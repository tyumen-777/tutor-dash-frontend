'use client'

import { useQueryClient } from '@tanstack/react-query'

import { parseApiError } from '@/api/errors'
import type { TeacherResponse } from '@/api/generated/models'
import {
	getTeachersControllerGetTeacherQueryKey,
	getTeachersControllerListTeachersQueryKey,
	useTeachersControllerArchiveTeacher,
	useTeachersControllerDeleteTeacher,
	useTeachersControllerRestoreTeacher
} from '@/api/generated/teachers/teachers'

function useTeacherCache() {
	const queryClient = useQueryClient()

	return {
		update(teacher: TeacherResponse) {
			queryClient.setQueryData(
				getTeachersControllerGetTeacherQueryKey(teacher.id),
				teacher
			)
			return queryClient.invalidateQueries({
				queryKey: getTeachersControllerListTeachersQueryKey()
			})
		},
		remove(id: string) {
			queryClient.removeQueries({
				queryKey: getTeachersControllerGetTeacherQueryKey(id)
			})
			return queryClient.invalidateQueries({
				queryKey: getTeachersControllerListTeachersQueryKey()
			})
		},
		/**
		 * 404 and 409 mean the data on screen is stale (the teacher was changed
		 * in another tab), so refetch both the list and the card.
		 */
		refreshOnConflict(error: unknown, id: string) {
			const { status } = parseApiError(error)

			if (status !== 404 && status !== 409) return

			void queryClient.invalidateQueries({
				queryKey: getTeachersControllerGetTeacherQueryKey(id)
			})
			void queryClient.invalidateQueries({
				queryKey: getTeachersControllerListTeachersQueryKey()
			})
		}
	}
}

export function useArchiveTeacher() {
	const cache = useTeacherCache()

	return useTeachersControllerArchiveTeacher({
		mutation: {
			onSuccess: teacher => cache.update(teacher),
			onError: (error, { id }) => cache.refreshOnConflict(error, id)
		}
	})
}

export function useRestoreTeacher() {
	const cache = useTeacherCache()

	return useTeachersControllerRestoreTeacher({
		mutation: {
			onSuccess: teacher => cache.update(teacher),
			onError: (error, { id }) => cache.refreshOnConflict(error, id)
		}
	})
}

export function useDeleteTeacher() {
	const cache = useTeacherCache()

	return useTeachersControllerDeleteTeacher({
		mutation: {
			onSuccess: (_, { id }) => cache.remove(id),
			onError: (error, { id }) => cache.refreshOnConflict(error, id)
		}
	})
}
