import dayjs from 'dayjs'
import { z } from 'zod'

import type {
	CreatePaymentRequest,
	PaymentResponse,
	PaymentResponseMethod,
	UpdatePaymentRequest
} from '@/api/generated/models'

const methods = [
	'CASH',
	'CARD',
	'TRANSFER',
	'OTHER'
] as const satisfies readonly PaymentResponseMethod[]

export const paymentFormSchema = z.object({
	studentId: z.string().min(1, 'Выберите ученика'),
	amount: z
		.number({ error: 'Введите сумму' })
		.min(0, 'Сумма не может быть отрицательной')
		.max(10_000_000, 'Слишком большая сумма')
		.refine(
			value => Math.abs(value * 100 - Math.round(value * 100)) < 1e-6,
			'Не более двух знаков после запятой'
		),
	lessonsCount: z
		.number({ error: 'Укажите количество занятий' })
		.int('Целое число')
		.min(1, 'Минимум 1 занятие')
		.max(1000, 'Не более 1000 занятий'),
	paidOn: z
		.string()
		.min(1, 'Укажите дату')
		.refine(value => dayjs(value).isValid(), 'Введите корректную дату')
		.refine(
			value => !dayjs(value).isAfter(dayjs(), 'day'),
			'Дата не может быть в будущем'
		),
	method: z.enum(methods, { error: 'Выберите способ оплаты' }),
	comment: z.string().trim().max(2000, 'Не более 2000 символов')
})

export type PaymentFormValues = z.infer<typeof paymentFormSchema>

export function getCreateDefaultValues(
	studentId = ''
): Partial<PaymentFormValues> {
	return {
		studentId,
		amount: undefined,
		lessonsCount: undefined,
		paidOn: dayjs().format('YYYY-MM-DD'),
		method: 'TRANSFER',
		comment: ''
	}
}

export function getEditDefaultValues(
	payment: PaymentResponse
): PaymentFormValues {
	return {
		studentId: payment.student.id,
		amount: Number(payment.amount),
		lessonsCount: payment.lessonsCount ?? 1,
		paidOn: payment.paidOn,
		method: payment.method,
		comment: payment.comment ?? ''
	}
}

export function toCreatePaymentRequest(
	values: PaymentFormValues
): CreatePaymentRequest {
	return {
		studentId: values.studentId,
		amount: values.amount,
		lessonsCount: values.lessonsCount,
		paidOn: values.paidOn,
		method: values.method,
		comment: values.comment || undefined
	}
}

export function toUpdatePaymentRequest(
	values: PaymentFormValues
): UpdatePaymentRequest {
	return {
		amount: values.amount,
		lessonsCount: values.lessonsCount,
		paidOn: values.paidOn,
		method: values.method,
		comment: values.comment
	}
}
