'use client'

import { DataTable } from '@/components/data-table'

import { useTeachers } from './api/use-teachers'
import { columns } from './columns'
import { TeacherFormDialog } from './teacher-form-dialog'

export default function TeachersPage() {
	const { data, isPending, isError } = useTeachers()

	const emptyMessage = isPending
		? 'Загрузка преподавателей…'
		: isError
			? 'Не удалось загрузить преподавателей.'
			: undefined

	return (
		<div className='container mx-auto py-10'>
			<DataTable
				columns={columns}
				data={data?.items ?? []}
				searchColumn='fullName'
				searchPlaceholder='Найти по ФИО...'
				toolbar={<TeacherFormDialog />}
				emptyMessage={emptyMessage}
			/>
		</div>
	)
}
