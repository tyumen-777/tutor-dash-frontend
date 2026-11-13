'use client'

import { useQueryClient } from '@tanstack/react-query'

import type { TeacherAccessResponse } from '@/api/generated/models'
import {
	getTeacherAccessControllerGetAccessQueryKey,
	useTeacherAccessControllerGetAccess,
	useTeacherAccessControllerInvite,
	useTeacherAccessControllerRevoke
} from '@/api/generated/teacher-access/teacher-access'

/**
 * Whether the teacher can sign in to their personal cabinet. Only owners and
 * admins may request it, so callers pass `enabled`.
 */
export function useTeacherAccess(teacherId: string, enabled: boolean) {
	return useTeacherAccessControllerGetAccess(teacherId, {
		query: { enabled }
	})
}

function useSetAccess() {
	const queryClient = useQueryClient()

	return (teacherId: string, access: TeacherAccessResponse) =>
		queryClient.setQueryData(
			getTeacherAccessControllerGetAccessQueryKey(teacherId),
			access
		)
}

export function useInviteTeacher() {
	const setAccess = useSetAccess()

	return useTeacherAccessControllerInvite({
		mutation: {
			onSuccess: (access, { id }) => setAccess(id, access)
		}
	})
}

export function useRevokeTeacherAccess() {
	const setAccess = useSetAccess()

	return useTeacherAccessControllerRevoke({
		mutation: {
			onSuccess: (access, { id }) => setAccess(id, access)
		}
	})
}

export function getInviteUrl(invitationId: string) {
	return `${window.location.origin}/invite/${invitationId}`
}
