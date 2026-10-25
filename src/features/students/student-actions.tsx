'use client'

import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { StudentFormDialog } from './student-form-dialog'
import type { StudentResponse } from '@/api/generated/models'
import { useCanManageStudents } from '@/features/auth/api/use-organization-role'

export function StudentActions({ student }: { student: StudentResponse }) {
	const canManage = useCanManageStudents()
	const [editOpen, setEditOpen] = useState(false)

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger
					render={<Button variant='ghost' className='h-8 w-8 p-0' />}
				>
					<span className='sr-only'>Открыть меню</span>
					<MoreHorizontal className='h-4 w-4' />
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Действия</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() =>
							navigator.clipboard.writeText(student.id)
						}
					>
						Скопировать ID
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						render={<Link href={`/student/${student.id}`} />}
					>
						Открыть профиль
					</DropdownMenuItem>
					{canManage ? (
						<DropdownMenuItem onClick={() => setEditOpen(true)}>
							Редактировать
						</DropdownMenuItem>
					) : null}
					<DropdownMenuItem>Запланировать занятие</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{canManage ? (
				<StudentFormDialog
					student={student}
					open={editOpen}
					onOpenChange={setEditOpen}
				/>
			) : null}
		</>
	)
}
