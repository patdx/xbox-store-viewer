import { ErrorBoundary } from 'react-error-boundary'
import type { Route } from './+types/_main.$market.$product'

const Params = v.object({
	product: v.string(),
	market: v.string(),
})

export const loader = async ({ params }: Route.LoaderArgs) => {
	const { product: productId, market } = v.parse(Params, params)

	const [lang, region] = market.split('-')

	const product = await fetchProduct({ id: productId, market: region, lang })

	return product
}

export default function Product({ loaderData }: Route.ComponentProps) {
	const product = loaderData

	return (
		<>
			<RegionSelector />
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
				<ProductSchemaUI product={product} />
			</ErrorBoundary>
		</>
	)
}
