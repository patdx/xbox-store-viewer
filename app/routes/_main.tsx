import { Outlet, useLocation } from 'react-router'
import { StyledLink } from '~/shared/components'

const EXAMPLES = [
	{
		label: 'Elden Ring',
		productId: '9P3J32CTXLRZ',
		note: 'Japanese-only package vs multi-language package',
	},
	{
		label: 'Cyberpunk 2077',
		productId: 'BX3M8L83BBRW',
		note: 'Different content IDs and language sets',
	},
	{
		label: 'Cyberpunk 2077 Ultimate Edition',
		productId: '9P9G5WX8C0VH',
		note: 'Bundle example',
	},
	{
		label: 'Grand Theft Auto VI — store bundle',
		productId: '9P3H4968GRSM',
		note: 'Standard Edition bundle (price and availability)',
	},
	{
		label: 'Grand Theft Auto VI — game package',
		productId: '9NL3WWNZLZZN',
		note: 'The US/JP content IDs and language sets live here',
	},
	{
		label: 'Grand Theft Auto VI — Ultimate Edition',
		productId: '9NNZSNHLR63L',
		note: 'Ultimate bundle',
	},
]

export default function Main() {
	const { pathname } = useLocation()
	const isHome = pathname === '/'

	return (
		<div className="p-4 font-sans">
			<h1 className="text-3xl">Xbox Store Viewer</h1>
			<p className="mt-1 text-muted-foreground">
				View and compare Xbox Store products in different languages and regions
			</p>

			<details open={isHome} className="mt-4 max-w-4xl rounded-md border">
				<summary className="cursor-pointer px-3 py-2 text-sm font-medium">
					Examples
				</summary>
				<div className="overflow-x-auto border-t">
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="border-b bg-muted/40 text-left text-[11px] tracking-wide text-muted-foreground uppercase">
								<th className="px-3 py-2 font-medium">Example</th>
								<th className="px-3 py-2 font-medium">US view</th>
								<th className="px-3 py-2 font-medium">JP view</th>
							</tr>
						</thead>
						<tbody>
							{EXAMPLES.map((example) => (
								<tr key={example.productId} className="border-b last:border-0">
									<td className="px-3 py-2 align-top">
										<div className="font-medium">{example.label}</div>
										<div className="text-xs text-muted-foreground">
											{example.note}
										</div>
									</td>
									<td className="px-3 py-2 align-top">
										<StyledLink
											to={`/en-US/${example.productId}?compare=US,JP`}
										>
											en-US
										</StyledLink>
									</td>
									<td className="px-3 py-2 align-top">
										<StyledLink
											to={`/ja-JP/${example.productId}?compare=US,JP`}
										>
											ja-JP
										</StyledLink>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<p className="border-t px-3 py-2 text-xs text-muted-foreground">
					Each example opens with a US vs JP comparison. GTA VI's store bundle
					exposes no package data itself — open the game package row to see the
					US vs JP content IDs, languages and sizes. You can add more markets
					from the comparison card on any product page.
				</p>
			</details>

			<Outlet />
		</div>
	)
}
