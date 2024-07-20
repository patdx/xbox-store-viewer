export function StyledLink({
	children,
	to,
}: { children: React.ReactNode; to: string }) {
	return (
		<Link className="text-blue-700 underline visited:text-purple-900" to={to}>
			{children}
		</Link>
	);
}

export function RegionSelector() {
	const { market, product } = useParams();

	const [lang, region] = market?.split('-') ?? [null, null];

	const navigate = useNavigate();

	// Lang dropdown and Region dropdown

	return (
		<>
			<div className="flex flex-col sticky top-0 bg-white p-4 border-b border-gray-200">
				<div className="flex items-center">
					<div className="mr-2">
						<span className="text-gray-700">Language</span>
					</div>
					<select
						className="bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded-md"
						value={lang ?? ''}
						onChange={(e) => {
							const lang = e.target.value;
							if (lang) {
								navigate(`/${lang}-${region}/${product}`, {
									preventScrollReset: true,
								});
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
				<div className="flex items-center mt-2">
					<div className="mr-2">
						<span className="text-gray-700">Region</span>
					</div>
					<select
						className="bg-gray-200 border border-gray-300 text-gray-700 py-1 px-2 rounded-md"
						value={region ?? ''}
						onChange={(e) => {
							const region = e.target.value;
							if (region) {
								navigate(`/${lang}-${region}/${product}`, {
									preventScrollReset: true,
								});
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
	);
}
