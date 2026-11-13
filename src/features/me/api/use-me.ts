'use client'

import {
	getMeControllerGetEarningsQueryKey,
	useMeControllerGetEarnings,
	useMeControllerGetTeacher
} from '@/api/generated/me/me'
import type { MyEarningsQuery } from '@/api/generated/models'

/** Teacher card linked to the current user (404 when there is none). */
export function useMyTeacher(enabled = true) {
	return useMeControllerGetTeacher({ query: { retry: false, enabled } })
}

// orval не генерирует query-параметры, поэтому они передаются через axios,
// а в ключ запроса добавляются вручную.
export function useMyEarnings(params: MyEarningsQuery) {
	return useMeControllerGetEarnings({
		query: {
			queryKey: [...getMeControllerGetEarningsQueryKey(), params]
		},
		request: { params }
	})
}
