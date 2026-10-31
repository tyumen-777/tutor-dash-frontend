'use client'

import {
	Archive,
	ArchiveRestore,
	MoreHorizontal,
	Pencil,
	Trash2
} from 'lucide-react'
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

import { ArchiveTeacherDialog } from './archive-teacher-dialog'
import { DeleteTeacherDialog } from './delete-teacher-dialog'
import { TeacherFormDialog } from './teacher-form-dialog'
import { useRestoreTeacherAction } from './use-restore-teacher-action'
import type { TeacherResponse } from '@/api/generated/models'
import { useCanManageTeachers } from '@/features/auth/api/use-organization-role'

/**
 * In the table every action lives in the "…" menu to keep rows compact. On the
 * profile archive / restore is a visible button. Delete always sits at the end
 * of the menu: it is only meant for cards created by mistake.
 */
export function TeacherActions({
	teacher,
	variant,
	onDeleted
}: {
	teacher: TeacherResponse
	variant: 'row' | 'profile'
	onDeleted?: () => void
}) {
	const canManage = useCanManageTeachers()
	const [archiveOpen, setArchiveOpen] = useState(false)
	const [deleteOpen, setDeleteOpen] = useState(false)
	const [editOpen, setEditOpen] = useState(false)
	const { restore, isPending: isRestoring } = useRestoreTeacherAction()
	const isRow = variant === 'row'

	const primaryAction =
		!canManage || isRow ? null : teacher.isActive ? (
			<Button variant='outline' onClick={() => setArchiveOpen(true)}>
				<Archive data-icon='inline-start' />В архив
			</Button>
		) : (
			<Button
				variant='outline'
				disabled={isRestoring}
				onClick={() => restore(teacher)}
			>
				<ArchiveRestore data-icon='inline-start' />
				Восстановить
			</Button>
		)

	return (
		<div className='flex items-center justify-end gap-2'>
			{canManage && !isRow ? (
				<Button variant='outline' onClick={() => setEditOpen(true)}>
					<Pencil data-icon='inline-start' />
					Редактировать
				</Button>
			) : null}
			{primaryAction}

			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant={isRow ? 'ghost' : 'outline'}
							size='icon'
						/>
					}
				>
					<span className='sr-only'>Открыть меню</span>
					<MoreHorizontal className='h-4 w-4' />
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='min-w-44'>
					<DropdownMenuLabel>Действия</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() =>
							navigator.clipboard.writeText(teacher.id)
						}
					>
						Скопировать ID
					</DropdownMenuItem>
					{isRow ? (
						<DropdownMenuItem
							render={<Link href={`/teacher/${teacher.id}`} />}
						>
							Открыть профиль
						</DropdownMenuItem>
					) : null}
					{canManage && isRow ? (
						<>
							<DropdownMenuItem onClick={() => setEditOpen(true)}>
								<Pencil />
								Редактировать
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							{teacher.isActive ? (
								<DropdownMenuItem
									onClick={() => setArchiveOpen(true)}
								>
									<Archive />В архив
								</DropdownMenuItem>
							) : (
								<DropdownMenuItem
									disabled={isRestoring}
									onClick={() => restore(teacher)}
								>
									<ArchiveRestore />
									Восстановить
								</DropdownMenuItem>
							)}
						</>
					) : null}
					{canManage ? (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant='destructive'
								onClick={() => setDeleteOpen(true)}
							>
								<Trash2 />
								Удалить
							</DropdownMenuItem>
						</>
					) : null}
				</DropdownMenuContent>
			</DropdownMenu>

			{canManage ? (
				<>
					<TeacherFormDialog
						teacher={teacher}
						open={editOpen}
						onOpenChange={setEditOpen}
					/>
					<ArchiveTeacherDialog
						teacher={teacher}
						open={archiveOpen}
						onOpenChange={setArchiveOpen}
					/>
					<DeleteTeacherDialog
						teacher={teacher}
						open={deleteOpen}
						onOpenChange={setDeleteOpen}
						onArchiveRequest={() => setArchiveOpen(true)}
						onDeleted={onDeleted}
					/>
				</>
			) : null}
		</div>
	)
}
