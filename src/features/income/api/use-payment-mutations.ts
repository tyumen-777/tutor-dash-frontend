'use client'

import { useQueryClient } from '@tanstack/react-query'

import type { PaymentResponse } from '@/api/generated/models'
import {
	getPaymentsControllerListPaymentsQueryKey,
	usePaymentsControllerCancelPayment,
	usePaymentsControllerCreatePayment,
	usePaymentsControllerUpdatePayment
} from '@/api/generated/payments/payments'
import {
	getStudentsControllerGetStudentBalanceQueryKey,
	getStudentsControllerGetStudentQueryKey,
	getStudentsControllerListStudentsQueryKey
} from '@/api/generated/students/students'

/**
 * A payment changes the student's lesson balance, so the student card and the
 * student list (balance column) are refreshed together with the payments.
 */
function usePaymentCache() {
	const queryClient = useQueryClient()

	return (payment: PaymentResponse) =>
		Promise.all(
			[
				getPaymentsControllerListPaymentsQueryKey(),
				getStudentsControllerListStudentsQueryKey(),
				getStudentsControllerGetStudentQueryKey(payment.student.id),
				getStudentsControllerGetStudentBalanceQueryKey(
					payment.student.id
				)
			].map(queryKey => queryClient.invalidateQueries({ queryKey }))
		)
}

export function useCreatePayment() {
	const refresh = usePaymentCache()

	return usePaymentsControllerCreatePayment({
		mutation: { onSuccess: refresh }
	})
}

export function useUpdatePayment() {
	const refresh = usePaymentCache()

	return usePaymentsControllerUpdatePayment({
		mutation: { onSuccess: refresh }
	})
}

export function useCancelPayment() {
	const refresh = usePaymentCache()

	return usePaymentsControllerCancelPayment({
		mutation: { onSuccess: refresh }
	})
}
