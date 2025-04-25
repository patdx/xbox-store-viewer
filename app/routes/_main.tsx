import { Outlet } from '@remix-run/react'

export default function Main() {
	return (
		<div className="font-sans p-4">
			<h1 className="text-3xl">Xbox Store Viewer</h1>
			<p>
				View and compare Xbox Store products in different languages and regions
			</p>
			<ul className="list-disc mt-4 pl-6 space-y-2">
				<li>
					<StyledLink to="/en-US/9P3J32CTXLRZ">Elden Ring US</StyledLink>
				</li>
				<li>
					<StyledLink to="/ja-JP/9P3J32CTXLRZ">Elden Ring JP</StyledLink>
				</li>
			</ul>
			<Outlet />
		</div>
	)
}
