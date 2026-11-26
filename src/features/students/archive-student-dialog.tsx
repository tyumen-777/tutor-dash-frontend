'use client'

import { Archive } from 'lucide-react'
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

import { useArchiveStudent } from './api/use-student-archive'
import { getStudentFullName } from './format'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	parseApiError
} from '@/api/errors'
import type { StudentResponse } from '@/api/generated/models'
import { formatLessons } from '@/features/income/payment-options'

function getArchiveErrorMessage(error: unknown) {
	const apiError = parseApiError(error)
	const common = getCommonErrorMessage(apiError)

	if (common) return common
	if (apiError.status === 404) return 'Ученик не найден'
	if (apiError.status === 409) return 'Ученик уже в архиве'

	return UNKNOWN_ERROR_MESSAGE
}

export function ArchiveStudentDialog({
	student,
	open,
	onOpenChange
}: {
	student: StudentResponse
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const archiveStudent = useArchiveStudent()
	const fullName = getStudentFullName(student)
	const requestError = archiveStudent.error
		? getArchiveErrorMessage(archiveStudent.error)
		: null

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen)

		if (!nextOpen) archiveStudent.reset()
	}

	function handleArchive() {
		archiveStudent.mutate(
			{ id: student.id },
			{
				onSuccess: () => {
					toast.success(`«${fullName}» переведён в архив`)
					handleOpenChange(false)
				}
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='sm:max-w-lg'>
				<DialogHeader className='pr-8'>
					<div className='flex items-start gap-3'>
						<div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
							<Archive aria-hidden='true' />
						</div>
						<div className='flex min-w-0 flex-col gap-1'>
							<DialogTitle>
								Перевести «{fullName}» в архив?
							</DialogTitle>
							<DialogDescription>
								Для учеников, которые закончили обучение.
								История занятий и оплат сохранится, вносить
								новые занятия и оплаты будет нельзя. Ученика
								можно будет восстановить. Если ученик вернётся
								после каникул, лучше поставить его на паузу
								через «Редактировать».
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				{student.lessonsLeft > 0 ? (
					<p
						role='note'
						className='rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900'
					>
						Остаток оплаченных занятий:{' '}
						{formatLessons(student.lessonsLeft)}. Он сохранится за
						учеником и будет доступен после восстановления.
					</p>
				) : null}

				{requestError ? (
					<p role='alert' className='text-destructive text-sm'>
						{requestError}
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
					<Button
						type='button'
						disabled={archiveStudent.isPending}
						onClick={handleArchive}
					>
						{archiveStudent.isPending ? 'Сохранение…' : 'В архив'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
