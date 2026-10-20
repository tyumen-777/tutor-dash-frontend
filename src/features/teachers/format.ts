import dayjs from 'dayjs'
import 'dayjs/locale/ru'

const rateFormatter = new Intl.NumberFormat('ru-RU', {
	style: 'currency',
	currency: 'RUB',
	maximumFractionDigits: 2
})

export function formatHourlyRate(value: string) {
	return `${rateFormatter.format(Number(value))}/ч`
}

export function formatDate(value: string) {
	return dayjs(value).locale('ru').format('D MMMM YYYY')
}
