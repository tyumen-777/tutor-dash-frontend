'use client'

import { useQueryClient } from '@tanstack/react-query'

import {
	getBackendAuthControllerMeQueryKey,
	useBackendAuthControllerLogin
} from '@/api/generated/backend-auth/backend-auth'

export function useLogin() {
	const queryClient = useQueryClient()

	return useBackendAuthControllerLogin({
		mutation: {
			onSuccess: session => {
				queryClient.clear()
				queryClient.setQueryData(
					getBackendAuthControllerMeQueryKey(),
					session
				)
			}
		}
	})
}
