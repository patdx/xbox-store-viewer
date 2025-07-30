import type { Availability } from '~/shared/types'

const formatDate = (dateString?: string | null) => {
	if (dateString == null) return null
	return new Date(dateString).toLocaleString()
}

export const AvailabilityData = ({ data }: { data: Availability }) => {
	const [isExpanded, setIsExpanded] = useState(false)

	const toggle = () => {
		setIsExpanded((prev) => !prev)
	}

	return (
		<Card className="">
			<CardHeader>
				<h2 className="text-2xl font-bold">
					Availability {data.AvailabilityId}
				</h2>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div>
						<h3 className="mb-2 text-lg font-semibold">General Information</h3>
						<p>
							<span className="font-medium">Availability ID:</span>{' '}
							{data.AvailabilityId}
						</p>
						<p>
							<span className="font-medium">SKU ID:</span> {data.SkuId}
						</p>
						<p>
							<span className="font-medium">Display Rank:</span>{' '}
							{data.DisplayRank}
						</p>
						<p>
							<span className="font-medium">Last Modified:</span>{' '}
							{formatDate(data.LastModifiedDate)}
						</p>
					</div>

					<div>
						<h3 className="mb-2 text-lg font-semibold">Actions</h3>
						<div className="flex flex-wrap gap-2">
							{data.Actions.map((action, index) => (
								<Badge key={index} variant="secondary">
									{action}
								</Badge>
							))}
						</div>
					</div>

					{isExpanded && (
						<>
							<div>
								<h3 className="mb-2 text-lg font-semibold">Conditions</h3>
								<p>
									<span className="font-medium">Start Date:</span>{' '}
									{formatDate(data.Conditions.StartDate)}
								</p>
								<p>
									<span className="font-medium">End Date:</span>{' '}
									{formatDate(data.Conditions.EndDate)}
								</p>
								<p>
									<span className="font-medium">Allowed Platforms:</span>
								</p>
								<ul className="list-inside list-disc pl-4">
									{data.Conditions.ClientConditions.AllowedPlatforms.map(
										(platform, index) => (
											<li key={index}>
												{platform.PlatformName} (Min: {platform.MinVersion},
												Max: {platform.MaxVersion})
											</li>
										),
									)}
								</ul>
							</div>

							<div>
								<h3 className="mb-2 text-lg font-semibold">
									Order Management Data
								</h3>
								<p>
									<span className="font-medium">Currency:</span>{' '}
									{data.OrderManagementData.Price.CurrencyCode}
								</p>
								<p>
									<span className="font-medium">List Price:</span> $
									{data.OrderManagementData.Price.ListPrice?.toFixed(2)}
								</p>
								<p>
									<span className="font-medium">MSRP:</span> $
									{data.OrderManagementData.Price.MSRP?.toFixed(2)}
								</p>
								<p>
									<span className="font-medium">Wholesale Price:</span> $
									{data.OrderManagementData.Price.WholesalePrice?.toFixed(2)} (
									{data.OrderManagementData.Price.WholesaleCurrencyCode})
								</p>
							</div>

							<div>
								<h3 className="mb-2 text-lg font-semibold">Properties</h3>
								<p>
									<span className="font-medium">Original Release Date:</span>{' '}
									{formatDate(data.Properties.OriginalReleaseDate)}
								</p>
							</div>

							<div>
								<h3 className="mb-2 text-lg font-semibold">Markets</h3>
								<div className="flex flex-wrap gap-2">
									{data.Markets.map((market, index) => (
										<Badge key={index} variant="outline">
											{market}
										</Badge>
									))}
								</div>
							</div>
						</>
					)}
				</div>
				{!isExpanded ? (
					<Button
						type="button"
						variant={'outline'}
						className="mt-4"
						onClick={toggle}
					>
						Show More
					</Button>
				) : null}
			</CardContent>
		</Card>
	)
}
