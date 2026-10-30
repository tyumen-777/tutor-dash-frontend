'use client'

import { useQueryClient } from '@tanstack/react-query'

import {
	getStudyLevelsControllerListStudyLevelsQueryKey,
	useStudyLevelsControllerCreateStudyLevel,
	useStudyLevelsControllerDeleteStudyLevel,
	useStudyLevelsControllerListStudyLevels,
	useStudyLevelsControllerUpdateStudyLevel
} from '@/api/generated/study-levels/study-levels'

export function useStudyLevels() {
	return useStudyLevelsControllerListStudyLevels()
}

function useStudyLevelCache() {
	const queryClient = useQueryClient()

	return () =>
		Promise.all([
			queryClient.invalidateQueries({
				queryKey: getStudyLevelsControllerListStudyLevelsQueryKey()
			}),
			// Обозначение и название уровня показываются в карточках учеников
			queryClient.invalidateQueries({
				predicate: query =>
					String(query.queryKey[0]).startsWith('/students')
			})
		])
}

export function useCreateStudyLevel() {
	const refresh = useStudyLevelCache()

	return useStudyLevelsControllerCreateStudyLevel({
		mutation: { onSuccess: refresh }
	})
}

export function useUpdateStudyLevel() {
	const refresh = useStudyLevelCache()

	return useStudyLevelsControllerUpdateStudyLevel({
		mutation: { onSuccess: refresh }
	})
}

export function useDeleteStudyLevel() {
	const refresh = useStudyLevelCache()

	return useStudyLevelsControllerDeleteStudyLevel({
		mutation: { onSuccess: refresh }
	})
}
