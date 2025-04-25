import type { Product } from './types'

// some of the values I found in source code of pages like:
// https://www.xbox.com/en-US/games/store/elden-ring/9P3J32CTXLRZ/0010
// Which may hint at the correct format for these
// const ex = [
// 	{
// 		language: 'pt',
// 		locale: 'pt-BR',
// 		localeWithScript: 'pt-BR',
// 		market: 'BR',
// 	},
// 	{
// 		language: 'en',
// 		locale: 'en-HK',
// 		localeWithScript: 'en-HK',
// 		market: 'HK',
// 	},
// 	{
// 		language: 'ja',
// 		locale: 'ja-JP',
// 		localeWithScript: 'ja-JP',
// 		market: 'JP',
// 	},
// 	{
// 		language: 'en',
// 		locale: 'en-US',
// 		localeWithScript: 'en-US',
// 		market: 'US',
// 	},
// ];

export async function fetchProducts({
	ids,
	market,
	lang,
}: {
	ids: string[]
	market: string
	lang: string
}) {
	const params = new URLSearchParams({
		market: market,
		languages: lang,
		bigIds: ids.join(','),
		'MS-CV': 'DGU1mcuYo0WMMp+F.1',
	})

	const url = `https://displaycatalog.mp.microsoft.com/v7.0/products?${params}`

	const result = await ofetch<{ Products: Product[] }>(url)

	return result.Products
}

export async function fetchProduct({
	id,
	market,
	lang,
}: {
	id: string
	market: string
	lang: string
}): Promise<Product> {
	const products = await fetchProducts({ ids: [id], market, lang })

	return products[0]
}
