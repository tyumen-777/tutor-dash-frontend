import dayjs from 'dayjs'
import { z } from 'zod'

import {
	type CreateStudentRequest,
	CreateStudentRequestStatus,
	type StudentResponse,
	type UpdateStudentRequest
} from '@/api/generated/models'

export const statusOptions = [
	{ label: 'Активный', value: CreateStudentRequestStatus.ACTIVE },
	{ label: 'Лид (пробное занятие)', value: CreateStudentRequestStatus.LEAD }
] as const

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

const optionalBirthDateSchema = z
	.string()
	.refine(
		value =>
			value === '' ||
			(/^\d{4}-\d{2}-\d{2}$/.test(value) &&
				dayjs(value).format('YYYY-MM-DD') === value),
		'Введите корректную дату'
	)
	.refine(
		value => value === '' || value >= '1900-01-01',
		'Дата не может быть раньше 1900 года'
	)
	.refine(
		value => value === '' || value <= dayjs().format('YYYY-MM-DD'),
		'Дата рождения не может быть в будущем'
	)

export const studentFormSchema = z.object({
	firstName: z
		.string()
		.trim()
		.min(1, 'Введите имя')
		.max(100, 'Не более 100 символов'),
	lastName: z.string().trim().max(100, 'Не более 100 символов'),
	birthDate: optionalBirthDateSchema,
	status: z.enum(CreateStudentRequestStatus, {
		error: 'Выберите статус'
	}),
	// '' — без преподавателя
	teacherId: z.string(),
	level: z.string().trim().max(50, 'Не более 50 символов'),
	// '' — часовой пояс организации
	timezone: z.string(),
	phone: optionalPhoneSchema,
	email: optionalEmailSchema,
	telegram: optionalTelegramSchema,
	note: z.string().trim().max(2000, 'Не более 2000 символов')
})

export type StudentFormValues = z.infer<typeof studentFormSchema>

function emptyToUndefined(value: string) {
	return value === '' ? undefined : value
}

export function toCreateStudentRequest(
	values: StudentFormValues
): CreateStudentRequest {
	return {
		firstName: values.firstName,
		lastName: emptyToUndefined(values.lastName),
		birthDate: emptyToUndefined(values.birthDate),
		status: values.status,
		teacherId: emptyToUndefined(values.teacherId),
		level: emptyToUndefined(values.level),
		timezone: emptyToUndefined(values.timezone),
		phone: emptyToUndefined(values.phone),
		email: emptyToUndefined(values.email),
		telegram: emptyToUndefined(values.telegram),
		note: emptyToUndefined(values.note)
	}
}

/**
 * Only a lead or an active student can be switched in the form; pausing and
 * archiving are separate actions.
 */
export function hasEditableStatus(student: StudentResponse) {
	return (
		student.status === CreateStudentRequestStatus.LEAD ||
		student.status === CreateStudentRequestStatus.ACTIVE
	)
}

export function toStudentFormValues(
	student: StudentResponse
): StudentFormValues {
	return {
		firstName: student.firstName,
		lastName: student.lastName ?? '',
		birthDate: student.birthDate ?? '',
		status: hasEditableStatus(student)
			? (student.status as CreateStudentRequestStatus)
			: CreateStudentRequestStatus.ACTIVE,
		teacherId: student.teacher?.id ?? '',
		level: student.level ?? '',
		timezone: student.timezone ?? '',
		phone: student.phone ?? '',
		email: student.email ?? '',
		telegram: student.telegram ?? '',
		note: student.note ?? ''
	}
}

function emptyToNull(value: string) {
	return value === '' ? null : value
}

export function toUpdateStudentRequest(
	values: StudentFormValues,
	student: StudentResponse
): UpdateStudentRequest {
	return {
		firstName: values.firstName,
		lastName: emptyToNull(values.lastName),
		birthDate: emptyToNull(values.birthDate),
		status: hasEditableStatus(student) ? values.status : undefined,
		teacherId: emptyToNull(values.teacherId),
		level: emptyToNull(values.level),
		timezone: emptyToNull(values.timezone),
		phone: emptyToNull(values.phone),
		email: emptyToNull(values.email),
		telegram: emptyToNull(values.telegram),
		note: emptyToNull(values.note)
	}
}
