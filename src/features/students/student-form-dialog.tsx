'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, UserRoundPlus } from 'lucide-react'
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
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

import {
	type StudentFormValues,
	levelOptions,
	studentFormSchema,
	teacherOptions
} from './student-form-schema'

const defaultValues: Partial<StudentFormValues> = {
	fullName: '',
	teacher: undefined,
	level: undefined,
	phone: '',
	email: '',
	telegram: ''
}

export function StudentFormDialog() {
	const [open, setOpen] = useState(false)
	const form = useForm<StudentFormValues>({
		resolver: zodResolver(studentFormSchema),
		defaultValues,
		reValidateMode: 'onChange'
	})

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen)

		if (!nextOpen) {
			form.reset(defaultValues)
		}
	}

	function handleValidSubmit() {
		form.reset(defaultValues)
		setOpen(false)
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
									Заполните основные данные, назначьте
									преподавателя и добавьте способ связи.
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>

					<div className='min-h-0 overflow-y-auto pr-1'>
						<FieldGroup>
							<FieldSet>
								<FieldLegend>Основные данные</FieldLegend>
								<div className='grid gap-4 sm:grid-cols-[minmax(0,1fr)_9rem]'>
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
													placeholder='Анна Смирнова'
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

									<Controller
										name='age'
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
													Возраст
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
													inputMode='numeric'
													min={3}
													max={100}
													placeholder='12'
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
								<FieldLegend>Обучение</FieldLegend>
								<div className='grid gap-4 sm:grid-cols-2'>
									<Controller
										name='teacher'
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
													value={field.value ?? null}
													onValueChange={
														field.onChange
													}
												>
													<SelectTrigger
														id={field.name}
														aria-invalid={
															fieldState.invalid
														}
														className='h-10 w-full'
													>
														<SelectValue placeholder='Выберите преподавателя' />
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
													errors={[fieldState.error]}
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
												<Select
													items={levelOptions}
													value={field.value ?? null}
													onValueChange={
														field.onChange
													}
												>
													<SelectTrigger
														id={field.name}
														aria-invalid={
															fieldState.invalid
														}
														className='h-10 w-full'
													>
														<SelectValue placeholder='Выберите уровень' />
													</SelectTrigger>
													<SelectContent
														alignItemWithTrigger={
															false
														}
													>
														<SelectGroup>
															{levelOptions.map(
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
						</FieldGroup>
					</div>

					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							onClick={() => handleOpenChange(false)}
						>
							Отмена
						</Button>
						<Button type='submit'>Добавить ученика</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
