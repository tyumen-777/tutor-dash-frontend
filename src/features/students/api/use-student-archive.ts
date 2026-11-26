'use client'

import { useQueryClient } from '@tanstack/react-query'

import { getDashboardControllerGetSummaryQueryKey } from '@/api/generated/dashboard/dashboard'
import {
	getStudentsControllerGetStudentQueryKey,
	getStudentsControllerListStudentsQueryKey,
	useStudentsControllerArchiveStudent,
	useStudentsControllerRestoreStudent
} from '@/api/generated/students/students'

/**
 * Archiving changes the student lists (active / archive tabs), the card and
 * the dashboard counters, so all of them are refreshed.
 */
function useStudentStatusCache() {
	const queryClient = useQueryClient()

	return (id: string) =>
		Promise.all(
			[
				getStudentsControllerListStudentsQueryKey(),
				getStudentsControllerGetStudentQueryKey(id),
				getDashboardControllerGetSummaryQueryKey()
			].map(queryKey => queryClient.invalidateQueries({ queryKey }))
		)
}

export function useArchiveStudent() {
	const refresh = useStudentStatusCache()

	return useStudentsControllerArchiveStudent({
		mutation: { onSettled: (_, __, { id }) => refresh(id) }
	})
}

export function useRestoreStudent() {
	const refresh = useStudentStatusCache()

	return useStudentsControllerRestoreStudent({
		mutation: { onSettled: (_, __, { id }) => refresh(id) }
	})
}
