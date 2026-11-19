import {
	ArrowLeftRight,
	CalendarDays,
	Check,
	ExternalLink,
	HardDrive,
	Languages,
	Minus,
	Package,
	Tag,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { cn } from '~/lib/utils'
import type { MarketSummary } from './compare.server'
import { COMPARE_MARKETS, COMPARE_MARKET_LIMIT, MARKETS } from './consts'
import { formatBytes, formatDateTime, formatPrice, taxLabel } from './format'

type ComparisonRow = {
	label: string
	icon: ReactNode
	compare?: (summary: MarketSummary) => string
	render: (summary: MarketSummary, current: boolean) => ReactNode
}

const shortId = (id: string) => (id.length > 14 ? `${id.slice(0, 8)}…` : id)

const buildKey = (summary: MarketSummary) =>
	summary.contentIds.slice().sort().join('|')

export function MarketComparison({
	productId,
	currentMarket,
	currentLang,
	compareMarkets,
	summaries,
}: {
	productId: string
	currentMarket: string
	currentLang: string
	compareMarkets: string[]
	summaries: MarketSummary[]
}) {
	const ordered = compareMarkets
		.map((market) => summaries.find((summary) => summary.market === market))
		.filter((summary): summary is MarketSummary => Boolean(summary))
	const valid = ordered.filter((summary) => summary.ok)
	const failed = ordered.filter((summary) => !summary.ok)
	const current = ordered.find((summary) => summary.market === currentMarket)
	const currentKey = current ? buildKey(current) : ''

	const buildGroups = new Map<string, string[]>()

	for (const summary of valid) {
		const key = buildKey(summary) || 'no-package'
		buildGroups.set(key, [...(buildGroups.get(key) ?? []), summary.market])
	}

	const buildCount = new Set(
		valid
			.filter((summary) => summary.contentIds.length > 0)
			.map((summary) => buildKey(summary)),
	).size

	const japaneseMarkets = valid
		.filter((summary) => summary.japanese)
		.map((summary) => summary.market)
	const nonJapaneseMarkets = valid
		.filter((summary) => !summary.japanese)
		.map((summary) => summary.market)

	const sized = valid
		.filter((summary) => summary.downloadBytes > 0)
		.sort((a, b) => b.downloadBytes - a.downloadBytes)
	const largest = sized[0]
	const smallest = sized[sized.length - 1]

	const rows: ComparisonRow[] = [
		{
			label: 'List price',
			icon: <Tag className="size-3.5" />,
			render: (summary) => {
				if (summary.price) {
					return (
						<div>
							<div className="font-medium">{formatPrice(summary.price)}</div>
							<div className="text-xs text-muted-foreground">
								{taxLabel(summary.price.taxType) || 'local list price'}
							</div>
						</div>
					)
				}

				if (summary.relatedBundleIds.length > 0) {
					const bundleId = summary.relatedBundleIds[0]

					return (
						<div className="text-xs">
							<span className="text-muted-foreground">Via bundle:</span>{' '}
							<Link
								className="font-mono underline"
								to={`/${currentLang}-${summary.market}/${bundleId}`}
							>
								{shortId(bundleId)}
							</Link>
						</div>
					)
				}

				return (
					<span className="text-xs text-muted-foreground">
						No price / not sold here
					</span>
				)
			},
		},
		{
			label: 'Content ID',
			icon: <Package className="size-3.5" />,
			compare: buildKey,
			render: (summary, isCurrent) => {
				if (summary.contentIds.length === 0) {
					return (
						<span className="text-xs text-muted-foreground">
							No package data
						</span>
					)
				}

				const sameAsCurrent =
					isCurrent || !currentKey || buildKey(summary) === currentKey

				return (
					<div className="space-y-1">
						{summary.contentIds.map((contentId) => (
							<code
								key={contentId}
								className="block font-mono text-[11px] leading-relaxed break-all"
							>
								{contentId}
							</code>
						))}
						{!sameAsCurrent && (
							<Badge
								variant="outline"
								className="border-amber-300 bg-amber-50 text-[10px] text-amber-700"
							>
								different build
							</Badge>
						)}
					</div>
				)
			},
		},
		{
			label: 'Languages',
			icon: <Languages className="size-3.5" />,
			compare: (summary) => summary.languageNames.join('|'),
			render: (summary) =>
				summary.languageNames.length ? (
					<div
						className="flex flex-wrap items-center gap-1.5"
						title={summary.languageNames.join(', ')}
					>
						<span className="font-medium">{summary.languageNames.length}</span>
						<span className="text-xs text-muted-foreground">
							{summary.languageNames.length === 1 ? 'language' : 'languages'}
						</span>
						{summary.japanese && (
							<Badge
								variant="outline"
								className="border-emerald-300 bg-emerald-50 text-[10px] text-emerald-700"
							>
								Japanese
							</Badge>
						)}
					</div>
				) : (
					<span className="text-xs text-muted-foreground">
						No package language data
					</span>
				),
		},
		{
			label: 'Largest package',
			icon: <HardDrive className="size-3.5" />,
			compare: (summary) => String(summary.downloadBytes),
			render: (summary) => {
				if (!summary.downloadBytes) {
					return <span className="text-muted-foreground">—</span>
				}

				const delta =
					current?.downloadBytes && current.downloadBytes > 0
						? summary.downloadBytes - current.downloadBytes
						: 0
				const meaningfulDelta = Math.abs(delta) >= 1024 ** 2

				return (
					<div>
						<div className="font-medium">
							{formatBytes(summary.downloadBytes)}
						</div>
						{meaningfulDelta && (
							<div
								className={cn(
									'text-xs',
									delta > 0 ? 'text-amber-700' : 'text-emerald-700',
								)}
							>
								{delta > 0 ? '+' : '−'}
								{formatBytes(Math.abs(delta))} vs {currentMarket}
							</div>
						)}
					</div>
				)
			},
		},
		{
			label: 'Release',
			icon: <CalendarDays className="size-3.5" />,
			compare: (summary) => summary.releaseDate ?? '',
			render: (summary) => (
				<span className="text-xs">{formatDateTime(summary.releaseDate)}</span>
			),
		},
		{
			label: 'Store product',
			icon: <ExternalLink className="size-3.5" />,
			compare: (summary) => `${summary.productId}:${summary.packageProductId}`,
			render: (summary) => (
				<div className="space-y-1 text-xs">
					<div className="flex flex-wrap items-center gap-1">
						<Link
							className="font-mono underline"
							to={`/${currentLang}-${summary.market}/${summary.productId}`}
						>
							{summary.productId}
						</Link>
						{summary.isBundle && (
							<Badge variant="outline" className="text-[10px]">
								bundle
							</Badge>
						)}
					</div>
					{summary.packageProductId &&
						summary.packageProductId !== summary.productId && (
							<div>
								Packages:{' '}
								<Link
									className="font-mono underline"
									to={`/${currentLang}-${summary.market}/${summary.packageProductId}`}
								>
									{summary.packageProductId}
								</Link>
							</div>
						)}
					{summary.relatedBundleIds.length > 0 && (
						<div>
							Sold in:{' '}
							{summary.relatedBundleIds.slice(0, 2).map((bundleId, index) => (
								<span key={bundleId}>
									{index > 0 && ', '}
									<Link
										className="font-mono underline"
										to={`/${currentLang}-${summary.market}/${bundleId}`}
									>
										{bundleId}
									</Link>
								</span>
							))}
							{summary.relatedBundleIds.length > 2 && (
								<span className="text-muted-foreground">
									{' '}
									+{summary.relatedBundleIds.length - 2}
								</span>
							)}
						</div>
					)}
				</div>
			),
		},
	]

	const hasContent = valid.some((summary) => summary.contentIds.length > 0)
	const hasLanguages = valid.some((summary) => summary.languageNames.length > 0)
	const hasSize = valid.some((summary) => summary.downloadBytes > 0)
	const hasRelease = valid.some((summary) => Boolean(summary.releaseDate))
	const visibleRows = rows.filter((row) => {
		switch (row.label) {
			case 'Content ID':
				return hasContent
			case 'Languages':
				return hasLanguages
			case 'Largest package':
				return hasSize
			case 'Release':
				return hasRelease
			default:
				return true
		}
	})

	const samePackageInAll =
		valid.length > 1 &&
		valid.every((summary) => summary.contentIds.length > 0) &&
		buildCount === 1

	return (
		<Card className="ring-blue-200">
			<CardHeader>
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<h2 className="flex items-center gap-2 text-xl font-semibold">
							<span className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
								<ArrowLeftRight className="size-4" />
							</span>
							Compare versions
						</h2>
						<p className="mt-1 max-w-2xl text-sm text-muted-foreground">
							The same product ID can resolve to different content packages
							depending on the store market. This table compares what the
							console actually downloads.
						</p>
					</div>
					<div className="flex flex-wrap gap-1.5">
						{samePackageInAll && (
							<Badge
								variant="outline"
								className="border-emerald-300 bg-emerald-50 text-emerald-700"
							>
								Same package in all compared markets
							</Badge>
						)}
						{buildCount > 1 && (
							<Badge
								variant="outline"
								className="border-amber-300 bg-amber-50 text-amber-700"
							>
								<ArrowLeftRight className="mr-1 size-3" />
								{buildCount} different builds
							</Badge>
						)}
						{japaneseMarkets.length > 0 && nonJapaneseMarkets.length > 0 && (
							<Badge
								variant="outline"
								className="border-emerald-300 bg-emerald-50 text-emerald-700"
							>
								<Languages className="mr-1 size-3" />
								Japanese: {japaneseMarkets.join(', ')} only
							</Badge>
						)}
						{hasLanguages &&
							japaneseMarkets.length === 0 &&
							valid.length > 1 && (
								<Badge variant="outline">
									No Japanese in any compared build
								</Badge>
							)}
						{largest &&
							smallest &&
							largest.downloadBytes - smallest.downloadBytes >= 1024 ** 2 && (
								<Badge variant="outline">
									<HardDrive className="mr-1 size-3" />
									{smallest.market} −
									{formatBytes(largest.downloadBytes - smallest.downloadBytes)}{' '}
									vs {largest.market}
								</Badge>
							)}
					</div>
				</div>

				<CompareMarketChips
					productId={productId}
					currentMarket={currentMarket}
					currentLang={currentLang}
					compareMarkets={compareMarkets}
				/>
			</CardHeader>

			<CardContent>
				{ordered.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						No comparison data was returned for these markets.
					</p>
				) : (
					<>
						{!hasContent && (
							<p className="mb-3 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
								No package data is exposed for this product. If it is a bundle,
								open its bundled products to compare content IDs.
							</p>
						)}
						<div className="overflow-x-auto rounded-md border">
							<table className="w-full min-w-[760px] border-collapse text-sm">
								<thead>
									<tr>
										<th
											scope="col"
											className="sticky left-0 z-10 w-40 border-r border-b bg-card px-3 py-2 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase"
										>
											Metric
										</th>
										{ordered.map((summary) => (
											<th
												key={summary.market}
												scope="col"
												className={cn(
													'border-b border-l px-3 py-2 text-left align-top',
													summary.market === currentMarket && 'bg-blue-50/60',
												)}
											>
												<div className="font-semibold">
													{MARKETS[
														summary.market as keyof typeof MARKETS
													]?.[0] ?? summary.market}
												</div>
												<div className="font-mono text-xs text-muted-foreground">
													{summary.market}
												</div>
												{summary.market === currentMarket && (
													<Badge
														variant="outline"
														className="mt-1 border-blue-300 bg-blue-100 text-[10px] text-blue-800"
													>
														current
													</Badge>
												)}
												{!summary.ok && (
													<Badge
														variant="outline"
														className="mt-1 border-red-300 bg-red-50 text-[10px] text-red-700"
													>
														unavailable
													</Badge>
												)}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{visibleRows.map((row) => {
										const values = ordered
											.filter((summary) => summary.ok)
											.map((summary) =>
												row.compare ? row.compare(summary) : '',
											)
										const differs =
											Boolean(row.compare) && new Set(values).size > 1

										return (
											<tr key={row.label}>
												<th
													scope="row"
													className="sticky left-0 z-10 border-t border-r bg-card px-3 py-2 text-left align-top text-xs font-medium"
												>
													<div className="flex items-start gap-1.5">
														<span className="mt-0.5 text-muted-foreground">
															{row.icon}
														</span>
														<span>{row.label}</span>
														{differs && (
															<Badge
																variant="outline"
																className="ml-1 border-amber-300 bg-amber-50 px-1.5 py-0 text-[10px] text-amber-700"
															>
																differs
															</Badge>
														)}
													</div>
												</th>
												{ordered.map((summary) => {
													const isCurrent = summary.market === currentMarket
													const currentValue =
														row.compare && current?.ok
															? row.compare(current)
															: undefined
													const differsFromCurrent =
														Boolean(row.compare) &&
														summary.ok &&
														!isCurrent &&
														currentValue !== undefined &&
														row.compare!(summary) !== currentValue

													return (
														<td
															key={summary.market}
															className={cn(
																'border-t border-l px-3 py-2 align-top',
																isCurrent && 'bg-blue-50/60',
																differsFromCurrent && 'bg-amber-50/60',
																!summary.ok && 'text-muted-foreground',
															)}
														>
															{summary.ok ? (
																row.render(summary, isCurrent)
															) : (
																<span className="text-xs text-red-600">—</span>
															)}
														</td>
													)
												})}
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>

						<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
							<span>
								Content ID, languages and size come from the package manifest,
								not the store listing.
							</span>
							<span>Prices are local list prices, not converted.</span>
							{buildGroups.size > 1 && (
								<span>
									Package groups:{' '}
									{[...buildGroups.entries()]
										.map(([key, markets]) => {
											const ids =
												key === 'no-package'
													? 'no package data'
													: key.split('|').map(shortId).join(' + ')

											return `${markets.join(', ')} (${ids})`
										})
										.join(' · ')}
								</span>
							)}
						</div>

						{failed.length > 0 && (
							<p className="mt-2 text-xs text-red-600">
								Unavailable:{' '}
								{failed
									.map(
										(summary) =>
											`${summary.market} (${summary.error ?? 'unknown error'})`,
									)
									.join('; ')}
							</p>
						)}

						<LanguageMatrix summaries={valid} currentMarket={currentMarket} />
					</>
				)}
			</CardContent>
		</Card>
	)
}

function CompareMarketChips({
	productId,
	currentMarket,
	currentLang,
	compareMarkets,
}: {
	productId: string
	currentMarket: string
	currentLang: string
	compareMarkets: string[]
}) {
	const chipMarkets = [...new Set([currentMarket, ...COMPARE_MARKETS])]

	return (
		<div className="flex flex-wrap items-center gap-1.5 pt-3">
			<span className="mr-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
				Markets
			</span>
			{chipMarkets.map((market) => {
				const active = compareMarkets.includes(market)
				const isCurrent = market === currentMarket
				const atLimit = !active && compareMarkets.length >= COMPARE_MARKET_LIMIT
				const next = active
					? compareMarkets.filter((value) => value !== market)
					: [...compareMarkets, market]
				const href = `/${currentLang}-${currentMarket}/${productId}?compare=${next.join(',')}`

				if (isCurrent) {
					return (
						<Badge
							key={market}
							className="border-blue-300 bg-blue-100 text-blue-800"
						>
							{market} · current
						</Badge>
					)
				}

				if (atLimit) {
					return (
						<Badge
							key={market}
							variant="outline"
							className="cursor-not-allowed opacity-40"
							title={`Compare up to ${COMPARE_MARKET_LIMIT} markets at once`}
						>
							{market}
						</Badge>
					)
				}

				return (
					<Link
						key={market}
						to={href}
						title={
							active
								? `Remove ${market} from comparison`
								: `Add ${market} to comparison`
						}
						aria-label={
							active
								? `Remove ${market} from comparison`
								: `Add ${market} to comparison`
						}
					>
						<Badge
							variant={active ? 'default' : 'outline'}
							className={cn(
								'cursor-pointer',
								active &&
									'border-blue-600 bg-blue-600 text-white hover:bg-blue-700',
							)}
						>
							{market}
						</Badge>
					</Link>
				)
			})}
		</div>
	)
}

function LanguageMatrix({
	summaries,
	currentMarket,
}: {
	summaries: MarketSummary[]
	currentMarket: string
}) {
	const matrixSummaries = summaries.filter(
		(summary) => summary.languageNames.length > 0,
	)

	if (matrixSummaries.length < 2) {
		return null
	}

	const languages = [
		...new Set(matrixSummaries.flatMap((summary) => summary.languageNames)),
	]
	const counts = new Map(
		languages.map((language) => [
			language,
			matrixSummaries.filter((summary) =>
				summary.languageNames.includes(language),
			).length,
		]),
	)
	const sorted = languages.sort((a, b) => {
		const countA = counts.get(a) ?? 0
		const countB = counts.get(b) ?? 0

		if (countA !== countB) {
			return countA - countB
		}

		return a.localeCompare(b)
	})

	if (sorted.length === 0) {
		return null
	}

	return (
		<div className="mt-6">
			<h3 className="flex items-center gap-2 text-sm font-semibold">
				<Languages className="size-4 text-muted-foreground" />
				Language availability
			</h3>
			<p className="mt-1 text-xs text-muted-foreground">
				Package languages grouped by language. Differences are shown first.
			</p>
			<div className="mt-2 overflow-x-auto rounded-md border">
				<table className="w-full min-w-[420px] border-collapse text-sm">
					<thead>
						<tr>
							<th
								scope="col"
								className="border-b bg-card px-3 py-2 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase"
							>
								Language
							</th>
							{matrixSummaries.map((summary) => (
								<th
									key={summary.market}
									scope="col"
									className={cn(
										'border-b border-l px-3 py-2 text-center text-xs font-semibold',
										summary.market === currentMarket && 'bg-blue-50/60',
									)}
								>
									{summary.market}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{sorted.map((language) => {
							const markets = matrixSummaries
								.filter((summary) => summary.languageNames.includes(language))
								.map((summary) => summary.market)
							const partial = markets.length < matrixSummaries.length

							return (
								<tr
									key={language}
									className={cn('border-t', partial && 'bg-amber-50/60')}
								>
									<th scope="row" className="px-3 py-1.5 text-left font-medium">
										<span className="flex flex-wrap items-center gap-1.5">
											{language}
											{partial && (
												<Badge
													variant="outline"
													className="border-amber-300 bg-white px-1.5 py-0 text-[10px] text-amber-700"
												>
													{markets.join(', ')} only
												</Badge>
											)}
										</span>
									</th>
									{matrixSummaries.map((summary) => {
										const included = summary.languageNames.includes(language)

										return (
											<td
												key={summary.market}
												className={cn(
													'border-l px-3 py-1.5 text-center',
													summary.market === currentMarket && 'bg-blue-50/60',
												)}
												aria-label={`${language} ${
													included ? 'included' : 'not included'
												} in ${summary.market}`}
											>
												{included ? (
													<Check
														className="mx-auto size-4 text-emerald-600"
														aria-hidden
													/>
												) : (
													<Minus
														className="mx-auto size-4 text-gray-300"
														aria-hidden
													/>
												)}
											</td>
										)
									})}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		</div>
	)
}
