'use client'

import { useQueryClient } from '@tanstack/react-query'

import { getExpensesControllerListExpensesQueryKey } from '@/api/generated/expenses/expenses'
import { getLessonsControllerListLessonsQueryKey } from '@/api/generated/lessons/lessons'
import type { PayoutReportQuery } from '@/api/generated/models'
import {
	getPayoutsControllerGetReportQueryKey,
	usePayoutsControllerCreatePayout,
	usePayoutsControllerGetReport
} from '@/api/generated/payouts/payouts'

// orval не генерирует query-параметры, поэтому они передаются через axios,
// а в ключ запроса добавляются вручную.
export function usePayoutReport(params: PayoutReportQuery) {
	return usePayoutsControllerGetReport({
		query: {
			queryKey: [...getPayoutsControllerGetReportQueryKey(), params],
			refetchOnMount: 'always'
		},
		request: { params }
	})
}

/**
 * A payout is a salary expense that marks lessons as paid, so the report,
 * expenses and lessons are refreshed together.
 */
export function useCreatePayout() {
	const queryClient = useQueryClient()

	return usePayoutsControllerCreatePayout({
		mutation: {
			onSuccess: () =>
				Promise.all(
					[
						getPayoutsControllerGetReportQueryKey(),
						getExpensesControllerListExpensesQueryKey(),
						getLessonsControllerListLessonsQueryKey()
					].map(queryKey =>
						queryClient.invalidateQueries({ queryKey })
					)
				)
		}
	})
}
