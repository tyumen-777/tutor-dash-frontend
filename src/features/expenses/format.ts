import dayjs from 'dayjs'

import { formatMoney } from '@/lib/format-money'

export function formatCurrency(value: number) {
	return formatMoney(value)
}

export function formatDate(value: string) {
	return dayjs(value).format('DD.MM.YYYY')
}
