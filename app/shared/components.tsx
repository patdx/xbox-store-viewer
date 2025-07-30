export function StyledLink({
	children,
	to,
}: {
	children: React.ReactNode
	to: string
}) {
	return (
		<Link className="text-blue-700 underline visited:text-purple-900" to={to}>
			{children}
		</Link>
	)
}

export function RegionSelector() {
	const { market, product } = useParams()

	const [lang, region] = market?.split('-') ?? [null, null]

	const navigate = useNavigate()

	// Lang dropdown and Region dropdown

	return (
		<>
			<div className="sticky top-0 flex flex-col border-b border-gray-200 bg-white p-4">
				<div className="flex items-center">
					<div className="mr-2">
						<span className="text-gray-700">Language</span>
					</div>
					<select
						className="rounded-md border border-gray-300 bg-gray-200 px-2 py-1 text-gray-700"
						value={lang ?? ''}
						onChange={(e) => {
							const lang = e.target.value
							if (lang) {
								navigate(`/${lang}-${region}/${product}`, {
									preventScrollReset: true,
								})
							}
						}}
					>
						<option>Select a language</option>
						{Object.entries(LANGUAGES).map(([key, [label, value]]) => (
							<option key={key} value={key}>
								{label} ({value})
							</option>
						))}
					</select>
				</div>
				<div className="mt-2 flex items-center">
					<div className="mr-2">
						<span className="text-gray-700">Region</span>
					</div>
					<select
						className="rounded-md border border-gray-300 bg-gray-200 px-2 py-1 text-gray-700"
						value={region ?? ''}
						onChange={(e) => {
							const region = e.target.value
							if (region) {
								navigate(`/${lang}-${region}/${product}`, {
									preventScrollReset: true,
								})
							}
						}}
					>
						<option>Select a region</option>
						{Object.entries(MARKETS).map(([key, [label, value]]) => (
							<option key={key} value={key}>
								{label} ({value})
							</option>
						))}
					</select>
				</div>
			</div>
		</>
	)
}
