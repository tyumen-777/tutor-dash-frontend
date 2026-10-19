'use client'

import type { ListTeachersQuery } from '@/api/generated/models'
import { useTeachersControllerListTeachers } from '@/api/generated/teachers/teachers'

// orval не генерирует query-параметры для этого эндпоинта, поэтому они
// передаются через axios. По умолчанию бэкенд отдаёт только активных
// и не больше 20 записей — таблица фильтрует и листает на клиенте.
const listParams: ListTeachersQuery = { status: 'all', limit: 100 }

export function useTeachers() {
	return useTeachersControllerListTeachers({
		request: { params: listParams }
	})
}
