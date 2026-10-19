import dayjs from 'dayjs'
import { z } from 'zod'

import type { CreateTeacherRequest } from '@/api/generated/models'

const MAX_HOURLY_RATE = 9_999_999_999.99

const optionalPhoneSchema = z
	.string()
	.trim()
	.refine(
		value => value === '' || /^\+?[\d\s()-]{5,20}$/.test(value),
		'Используйте от 5 до 20 символов: цифры, пробелы, скобки, дефисы и знак +'
	)

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
		value =>
			value === '' ||
			/^(?:@|(?:https?:\/\/)?t\.me\/)?[a-zA-Z0-9_]{5,32}$/.test(value),
		'Введите username, @username или t.me/username'
	)

export const teacherFormSchema = z.object({
	fullName: z
		.string()
		.trim()
		.min(1, 'Введите ФИО')
		.max(200, 'Не более 200 символов')
		.refine(
			value => value.split(/\s+/).filter(Boolean).length >= 2,
			'Укажите как минимум имя и фамилию'
		),
	hourlyRate: z
		.number({ error: 'Введите ставку' })
		.min(0, 'Ставка не может быть отрицательной')
		.max(MAX_HOURLY_RATE, 'Слишком большая ставка')
		.refine(
			value => /^\d+(\.\d{1,2})?$/.test(String(value)),
			'Не более двух знаков после запятой'
		),
	startedOn: z
		.string()
		.min(1, 'Укажите дату начала работы')
		.refine(
			value =>
				/^\d{4}-\d{2}-\d{2}$/.test(value) &&
				dayjs(value).format('YYYY-MM-DD') === value,
			'Введите корректную дату'
		),
	phone: optionalPhoneSchema,
	email: optionalEmailSchema,
	telegram: optionalTelegramSchema
})

export type TeacherFormValues = z.infer<typeof teacherFormSchema>

function emptyToUndefined(value: string) {
	return value === '' ? undefined : value
}

export function toCreateTeacherRequest(
	values: TeacherFormValues
): CreateTeacherRequest {
	return {
		fullName: values.fullName,
		hourlyRate: values.hourlyRate,
		startedOn: values.startedOn,
		phone: emptyToUndefined(values.phone),
		email: emptyToUndefined(values.email),
		telegram: emptyToUndefined(values.telegram)
	}
}
