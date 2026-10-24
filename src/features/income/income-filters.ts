import { paymentMethodOptions, paymentStatusOptions } from './payment-options'
import type {
	ListPaymentsQuery,
	PaymentResponseMethod,
	PaymentResponseStatus
} from '@/api/generated/models'
import { getDefaultPeriod } from '@/features/expenses/expense-filters'

export type IncomeFilters = {
	from: string
	to: string
	method: PaymentResponseMethod | null
	status: PaymentResponseStatus | null
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function parseIncomeFilters(
	params: Pick<URLSearchParams, 'get'>
): IncomeFilters {
	const defaultPeriod = getDefaultPeriod()
	let from = params.get('from')
	let to = params.get('to')

	if (!from || !to || !DATE_PATTERN.test(from) || !DATE_PATTERN.test(to)) {
		from = defaultPeriod.from
		to = defaultPeriod.to
	} else if (from > to) {
		;[from, to] = [to, from]
	}

	const method =
		paymentMethodOptions.find(
			option => option.value === params.get('method')
		)?.value ?? null
	const status =
		paymentStatusOptions.find(
			option => option.value === params.get('status')
		)?.value ?? null

	return { from, to, method, status }
}

export function serializeIncomeFilters(filters: IncomeFilters) {
	const params = new URLSearchParams()
	const defaultPeriod = getDefaultPeriod()

	if (
		filters.from !== defaultPeriod.from ||
		filters.to !== defaultPeriod.to
	) {
		params.set('from', filters.from)
		params.set('to', filters.to)
	}
	if (filters.method) {
		params.set('method', filters.method)
	}
	if (filters.status) {
		params.set('status', filters.status)
	}

	return params.toString()
}

export function toListPaymentsQuery(filters: IncomeFilters): ListPaymentsQuery {
	return {
		from: filters.from,
		to: filters.to,
		method: filters.method ?? undefined,
		status: filters.status ?? undefined,
		limit: 100
	}
}
