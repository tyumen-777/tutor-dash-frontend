'use client'

import { useQueryClient } from '@tanstack/react-query'

import { getBackendAuthControllerMeQueryKey } from '@/api/generated/backend-auth/backend-auth'
import {
	getOrganizationControllerGetOrganizationQueryKey,
	useOrganizationControllerGetOrganization,
	useOrganizationControllerUpdateOrganization
} from '@/api/generated/organization/organization'

export function useOrganizationSettings() {
	return useOrganizationControllerGetOrganization()
}

export function useUpdateOrganization() {
	const queryClient = useQueryClient()

	return useOrganizationControllerUpdateOrganization({
		mutation: {
			onSuccess: settings => {
				queryClient.setQueryData(
					getOrganizationControllerGetOrganizationQueryKey(),
					settings
				)
				// Название и часовой пояс школы берутся из сессии
				// (useActiveOrganization, useSchoolTimezone)
				return queryClient.invalidateQueries({
					queryKey: getBackendAuthControllerMeQueryKey()
				})
			}
		}
	})
}
