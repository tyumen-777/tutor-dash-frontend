'use client'

import { useLessonsControllerListLessons } from '@/api/generated/lessons/lessons'
import type { ListLessonsQuery } from '@/api/generated/models'

// orval не генерирует query-параметры, поэтому они передаются через axios,
// а в ключ запроса добавляются вручную.
export function useLessons(params: ListLessonsQuery) {
	return useLessonsControllerListLessons({
		query: { queryKey: ['/lessons', params] },
		request: { params }
	})
}
