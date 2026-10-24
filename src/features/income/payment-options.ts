import type {
	PaymentResponseMethod,
	PaymentResponseStatus
} from '@/api/generated/models'

export const PAYMENT_METHOD_LABELS: Record<PaymentResponseMethod, string> = {
	CASH: 'Наличные',
	CARD: 'Карта',
	TRANSFER: 'Перевод',
	OTHER: 'Другое'
}

export const PAYMENT_STATUS_LABELS: Record<PaymentResponseStatus, string> = {
	COMPLETED: 'Проведена',
	CANCELED: 'Отменена',
	REFUNDED: 'Возврат'
}

export const PAYMENT_STATUS_BADGE_VARIANTS: Record<
	PaymentResponseStatus,
	'success' | 'outline' | 'warning'
> = {
	COMPLETED: 'success',
	CANCELED: 'outline',
	REFUNDED: 'warning'
}

export const paymentMethodOptions = (
	Object.keys(PAYMENT_METHOD_LABELS) as PaymentResponseMethod[]
).map(value => ({ value, label: PAYMENT_METHOD_LABELS[value] }))

export const paymentStatusOptions = (
	Object.keys(PAYMENT_STATUS_LABELS) as PaymentResponseStatus[]
).map(value => ({ value, label: PAYMENT_STATUS_LABELS[value] }))

const pluralRules = new Intl.PluralRules('ru-RU')

export function formatLessons(count: number) {
	const forms: Partial<Record<Intl.LDMLPluralRule, string>> = {
		one: 'занятие',
		few: 'занятия'
	}

	return `${count} ${forms[pluralRules.select(count)] ?? 'занятий'}`
}

/**
 * Price of one lesson in the package, or null when it cannot be computed.
 */
export function getLessonPrice(
	amount: number | string | undefined,
	lessonsCount: number | null | undefined
) {
	if (amount === undefined || amount === '' || !lessonsCount) return null

	const value = Number(amount)

	return Number.isFinite(value) ? value / lessonsCount : null
}
