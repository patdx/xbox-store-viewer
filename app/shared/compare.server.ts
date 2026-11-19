import type { Product } from './types'
import { COMPARE_MARKET_LIMIT, DEFAULT_COMPARE_MARKETS } from './consts'
import { hasJapaneseLanguage, uniqueLanguageNames } from './format'
import { fetchProducts } from './utils.server'

export type MarketPrice = {
	currencyCode: string
	listPrice: number
	msrp: number
	taxType: string
}

export type MarketSummary = {
	market: string
	ok: boolean
	error?: string
	title: string
	productId: string
	packageProductId: string
	isBundle: boolean
	bundleIds: string[]
	relatedBundleIds: string[]
	contentIds: string[]
	packageFamilyNames: string[]
	formats: string[]
	languages: string[]
	languageNames: string[]
	japanese: boolean
	downloadBytes: number
	price?: MarketPrice
	releaseDate?: string
}

type CollectedPackage = {
	contentId: string
	languages: Set<string>
	downloadBytes: number
	formats: Set<string>
	packageFamilyNames: Set<string>
}

export function parseCompareMarkets(raw: string | null, currentMarket: string) {
	const requested = (raw ?? '')
		.split(',')
		.map((value) => value.trim().toUpperCase())
		.filter((value) => /^[A-Z]{2}$/.test(value))

	const selected = requested.length ? requested : DEFAULT_COMPARE_MARKETS

	return [...new Set([currentMarket.toUpperCase(), ...selected])].slice(
		0,
		COMPARE_MARKET_LIMIT,
	)
}

async function fetchProductSafe({
	id,
	market,
	lang,
}: {
	id: string
	market: string
	lang: string
}) {
	const products = await fetchProducts({ ids: [id], market, lang })

	return (
		products?.find(
			(product) => product.ProductId?.toLowerCase() === id.toLowerCase(),
		) ?? products?.[0]
	)
}

function errorSummary(market: string, error: unknown): MarketSummary {
	const message =
		error instanceof Error
			? error.message
			: typeof error === 'string'
				? error
				: 'Unable to load this market'

	return {
		market,
		ok: false,
		error: message.slice(0, 160),
		title: '',
		productId: '',
		packageProductId: '',
		isBundle: false,
		bundleIds: [],
		relatedBundleIds: [],
		contentIds: [],
		packageFamilyNames: [],
		formats: [],
		languages: [],
		languageNames: [],
		japanese: false,
		downloadBytes: 0,
	}
}

function bundleContents(product: Product) {
	const ids: string[] = []

	for (const skuAvailability of product.DisplaySkuAvailabilities ?? []) {
		const bundled = [...(skuAvailability.Sku.Properties?.BundledSkus ?? [])]
			.filter((item) => item?.BigId)
			.sort(
				(a, b) =>
					Number(b.IsPrimary) - Number(a.IsPrimary) ||
					(a.DisplayRank ?? 0) - (b.DisplayRank ?? 0),
			)

		for (const item of bundled) {
			if (!ids.includes(item.BigId)) {
				ids.push(item.BigId)
			}
		}
	}

	return ids
}

function relatedBundleIds(product: Product) {
	const ids = (product.MarketProperties ?? [])
		.flatMap((market) => market.RelatedProducts ?? [])
		.filter(
			(related) =>
				related.RelationshipType === 'Bundle' && related.RelatedProductId,
		)
		.map((related) => related.RelatedProductId)

	return [...new Set(ids)]
}

function isBundleProduct(product: Product) {
	return (
		(product.DisplaySkuAvailabilities ?? []).some(
			(skuAvailability) => skuAvailability.Sku.Properties?.IsBundle,
		) || bundleContents(product).length > 0
	)
}

function collectPackages(product: Product) {
	const skus = (product.DisplaySkuAvailabilities ?? []).map(
		(skuAvailability) => skuAvailability.Sku,
	)
	const fullSkus = skus.filter((sku) => sku.SkuType !== 'trial')
	const source = fullSkus.length ? fullSkus : skus
	const packages = new Map<string, CollectedPackage>()

	for (const sku of source) {
		for (const pkg of sku.Properties?.Packages ?? []) {
			const contentId = pkg.ContentId || pkg.PackageId

			if (!contentId) {
				continue
			}

			const entry = packages.get(contentId) ?? {
				contentId,
				languages: new Set<string>(),
				downloadBytes: 0,
				formats: new Set<string>(),
				packageFamilyNames: new Set<string>(),
			}

			for (const language of pkg.Languages ?? []) {
				if (language) {
					entry.languages.add(language.toLowerCase())
				}
			}

			entry.downloadBytes = Math.max(
				entry.downloadBytes,
				pkg.MaxDownloadSizeInBytes ?? 0,
			)

			if (pkg.PackageFormat) {
				entry.formats.add(pkg.PackageFormat)
			}

			const packageFamilyName = pkg.FulfillmentData?.PackageFamilyName

			if (packageFamilyName) {
				entry.packageFamilyNames.add(packageFamilyName)
			}

			packages.set(contentId, entry)
		}
	}

	return [...packages.values()]
}

function isRealDate(value?: string | null): value is string {
	return (
		typeof value === 'string' &&
		value.length > 0 &&
		!value.startsWith('1753-') &&
		!value.startsWith('9998-')
	)
}

function pickPrice(product: Product): MarketPrice | undefined {
	const candidates: {
		price: MarketPrice
		actions: string[]
		rank: number
	}[] = []

	for (const skuAvailability of product.DisplaySkuAvailabilities ?? []) {
		for (const availability of skuAvailability.Availabilities ?? []) {
			const price = availability.OrderManagementData?.Price

			if (!price?.CurrencyCode || typeof price.ListPrice !== 'number') {
				continue
			}

			candidates.push({
				price: {
					currencyCode: price.CurrencyCode,
					listPrice: price.ListPrice,
					msrp: price.MSRP ?? price.ListPrice,
					taxType: price.TaxType ?? '',
				},
				actions: availability.Actions ?? [],
				rank: availability.DisplayRank ?? 0,
			})
		}
	}

	const purchasable = candidates.filter((candidate) =>
		candidate.actions.includes('Purchase'),
	)
	const paid = purchasable.filter((candidate) => candidate.price.listPrice > 0)

	if (paid.length) {
		return paid.sort(
			(a, b) => b.price.listPrice - a.price.listPrice || a.rank - b.rank,
		)[0].price
	}

	if (purchasable.length) {
		return purchasable[0].price
	}

	const paidAny = candidates
		.filter((candidate) => candidate.price.listPrice > 0)
		.sort((a, b) => b.price.listPrice - a.price.listPrice)

	return paidAny[0]?.price
}

function buildSummary({
	product,
	packageProduct,
	packages,
	market,
}: {
	product: Product
	packageProduct: Product
	packages: CollectedPackage[]
	market: string
}): MarketSummary {
	const languages = [
		...new Set(packages.flatMap((pkg) => [...pkg.languages])),
	].sort()
	const releaseDate = (product.MarketProperties ?? [])
		.map((marketProperty) => marketProperty.OriginalReleaseDate)
		.filter(isRealDate)
		.sort()[0]

	return {
		market,
		ok: true,
		title: product.LocalizedProperties?.[0]?.ProductTitle ?? product.ProductId,
		productId: product.ProductId,
		packageProductId: packageProduct.ProductId,
		isBundle: isBundleProduct(product),
		bundleIds: bundleContents(product),
		relatedBundleIds: relatedBundleIds(product),
		contentIds: packages.map((pkg) => pkg.contentId),
		packageFamilyNames: [
			...new Set(packages.flatMap((pkg) => [...pkg.packageFamilyNames])),
		],
		formats: [...new Set(packages.flatMap((pkg) => [...pkg.formats]))],
		languages,
		languageNames: uniqueLanguageNames(languages),
		japanese: hasJapaneseLanguage(languages),
		downloadBytes: Math.max(0, ...packages.map((pkg) => pkg.downloadBytes)),
		price: pickPrice(product),
		releaseDate,
	}
}

export async function summarizeProduct({
	product,
	market,
	lang,
}: {
	product: Product
	market: string
	lang: string
}) {
	let packageProduct = product
	let packages = collectPackages(product)

	if (packages.length === 0) {
		const bundledIds = bundleContents(product)

		for (const bundledId of bundledIds.slice(0, 3)) {
			const bundled = await fetchProductSafe({
				id: bundledId,
				market,
				lang,
			})

			if (!bundled) {
				continue
			}

			const bundledPackages = collectPackages(bundled)

			if (bundledPackages.length > 0) {
				packageProduct = bundled
				packages = bundledPackages
				break
			}
		}
	}

	return buildSummary({ product, packageProduct, packages, market })
}

export async function fetchMarketSummary({
	id,
	market,
	lang,
}: {
	id: string
	market: string
	lang: string
}) {
	try {
		const product = await fetchProductSafe({ id, market, lang })

		if (!product) {
			return errorSummary(market, 'Not available in this market')
		}

		return await summarizeProduct({ product, market, lang })
	} catch (error) {
		return errorSummary(market, error)
	}
}
