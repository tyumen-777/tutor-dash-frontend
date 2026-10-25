'use client'

import { Ban } from 'lucide-react'
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
import { Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'

import { toSchoolTime } from '@/lib/school-time'

import { useCancelLesson } from './api/use-lesson-mutations'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	parseApiError
} from '@/api/errors'
import type { LessonResponse } from '@/api/generated/models'
import { useSchoolTimezone } from '@/features/auth/api/use-organization-role'
import { getStudentFullName } from '@/features/students/format'

export function CancelLessonDialog({
	lesson,
	open,
	onOpenChange
}: {
	lesson: LessonResponse
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const cancelLesson = useCancelLesson()
	const timezone = useSchoolTimezone()
	const [reason, setReason] = useState('')
	const apiError = cancelLesson.error
		? parseApiError(cancelLesson.error)
		: null

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen)

		if (!nextOpen) {
			cancelLesson.reset()
			setReason('')
		}
	}

	function handleCancel() {
		cancelLesson.mutate(
			{ id: lesson.id, data: { reason: reason.trim() || undefined } },
			{
				onSuccess: () => {
					toast.success('Занятие отменено, занятие вернулось ученику')
					handleOpenChange(false)
				}
			}
		)
	}

	const errorMessage = !apiError
		? null
		: apiError.status === 409
			? 'Занятие уже отменено.'
			: (getCommonErrorMessage(apiError) ?? UNKNOWN_ERROR_MESSAGE)

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='sm:max-w-lg'>
				<DialogHeader className='pr-8'>
					<div className='flex items-start gap-3'>
						<div className='bg-destructive/10 text-destructive flex size-9 shrink-0 items-center justify-center rounded-lg'>
							<Ban aria-hidden='true' />
						</div>
						<div className='flex min-w-0 flex-col gap-1'>
							<DialogTitle>Отменить занятие?</DialogTitle>
							<DialogDescription>
								{lesson.student
									? `${getStudentFullName(lesson.student)}, `
									: ''}
								{toSchoolTime(lesson.startsAt, timezone).format(
									'DD.MM.YYYY HH:mm'
								)}
								, {lesson.teacher.fullName}. Занятие останется в
								истории со статусом «Отменено», вернётся на
								баланс ученика, а начисление преподавателю
								снимется.
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<Field>
					<FieldLabel htmlFor='cancel-reason'>Причина</FieldLabel>
					<Textarea
						id='cancel-reason'
						rows={2}
						maxLength={500}
						value={reason}
						onChange={event => setReason(event.target.value)}
						placeholder='Необязательно'
					/>
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
						Не отменять
					</Button>
					<Button
						type='button'
						variant='destructive'
						disabled={cancelLesson.isPending}
						onClick={handleCancel}
					>
						{cancelLesson.isPending
							? 'Отмена…'
							: 'Отменить занятие'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
