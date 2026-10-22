'use client'

import { useStudentsControllerGetStudent } from '@/api/generated/students/students'

export function useStudent(id: string) {
	return useStudentsControllerGetStudent(id)
}
