const Params = v.object({
	product: v.string(),
	market: v.string(),
});

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { product: productId, market } = v.parse(Params, params);

	const [lang, region] = market.split('-');

	const product = await fetchProduct({ id: productId, market: region, lang });

	return json(product);
};

export default function Product() {
	const product = useLoaderData<typeof loader>();

	return (
		<>
			<RegionSelector />
			<ProductSchemaUI product={product} />
		</>
	);
}
