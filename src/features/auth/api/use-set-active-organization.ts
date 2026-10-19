'use client'

import { useQueryClient } from '@tanstack/react-query'

import {
	getBackendAuthControllerMeQueryKey,
	useBackendAuthControllerSetActiveOrganization
} from '@/api/generated/backend-auth/backend-auth'

export function useSetActiveOrganization() {
	const queryClient = useQueryClient()

	return useBackendAuthControllerSetActiveOrganization({
		mutation: {
			onSuccess: session => {
				// Cached data belongs to the previous (or no) organization.
				queryClient.clear()
				queryClient.setQueryData(
					getBackendAuthControllerMeQueryKey(),
					session
				)
			}
		}
	})
}
