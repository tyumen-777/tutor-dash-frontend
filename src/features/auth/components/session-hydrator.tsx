'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { getBackendAuthControllerMeQueryKey } from '@/api/generated/backend-auth/backend-auth'
import type { AuthSessionResponse } from '@/api/generated/models'

/**
 * Puts the session loaded by the server layout into the query cache before the
 * page renders. Role-dependent UI (menu, buttons, teacher mode) then renders
 * the same on the server and on the client, without a hydration mismatch or a
 * flash of the admin interface.
 */
export function SessionHydrator({
	session,
	children
}: {
	session: AuthSessionResponse
	children: React.ReactNode
}) {
	const queryClient = useQueryClient()

	useState(() =>
		queryClient.setQueryData(getBackendAuthControllerMeQueryKey(), session)
	)

	return children
}
