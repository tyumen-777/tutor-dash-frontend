'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { BriefcaseBusiness, Plus } from 'lucide-react'
import { useState } from 'react'
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

import {
	type TeacherFormValues,
	teacherFormSchema,
	toCreateTeacherRequest
} from './teacher-form-schema'
import type { ErrorType } from '@/api/api-client'
import type { TeacherResponse } from '@/api/generated/models'
import { useTeachersControllerCreateTeacher } from '@/api/generated/teachers/teachers'

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

function getErrorMessage(error: ErrorType<unknown> | null) {
	if (!error) return null

	const data = error.response?.data as { message?: unknown } | undefined
	const message = data?.message

	if (typeof message === 'string') return message
	if (Array.isArray(message) && message.length) return message.join('. ')

	return 'Не удалось добавить преподавателя. Попробуйте ещё раз.'
}

export function TeacherFormDialog({
	onCreated
}: {
	onCreated?: (teacher: TeacherResponse) => void
}) {
	const [open, setOpen] = useState(false)
	const form = useForm<TeacherFormValues>({
		resolver: zodResolver(teacherFormSchema),
		defaultValues: getDefaultValues(),
		reValidateMode: 'onChange'
	})
	const createTeacher = useTeachersControllerCreateTeacher()
	const errorMessage = getErrorMessage(createTeacher.error)

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen)

		if (!nextOpen) {
			form.reset(getDefaultValues())
			createTeacher.reset()
		}
	}

	function handleValidSubmit(values: TeacherFormValues) {
		createTeacher.mutate(
			{ data: toCreateTeacherRequest(values) },
			{
				onSuccess: teacher => {
					onCreated?.(teacher)
					handleOpenChange(false)
				}
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger render={<Button size='lg' />}>
				<Plus data-icon='inline-start' />
				Добавить преподавателя
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
								<BriefcaseBusiness aria-hidden='true' />
							</div>
							<div className='flex min-w-0 flex-col gap-1'>
								<DialogTitle>Новый преподаватель</DialogTitle>
								<DialogDescription>
									Заполните основные данные, ставку и добавьте
									способ связи.
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>

					<div className='min-h-0 overflow-y-auto pr-1'>
						<FieldGroup>
							<FieldSet>
								<FieldLegend>Основные данные</FieldLegend>
								<Controller
									name='fullName'
									control={form.control}
									render={({ field, fieldState }) => (
										<Field
											data-invalid={fieldState.invalid}
										>
											<FieldLabel htmlFor={field.name}>
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
															event.target.value
														field.onChange(
															value === ''
																? undefined
																: Number(value)
														)
													}}
													value={field.value ?? ''}
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
													errors={[fieldState.error]}
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
													placeholder='teacher@example.com'
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
						</FieldGroup>
					</div>

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
						<Button
							type='submit'
							disabled={createTeacher.isPending}
						>
							{createTeacher.isPending
								? 'Сохранение…'
								: 'Добавить преподавателя'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
