const LANGUAGE_NAMES: Record<string, string> = {
	en: 'English',
	ja: 'Japanese',
	zh: 'Chinese',
	ko: 'Korean',
	fr: 'French',
	de: 'German',
	it: 'Italian',
	es: 'Spanish',
	pt: 'Portuguese',
	ru: 'Russian',
	pl: 'Polish',
	ar: 'Arabic',
	cs: 'Czech',
	da: 'Danish',
	nl: 'Dutch',
	fi: 'Finnish',
	el: 'Greek',
	hu: 'Hungarian',
	no: 'Norwegian',
	sv: 'Swedish',
	tr: 'Turkish',
	uk: 'Ukrainian',
	th: 'Thai',
	vi: 'Vietnamese',
	id: 'Indonesian',
	ms: 'Malay',
	he: 'Hebrew',
	hi: 'Hindi',
}

export function baseLanguage(tag: string) {
	const normalized = tag.trim().toLowerCase()

	if (normalized.startsWith('zh')) {
		return 'zh'
	}

	return normalized.split('-')[0] || normalized
}

export function languageName(tag: string) {
	const base = baseLanguage(tag)

	return LANGUAGE_NAMES[base] ?? base.toUpperCase()
}

export function uniqueLanguageNames(tags: string[]) {
	return [...new Set(tags.map(languageName))].sort((a, b) => a.localeCompare(b))
}

export function hasJapaneseLanguage(tags: string[]) {
	return tags.some((tag) => baseLanguage(tag) === 'ja')
}

export function formatMoney(value?: number | null, currency?: string | null) {
	if (typeof value !== 'number' || !currency) {
		return '—'
	}

	try {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency,
			maximumFractionDigits: currency === 'JPY' || currency === 'KRW' ? 0 : 2,
		}).format(value)
	} catch {
		return `${value.toLocaleString('en-US')} ${currency}`
	}
}

export function formatPrice(
	price?: { listPrice: number; currencyCode: string } | null,
) {
	if (!price?.currencyCode) {
		return '—'
	}

	if (price.listPrice === 0) {
		return 'Free'
	}

	return formatMoney(price.listPrice, price.currencyCode)
}

export function taxLabel(taxType?: string | null) {
	switch (taxType) {
		case 'ConsumptionTaxIncluded':
		case 'TaxesIncluded':
		case 'VatIncluded':
			return 'incl. tax'
		case 'TaxesNotIncluded':
		case 'VatExcluded':
			return 'excl. tax'
		case '':
		case null:
		case undefined:
			return ''
		default:
			return taxType
	}
}

export function formatBytes(bytes?: number | null) {
	if (typeof bytes !== 'number' || bytes <= 0) {
		return '—'
	}

	const gib = bytes / 1024 ** 3

	return `${gib.toFixed(2)} GiB`
}

export function formatDateTime(value?: string | null) {
	if (!value || value.startsWith('1753-') || value.startsWith('9998-')) {
		return '—'
	}

	const date = new Date(value)

	if (Number.isNaN(date.getTime())) {
		return value
	}

	return `${date.toLocaleString('en-US', {
		timeZone: 'UTC',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})} UTC`
}
