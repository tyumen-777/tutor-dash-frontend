import { z } from 'zod'

export const teacherOptions = [
	{ label: 'Мария Иванова', value: 'Мария Иванова' },
	{ label: 'Алексей Петров', value: 'Алексей Петров' },
	{ label: 'Екатерина Соколова', value: 'Екатерина Соколова' }
] as const

export const levelOptions = [
	{ label: 'Beginner', value: 'Beginner' },
	{ label: 'Elementary', value: 'Elementary' },
	{ label: 'Pre-Intermediate', value: 'Pre-Intermediate' },
	{ label: 'Intermediate', value: 'Intermediate' }
] as const

const optionalPhoneSchema = z
	.string()
	.trim()
	.refine(
		value => value === '' || /^\+?[\d\s()-]+$/.test(value),
		'Используйте цифры, пробелы, скобки, дефисы и знак +'
	)
	.refine(value => {
		if (value === '') return true

		const digits = value.replace(/\D/g, '')
		return digits.length >= 10 && digits.length <= 15
	}, 'Телефон должен содержать от 10 до 15 цифр')

const optionalEmailSchema = z
	.string()
	.trim()
	.refine(
		value => value === '' || z.email().safeParse(value).success,
		'Введите корректный email'
	)

const optionalTelegramSchema = z
	.string()
	.trim()
	.refine(
		value => value === '' || /^@[a-zA-Z0-9_]{5,32}$/.test(value),
		'Введите username в формате @username'
	)

const studentDetailsSchema = z.object({
	fullName: z
		.string()
		.trim()
		.min(1, 'Введите ФИО')
		.refine(
			value => value.split(/\s+/).filter(Boolean).length >= 2,
			'Укажите как минимум имя и фамилию'
		),
	age: z
		.number({ error: 'Введите возраст' })
		.int('Возраст должен быть целым числом')
		.min(3, 'Минимальный возраст — 3 года')
		.max(100, 'Максимальный возраст — 100 лет'),
	teacher: z.enum(
		teacherOptions.map(option => option.value) as [
			(typeof teacherOptions)[number]['value'],
			...(typeof teacherOptions)[number]['value'][]
		],
		{ error: 'Выберите преподавателя' }
	),
	level: z.enum(
		levelOptions.map(option => option.value) as [
			(typeof levelOptions)[number]['value'],
			...(typeof levelOptions)[number]['value'][]
		],
		{ error: 'Выберите уровень' }
	)
})

const studentContactsSchema = z
	.object({
		phone: optionalPhoneSchema,
		email: optionalEmailSchema,
		telegram: optionalTelegramSchema
	})
	.refine(data => data.phone || data.email || data.telegram, {
		message: 'Укажите хотя бы один способ связи',
		path: ['phone']
	})

export const studentFormSchema = studentDetailsSchema.and(studentContactsSchema)

export type StudentFormValues = z.infer<typeof studentFormSchema>
