import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import type { Package, Product, Sku } from './types';

export const ProductSchemaUI = ({ product }: { product: Product }) => {
	return (
		<div className="p-4 space-y-4">
			<h1 className="text-2xl font-bold">Product Schema UI</h1>

			{product && (
				<>
					<Card>
						<CardHeader>
							<h2 className="text-xl font-semibold">
								{product.LocalizedProperties?.[0]?.ProductTitle || 'No Title'}
							</h2>
							<div>
								<Badge variant="outline">
									{product.ProductType || 'Unknown Type'}
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">
								{product.LocalizedProperties?.[0]?.ProductDescription ||
									'No Description'}
							</p>
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

					<Card>
						<CardHeader>
							<h3 className="text-lg font-semibold">Pricing</h3>
						</CardHeader>
						<CardContent>
							{product.DisplaySkuAvailabilities?.map((skuAvail, index) => (
								<div key={index} className="mb-4">
									<SkuCard sku={skuAvail.Sku} />
									{skuAvail.Availabilities?.map((avail, availIndex) => (
										<div key={availIndex} className="ml-4 mt-2">
											<h5 className="font-semibold">
												Availability ID: {avail.AvailabilityId || 'N/A'}
											</h5>
											<p>
												Price:{' '}
												{avail.OrderManagementData?.Price?.ListPrice || 'N/A'}{' '}
												{avail.OrderManagementData?.Price?.CurrencyCode ||
													'N/A'}
											</p>
											<p>
												MSRP: {avail.OrderManagementData?.Price?.MSRP || 'N/A'}{' '}
												{avail.OrderManagementData?.Price?.CurrencyCode ||
													'N/A'}
											</p>
											<p>Actions: {avail.Actions?.join(', ') || 'N/A'}</p>
											{/* <pre className="text-xs">
												{JSON.stringify(omit(avail, 'Actions'), null, 2)}
											</pre> */}
										</div>
									))}
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
	);
};

const SkuCard = ({ sku }: { sku: Sku }) => {
	if (!sku) return null;

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-semibold">SKU: {sku.SkuId || 'N/A'}</h2>
					<Badge variant="outline">{sku.SkuType || 'Unknown Type'}</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<dl className="grid grid-cols-2 gap-2">
					<dt className="font-semibold">Last Modified:</dt>
					<dd>
						{sku.LastModifiedDate
							? new Date(sku.LastModifiedDate).toLocaleString()
							: 'N/A'}
					</dd>

					<dt className="font-semibold">Product ID:</dt>
					<dd>{sku.ProductId || 'N/A'}</dd>

					{sku.LocalizedProperties && sku.LocalizedProperties.length > 0 && (
						<>
							<dt className="font-semibold">Title:</dt>
							<dd>{sku.LocalizedProperties[0].SkuTitle || 'N/A'}</dd>

							<dt className="font-semibold">Description:</dt>
							<dd className="whitespace-pre-wrap">
								{sku.LocalizedProperties[0].SkuDescription || 'N/A'}
							</dd>

							<dt className="font-semibold">Language:</dt>
							<dd>{sku.LocalizedProperties[0].Language || 'N/A'}</dd>
						</>
					)}

					{sku.MarketProperties && sku.MarketProperties.length > 0 && (
						<>
							<dt className="font-semibold">First Available:</dt>
							<dd>
								{sku.MarketProperties[0].FirstAvailableDate
									? new Date(
											sku.MarketProperties[0].FirstAvailableDate,
										).toLocaleDateString()
									: 'N/A'}
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

				<dt className="font-semibold">Packages:</dt>
				<div className="grid grid-cols-2 gap-2">
					{sku.Properties.Packages.map((pkg, index) => (
						<div key={index}>
							<PackageCard package={pkg} />
						</div>
					))}
				</div>
				{/* packages */}
			</CardContent>
		</Card>
	);
};

const PackageCard = ({ package: pkg }: { package: Package }) => {
	if (!pkg) return null;

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader>
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-semibold">Package ID: {pkg.PackageId}</h2>
					<Badge variant="outline">{pkg.PackageFormat}</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<dl className="grid grid-cols-2 gap-2 text-sm">
					<dt className="font-semibold">Architecture:</dt>
					<dd>{pkg.Architectures.join(', ')}</dd>

					<dt className="font-semibold">Is Streaming App:</dt>
					<dd>{pkg.IsStreamingApp ? 'Yes' : 'No'}</dd>

					<dt className="font-semibold">Languages:</dt>
					<dd>{pkg.Languages.join(', ')}</dd>

					<dt className="font-semibold">Max Download Size:</dt>
					<dd>
						{(pkg.MaxDownloadSizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB
					</dd>

					<dt className="font-semibold">Package Rank:</dt>
					<dd>{pkg.PackageRank}</dd>

					<dt className="font-semibold">Version:</dt>
					<dd>{pkg.Version}</dd>

					<dt className="font-semibold">Platform Dependencies:</dt>
					<dd>
						{pkg.PlatformDependencies.map((dep, index) => (
							<div key={index}>
								{dep.PlatformName} (Min: {dep.MinVersion}, Max Tested:{' '}
								{dep.MaxTested})
							</div>
						))}
					</dd>

					<dt className="font-semibold">Fulfillment Data:</dt>
					<dd>
						<div>Product ID: {pkg.FulfillmentData.ProductId}</div>
						<div>SKU ID: {pkg.FulfillmentData.SkuId}</div>
						<div>
							Package Family Name: {pkg.FulfillmentData.PackageFamilyName}
						</div>
					</dd>

					<dt className="font-semibold">Package Features:</dt>
					<dd>
						<div>
							Intelligent Delivery:{' '}
							{pkg.FulfillmentData.PackageFeatures.SupportsIntelligentDelivery
								? 'Yes'
								: 'No'}
						</div>
						<div>
							Install Features:{' '}
							{pkg.FulfillmentData.PackageFeatures.SupportsInstallFeatures
								? 'Yes'
								: 'No'}
						</div>
						<div>
							Install Recipes:{' '}
							{pkg.FulfillmentData.PackageFeatures.SupportsInstallRecipes
								? 'Yes'
								: 'No'}
						</div>
					</dd>

					<dt className="font-semibold">Download URIs:</dt>
					<dd>
						{pkg.PackageDownloadUris.map((uri, index) => (
							<div key={index}>
								Rank {uri.Rank}: {uri.Uri}
							</div>
						))}
					</dd>
				</dl>
			</CardContent>
		</Card>
	);
};
