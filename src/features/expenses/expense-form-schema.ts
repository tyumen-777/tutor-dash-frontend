import dayjs from 'dayjs'
import { z } from 'zod'

import type {
	CreateExpenseRequest,
	ExpenseResponse,
	ExpenseResponseCategory,
	PaymentResponseMethod,
	UpdateExpenseRequest
} from '@/api/generated/models'

const categories = [
	'RENT',
	'SALARY',
	'MATERIALS',
	'MARKETING',
	'UTILITIES',
	'SOFTWARE',
	'HOUSEHOLD',
	'TAXES',
	'OTHER'
] as const satisfies readonly ExpenseResponseCategory[]

const methods = [
	'CASH',
	'CARD',
	'TRANSFER',
	'OTHER'
] as const satisfies readonly PaymentResponseMethod[]

export const expenseFormSchema = z.object({
	spentOn: z
		.string()
		.min(1, 'Укажите дату')
		.refine(value => dayjs(value).isValid(), 'Введите корректную дату')
		.refine(
			value => !dayjs(value).isAfter(dayjs(), 'day'),
			'Дата не может быть в будущем'
		),
	amount: z
		.number({ error: 'Введите сумму' })
		.positive('Сумма должна быть больше нуля')
		.max(10_000_000, 'Слишком большая сумма')
		.refine(
			value => Math.abs(value * 100 - Math.round(value * 100)) < 1e-6,
			'Не более двух знаков после запятой'
		),
	category: z.enum(categories, { error: 'Выберите категорию' }),
	// Пустая строка — преподаватель не выбран
	teacherId: z.string(),
	// Пустая строка — получатель не указан
	recipient: z
		.string()
		.trim()
		.max(100, 'Не более 100 символов')
		.refine(
			value => value === '' || value.length >= 2,
			'Не менее 2 символов'
		),
	method: z.enum(methods, { error: 'Выберите способ оплаты' }),
	status: z.enum(['PAID', 'PENDING'], { error: 'Выберите статус' }),
	description: z
		.string()
		.trim()
		.min(3, 'Опишите расход')
		.max(200, 'Не более 200 символов'),
	comment: z.string().trim().max(500, 'Не более 500 символов')
})

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>

export function getCreateDefaultValues(): Partial<ExpenseFormValues> {
	return {
		spentOn: dayjs().format('YYYY-MM-DD'),
		amount: undefined,
		category: undefined,
		teacherId: '',
		recipient: '',
		method: 'TRANSFER',
		status: 'PAID',
		description: '',
		comment: ''
	}
}

export function getEditDefaultValues(
	expense: ExpenseResponse
): Partial<ExpenseFormValues> {
	return {
		spentOn: expense.spentOn,
		amount: Number(expense.amount),
		category: expense.category,
		teacherId: expense.teacher?.id ?? '',
		recipient: expense.recipient ?? '',
		method: expense.method,
		status: expense.status === 'CANCELED' ? undefined : expense.status,
		description: expense.description,
		comment: expense.comment ?? ''
	}
}

function getTeacherId(values: ExpenseFormValues) {
	return values.category === 'SALARY' && values.teacherId
		? values.teacherId
		: null
}

export function toCreateExpenseRequest(
	values: ExpenseFormValues
): CreateExpenseRequest {
	return {
		spentOn: values.spentOn,
		amount: values.amount,
		category: values.category,
		recipient: values.recipient || undefined,
		method: values.method,
		status: values.status,
		description: values.description,
		comment: values.comment || undefined,
		teacherId: getTeacherId(values) ?? undefined
	}
}

export function toUpdateExpenseRequest(
	values: ExpenseFormValues
): UpdateExpenseRequest {
	return {
		spentOn: values.spentOn,
		amount: values.amount,
		category: values.category,
		recipient: values.recipient,
		method: values.method,
		status: values.status,
		description: values.description,
		comment: values.comment,
		teacherId: getTeacherId(values)
	}
}
