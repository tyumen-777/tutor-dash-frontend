import dayjs from 'dayjs'

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
	style: 'currency',
	currency: 'RUB',
	maximumFractionDigits: 2
})

export function formatCurrency(value: number) {
	return currencyFormatter.format(value)
}

export function formatDate(value: string) {
	return dayjs(value).format('DD.MM.YYYY')
}
