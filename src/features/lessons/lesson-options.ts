import type { LessonResponseStatus } from '@/api/generated/models'

export const LESSON_STATUS_LABELS: Record<LessonResponseStatus, string> = {
	SCHEDULED: 'Запланировано',
	COMPLETED: 'Проведено',
	CANCELED: 'Отменено',
	RESCHEDULED: 'Перенесено'
}

export const LESSON_STATUS_BADGE_VARIANTS: Record<
	LessonResponseStatus,
	'success' | 'outline' | 'warning' | 'secondary'
> = {
	SCHEDULED: 'secondary',
	COMPLETED: 'success',
	CANCELED: 'outline',
	RESCHEDULED: 'warning'
}

// Пока занятия только вносятся по факту — фильтруем по этим двум статусам
export const lessonStatusOptions = (
	['COMPLETED', 'CANCELED'] as const satisfies LessonResponseStatus[]
).map(value => ({ value, label: LESSON_STATUS_LABELS[value] }))

export const LESSON_DURATIONS = [60, 45] as const

export type LessonDuration = (typeof LESSON_DURATIONS)[number]

export const lessonDurationOptions = LESSON_DURATIONS.map(value => ({
	value: String(value),
	label: `${value} минут`
}))

/**
 * Teacher pay for a lesson, mirroring the backend: 45 minutes are paid
 * pro rata from the hourly rate and rounded up to 10.
 */
export function calculateTeacherPay(
	hourlyRate: number,
	durationMin: LessonDuration
) {
	if (durationMin === 60) return hourlyRate

	return Math.ceil((hourlyRate * durationMin) / 60 / 10) * 10
}
