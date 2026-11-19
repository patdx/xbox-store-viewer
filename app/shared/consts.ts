export const LANGUAGES = {
	en: ['English', 'English'],
	ja: ['Japanese', '日本語'],
	de: ['German', 'Deutsch'],
	fr: ['French', 'Français'],
	es: ['Spanish', 'Español'],
	it: ['Italian', 'Italiano'],
	ko: ['Korean', '한국어'],
	zh: ['Chinese', '中文'],
	pt: ['Portuguese', 'Português'],
	ru: ['Russian', 'Русский'],
	pl: ['Polish', 'Polski'],
} satisfies Record<string, [string, string]>

export const MARKETS = {
	US: ['United States', 'United States'],
	JP: ['Japan', '日本'],
	GB: ['United Kingdom', 'United Kingdom'],
	AU: ['Australia', 'Australia'],
	CA: ['Canada', 'Canada'],
	DE: ['Germany', 'Deutschland'],
	FR: ['France', 'France'],
	ES: ['Spain', 'España'],
	IT: ['Italy', 'Italia'],
	KR: ['Korea', '한국'],
	HK: ['Hong Kong', '香港'],
	TW: ['Taiwan', '台灣'],
	BR: ['Brazil', 'Brasil'],
	MX: ['Mexico', 'México'],
	PL: ['Poland', 'Polska'],
	CN: ['China', '中国'],
	SG: ['Singapore', 'Singapore'],
	NZ: ['New Zealand', 'New Zealand'],
} satisfies Record<string, [string, string]>

export const COMPARE_MARKETS = [
	'US',
	'JP',
	'GB',
	'AU',
	'DE',
	'FR',
	'KR',
	'HK',
	'TW',
	'BR',
] as const

export const DEFAULT_COMPARE_MARKETS = ['US', 'JP', 'GB', 'AU'] as const

export const COMPARE_MARKET_LIMIT = 6
