import dayjs from 'dayjs'

const MONTHS = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь'
]

/** «Октябрь 2026» по месяцу YYYY-MM. */
export function formatMonth(month: string) {
	const [year, monthNumber] = month.split('-')

	return `${MONTHS[Number(monthNumber) - 1]} ${year}`
}

// Сколько завершившихся месяцев показывать, даже если они не закрыты
export const RECENT_MONTHS = 12

/**
 * Завершившиеся месяцы (YYYY-MM) от новых к старым: последние RECENT_MONTHS
 * и все закрытые, даже более ранние.
 */
export function getEndedMonths(currentMonth: string, closed: string[]) {
	const start = dayjs(`${currentMonth}-01`)
	const recent = Array.from({ length: RECENT_MONTHS }, (_, index) =>
		start.subtract(index + 1, 'month').format('YYYY-MM')
	)

	return [...new Set([...recent, ...closed])].sort((a, b) =>
		b.localeCompare(a)
	)
}
