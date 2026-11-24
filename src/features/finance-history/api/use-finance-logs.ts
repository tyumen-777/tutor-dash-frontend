'use client'

import { useFinanceLogsControllerListLogs } from '@/api/generated/finance-logs/finance-logs'
import type { ListFinanceLogsQuery } from '@/api/generated/models'

// orval не генерирует query-параметры, поэтому они передаются через axios,
// а в ключ запроса добавляются вручную.
export function useFinanceLogs(params: ListFinanceLogsQuery) {
	return useFinanceLogsControllerListLogs({
		query: { queryKey: ['/finance-logs', params] },
		request: { params }
	})
}
