import dayjs, { type Dayjs } from 'dayjs'

import {
	type Expense,
	categoryOptions,
	statusOptions
} from './expense-form-schema'

export type ExpenseCategory = Expense['category']
export type ExpenseStatus = Expense['status']

export type ExpenseFilters = {
	from: string
	to: string
	categories: ExpenseCategory[]
	status: ExpenseStatus | null
}

const DATE_FORMAT = 'YYYY-MM-DD'

export function toDateString(date: Dayjs) {
	return date.format(DATE_FORMAT)
}

function isValidDate(value: string | null): value is string {
	return !!value && dayjs(value, DATE_FORMAT).isValid()
}

export const periodPresets = [
	{
		label: 'Этот месяц',
		getRange: (today: Dayjs) => [
			today.startOf('month'),
			today.endOf('month')
		]
	},
	{
		label: 'Прошлый месяц',
		getRange: (today: Dayjs) => {
			const month = today.subtract(1, 'month')
			return [month.startOf('month'), month.endOf('month')]
		}
	},
	{
		label: 'Последние 7 дней',
		getRange: (today: Dayjs) => [today.subtract(6, 'day'), today]
	},
	{
		label: 'Этот квартал',
		getRange: (today: Dayjs) => {
			const start = today
				.month(Math.floor(today.month() / 3) * 3)
				.startOf('month')
			return [start, start.add(2, 'month').endOf('month')]
		}
	},
	{
		label: 'Этот год',
		getRange: (today: Dayjs) => [today.startOf('year'), today.endOf('year')]
	}
] as const satisfies readonly {
	label: string
	getRange: (today: Dayjs) => [Dayjs, Dayjs]
}[]

export function getPresetRange(preset: (typeof periodPresets)[number]) {
	const [from, to] = preset.getRange(dayjs())
	return { from: toDateString(from), to: toDateString(to) }
}

export function getDefaultPeriod() {
	return getPresetRange(periodPresets[0])
}

export function parseExpenseFilters(
	params: Pick<URLSearchParams, 'get'>
): ExpenseFilters {
	const defaultPeriod = getDefaultPeriod()
	let from = params.get('from')
	let to = params.get('to')

	if (!isValidDate(from) || !isValidDate(to)) {
		from = defaultPeriod.from
		to = defaultPeriod.to
	} else if (from > to) {
		;[from, to] = [to, from]
	}

	const categoryValues = new Set<string>(
		categoryOptions.map(option => option.value)
	)
	const categories = (params.get('category') ?? '')
		.split(',')
		.filter((value): value is ExpenseCategory => categoryValues.has(value))

	const statusParam = params.get('status')
	const status =
		statusOptions.find(option => option.value === statusParam)?.value ??
		null

	return { from, to, categories, status }
}

export function serializeExpenseFilters(filters: ExpenseFilters) {
	const params = new URLSearchParams()
	const defaultPeriod = getDefaultPeriod()

	if (
		filters.from !== defaultPeriod.from ||
		filters.to !== defaultPeriod.to
	) {
		params.set('from', filters.from)
		params.set('to', filters.to)
	}
	if (filters.categories.length) {
		params.set('category', filters.categories.join(','))
	}
	if (filters.status) {
		params.set('status', filters.status)
	}

	return params.toString()
}

export function hasActiveFilters(filters: ExpenseFilters) {
	return serializeExpenseFilters(filters) !== ''
}

export function applyExpenseFilters(
	expenses: Expense[],
	filters: ExpenseFilters
) {
	return expenses.filter(
		expense =>
			expense.date >= filters.from &&
			expense.date <= filters.to &&
			(!filters.categories.length ||
				filters.categories.includes(expense.category)) &&
			(!filters.status || expense.status === filters.status)
	)
}

const dayMonthFormatter = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'short'
})
const fullDateFormatter = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
})
const monthFormatter = new Intl.DateTimeFormat('ru-RU', {
	month: 'long',
	year: 'numeric'
})

export function formatPeriod(from: string, to: string) {
	const start = dayjs(from)
	const end = dayjs(to)

	if (
		start.isSame(start.startOf('month'), 'day') &&
		end.isSame(start.endOf('month'), 'day')
	) {
		const label = monthFormatter.format(start.toDate()).replace(' г.', '')
		return label.charAt(0).toUpperCase() + label.slice(1)
	}
	if (start.isSame(end, 'day')) {
		return fullDateFormatter.format(start.toDate())
	}
	if (start.isSame(end, 'year')) {
		return `${dayMonthFormatter.format(start.toDate())} – ${fullDateFormatter.format(end.toDate())}`
	}

	return `${fullDateFormatter.format(start.toDate())} – ${fullDateFormatter.format(end.toDate())}`
}
