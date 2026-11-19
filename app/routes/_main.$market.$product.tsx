import { ErrorBoundary } from 'react-error-boundary'
import { RegionSelector } from '~/shared/components'
import { MarketComparison } from '~/shared/components-compare'
import { ProductSchemaUI } from '~/shared/components-product'
import {
	fetchMarketSummary,
	parseCompareMarkets,
} from '~/shared/compare.server'
import { fetchProduct } from '~/shared/utils.server'
import type { Route } from './+types/_main.$market.$product'

const Params = v.object({
	product: v.string(),
	market: v.string(),
})

export const loader = async ({ params, request }: Route.LoaderArgs) => {
	const { product: productId, market } = v.parse(Params, params)

	const [lang, region] = market.split('-')

	const product = await fetchProduct({ id: productId, market: region, lang })
	const compareMarkets = parseCompareMarkets(
		new URL(request.url).searchParams.get('compare'),
		region,
	)

	if (!product) {
		return {
			product: null,
			summaries: [],
			compareMarkets,
			currentMarket: region,
			lang,
		}
	}

	const summaries = await Promise.all(
		compareMarkets.map((compareMarket) =>
			fetchMarketSummary({
				id: productId,
				market: compareMarket,
				lang,
			}),
		),
	)

	return {
		product,
		summaries,
		compareMarkets,
		currentMarket: region,
		lang,
	}
}

export default function Product({ loaderData }: Route.ComponentProps) {
	const { product, summaries, compareMarkets, currentMarket, lang } = loaderData

	if (!product) {
		return (
			<>
				<RegionSelector />
				<div className="p-4">
					<div className="rounded-lg border border-red-200 bg-red-50 p-4">
						<h2 className="mb-2 text-lg font-semibold text-red-800">
							Product not found
						</h2>
						<p className="text-red-600">
							No product was returned for this market. Check the product ID and
							region, or try another market.
						</p>
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<RegionSelector />
			<div className="space-y-4 p-4">
				<ErrorBoundary fallback={<ComparisonFallback />}>
					<MarketComparison
						productId={product.ProductId}
						currentMarket={currentMarket}
						currentLang={lang}
						compareMarkets={compareMarkets}
						summaries={summaries}
					/>
				</ErrorBoundary>

				<ErrorBoundary
					fallback={
						<div className="rounded-lg border border-red-200 bg-red-50 p-4">
							<h2 className="mb-2 text-lg font-semibold text-red-800">
								Product Loading Error
							</h2>
							<p className="text-red-600">
								Unable to display product information. This may be due to data
								formatting issues or network problems. Please try refreshing the
								page or selecting a different product.
							</p>
						</div>
					}
				>
					<ProductSchemaUI
						product={product}
						lang={lang}
						region={currentMarket}
					/>
				</ErrorBoundary>
			</div>
		</>
	)
}

function ComparisonFallback() {
	return (
		<div className="rounded-lg border border-red-200 bg-red-50 p-4">
			<h2 className="mb-1 text-lg font-semibold text-red-800">
				Comparison unavailable
			</h2>
			<p className="text-sm text-red-600">
				The market comparison could not be rendered, but the raw product data is
				still available below.
			</p>
		</div>
	)
}
