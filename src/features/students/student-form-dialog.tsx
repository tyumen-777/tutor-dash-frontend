'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Plus, UserRoundPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList
} from '@/components/ui/combobox'
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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { useCreateStudent } from './api/use-create-student'
import {
	type StudentFormValues,
	statusOptions,
	studentFormSchema,
	toCreateStudentRequest
} from './student-form-schema'
import { TIMEZONE_OPTIONS, type TimezoneOption } from './timezones'
import {
	type ApiError,
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	hasMessage,
	parseApiError
} from '@/api/errors'
import { getTeachersControllerListTeachersQueryKey } from '@/api/generated/teachers/teachers'
import { useTeachers } from '@/features/teachers/api/use-teachers'

const defaultValues: StudentFormValues = {
	firstName: '',
	lastName: '',
	birthDate: '',
	status: 'ACTIVE',
	teacherId: '',
	level: '',
	timezone: '',
	phone: '',
	email: '',
	telegram: '',
	note: ''
}

const FORM_FIELDS = Object.keys(defaultValues) as (keyof StudentFormValues)[]

/**
 * Validation errors come as "field: message" strings. Returns the form fields
 * they point to.
 */
function getInvalidFields(error: ApiError) {
	return error.messages
		.map(message => message.split(':')[0]?.trim())
		.filter((field): field is keyof StudentFormValues =>
			FORM_FIELDS.includes(field as keyof StudentFormValues)
		)
}

export function StudentFormDialog() {
	const [open, setOpen] = useState(false)
	const form = useForm<StudentFormValues>({
		resolver: zodResolver(studentFormSchema),
		defaultValues,
		reValidateMode: 'onChange'
	})
	const queryClient = useQueryClient()
	const createStudent = useCreateStudent()
	const teachers = useTeachers('active')
	const [formError, setFormError] = useState<string | null>(null)

	const teacherOptions = useMemo(
		() => [
			{ value: '', label: 'Без преподавателя' },
			...(teachers.data?.items ?? []).map(teacher => ({
				value: teacher.id,
				label: teacher.fullName
			}))
		],
		[teachers.data]
	)

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen)

		if (!nextOpen) {
			form.reset(defaultValues)
			createStudent.reset()
			setFormError(null)
		}
	}

	function handleCreateError(error: unknown) {
		const apiError = parseApiError(error)

		if (apiError.status === 400) {
			// Преподавателя архивировали или удалили, пока форма была открыта
			if (
				hasMessage(apiError, 'Teacher not found') ||
				hasMessage(apiError, 'Teacher is archived')
			) {
				form.setValue('teacherId', '')
				form.setError('teacherId', {
					message: 'Преподаватель больше недоступен, выберите другого'
				})
				void queryClient.invalidateQueries({
					queryKey: getTeachersControllerListTeachersQueryKey()
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

	function handleValidSubmit(values: StudentFormValues) {
		setFormError(null)
		createStudent.mutate(
			{ data: toCreateStudentRequest(values) },
			{
				onSuccess: () => handleOpenChange(false),
				onError: handleCreateError
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger render={<Button size='lg' />}>
				<Plus data-icon='inline-start' />
				Добавить ученика
			</DialogTrigger>

			<DialogContent className='max-h-[calc(100svh-2rem)] overflow-hidden sm:max-w-2xl'>
				<form
					className='flex min-h-0 flex-col gap-4'
					onSubmit={form.handleSubmit(handleValidSubmit)}
					noValidate
				>
					<DialogHeader className='pr-8'>
						<div className='flex items-start gap-3'>
							<div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
								<UserRoundPlus aria-hidden='true' />
							</div>
							<div className='flex min-w-0 flex-col gap-1'>
								<DialogTitle>Новый ученик</DialogTitle>
								<DialogDescription>
									Обязательно только имя — остальное можно
									заполнить позже.
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>

					<div className='min-h-0 overflow-y-auto pr-1'>
						<FieldGroup>
							<FieldSet>
								<FieldLegend>Основные данные</FieldLegend>
								<div className='grid gap-4 sm:grid-cols-2'>
									<Controller
										name='firstName'
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
													Имя
												</FieldLabel>
												<Input
													{...field}
													id={field.name}
													placeholder='Анна'
													autoComplete='given-name'
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

									<Controller
										name='lastName'
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
													Фамилия
												</FieldLabel>
												<Input
													{...field}
													id={field.name}
													placeholder='Смирнова'
													autoComplete='family-name'
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

									<Controller
										name='birthDate'
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
													Дата рождения
												</FieldLabel>
												<Input
													{...field}
													id={field.name}
													type='date'
													min='1900-01-01'
													max={dayjs().format(
														'YYYY-MM-DD'
													)}
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

									<Controller
										name='status'
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
													Статус
												</FieldLabel>
												<Select
													items={statusOptions}
													value={field.value}
													onValueChange={
														field.onChange
													}
												>
													<SelectTrigger
														id={field.name}
														aria-invalid={
															fieldState.invalid
														}
														className='w-full data-[size=default]:h-10'
													>
														<SelectValue placeholder='Выберите статус' />
													</SelectTrigger>
													<SelectContent
														alignItemWithTrigger={
															false
														}
													>
														<SelectGroup>
															{statusOptions.map(
																option => (
																	<SelectItem
																		key={
																			option.value
																		}
																		value={
																			option.value
																		}
																	>
																		{
																			option.label
																		}
																	</SelectItem>
																)
															)}
														</SelectGroup>
													</SelectContent>
												</Select>
												<FieldError
													errors={[fieldState.error]}
												/>
											</Field>
										)}
									/>
								</div>
							</FieldSet>

							<FieldSet>
								<FieldLegend>Обучение</FieldLegend>
								<div className='grid gap-4 sm:grid-cols-2'>
									<Controller
										name='teacherId'
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
													Преподаватель
												</FieldLabel>
												<Select
													items={teacherOptions}
													value={field.value}
													onValueChange={value =>
														field.onChange(
															value ?? ''
														)
													}
													disabled={
														teachers.isPending
													}
												>
													<SelectTrigger
														id={field.name}
														aria-invalid={
															fieldState.invalid
														}
														className='w-full data-[size=default]:h-10'
													>
														<SelectValue
															placeholder={
																teachers.isPending
																	? 'Загрузка…'
																	: 'Без преподавателя'
															}
														/>
													</SelectTrigger>
													<SelectContent
														alignItemWithTrigger={
															false
														}
													>
														<SelectGroup>
															{teacherOptions.map(
																option => (
																	<SelectItem
																		key={
																			option.value
																		}
																		value={
																			option.value
																		}
																	>
																		{
																			option.label
																		}
																	</SelectItem>
																)
															)}
														</SelectGroup>
													</SelectContent>
												</Select>
												<FieldError
													errors={[
														fieldState.error ??
															(teachers.isError
																? {
																		message:
																			'Не удалось загрузить преподавателей'
																	}
																: undefined)
													]}
												/>
											</Field>
										)}
									/>

									<Controller
										name='level'
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
													Уровень
												</FieldLabel>
												<Input
													{...field}
													id={field.name}
													placeholder='B1, 7 класс, ОГЭ'
													maxLength={50}
													autoComplete='off'
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

									<Controller
										name='timezone'
										control={form.control}
										render={({ field, fieldState }) => (
											<Field
												data-invalid={
													fieldState.invalid
												}
												className='sm:col-span-2'
											>
												<FieldLabel
													htmlFor={field.name}
												>
													Часовой пояс
												</FieldLabel>
												<Combobox<TimezoneOption>
													items={TIMEZONE_OPTIONS}
													value={
														TIMEZONE_OPTIONS.find(
															option =>
																option.value ===
																field.value
														) ?? null
													}
													onValueChange={option =>
														field.onChange(
															option?.value ?? ''
														)
													}
													itemToStringValue={option =>
														option.value
													}
												>
													<ComboboxInput
														id={field.name}
														placeholder='Как в организации'
														showClear={
															field.value !== ''
														}
														aria-invalid={
															fieldState.invalid
														}
														className='h-10 w-full'
													/>
													<ComboboxContent>
														<ComboboxEmpty>
															Ничего не найдено
														</ComboboxEmpty>
														<ComboboxList>
															{(
																option: TimezoneOption
															) => (
																<ComboboxItem
																	key={
																		option.value
																	}
																	value={
																		option
																	}
																>
																	{
																		option.label
																	}
																</ComboboxItem>
															)}
														</ComboboxList>
													</ComboboxContent>
												</Combobox>
												<FieldError
													errors={[fieldState.error]}
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
													errors={[fieldState.error]}
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
													placeholder='student@example.com'
													autoComplete='email'
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
													errors={[fieldState.error]}
												/>
											</Field>
										)}
									/>
								</div>
							</FieldSet>

							<Controller
								name='note'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Заметка
										</FieldLabel>
										<Textarea
											{...field}
											id={field.name}
											placeholder='Готовится к ОГЭ по математике'
											maxLength={2000}
											aria-invalid={fieldState.invalid}
										/>
										<FieldError
											errors={[fieldState.error]}
										/>
									</Field>
								)}
							/>
						</FieldGroup>
					</div>

					{formError ? (
						<p role='alert' className='text-destructive text-sm'>
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
						<Button
							type='submit'
							disabled={createStudent.isPending}
						>
							{createStudent.isPending
								? 'Сохранение…'
								: 'Добавить ученика'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
