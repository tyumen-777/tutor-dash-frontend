'use client'

import { toast } from 'sonner'

import { useRestoreStudent } from './api/use-student-archive'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	parseApiError
} from '@/api/errors'

function getRestoreErrorMessage(error: unknown) {
	const apiError = parseApiError(error)
	const common = getCommonErrorMessage(apiError)

	if (common) return common
	if (apiError.status === 404) return 'Ученик не найден'
	if (apiError.status === 409) return 'Ученик уже не в архиве'

	return UNKNOWN_ERROR_MESSAGE
}

/**
 * Restore needs no confirmation: it is safe and reversible. The result is
 * reported with a toast.
 */
export function useRestoreStudentAction() {
	const restoreStudent = useRestoreStudent()

	function restore(studentId: string) {
		restoreStudent.mutate(
			{ id: studentId },
			{
				onSuccess: () => toast.success('Ученик восстановлен'),
				onError: error => {
					const message = getRestoreErrorMessage(error)
					if (message) toast.error(message)
				}
			}
		)
	}

	return { restore, isPending: restoreStudent.isPending }
}
