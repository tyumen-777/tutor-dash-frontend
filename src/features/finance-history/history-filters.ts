import dayjs from 'dayjs'

import type {
	FinanceLogResponseAction,
	ListFinanceLogsQuery
} from '@/api/generated/models'
import { getDefaultPeriod } from '@/features/expenses/expense-filters'

export type HistoryAction = FinanceLogResponseAction

export const ACTION_LABELS: Record<HistoryAction, string> = {
	CREATED: 'Внесение',
	UPDATED: 'Изменение',
	CANCELED: 'Отмена'
}

export const ACTION_BADGE_VARIANTS: Record<
	HistoryAction,
	'success' | 'warning' | 'destructive'
> = {
	CREATED: 'success',
	UPDATED: 'warning',
	CANCELED: 'destructive'
}

export const actionOptions = (
	Object.keys(ACTION_LABELS) as HistoryAction[]
).map(value => ({ value, label: ACTION_LABELS[value] }))

export type HistoryFilters = {
	from: string
	to: string
	action: HistoryAction | null
}

function isValidDate(value: string | null): value is string {
	return !!value && dayjs(value, 'YYYY-MM-DD').isValid()
}

export function parseHistoryFilters(
	params: Pick<URLSearchParams, 'get'>
): HistoryFilters {
	const defaultPeriod = getDefaultPeriod()
	let from = params.get('from')
	let to = params.get('to')

	if (!isValidDate(from) || !isValidDate(to)) {
		from = defaultPeriod.from
		to = defaultPeriod.to
	} else if (from > to) {
		;[from, to] = [to, from]
	}

	const actionParam = params.get('action')
	const action =
		actionOptions.find(option => option.value === actionParam)?.value ??
		null

	return { from, to, action }
}

export function serializeHistoryFilters(filters: HistoryFilters) {
	const params = new URLSearchParams()
	const defaultPeriod = getDefaultPeriod()

	if (
		filters.from !== defaultPeriod.from ||
		filters.to !== defaultPeriod.to
	) {
		params.set('from', filters.from)
		params.set('to', filters.to)
	}
	if (filters.action) {
		params.set('action', filters.action)
	}

	return params.toString()
}

export function toListFinanceLogsQuery(
	filters: HistoryFilters
): ListFinanceLogsQuery {
	return {
		from: filters.from,
		to: filters.to,
		action: filters.action ?? undefined,
		limit: 100
	}
}
