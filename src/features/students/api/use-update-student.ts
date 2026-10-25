'use client'

import { useQueryClient } from '@tanstack/react-query'

import {
	getStudentsControllerGetStudentQueryKey,
	getStudentsControllerListStudentsQueryKey,
	useStudentsControllerUpdateStudent
} from '@/api/generated/students/students'

export function useUpdateStudent() {
	const queryClient = useQueryClient()

	return useStudentsControllerUpdateStudent({
		mutation: {
			onSuccess: (_, { id }) =>
				Promise.all([
					queryClient.invalidateQueries({
						queryKey: getStudentsControllerListStudentsQueryKey()
					}),
					queryClient.invalidateQueries({
						queryKey: getStudentsControllerGetStudentQueryKey(id)
					})
				])
		}
	})
}
