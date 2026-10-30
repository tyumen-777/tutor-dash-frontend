'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { GraduationCap, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

import { useCreateStudyLevel, useStudyLevels } from './api/use-study-levels'
import {
	DeleteStudyLevelDialog,
	EditStudyLevelDialog
} from './study-level-dialogs'
import { StudyLevelFields, setStudyLevelFieldError } from './study-level-fields'
import {
	type StudyLevelFormValues,
	emptyStudyLevel,
	studyLevelFormSchema
} from './study-level-form-schema'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	parseApiError
} from '@/api/errors'
import type { StudyLevelResponse } from '@/api/generated/models'

type DialogState =
	| { type: 'edit'; level: StudyLevelResponse }
	| { type: 'delete'; level: StudyLevelResponse }
	| null

function CreateStudyLevelForm() {
	const createLevel = useCreateStudyLevel()
	const form = useForm<StudyLevelFormValues>({
		resolver: zodResolver(studyLevelFormSchema),
		defaultValues: emptyStudyLevel
	})

	function onSubmit(values: StudyLevelFormValues) {
		createLevel.mutate(
			{ data: values },
			{
				onSuccess: level => {
					toast.success(`Уровень ${level.code} добавлен`)
					form.reset(emptyStudyLevel)
					form.setFocus('code')
				},
				onError: error => {
					const apiError = parseApiError(error)

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
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className='grid items-start gap-3 rounded-md border p-4 sm:grid-cols-[10rem_minmax(0,1fr)_auto]'
		>
			<StudyLevelFields form={form} idPrefix='new-level' />
			<Button
				type='submit'
				size='lg'
				disabled={createLevel.isPending}
				className='h-10 sm:mt-[1.625rem]'
			>
				<Plus data-icon='inline-start' />
				{createLevel.isPending ? 'Добавление…' : 'Добавить'}
			</Button>
		</form>
	)
}

export function StudyLevelsCard({ canManage }: { canManage: boolean }) {
	const { data, isPending, isError } = useStudyLevels()
	const [dialog, setDialog] = useState<DialogState>(null)
	const levels = data?.items ?? []

	function closeDialog(open: boolean) {
		if (!open) setDialog(null)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<GraduationCap className='size-5' aria-hidden='true' />
					Уровни обучения
				</CardTitle>
				<CardDescription>
					Обозначение и название уровня, например A1 — Beginner.
					Уровень выбирается в карточке ученика.
				</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-col gap-4'>
				{canManage ? <CreateStudyLevelForm /> : null}

				{isPending ? (
					<div className='flex flex-col gap-2'>
						<Skeleton className='h-10' />
						<Skeleton className='h-10' />
					</div>
				) : isError ? (
					<p role='alert' className='text-destructive text-sm'>
						Не удалось загрузить уровни. Обновите страницу или
						попробуйте позже.
					</p>
				) : levels.length ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='w-32'>
									Обозначение
								</TableHead>
								<TableHead>Название</TableHead>
								{canManage ? (
									<TableHead className='w-24'>
										<span className='sr-only'>
											Действия
										</span>
									</TableHead>
								) : null}
							</TableRow>
						</TableHeader>
						<TableBody>
							{levels.map(level => (
								<TableRow key={level.id}>
									<TableCell className='font-medium'>
										{level.code}
									</TableCell>
									<TableCell className='whitespace-normal'>
										{level.name}
									</TableCell>
									{canManage ? (
										<TableCell>
											<div className='flex justify-end gap-1'>
												<Button
													variant='ghost'
													size='icon-sm'
													aria-label={`Изменить уровень ${level.code}`}
													onClick={() =>
														setDialog({
															type: 'edit',
															level
														})
													}
												>
													<Pencil />
												</Button>
												<Button
													variant='ghost'
													size='icon-sm'
													aria-label={`Удалить уровень ${level.code}`}
													title={
														level.studentsCount
															? 'Уровень назначен ученикам'
															: undefined
													}
													disabled={
														level.studentsCount > 0
													}
													onClick={() =>
														setDialog({
															type: 'delete',
															level
														})
													}
												>
													<Trash2 />
												</Button>
											</div>
										</TableCell>
									) : null}
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<p className='text-muted-foreground text-sm'>
						Уровней пока нет.
						{canManage ? ' Добавьте первый в форме выше.' : null}
					</p>
				)}
			</CardContent>

			{dialog?.type === 'edit' ? (
				<EditStudyLevelDialog
					level={dialog.level}
					open
					onOpenChange={closeDialog}
				/>
			) : null}
			{dialog?.type === 'delete' ? (
				<DeleteStudyLevelDialog
					level={dialog.level}
					open
					onOpenChange={closeDialog}
				/>
			) : null}
		</Card>
	)
}
