'use client'

import { toast } from 'sonner'

import { useRestoreTeacher } from './api/use-teacher-mutations'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	hasMessage,
	parseApiError
} from '@/api/errors'

function getRestoreErrorMessage(error: unknown, email: string | null) {
	const apiError = parseApiError(error)
	const common = getCommonErrorMessage(apiError)

	if (common) return common
	if (apiError.status === 404) return 'Учитель не найден'

	if (apiError.status === 409) {
		if (hasMessage(apiError, 'Active teacher with this email')) {
			return `Уже есть активный учитель с почтой ${email ?? ''}. Измените почту у одного из них`
		}
		return 'Учитель уже активен'
	}

	return UNKNOWN_ERROR_MESSAGE
}

/**
 * Restore needs no confirmation: it is safe and reversible. The result is
 * reported with a toast.
 */
export function useRestoreTeacherAction() {
	const restoreTeacher = useRestoreTeacher()

	function restore(
		teacher: { id: string; email: string | null },
		onSuccess?: () => void
	) {
		restoreTeacher.mutate(
			{ id: teacher.id },
			{
				onSuccess: () => {
					toast.success('Учитель восстановлен', {
						description: 'Расписание нужно составить заново'
					})
					onSuccess?.()
				},
				onError: error => {
					const message = getRestoreErrorMessage(error, teacher.email)
					if (message) toast.error(message)
				}
			}
		)
	}

	return { restore, isPending: restoreTeacher.isPending }
}
