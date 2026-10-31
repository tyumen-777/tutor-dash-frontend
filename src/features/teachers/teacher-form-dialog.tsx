'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { ArchiveRestore, BriefcaseBusiness, Pencil, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import { useCreateTeacher } from './api/use-create-teacher'
import { useUpdateTeacher } from './api/use-teacher-mutations'
import {
	type TeacherFormValues,
	teacherFormSchema,
	toCreateTeacherRequest,
	toTeacherFormValues,
	toUpdateTeacherRequest
} from './teacher-form-schema'
import { useRestoreTeacherAction } from './use-restore-teacher-action'
import {
	type ApiError,
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	hasMessage,
	parseApiError
} from '@/api/errors'
import type { TeacherResponse } from '@/api/generated/models'

function getDefaultValues(): Partial<TeacherFormValues> {
	return {
		fullName: '',
		hourlyRate: undefined,
		startedOn: dayjs().format('YYYY-MM-DD'),
		phone: '',
		email: '',
		telegram: ''
	}
}

const FORM_FIELDS = [
	'fullName',
	'hourlyRate',
	'startedOn',
	'phone',
	'email',
	'telegram'
] as const satisfies readonly (keyof TeacherFormValues)[]

/**
 * Validation errors come as "field: message" strings. Returns the form fields
 * they point to.
 */
function getInvalidFields(error: ApiError) {
	return error.messages
		.map(message => message.split(':')[0]?.trim())
		.filter((field): field is (typeof FORM_FIELDS)[number] =>
			FORM_FIELDS.includes(field as (typeof FORM_FIELDS)[number])
		)
}

type ArchivedTeacher = { id: string; email: string | null }

type TeacherFormDialogProps =
	| { teacher?: undefined; open?: undefined; onOpenChange?: undefined }
	| {
			teacher: TeacherResponse
			open: boolean
			onOpenChange: (open: boolean) => void
	  }

/**
 * Adds a teacher (with its own trigger button) or, when `teacher` is passed,
 * edits it in a dialog controlled by the caller.
 */
export function TeacherFormDialog({
	teacher,
	open: controlledOpen,
	onOpenChange
}: TeacherFormDialogProps) {
	const isEdit = !!teacher
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
	const open = controlledOpen ?? uncontrolledOpen
	const initialValues = useMemo(
		() => (teacher ? toTeacherFormValues(teacher) : getDefaultValues()),
		[teacher]
	)
	const form = useForm<TeacherFormValues>({
		resolver: zodResolver(teacherFormSchema),
		defaultValues: initialValues,
		reValidateMode: 'onChange'
	})
	const router = useRouter()
	const createTeacher = useCreateTeacher()
	const updateTeacher = useUpdateTeacher()
	const mutation = isEdit ? updateTeacher : createTeacher
	const { restore, isPending: isRestoring } = useRestoreTeacherAction()
	const [formError, setFormError] = useState<string | null>(null)
	const [archivedTeacher, setArchivedTeacher] =
		useState<ArchivedTeacher | null>(null)

	// Форма редактирования заполняется актуальными данными при каждом открытии
	useEffect(() => {
		if (open) form.reset(initialValues)
	}, [open, initialValues, form])

	function handleOpenChange(nextOpen: boolean) {
		if (onOpenChange) {
			onOpenChange(nextOpen)
		} else {
			setUncontrolledOpen(nextOpen)
		}

		if (!nextOpen) {
			form.reset(initialValues)
			mutation.reset()
			setFormError(null)
			setArchivedTeacher(null)
		}
	}

	function handleSubmitError(error: unknown, values: TeacherFormValues) {
		const apiError = parseApiError(error)

		if (isEdit && apiError.status === 404) {
			setFormError('Преподаватель не найден — возможно, его удалили')
			return
		}

		if (apiError.status === 409) {
			if (!isEdit && apiError.archivedTeacherId) {
				setArchivedTeacher({
					id: apiError.archivedTeacherId,
					email: values.email || null
				})
				return
			}

			form.setError('email', {
				message: 'Учитель с такой почтой уже есть'
			})
			return
		}

		if (apiError.status === 400) {
			if (
				hasMessage(apiError, 'startedOn cannot be later than endedOn')
			) {
				form.setError('startedOn', {
					message: 'Дата начала не может быть позже даты увольнения'
				})
				return
			}

			const fields = getInvalidFields(apiError)

			if (fields.length) {
				fields.forEach(field =>
					form.setError(field, { message: 'Некорректное значение' })
				)
				return
			}
		}

		setFormError(
			getCommonErrorMessage(apiError) ??
				(apiError.status === 400
					? 'Проверьте данные формы'
					: UNKNOWN_ERROR_MESSAGE)
		)
	}

	function handleRestore() {
		if (!archivedTeacher) return

		restore(archivedTeacher, () => {
			handleOpenChange(false)
			router.push(`/teacher/${archivedTeacher.id}`)
		})
	}

	function handleValidSubmit(values: TeacherFormValues) {
		const options = {
			onSuccess: () => handleOpenChange(false),
			onError: (error: unknown) => handleSubmitError(error, values)
		}

		setFormError(null)

		if (teacher) {
			updateTeacher.mutate(
				{ id: teacher.id, data: toUpdateTeacherRequest(values) },
				options
			)
		} else {
			createTeacher.mutate(
				{ data: toCreateTeacherRequest(values) },
				options
			)
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			{isEdit ? null : (
				<DialogTrigger render={<Button size='lg' />}>
					<Plus data-icon='inline-start' />
					Добавить преподавателя
				</DialogTrigger>
			)}

			<DialogContent className='flex max-h-[calc(100svh-2rem)] flex-col overflow-hidden sm:max-w-2xl'>
				{archivedTeacher ? (
					<div className='flex flex-col gap-4'>
						<DialogHeader className='pr-8'>
							<div className='flex items-start gap-3'>
								<div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
									<ArchiveRestore aria-hidden='true' />
								</div>
								<div className='flex min-w-0 flex-col gap-1'>
									<DialogTitle>
										Этот учитель уже работал у вас
									</DialogTitle>
									<DialogDescription>
										Учитель с почтой {archivedTeacher.email}{' '}
										в архиве. Восстановите его, чтобы
										сохранить историю занятий. Данные из
										формы при этом не применятся.
									</DialogDescription>
								</div>
							</div>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant='outline'
								nativeButton={false}
								render={
									<Link
										href={`/teacher/${archivedTeacher.id}`}
										onClick={() => handleOpenChange(false)}
									/>
								}
							>
								Открыть карточку
							</Button>
							<Button
								disabled={isRestoring}
								onClick={handleRestore}
							>
								{isRestoring
									? 'Восстановление…'
									: 'Восстановить'}
							</Button>
						</DialogFooter>
					</div>
				) : (
					<form
						className='flex min-h-0 flex-col gap-4'
						onSubmit={form.handleSubmit(handleValidSubmit)}
						noValidate
					>
						<DialogHeader className='pr-8'>
							<div className='flex items-start gap-3'>
								<div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
									{isEdit ? (
										<Pencil aria-hidden='true' />
									) : (
										<BriefcaseBusiness aria-hidden='true' />
									)}
								</div>
								<div className='flex min-w-0 flex-col gap-1'>
									<DialogTitle>
										{isEdit
											? 'Редактирование преподавателя'
											: 'Новый преподаватель'}
									</DialogTitle>
									<DialogDescription>
										{isEdit
											? 'Новая ставка применится к занятиям, созданным после сохранения. Очистите контакт, чтобы удалить его.'
											: 'Заполните основные данные, ставку и добавьте способ связи.'}
									</DialogDescription>
								</div>
							</div>
						</DialogHeader>

						<div className='min-h-0 overflow-y-auto overscroll-contain pr-1'>
							<FieldGroup>
								<FieldSet>
									<FieldLegend>Основные данные</FieldLegend>
									<Controller
										name='fullName'
										control={form.control}
										render={({ field, fieldState }) => (
											<Field
												data-invalid={
													fieldState.invalid
												}
											>
												<FieldLabel
													htmlFor={field.name}
												>
													ФИО
												</FieldLabel>
												<Input
													{...field}
													id={field.name}
													placeholder='Мария Иванова'
													autoComplete='name'
													aria-invalid={
														fieldState.invalid
													}
													className='h-10'
												/>
												<FieldError
													errors={[fieldState.error]}
												/>
											</Field>
										)}
									/>
								</FieldSet>

								<FieldSet>
									<FieldLegend>Работа</FieldLegend>
									<div className='grid gap-4 sm:grid-cols-2'>
										<Controller
											name='hourlyRate'
											control={form.control}
											render={({ field, fieldState }) => (
												<Field
													data-invalid={
														fieldState.invalid
													}
												>
													<FieldLabel
														htmlFor={field.name}
													>
														Ставка в час, ₽
													</FieldLabel>
													<Input
														id={field.name}
														name={field.name}
														ref={field.ref}
														onBlur={field.onBlur}
														onChange={event => {
															const value =
																event.target
																	.value
															field.onChange(
																value === ''
																	? undefined
																	: Number(
																			value
																		)
															)
														}}
														value={
															field.value ?? ''
														}
														type='number'
														inputMode='decimal'
														min={0}
														step={0.01}
														placeholder='1500'
														aria-invalid={
															fieldState.invalid
														}
														className='h-10'
													/>
													<FieldError
														errors={[
															fieldState.error
														]}
													/>
												</Field>
											)}
										/>

										<Controller
											name='startedOn'
											control={form.control}
											render={({ field, fieldState }) => (
												<Field
													data-invalid={
														fieldState.invalid
													}
												>
													<FieldLabel
														htmlFor={field.name}
													>
														Дата начала работы
													</FieldLabel>
													<Input
														{...field}
														id={field.name}
														type='date'
														max={
															teacher?.endedOn ??
															undefined
														}
														aria-invalid={
															fieldState.invalid
														}
														className='h-10'
													/>
													<FieldError
														errors={[
															fieldState.error
														]}
													/>
												</Field>
											)}
										/>
									</div>
								</FieldSet>

								<FieldSet>
									<FieldLegend>Контакты</FieldLegend>
									<div className='grid gap-4 sm:grid-cols-2'>
										<Controller
											name='phone'
											control={form.control}
											render={({ field, fieldState }) => (
												<Field
													data-invalid={
														fieldState.invalid
													}
												>
													<FieldLabel
														htmlFor={field.name}
													>
														Телефон
													</FieldLabel>
													<Input
														{...field}
														id={field.name}
														type='tel'
														placeholder='+7 912 345-67-89'
														autoComplete='tel'
														aria-invalid={
															fieldState.invalid
														}
														className='h-10'
													/>
													<FieldError
														errors={[
															fieldState.error
														]}
													/>
												</Field>
											)}
										/>

										<Controller
											name='email'
											control={form.control}
											render={({ field, fieldState }) => (
												<Field
													data-invalid={
														fieldState.invalid
													}
												>
													<FieldLabel
														htmlFor={field.name}
													>
														Email
													</FieldLabel>
													<Input
														{...field}
														id={field.name}
														type='email'
														placeholder='teacher@example.com'
														autoComplete='email'
														aria-invalid={
															fieldState.invalid
														}
														className='h-10'
													/>
													<FieldError
														errors={[
															fieldState.error
														]}
													/>
												</Field>
											)}
										/>

										<Controller
											name='telegram'
											control={form.control}
											render={({ field, fieldState }) => (
												<Field
													data-invalid={
														fieldState.invalid
													}
												>
													<FieldLabel
														htmlFor={field.name}
													>
														Telegram
													</FieldLabel>
													<Input
														{...field}
														id={field.name}
														placeholder='@username'
														autoComplete='off'
														aria-invalid={
															fieldState.invalid
														}
														className='h-10'
													/>
													<FieldError
														errors={[
															fieldState.error
														]}
													/>
												</Field>
											)}
										/>
									</div>
								</FieldSet>
							</FieldGroup>
						</div>

						{formError ? (
							<p
								role='alert'
								className='text-destructive text-sm'
							>
								{formError}
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
							<Button type='submit' disabled={mutation.isPending}>
								{mutation.isPending
									? 'Сохранение…'
									: isEdit
										? 'Сохранить'
										: 'Добавить преподавателя'}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	)
}
