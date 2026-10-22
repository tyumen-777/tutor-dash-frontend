'use client'

import dayjs from 'dayjs'
import { Archive } from 'lucide-react'
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
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import { useArchiveTeacher } from './api/use-teacher-mutations'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	hasMessage,
	parseApiError
} from '@/api/errors'
import type { TeacherResponse } from '@/api/generated/models'

function today() {
	return dayjs().format('YYYY-MM-DD')
}

function validateEndedOn(value: string, startedOn: string) {
	if (!value) return null
	if (value > today()) return 'Дата увольнения не может быть в будущем'
	if (value < startedOn) return 'Дата увольнения раньше даты начала работы'
	return null
}

function getArchiveErrorMessage(error: unknown) {
	const apiError = parseApiError(error)
	const common = getCommonErrorMessage(apiError)

	if (common) return common

	if (apiError.status === 400) {
		if (hasMessage(apiError, 'cannot be in the future')) {
			return 'Дата увольнения не может быть в будущем'
		}
		if (hasMessage(apiError, 'cannot be earlier than startedOn')) {
			return 'Дата увольнения раньше даты начала работы'
		}
		return 'Проверьте дату увольнения'
	}

	if (apiError.status === 404) return 'Учитель не найден'
	if (apiError.status === 409) return 'Учитель уже в архиве'

	return UNKNOWN_ERROR_MESSAGE
}

export function ArchiveTeacherDialog({
	teacher,
	open,
	onOpenChange
}: {
	teacher: TeacherResponse
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const [endedOn, setEndedOn] = useState(today)
	const [submitted, setSubmitted] = useState(false)
	const archiveTeacher = useArchiveTeacher()
	const validationError = submitted
		? validateEndedOn(endedOn, teacher.startedOn)
		: null
	const requestError = archiveTeacher.error
		? getArchiveErrorMessage(archiveTeacher.error)
		: null

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen)

		if (!nextOpen) {
			setEndedOn(today())
			setSubmitted(false)
			archiveTeacher.reset()
		}
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setSubmitted(true)

		if (validateEndedOn(endedOn, teacher.startedOn)) return

		archiveTeacher.mutate(
			{ id: teacher.id, data: endedOn ? { endedOn } : {} },
			{
				onSuccess: () => {
					toast.success(`«${teacher.fullName}» переведён в архив`)
					handleOpenChange(false)
				}
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='sm:max-w-lg'>
				<form
					className='flex flex-col gap-4'
					onSubmit={handleSubmit}
					noValidate
				>
					<DialogHeader className='pr-8'>
						<div className='flex items-start gap-3'>
							<div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
								<Archive aria-hidden='true' />
							</div>
							<div className='flex min-w-0 flex-col gap-1'>
								<DialogTitle>
									Перевести «{teacher.fullName}» в архив?
								</DialogTitle>
								<DialogDescription>
									Будущие запланированные занятия учителя
									будут отменены, расписание закрыто.
									Проведённые занятия и выплаты сохранятся.
									Учителя можно будет восстановить.
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>

					<Field data-invalid={Boolean(validationError)}>
						<FieldLabel htmlFor='endedOn'>
							Дата увольнения
						</FieldLabel>
						<Input
							id='endedOn'
							type='date'
							value={endedOn}
							min={teacher.startedOn}
							max={today()}
							onChange={event => setEndedOn(event.target.value)}
							aria-invalid={Boolean(validationError)}
							className='h-10'
						/>
						<FieldError
							errors={
								validationError
									? [{ message: validationError }]
									: []
							}
						/>
					</Field>

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
							type='submit'
							disabled={archiveTeacher.isPending}
						>
							{archiveTeacher.isPending
								? 'Сохранение…'
								: 'В архив'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
