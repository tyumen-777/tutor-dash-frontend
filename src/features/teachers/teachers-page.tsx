'use client'

import { useState } from 'react'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'

import { useTeachers } from './api/use-teachers'
import { columns } from './columns'
import { TeacherFormDialog } from './teacher-form-dialog'
import { useCanManageTeachers } from '@/features/auth/api/use-organization-role'

type TeachersTab = 'active' | 'archived'

const tabs: { value: TeachersTab; label: string }[] = [
	{ value: 'active', label: 'Активные' },
	{ value: 'archived', label: 'Архив' }
]

export default function TeachersPage() {
	const [tab, setTab] = useState<TeachersTab>('active')
	const canManage = useCanManageTeachers()
	const { data, isPending, isError } = useTeachers(tab)

	const emptyMessage = isPending
		? 'Загрузка преподавателей…'
		: isError
			? 'Не удалось загрузить преподавателей.'
			: tab === 'archived'
				? 'В архиве никого нет.'
				: undefined

	return (
		<div className='container mx-auto py-10'>
			<div
				role='tablist'
				aria-label='Статус преподавателей'
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
				toolbar={canManage ? <TeacherFormDialog /> : null}
				emptyMessage={emptyMessage}
			/>
		</div>
	)
}
