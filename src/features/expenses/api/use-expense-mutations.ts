'use client'

import { useQueryClient } from '@tanstack/react-query'

import {
	getExpensesControllerListExpensesQueryKey,
	useExpensesControllerCancelExpense,
	useExpensesControllerCreateExpense,
	useExpensesControllerUpdateExpense
} from '@/api/generated/expenses/expenses'

function useExpenseCache() {
	const queryClient = useQueryClient()

	return () =>
		queryClient.invalidateQueries({
			queryKey: getExpensesControllerListExpensesQueryKey()
		})
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
