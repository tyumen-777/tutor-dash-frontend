'use client'

import { useState } from 'react'

import { DataTable } from '@/components/data-table'

import { columns } from './columns'
import { teachers as initialTeachers } from './teacher-data'
import { TeacherFormDialog } from './teacher-form-dialog'

export default function TeachersPage() {
	// Пока нет эндпоинта списка, созданные через API преподаватели
	// добавляются только в локальное состояние.
	const [teachers, setTeachers] = useState(initialTeachers)

	return (
		<div className='container mx-auto py-10'>
			<DataTable
				columns={columns}
				data={teachers}
				searchColumn='fullName'
				searchPlaceholder='Найти по ФИО...'
				toolbar={
					<TeacherFormDialog
						onCreated={teacher =>
							setTeachers(prev => [teacher, ...prev])
						}
					/>
				}
			/>
		</div>
	)
}
