'use client'

import type { ListPaymentsQuery } from '@/api/generated/models'
import { usePaymentsControllerListPayments } from '@/api/generated/payments/payments'
import { useStudentsControllerGetStudentBalance } from '@/api/generated/students/students'

// orval не генерирует query-параметры, поэтому они передаются через axios,
// а в ключ запроса добавляются вручную.
export function usePayments(
	params: ListPaymentsQuery,
	options: { enabled?: boolean } = {}
) {
	return usePaymentsControllerListPayments({
		query: { queryKey: ['/payments', params], ...options },
		request: { params }
	})
}

export function useStudentBalance(studentId: string) {
	return useStudentsControllerGetStudentBalance(studentId)
}
