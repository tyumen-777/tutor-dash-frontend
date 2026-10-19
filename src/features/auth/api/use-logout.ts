'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { useBackendAuthControllerLogout } from '@/api/generated/backend-auth/backend-auth'

export function useLogout() {
	const queryClient = useQueryClient()
	const router = useRouter()

	return useBackendAuthControllerLogout({
		mutation: {
			onSuccess: () => {
				queryClient.clear()
				router.replace('/login')
				router.refresh()
			}
		}
	})
}
