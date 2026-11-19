import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import type { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { StyledLink } from './components'
import {
	formatBytes,
	formatDateTime,
	languageName,
	uniqueLanguageNames,
} from './format'
import type { Package, Product, Sku } from './types'

export const ProductSchemaUI = ({
	product,
	lang,
	region,
}: {
	product: Product
	lang?: string
	region?: string
}) => {
	const productHref = (id: string) =>
		lang && region ? `/${lang}-${region}/${id}` : '#'

	const bundledProducts = [
		...new Map(
			(product.DisplaySkuAvailabilities ?? [])
				.flatMap((skuAvailability) => {
					return (skuAvailability.Sku.Properties?.BundledSkus ?? [])
						.filter((item) => item?.BigId)
						.sort(
							(a, b) =>
								Number(b.IsPrimary) - Number(a.IsPrimary) ||
								(a.DisplayRank ?? 0) - (b.DisplayRank ?? 0),
						)
						.map((item) => [item.BigId, item] as const)
				})
				.values(),
		).values(),
	]

	const relatedBundles = [
		...new Set(
			(product.MarketProperties ?? []).flatMap((marketProperty) => {
				return (marketProperty.RelatedProducts ?? [])
					.filter(
						(related) =>
							related.RelationshipType === 'Bundle' && related.RelatedProductId,
					)
					.map((related) => related.RelatedProductId)
			}),
		),
	]

	return (
		<div className="space-y-4">
			{product && (
				<>
					<Card>
						<CardHeader>
							<div className="flex flex-wrap items-start justify-between gap-3">
								<div>
									<h2 className="text-xl font-semibold">
										{product.LocalizedProperties?.[0]?.ProductTitle ||
											'No Title'}
									</h2>
									<div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
										<Badge variant="outline">
											{product.ProductType || 'Unknown Type'}
										</Badge>
										<span>
											{product.LocalizedProperties?.[0]?.PublisherName ||
												'Unknown publisher'}
										</span>
										<code className="font-mono text-xs">
											{product.ProductId}
										</code>
									</div>
								</div>
								<Badge variant="outline">
									{product.Properties?.Category || 'Unknown category'}
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							<ReadMore className="mb-4 text-sm whitespace-pre-wrap text-gray-600">
								{/* <p className=""> */}
								{product.LocalizedProperties?.[0]?.ProductDescription ||
									'No Description'}
								{/* </p> */}
							</ReadMore>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<h3 className="text-lg font-semibold">Product Details</h3>
						</CardHeader>
						<CardContent>
							<dl className="grid grid-cols-2 gap-2">
								<dt className="font-semibold">Product ID:</dt>
								<dd>{product.ProductId || 'N/A'}</dd>
								<dt className="font-semibold">Product Family:</dt>
								<dd>{product.ProductFamily || 'N/A'}</dd>
								<dt className="font-semibold">Product Kind:</dt>
								<dd>{product.ProductKind || 'N/A'}</dd>
								<dt className="font-semibold">Microsoft Product:</dt>
								<dd>{product.IsMicrosoftProduct ? 'Yes' : 'No'}</dd>
								<dt className="font-semibold">Schema Version:</dt>
								<dd>{product.SchemaVersion || 'N/A'}</dd>
								<dt className="font-semibold">Publisher:</dt>
								<dd>
									{product.LocalizedProperties?.[0]?.PublisherName || 'N/A'}
								</dd>
								<dt className="font-semibold">Category:</dt>
								<dd>{product.Properties?.Category || 'N/A'}</dd>
								<dt className="font-semibold">Accessible:</dt>
								<dd>{product.Properties?.IsAccessible ? 'Yes' : 'No'}</dd>
								<dt className="font-semibold">Xbox Live Tier:</dt>
								<dd>{product.Properties?.XboxLiveTier || 'N/A'}</dd>
							</dl>
						</CardContent>
					</Card>

					{(bundledProducts.length > 0 || relatedBundles.length > 0) && (
						<Card>
							<CardHeader>
								<h3 className="text-lg font-semibold">Bundles & packages</h3>
							</CardHeader>
							<CardContent className="grid gap-6 md:grid-cols-2">
								{bundledProducts.length > 0 && (
									<div>
										<h4 className="text-sm font-semibold">
											This product bundles
										</h4>
										<p className="mt-1 text-xs text-muted-foreground">
											Content packages live on the bundled products.
										</p>
										<ul className="mt-2 space-y-1 text-sm">
											{bundledProducts.map((item) => (
												<li
													key={item.BigId}
													className="flex flex-wrap items-center gap-2"
												>
													<StyledLink to={productHref(item.BigId)}>
														<span className="font-mono text-xs">
															{item.BigId}
														</span>
													</StyledLink>
													{item.IsPrimary && (
														<Badge variant="outline" className="text-[10px]">
															primary
														</Badge>
													)}
												</li>
											))}
										</ul>
									</div>
								)}

								{relatedBundles.length > 0 && (
									<div>
										<h4 className="text-sm font-semibold">
											Sold in these bundles
										</h4>
										<p className="mt-1 text-xs text-muted-foreground">
											Open a bundle for its price and availability.
										</p>
										<ul className="mt-2 space-y-1 text-sm">
											{relatedBundles.map((bundleId) => (
												<li key={bundleId}>
													<StyledLink to={productHref(bundleId)}>
														<span className="font-mono text-xs">
															{bundleId}
														</span>
													</StyledLink>
												</li>
											))}
										</ul>
									</div>
								)}
							</CardContent>
						</Card>
					)}

					<Card>
						<CardHeader>
							<h3 className="text-lg font-semibold">Pricing</h3>
						</CardHeader>
						<CardContent>
							{product.DisplaySkuAvailabilities?.map((skuAvail, index) => (
								<div
									key={index}
									className="mb-4 flex flex-col gap-4 rounded border p-4"
								>
									<SkuCard sku={skuAvail.Sku} />

									<h4 className="text-md font-semibold">Availabilities</h4>

									<div className="grid grid-cols-2 gap-4">
										{skuAvail.Availabilities?.map((avail) => (
											<AvailabilityData
												key={avail.AvailabilityId}
												data={avail}
											/>
										))}
									</div>

									{/* <Card>
										<CardHeader>
											Historical HistoricalBestAvailabilities
										</CardHeader>
										<CardContent>
											<pre className="text-xs">
												{JSON.stringify(
													skuAvail.HistoricalBestAvailabilities,
													null,
													2,
												)}
											</pre>
										</CardContent>
									</Card> */}
								</div>
							))}
						</CardContent>
					</Card>
				</>
			)}
		</div>
	)
}

const SkuCard = ({ sku }: { sku: Sku }) => {
	return (
		<>
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">SKU: {sku.SkuId || 'N/A'}</h2>
				<Badge variant="outline">{sku.SkuType || 'Unknown Type'}</Badge>
			</div>
			<dl className="grid grid-cols-2 gap-2">
				<dt className="font-semibold">Last Modified:</dt>
				<dd>{formatDateTime(sku.LastModifiedDate)}</dd>

				<dt className="font-semibold">Product ID:</dt>
				<dd>{sku.ProductId || 'N/A'}</dd>

				{sku.LocalizedProperties && sku.LocalizedProperties.length > 0 && (
					<>
						<dt className="font-semibold">Title:</dt>
						<dd>{sku.LocalizedProperties[0].SkuTitle || 'N/A'}</dd>

						<dt className="font-semibold">Description:</dt>
						<dd className="whitespace-pre-wrap">
							<ReadMore>
								{sku.LocalizedProperties[0].SkuDescription || 'N/A'}
							</ReadMore>
						</dd>

						<dt className="font-semibold">Language:</dt>
						<dd>{sku.LocalizedProperties[0].Language || 'N/A'}</dd>
					</>
				)}

				{sku.MarketProperties && sku.MarketProperties.length > 0 && (
					<>
						<dt className="font-semibold">First Available:</dt>
						<dd>
							{formatDateTime(sku.MarketProperties[0].FirstAvailableDate)}
						</dd>

						<dt className="font-semibold">Markets:</dt>
						<dd>{sku.MarketProperties[0].Markets?.join(', ') || 'N/A'}</dd>
					</>
				)}

				{sku.Properties && (
					<>
						<dt className="font-semibold">Fulfillment Type:</dt>
						<dd>{sku.Properties.FulfillmentType || 'N/A'}</dd>

						<dt className="font-semibold">Hardware Requirements:</dt>
						<dd>{sku.Properties.HardwareRequirements?.length || 0}</dd>

						<dt className="font-semibold">Version:</dt>
						<dd>{sku.Properties.VersionString || 'N/A'}</dd>

						<dt className="font-semibold">Install Terms:</dt>
						<dd>{sku.Properties.InstallationTerms || 'N/A'}</dd>
					</>
				)}
			</dl>

			<div>
				<h3 className="text-sm font-semibold">
					Packages{' '}
					<span className="font-normal text-muted-foreground">
						({(sku.Properties?.Packages ?? []).length})
					</span>
				</h3>
			</div>
			<div className="grid gap-3 lg:grid-cols-2">
				{(sku.Properties?.Packages ?? []).map((pkg, index) => (
					<div key={index}>
						<ErrorBoundary
							fallback={
								<Card className="border-red-200 bg-red-50">
									<CardHeader>
										<h3 className="text-sm font-medium text-red-800">
											Package Error
										</h3>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-red-600">
											Unable to display package information due to data error.
										</p>
									</CardContent>
								</Card>
							}
						>
							<PackageCard package={pkg} />
						</ErrorBoundary>
					</div>
				))}
			</div>
		</>
	)
}

const PackageCard = ({ package: pkg }: { package: Package }) => {
	if (!pkg) return null

	const languages = pkg.Languages ?? []
	const languageNames = uniqueLanguageNames(languages)
	const platformDependencies = pkg.PlatformDependencies ?? []
	const downloadUris = pkg.PackageDownloadUris ?? []
	const features = pkg.FulfillmentData?.PackageFeatures

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex flex-wrap items-start justify-between gap-2">
					<div>
						<h2 className="text-sm font-semibold">Content ID</h2>
						<code className="font-mono text-xs break-all">{pkg.ContentId}</code>
					</div>
					<Badge variant="outline">{pkg.PackageFormat}</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4 text-sm">
				<dl className="grid gap-3 sm:grid-cols-2">
					<Detail label="Download size">
						{formatBytes(pkg.MaxDownloadSizeInBytes)}
					</Detail>
					<Detail label="Languages">
						{languageNames.length
							? `${languageNames.length} (${languageNames.join(', ')})`
							: '—'}
					</Detail>
					<Detail label="Architecture">
						{pkg.Architectures?.join(', ') || '—'}
					</Detail>
					<Detail label="Package rank">{pkg.PackageRank ?? '—'}</Detail>
					<Detail label="Version">{pkg.Version || '—'}</Detail>
					<Detail label="Streaming app">
						{pkg.IsStreamingApp ? 'Yes' : 'No'}
					</Detail>
				</dl>

				<div>
					<h3 className="mb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
						Language tags
					</h3>
					<div className="flex flex-wrap gap-1">
						{languages.length ? (
							languages.map((language) => (
								<Badge
									key={language}
									variant="secondary"
									className="font-mono text-[10px]"
									title={languageName(language)}
								>
									{language}
								</Badge>
							))
						) : (
							<span className="text-xs text-muted-foreground">
								No language tags reported
							</span>
						)}
					</div>
				</div>

				<details className="rounded-md border p-3">
					<summary className="cursor-pointer text-xs font-semibold">
						Technical details
					</summary>
					<dl className="mt-3 space-y-2 text-xs">
						<Detail label="Package ID">{pkg.PackageId}</Detail>
						{pkg.FulfillmentData?.PackageFamilyName && (
							<Detail label="Package family">
								<code className="font-mono break-all">
									{pkg.FulfillmentData.PackageFamilyName}
								</code>
							</Detail>
						)}
						<Detail label="Platform dependencies">
							{platformDependencies.length ? (
								platformDependencies.map((dependency, index) => (
									<div key={index}>
										{dependency.PlatformName} (Min: {dependency.MinVersion}, Max
										tested: {dependency.MaxTested})
									</div>
								))
							) : (
								<span className="text-muted-foreground">—</span>
							)}
						</Detail>
						{features && (
							<Detail label="Package features">
								<div>
									Intelligent delivery:{' '}
									{features.SupportsIntelligentDelivery ? 'Yes' : 'No'}
								</div>
								<div>
									Install features:{' '}
									{features.SupportsInstallFeatures ? 'Yes' : 'No'}
								</div>
								<div>
									Install recipes:{' '}
									{features.SupportsInstallRecipes ? 'Yes' : 'No'}
								</div>
							</Detail>
						)}
					</dl>

					{downloadUris.length > 0 && (
						<details className="mt-3">
							<summary className="cursor-pointer text-xs font-semibold">
								Download URIs ({downloadUris.length})
							</summary>
							<div className="mt-2 space-y-1 text-xs">
								{downloadUris.map((uri, index) => (
									<div key={index}>
										Rank {uri.Rank}: {uri.Uri}
									</div>
								))}
							</div>
						</details>
					)}
				</details>
			</CardContent>
		</Card>
	)
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="border-b pb-2">
			<dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
				{label}
			</dt>
			<dd className="mt-0.5">{children}</dd>
		</div>
	)
}
