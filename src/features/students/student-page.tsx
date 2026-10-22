'use client'

import { DataTable } from '@/components/data-table'

import { useStudents } from './api/use-students'
import { columns } from './columns'
import { StudentFormDialog } from './student-form-dialog'
import { useCanManageStudents } from '@/features/auth/api/use-organization-role'

export default function StudentPage() {
	const canManage = useCanManageStudents()
	const { data, isPending, isError } = useStudents()

	const emptyMessage = isPending
		? 'Загрузка учеников…'
		: isError
			? 'Не удалось загрузить учеников.'
			: undefined

	return (
		<div className='container mx-auto py-10'>
			<DataTable
				columns={columns}
				data={data?.items ?? []}
				searchColumn='fullName'
				searchPlaceholder='Найти по ФИО...'
				toolbar={canManage ? <StudentFormDialog /> : null}
				emptyMessage={emptyMessage}
			/>
		</div>
	)
}
