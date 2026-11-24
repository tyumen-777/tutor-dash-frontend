import dayjs from 'dayjs'

import type {
	FinanceLogResponseAction,
	FinanceLogResponseEntityType,
	ListFinanceLogsQuery
} from '@/api/generated/models'
import { getDefaultPeriod } from '@/features/expenses/expense-filters'

export type HistoryAction = FinanceLogResponseAction
export type HistoryEntity = FinanceLogResponseEntityType

export const ENTITY_LABELS: Record<HistoryEntity, string> = {
	PAYMENT: 'Оплаты учеников',
	PAYOUT: 'Выплаты преподавателям',
	PERIOD: 'Закрытие месяцев'
}

// Родительный падеж для бейджа: «Внесение оплаты», «Отмена выплаты»
export const ENTITY_OBJECT_LABELS: Record<HistoryEntity, string> = {
	PAYMENT: 'оплаты',
	PAYOUT: 'выплаты',
	PERIOD: 'месяца'
}

// Месяц не «вносят» и не «отменяют», а закрывают и открывают
const PERIOD_ACTION_LABELS: Partial<Record<HistoryAction, string>> = {
	CREATED: 'Закрытие',
	CANCELED: 'Открытие'
}

/** Текст бейджа: «Внесение оплаты», «Закрытие месяца». */
export function getActionLabel(action: HistoryAction, entity: HistoryEntity) {
	const verb =
		(entity === 'PERIOD' ? PERIOD_ACTION_LABELS[action] : undefined) ??
		ACTION_LABELS[action]

	return `${verb} ${ENTITY_OBJECT_LABELS[entity]}`
}

export const entityOptions = (
	Object.keys(ENTITY_LABELS) as HistoryEntity[]
).map(value => ({ value, label: ENTITY_LABELS[value] }))

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
	entity: HistoryEntity | null
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

	const entityParam = params.get('entity')
	const entity =
		entityOptions.find(option => option.value === entityParam)?.value ??
		null

	return { from, to, action, entity }
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
	if (filters.entity) {
		params.set('entity', filters.entity)
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
		entityType: filters.entity ?? undefined,
		limit: 100
	}
}
