const formatters = new Map<string, Intl.NumberFormat>()

function getFormatter(currency: string) {
	let formatter = formatters.get(currency)

	if (!formatter) {
		formatter = new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency,
			maximumFractionDigits: 2
		})
		formatters.set(currency, formatter)
	}

	return formatter
}

/**
 * Money from the API comes as decimal strings ("1500.00"), local values as
 * numbers. Currency defaults to the organization default (RUB).
 */
export function formatMoney(value: number | string, currency = 'RUB') {
	return getFormatter(currency).format(Number(value))
}
