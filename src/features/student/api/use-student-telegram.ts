'use client'

import { useQueryClient } from '@tanstack/react-query'

import {
	getStudentTelegramControllerGetLinksQueryKey,
	useStudentTelegramControllerCreateInvite,
	useStudentTelegramControllerDeleteLink,
	useStudentTelegramControllerGetLinks
} from '@/api/generated/student-telegram/student-telegram'

export function useStudentTelegram(studentId: string) {
	return useStudentTelegramControllerGetLinks(studentId)
}

export function useCreateTelegramInvite() {
	return useStudentTelegramControllerCreateInvite()
}

export function useDeleteTelegramLink(studentId: string) {
	const queryClient = useQueryClient()

	return useStudentTelegramControllerDeleteLink({
		mutation: {
			onSuccess: () =>
				queryClient.invalidateQueries({
					queryKey:
						getStudentTelegramControllerGetLinksQueryKey(studentId)
				})
		}
	})
}
