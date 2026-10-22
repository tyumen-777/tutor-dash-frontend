'use client'

import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'

import { useDeleteTeacher } from './api/use-teacher-mutations'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	parseApiError
} from '@/api/errors'
import type { TeacherResponse } from '@/api/generated/models'

export function DeleteTeacherDialog({
	teacher,
	open,
	onOpenChange,
	onArchiveRequest,
	onDeleted
}: {
	teacher: TeacherResponse
	open: boolean
	onOpenChange: (open: boolean) => void
	onArchiveRequest: () => void
	onDeleted?: () => void
}) {
	const deleteTeacher = useDeleteTeacher()
	const apiError = deleteTeacher.error
		? parseApiError(deleteTeacher.error)
		: null
	const hasLessons = apiError?.status === 409

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen)

		if (!nextOpen) {
			deleteTeacher.reset()
		}
	}

	function handleDelete() {
		deleteTeacher.mutate(
			{ id: teacher.id },
			{
				onSuccess: () => {
					toast.success(`«${teacher.fullName}» удалён`)
					handleOpenChange(false)
					onDeleted?.()
				},
				onError: error => {
					// Already deleted elsewhere: nothing left to do here.
					if (parseApiError(error).status === 404) {
						toast.info('Учитель уже удалён')
						handleOpenChange(false)
						onDeleted?.()
					}
				}
			}
		)
	}

	function handleArchive() {
		handleOpenChange(false)
		onArchiveRequest()
	}

	const errorMessage = !apiError
		? null
		: hasLessons
			? 'У учителя есть занятия или расписание, удалить нельзя.'
			: (getCommonErrorMessage(apiError) ?? UNKNOWN_ERROR_MESSAGE)

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='sm:max-w-lg'>
				<DialogHeader className='pr-8'>
					<div className='flex items-start gap-3'>
						<div className='bg-destructive/10 text-destructive flex size-9 shrink-0 items-center justify-center rounded-lg'>
							<Trash2 aria-hidden='true' />
						</div>
						<div className='flex min-w-0 flex-col gap-1'>
							<DialogTitle>
								Удалить «{teacher.fullName}» безвозвратно?
							</DialogTitle>
							<DialogDescription>
								Используйте удаление, только если карточку
								создали по ошибке. Если учитель уволился,
								переведите его в архив.
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				{errorMessage ? (
					<p role='alert' className='text-destructive text-sm'>
						{errorMessage}
					</p>
				) : null}

				<DialogFooter>
					<Button
						type='button'
						variant='outline'
						onClick={() => handleOpenChange(false)}
					>
						Отмена
					</Button>
					{hasLessons && teacher.isActive ? (
						<Button type='button' onClick={handleArchive}>
							Перевести в архив
						</Button>
					) : null}
					{hasLessons ? null : (
						<Button
							type='button'
							variant='destructive'
							disabled={deleteTeacher.isPending}
							onClick={handleDelete}
						>
							{deleteTeacher.isPending ? 'Удаление…' : 'Удалить'}
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
