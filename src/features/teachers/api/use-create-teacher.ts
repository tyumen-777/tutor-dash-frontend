'use client'

import { useQueryClient } from '@tanstack/react-query'

import {
	getTeachersControllerListTeachersQueryKey,
	useTeachersControllerCreateTeacher
} from '@/api/generated/teachers/teachers'

export function useCreateTeacher() {
	const queryClient = useQueryClient()

	return useTeachersControllerCreateTeacher({
		mutation: {
			onSuccess: () =>
				queryClient.invalidateQueries({
					queryKey: getTeachersControllerListTeachersQueryKey()
				})
		}
	})
}
