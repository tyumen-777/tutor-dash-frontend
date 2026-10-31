import dayjs from 'dayjs'
import { z } from 'zod'

import { fromSchoolTime, schoolNow, toSchoolTime } from '@/lib/school-time'

import { LESSON_DURATIONS, type LessonDuration } from './lesson-options'
import type {
	CreateLessonRequest,
	LessonResponse,
	UpdateLessonRequest
} from '@/api/generated/models'

const lessonFieldsSchema = z.object({
	studentId: z.string().min(1, 'Выберите ученика'),
	teacherId: z.string().min(1, 'Выберите преподавателя'),
	date: z
		.string()
		.min(1, 'Укажите дату')
		.refine(value => dayjs(value).isValid(), 'Введите корректную дату'),
	time: z.string().regex(/^\d{2}:\d{2}$/, 'Укажите время'),
	durationMin: z.union(
		LESSON_DURATIONS.map(value => z.literal(value)),
		{ error: 'Выберите длительность' }
	),
	topic: z.string().trim().max(500, 'Не более 500 символов'),
	homework: z.string().trim().max(2000, 'Не более 2000 символов')
})

export type LessonFormValues = z.infer<typeof lessonFieldsSchema>

// Дата и время вводятся по часам школы, а не браузера
export function createLessonFormSchema(timezone: string) {
	return lessonFieldsSchema.refine(
		values =>
			!fromSchoolTime(values.date, values.time, timezone).isAfter(
				dayjs()
			),
		{ message: 'Занятие не может быть в будущем', path: ['time'] }
	)
}

export function getCreateDefaultValues(
	timezone: string
): Partial<LessonFormValues> {
	const now = schoolNow(timezone)

	return {
		studentId: '',
		teacherId: '',
		date: now.format('YYYY-MM-DD'),
		time: now.subtract(1, 'hour').startOf('hour').format('HH:mm'),
		durationMin: 60,
		topic: '',
		homework: ''
	}
}

export function getEditDefaultValues(
	lesson: LessonResponse,
	timezone: string
): Partial<LessonFormValues> {
	const startsAt = toSchoolTime(lesson.startsAt, timezone)

	return {
		studentId: lesson.student?.id ?? '',
		teacherId: lesson.teacher.id,
		date: startsAt.format('YYYY-MM-DD'),
		time: startsAt.format('HH:mm'),
		durationMin: LESSON_DURATIONS.includes(
			lesson.durationMin as LessonDuration
		)
			? (lesson.durationMin as LessonDuration)
			: undefined,
		topic: lesson.topic ?? '',
		homework: lesson.homework ?? ''
	}
}

// Ученик не меняется; пустые тема и ДЗ очищают поля
export function toUpdateLessonRequest(
	values: LessonFormValues,
	timezone: string
): UpdateLessonRequest {
	return {
		teacherId: values.teacherId,
		startsAt: fromSchoolTime(
			values.date,
			values.time,
			timezone
		).toISOString(),
		durationMin: values.durationMin,
		topic: values.topic,
		homework: values.homework
	}
}

export function toCreateLessonRequest(
	values: LessonFormValues,
	timezone: string
): CreateLessonRequest {
	return {
		studentId: values.studentId,
		teacherId: values.teacherId,
		startsAt: fromSchoolTime(
			values.date,
			values.time,
			timezone
		).toISOString(),
		durationMin: values.durationMin,
		topic: values.topic || undefined,
		homework: values.homework || undefined
	}
}
