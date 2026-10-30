'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
import { FieldGroup } from '@/components/ui/field'

import {
	useDeleteStudyLevel,
	useUpdateStudyLevel
} from './api/use-study-levels'
import { formatStudyLevel } from './format'
import { StudyLevelFields, setStudyLevelFieldError } from './study-level-fields'
import {
	type StudyLevelFormValues,
	studyLevelFormSchema
} from './study-level-form-schema'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	parseApiError
} from '@/api/errors'
import type { StudyLevelResponse } from '@/api/generated/models'

export function EditStudyLevelDialog({
	level,
	open,
	onOpenChange
}: {
	level: StudyLevelResponse
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const updateLevel = useUpdateStudyLevel()
	const form = useForm<StudyLevelFormValues>({
		resolver: zodResolver(studyLevelFormSchema),
		defaultValues: { code: level.code, name: level.name }
	})

	useEffect(() => {
		if (open) form.reset({ code: level.code, name: level.name })
	}, [open, level, form])

	function onSubmit(values: StudyLevelFormValues) {
		updateLevel.mutate(
			{ id: level.id, data: values },
			{
				onSuccess: () => {
					toast.success('Уровень сохранён')
					onOpenChange(false)
				},
				onError: error => {
					const apiError = parseApiError(error)

					if (apiError.status === 404) {
						toast.error('Уровень не найден — возможно, его удалили')
						onOpenChange(false)
						return
					}

					if (!setStudyLevelFieldError(form, apiError)) {
						toast.error(
							getCommonErrorMessage(apiError) ??
								UNKNOWN_ERROR_MESSAGE
						)
					}
				}
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Изменить уровень</DialogTitle>
						<DialogDescription>
							Ученики с этим уровнем сразу увидят новые значения.
						</DialogDescription>
					</DialogHeader>

					<FieldGroup className='my-6'>
						<StudyLevelFields form={form} idPrefix='edit-level' />
					</FieldGroup>

					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							onClick={() => onOpenChange(false)}
						>
							Отмена
						</Button>
						<Button
							type='submit'
							disabled={
								!form.formState.isDirty || updateLevel.isPending
							}
						>
							{updateLevel.isPending
								? 'Сохранение…'
								: 'Сохранить'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export function DeleteStudyLevelDialog({
	level,
	open,
	onOpenChange
}: {
	level: StudyLevelResponse
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const deleteLevel = useDeleteStudyLevel()
	const apiError = deleteLevel.error ? parseApiError(deleteLevel.error) : null
	const errorMessage = !apiError
		? null
		: apiError.status === 409
			? 'Уровень назначен ученикам. Сначала смените им уровень.'
			: (getCommonErrorMessage(apiError) ?? UNKNOWN_ERROR_MESSAGE)

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen)

		if (!nextOpen) deleteLevel.reset()
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Удалить уровень?</DialogTitle>
					<DialogDescription>
						Уровень «{formatStudyLevel(level)}» пропадёт из списка
						выбора в карточке ученика.
					</DialogDescription>
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
						Не удалять
					</Button>
					<Button
						type='button'
						variant='destructive'
						disabled={deleteLevel.isPending}
						onClick={() =>
							deleteLevel.mutate(
								{ id: level.id },
								{
									onSuccess: () => {
										toast.success('Уровень удалён')
										handleOpenChange(false)
									}
								}
							)
						}
					>
						{deleteLevel.isPending ? 'Удаление…' : 'Удалить'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
