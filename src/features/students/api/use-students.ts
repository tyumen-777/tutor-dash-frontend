'use client'

import type { ListStudentsQuery } from '@/api/generated/models'
import {
	getStudentsControllerListStudentsQueryKey,
	useStudentsControllerListStudents
} from '@/api/generated/students/students'

// orval не генерирует query-параметры для этого эндпоинта, поэтому они
// передаются через axios. Бэкенд отдаёт не больше 100 записей за раз —
// таблица фильтрует и листает на клиенте.
// Без вкладки — все, кроме архивных (как и по умолчанию на бэкенде)
export function useStudents(tab: 'current' | 'archived' = 'current') {
	const params: ListStudentsQuery = {
		limit: 100,
		status: tab === 'archived' ? 'ARCHIVED' : undefined
	}

	return useStudentsControllerListStudents({
		query: {
			// Префикс общий: инвалидация списка обновляет обе вкладки
			queryKey: [...getStudentsControllerListStudentsQueryKey(), tab]
		},
		request: { params }
	})
}
