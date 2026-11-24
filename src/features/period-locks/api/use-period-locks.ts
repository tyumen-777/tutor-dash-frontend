'use client'

import { useQueryClient } from '@tanstack/react-query'

import {
	getPeriodLocksControllerListPeriodLocksQueryKey,
	usePeriodLocksControllerClosePeriod,
	usePeriodLocksControllerListPeriodLocks,
	usePeriodLocksControllerReopenPeriod
} from '@/api/generated/period-locks/period-locks'

export function usePeriodLocks() {
	return usePeriodLocksControllerListPeriodLocks()
}

function usePeriodLockCache() {
	const queryClient = useQueryClient()

	return () =>
		Promise.all([
			queryClient.invalidateQueries({
				queryKey: getPeriodLocksControllerListPeriodLocksQueryKey()
			}),
			// Закрытие и открытие месяца попадают в историю операций
			queryClient.invalidateQueries({
				predicate: query =>
					String(query.queryKey[0]).startsWith('/finance-logs')
			})
		])
}

export function useClosePeriod() {
	const refresh = usePeriodLockCache()

	return usePeriodLocksControllerClosePeriod({
		mutation: { onSuccess: refresh }
	})
}

export function useReopenPeriod() {
	const refresh = usePeriodLockCache()

	return usePeriodLocksControllerReopenPeriod({
		mutation: { onSuccess: refresh }
	})
}
