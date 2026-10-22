'use client'

import { useQueryClient } from '@tanstack/react-query'

import {
	getStudentsControllerListStudentsQueryKey,
	useStudentsControllerCreateStudent
} from '@/api/generated/students/students'

export function useCreateStudent() {
	const queryClient = useQueryClient()

	return useStudentsControllerCreateStudent({
		mutation: {
			onSuccess: () =>
				queryClient.invalidateQueries({
					queryKey: getStudentsControllerListStudentsQueryKey()
				})
		}
	})
}
