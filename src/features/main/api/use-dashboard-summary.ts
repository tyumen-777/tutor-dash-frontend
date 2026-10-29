'use client'

import { useDashboardControllerGetSummary } from '@/api/generated/dashboard/dashboard'

// Сводка собирается из оплат, расходов и занятий, поэтому при каждом
// открытии главной перезапрашиваем её, не дожидаясь staleTime.
export function useDashboardSummary() {
	return useDashboardControllerGetSummary({
		query: { refetchOnMount: 'always' }
	})
}
