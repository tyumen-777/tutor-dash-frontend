'use client'

import type {
	ListTeachersQuery,
	ListTeachersQueryStatus
} from '@/api/generated/models'
import {
	getTeachersControllerListTeachersQueryKey,
	useTeachersControllerListTeachers
} from '@/api/generated/teachers/teachers'

// orval не генерирует query-параметры для этого эндпоинта, поэтому они
// передаются через axios. Бэкенд отдаёт не больше 100 записей за раз —
// таблица фильтрует и листает на клиенте.
export function useTeachers(status: ListTeachersQueryStatus) {
	const params: ListTeachersQuery = { status, limit: 100 }

	return useTeachersControllerListTeachers({
		query: {
			queryKey: [...getTeachersControllerListTeachersQueryKey(), status]
		},
		request: { params }
	})
}
