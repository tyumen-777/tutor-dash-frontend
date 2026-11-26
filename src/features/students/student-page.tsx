'use client'

import { useState } from 'react'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'

import { useStudents } from './api/use-students'
import { columns } from './columns'
import { StudentFormDialog } from './student-form-dialog'
import { useCanManageStudents } from '@/features/auth/api/use-organization-role'

type StudentsTab = 'current' | 'archived'

const tabs: { value: StudentsTab; label: string }[] = [
	{ value: 'current', label: 'Ученики' },
	{ value: 'archived', label: 'Архив' }
]

export default function StudentPage() {
	const [tab, setTab] = useState<StudentsTab>('current')
	const canManage = useCanManageStudents()
	const { data, isPending, isError } = useStudents(tab)

	const emptyMessage = isPending
		? 'Загрузка учеников…'
		: isError
			? 'Не удалось загрузить учеников.'
			: tab === 'archived'
				? 'В архиве никого нет.'
				: undefined

	return (
		<div className='container mx-auto py-10'>
			<div
				role='tablist'
				aria-label='Статус учеников'
				className='bg-muted inline-flex gap-1 rounded-lg p-1'
			>
				{tabs.map(item => (
					<Button
						key={item.value}
						role='tab'
						aria-selected={tab === item.value}
						variant={tab === item.value ? 'outline' : 'ghost'}
						size='sm'
						className={
							tab === item.value
								? 'bg-background shadow-xs'
								: 'text-muted-foreground'
						}
						onClick={() => setTab(item.value)}
					>
						{item.label}
					</Button>
				))}
			</div>

			<DataTable
				key={tab}
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
