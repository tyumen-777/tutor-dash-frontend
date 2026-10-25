'use client'

import type { ListStudentsQuery } from '@/api/generated/models'
import {
	getStudentsControllerListStudentsQueryKey,
	useStudentsControllerListStudents
} from '@/api/generated/students/students'
import { useLessons } from '@/features/lessons/api/use-lessons'

export type MonthPeriod = { from: string; to: string }

/**
 * Lessons of the teacher in the given month. One month of an individual
 * teacher fits into a single page of 100 lessons.
 */
export function useTeacherLessons(teacherId: string, period: MonthPeriod) {
	return useLessons({ teacherId, ...period, limit: 100 })
}

/**
 * Students assigned to the teacher as their main teacher. The key extends
 * the student list key, so student mutations refresh it as well.
 */
export function useTeacherStudents(teacherId: string) {
	const params: ListStudentsQuery = { teacherId, limit: 100 }

	return useStudentsControllerListStudents({
		query: {
			queryKey: [...getStudentsControllerListStudentsQueryKey(), params]
		},
		request: { params }
	})
}
