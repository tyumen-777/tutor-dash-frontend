'use client'

import { useQueryClient } from '@tanstack/react-query'

import {
	getExpensesControllerListExpensesQueryKey,
	useExpensesControllerCancelExpense,
	useExpensesControllerCreateExpense,
	useExpensesControllerUpdateExpense
} from '@/api/generated/expenses/expenses'
import { getLessonsControllerListLessonsQueryKey } from '@/api/generated/lessons/lessons'
import { getPayoutsControllerGetReportQueryKey } from '@/api/generated/payouts/payouts'

/**
 * Canceling a teacher payout marks its lessons unpaid again, so the payout
 * report and lessons are refreshed together with expenses.
 */
function useExpenseCache() {
	const queryClient = useQueryClient()

	return () =>
		Promise.all(
			[
				getExpensesControllerListExpensesQueryKey(),
				getPayoutsControllerGetReportQueryKey(),
				getLessonsControllerListLessonsQueryKey()
			].map(queryKey => queryClient.invalidateQueries({ queryKey }))
		)
}

export function useCreateExpense() {
	const refresh = useExpenseCache()

	return useExpensesControllerCreateExpense({
		mutation: { onSuccess: refresh }
	})
}

export function useUpdateExpense() {
	const refresh = useExpenseCache()

	return useExpensesControllerUpdateExpense({
		mutation: { onSuccess: refresh }
	})
}

export function useCancelExpense() {
	const refresh = useExpenseCache()

	return useExpensesControllerCancelExpense({
		mutation: { onSuccess: refresh }
	})
}
