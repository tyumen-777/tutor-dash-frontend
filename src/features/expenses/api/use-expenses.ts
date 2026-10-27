'use client'

import { useExpensesControllerListExpenses } from '@/api/generated/expenses/expenses'
import type { ListExpensesQuery } from '@/api/generated/models'

// orval не генерирует query-параметры, поэтому они передаются через axios,
// а в ключ запроса добавляются вручную.
export function useExpenses(params: ListExpensesQuery) {
	return useExpensesControllerListExpenses({
		query: { queryKey: ['/expenses', params] },
		request: { params }
	})
}
