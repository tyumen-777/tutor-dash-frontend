'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'
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
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel
} from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'

import { formatMoney } from '@/lib/format-money'
import { toSchoolTime } from '@/lib/school-time'

import { useDeleteLesson } from './api/use-lesson-mutations'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	parseApiError
} from '@/api/errors'
import type { LessonResponse } from '@/api/generated/models'
import { useSchoolTimezone } from '@/features/auth/api/use-organization-role'
import { getStudentFullName } from '@/features/students/format'

const MIN_REASON_LENGTH = 3

/**
 * Deletes a lesson registered by mistake. A held lesson goes back to the
 * student's package and the teacher's pay is dropped; the reason is kept so
 * the deleted lesson can be reviewed later.
 */
export function DeleteLessonDialog({
	lesson,
	open,
	onOpenChange
}: {
	lesson: LessonResponse
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const deleteLesson = useDeleteLesson()
	const timezone = useSchoolTimezone()
	const [reason, setReason] = useState('')
	const [reasonError, setReasonError] = useState<string | null>(null)
	const apiError = deleteLesson.error
		? parseApiError(deleteLesson.error)
		: null
	const isHeld = lesson.status === 'COMPLETED'

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen)

		if (!nextOpen) {
			deleteLesson.reset()
			setReason('')
			setReasonError(null)
		}
	}

	function handleDelete() {
		const trimmed = reason.trim()

		if (trimmed.length < MIN_REASON_LENGTH) {
			setReasonError('Напишите, почему занятие удаляется')
			return
		}

		deleteLesson.mutate(
			{ id: lesson.id, data: { reason: trimmed } },
			{
				onSuccess: () => {
					toast.success(
						isHeld
							? 'Занятие удалено, занятие вернулось ученику'
							: 'Занятие удалено'
					)
					handleOpenChange(false)
				}
			}
		)
	}

	const errorMessage = !apiError
		? null
		: apiError.status === 409
			? 'Занятие уже удалено.'
			: apiError.status === 403
				? 'Удалять занятия могут только владелец и администратор.'
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
							<DialogTitle>Удалить занятие?</DialogTitle>
							<DialogDescription>
								{lesson.student
									? `${getStudentFullName(lesson.student)}, `
									: ''}
								{toSchoolTime(lesson.startsAt, timezone).format(
									'DD.MM.YYYY HH:mm'
								)}
								, {lesson.teacher.fullName}.
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<ul className='bg-muted flex list-disc flex-col gap-1 rounded-md py-2 pr-3 pl-7 text-sm'>
					{isHeld ? (
						<>
							<li>Ученику вернётся одно занятие в пакет.</li>
							<li>
								Начисление преподавателю
								{lesson.teacherPay
									? ` (${formatMoney(lesson.teacherPay, lesson.currency)})`
									: ''}{' '}
								снимется.
							</li>
						</>
					) : (
						<li>
							Занятие уже отменено — списание и начисление не
							изменятся.
						</li>
					)}
					<li>
						Занятие пропадёт из списка и итогов, но останется в
						разделе «Удалённые» вместе с причиной.
					</li>
				</ul>

				<Field data-invalid={Boolean(reasonError)}>
					<FieldLabel htmlFor='delete-reason'>
						Причина удаления
					</FieldLabel>
					<Textarea
						id='delete-reason'
						rows={2}
						maxLength={500}
						value={reason}
						onChange={event => {
							setReason(event.target.value)
							setReasonError(null)
						}}
						placeholder='Например: внесено дважды'
						aria-invalid={Boolean(reasonError)}
						autoFocus
					/>
					{reasonError ? (
						<FieldError errors={[{ message: reasonError }]} />
					) : (
						<FieldDescription>
							Обязательно — чтобы потом не гадать, почему занятие
							удалено.
						</FieldDescription>
					)}
				</Field>

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
						Не удалять
					</Button>
					<Button
						type='button'
						variant='destructive'
						disabled={deleteLesson.isPending}
						onClick={handleDelete}
					>
						{deleteLesson.isPending
							? 'Удаление…'
							: 'Удалить занятие'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
