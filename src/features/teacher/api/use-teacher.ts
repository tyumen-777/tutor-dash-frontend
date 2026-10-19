'use client'

import { useTeachersControllerGetTeacher } from '@/api/generated/teachers/teachers'

export function useTeacher(id: string) {
	return useTeachersControllerGetTeacher(id)
}
