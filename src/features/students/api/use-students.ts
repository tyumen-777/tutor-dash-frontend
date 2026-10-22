'use client'

import type { ListStudentsQuery } from '@/api/generated/models'
import {
	getStudentsControllerListStudentsQueryKey,
	useStudentsControllerListStudents
} from '@/api/generated/students/students'

// orval не генерирует query-параметры для этого эндпоинта, поэтому они
// передаются через axios. Бэкенд отдаёт не больше 100 записей за раз —
// таблица фильтрует и листает на клиенте.
export function useStudents() {
	const params: ListStudentsQuery = { limit: 100 }

	return useStudentsControllerListStudents({
		query: { queryKey: getStudentsControllerListStudentsQueryKey() },
		request: { params }
	})
}
