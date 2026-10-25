'use client'

import { useQueryClient } from '@tanstack/react-query'

import {
	getLessonsControllerListLessonsQueryKey,
	useLessonsControllerCancelLesson,
	useLessonsControllerCreateLesson
} from '@/api/generated/lessons/lessons'
import type { LessonResponse } from '@/api/generated/models'
import {
	getStudentsControllerGetStudentBalanceQueryKey,
	getStudentsControllerGetStudentQueryKey,
	getStudentsControllerListStudentsQueryKey
} from '@/api/generated/students/students'
import { getTeachersControllerGetTeacherQueryKey } from '@/api/generated/teachers/teachers'

/**
 * A lesson changes the student's lesson balance and the teacher's earnings,
 * so both profiles and the student list are refreshed together with lessons.
 */
function useLessonCache() {
	const queryClient = useQueryClient()

	return (lesson: LessonResponse) =>
		Promise.all(
			[
				getLessonsControllerListLessonsQueryKey(),
				getStudentsControllerListStudentsQueryKey(),
				getTeachersControllerGetTeacherQueryKey(lesson.teacher.id),
				...(lesson.student
					? [
							getStudentsControllerGetStudentQueryKey(
								lesson.student.id
							),
							getStudentsControllerGetStudentBalanceQueryKey(
								lesson.student.id
							)
						]
					: [])
			].map(queryKey => queryClient.invalidateQueries({ queryKey }))
		)
}

export function useCreateLesson() {
	const refresh = useLessonCache()

	return useLessonsControllerCreateLesson({
		mutation: { onSuccess: refresh }
	})
}

export function useCancelLesson() {
	const refresh = useLessonCache()

	return useLessonsControllerCancelLesson({
		mutation: { onSuccess: refresh }
	})
}
