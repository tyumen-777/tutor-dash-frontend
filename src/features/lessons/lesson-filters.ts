import { lessonStatusOptions } from './lesson-options'
import type {
	ListLessonsQuery,
	ListLessonsQueryStatus
} from '@/api/generated/models'
import { getDefaultPeriod } from '@/features/expenses/expense-filters'

export type LessonFilters = {
	from: string
	to: string
	teacherId: string | null
	status: ListLessonsQueryStatus | null
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function parseLessonFilters(
	params: Pick<URLSearchParams, 'get'>
): LessonFilters {
	const defaultPeriod = getDefaultPeriod()
	let from = params.get('from')
	let to = params.get('to')

	if (!from || !to || !DATE_PATTERN.test(from) || !DATE_PATTERN.test(to)) {
		from = defaultPeriod.from
		to = defaultPeriod.to
	} else if (from > to) {
		;[from, to] = [to, from]
	}

	const status =
		lessonStatusOptions.find(
			option => option.value === params.get('status')
		)?.value ?? null

	return { from, to, teacherId: params.get('teacher') || null, status }
}

export function serializeLessonFilters(filters: LessonFilters) {
	const params = new URLSearchParams()
	const defaultPeriod = getDefaultPeriod()

	if (
		filters.from !== defaultPeriod.from ||
		filters.to !== defaultPeriod.to
	) {
		params.set('from', filters.from)
		params.set('to', filters.to)
	}
	if (filters.teacherId) {
		params.set('teacher', filters.teacherId)
	}
	if (filters.status) {
		params.set('status', filters.status)
	}

	return params.toString()
}

export function toListLessonsQuery(filters: LessonFilters): ListLessonsQuery {
	return {
		from: filters.from,
		to: filters.to,
		teacherId: filters.teacherId ?? undefined,
		status: filters.status ?? undefined,
		limit: 100
	}
}
