import dayjs from 'dayjs'
import { z } from 'zod'

export const categoryOptions = [
	{ label: 'Аренда', value: 'rent' },
	{ label: 'Зарплата преподавателей', value: 'salary' },
	{ label: 'Учебные материалы', value: 'materials' },
	{ label: 'Маркетинг и реклама', value: 'marketing' },
	{ label: 'Коммунальные услуги', value: 'utilities' },
	{ label: 'Связь и ПО', value: 'software' },
	{ label: 'Хозяйственные нужды', value: 'household' },
	{ label: 'Налоги и сборы', value: 'taxes' },
	{ label: 'Прочее', value: 'other' }
] as const

export const paymentMethodOptions = [
	{ label: 'Наличные', value: 'cash' },
	{ label: 'Банковская карта', value: 'card' },
	{ label: 'Безналичный перевод', value: 'transfer' }
] as const

export const statusOptions = [
	{ label: 'Оплачено', value: 'paid' },
	{ label: 'Ожидает оплаты', value: 'pending' }
] as const

type OptionValue<T extends readonly { value: string }[]> = T[number]['value']

function optionValues<T extends readonly { value: string }[]>(options: T) {
	return options.map(option => option.value) as [
		OptionValue<T>,
		...OptionValue<T>[]
	]
}

export function getOptionLabel<
	T extends readonly { label: string; value: string }[]
>(options: T, value: string) {
	return options.find(option => option.value === value)?.label ?? value
}

export const expenseFormSchema = z.object({
	date: z
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
	category: z.enum(optionValues(categoryOptions), {
		error: 'Выберите категорию'
	}),
	recipient: z
		.string()
		.trim()
		.min(2, 'Укажите получателя')
		.max(100, 'Не более 100 символов'),
	paymentMethod: z.enum(optionValues(paymentMethodOptions), {
		error: 'Выберите способ оплаты'
	}),
	status: z.enum(optionValues(statusOptions), {
		error: 'Выберите статус'
	}),
	description: z
		.string()
		.trim()
		.min(3, 'Опишите расход')
		.max(200, 'Не более 200 символов'),
	comment: z.string().trim().max(500, 'Не более 500 символов')
})

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>

export type Expense = ExpenseFormValues & { id: string }
