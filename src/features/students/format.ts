import dayjs from 'dayjs'

import type {
	StudentResponse,
	StudentResponseStatus
} from '@/api/generated/models'

export function getStudentFullName(
	student: Pick<StudentResponse, 'firstName' | 'lastName'>
) {
	return [student.firstName, student.lastName].filter(Boolean).join(' ')
}

export function getAge(birthDate: string) {
	return dayjs().diff(birthDate, 'year')
}

const pluralRules = new Intl.PluralRules('ru-RU')

export function formatAge(age: number) {
	const forms: Partial<Record<Intl.LDMLPluralRule, string>> = {
		one: 'год',
		few: 'года'
	}

	return `${age} ${forms[pluralRules.select(age)] ?? 'лет'}`
}

export const STUDENT_STATUS_LABELS: Record<StudentResponseStatus, string> = {
	LEAD: 'Лид',
	ACTIVE: 'Активный',
	PAUSED: 'На паузе',
	ARCHIVED: 'В архиве'
}

export const STUDENT_STATUS_BADGE_VARIANTS: Record<
	StudentResponseStatus,
	'success' | 'warning' | 'secondary' | 'outline'
> = {
	ACTIVE: 'success',
	LEAD: 'warning',
	PAUSED: 'secondary',
	ARCHIVED: 'outline'
}
