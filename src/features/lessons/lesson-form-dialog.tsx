'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { GraduationCap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

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
	DialogTitle
} from '@/components/ui/dialog'
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel
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

import { formatMoney } from '@/lib/format-money'
import {
	formatTimezoneCity,
	getBrowserTimezone,
	schoolNow
} from '@/lib/school-time'

import { useCreateLesson } from './api/use-lesson-mutations'
import {
	type LessonFormValues,
	createLessonFormSchema,
	getCreateDefaultValues,
	toCreateLessonRequest
} from './lesson-form-schema'
import { calculateTeacherPay, lessonDurationOptions } from './lesson-options'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	hasMessage,
	parseApiError
} from '@/api/errors'
import { useSchoolTimezone } from '@/features/auth/api/use-organization-role'
import { formatLessons } from '@/features/income/payment-options'
import { useStudents } from '@/features/students/api/use-students'
import { getStudentFullName } from '@/features/students/format'
import { useTeachers } from '@/features/teachers/api/use-teachers'

type StudentOption = {
	value: string
	label: string
	lessonsLeft: number
	teacherId: string | null
}

/**
 * Registers a held lesson: one lesson is deducted from the student and the
 * teacher is credited by their hourly rate.
 */
export function LessonFormDialog({
	open,
	onOpenChange
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const timezone = useSchoolTimezone()
	const schema = useMemo(() => createLessonFormSchema(timezone), [timezone])
	const defaultValues = useMemo(
		() => getCreateDefaultValues(timezone),
		[timezone]
	)
	const form = useForm<LessonFormValues>({
		resolver: zodResolver(schema),
		defaultValues,
		reValidateMode: 'onChange'
	})
	const createLesson = useCreateLesson()
	const [formError, setFormError] = useState<string | null>(null)

	// Пересобираем форму при каждом открытии, чтобы время было актуальным
	useEffect(() => {
		if (open) form.reset(getCreateDefaultValues(timezone))
	}, [open, form, timezone])

	const students = useStudents()
	const studentOptions = useMemo<StudentOption[]>(
		() =>
			(students.data?.items ?? [])
				.filter(student => student.status !== 'ARCHIVED')
				.map(student => ({
					value: student.id,
					label: getStudentFullName(student),
					lessonsLeft: student.lessonsLeft,
					teacherId: student.teacher?.isActive
						? student.teacher.id
						: null
				})),
		[students.data]
	)

	const teachers = useTeachers('active')
	const teacherOptions = useMemo(
		() =>
			(teachers.data?.items ?? []).map(teacher => ({
				value: teacher.id,
				label: teacher.fullName,
				hourlyRate: Number(teacher.hourlyRate)
			})),
		[teachers.data]
	)

	const [studentId, teacherId, durationMin] = useWatch({
		control: form.control,
		name: ['studentId', 'teacherId', 'durationMin']
	})
	const selectedStudent = studentOptions.find(
		option => option.value === studentId
	)
	const selectedTeacher = teacherOptions.find(
		option => option.value === teacherId
	)
	const teacherPay =
		selectedTeacher && durationMin
			? calculateTeacherPay(selectedTeacher.hourlyRate, durationMin)
			: null
	const noLessonsLeft = selectedStudent?.lessonsLeft === 0

	// Подставляем основного преподавателя ученика, пока его не выбрали вручную
	useEffect(() => {
		if (!selectedStudent?.teacherId) return
		if (form.getFieldState('teacherId').isDirty) return

		form.setValue('teacherId', selectedStudent.teacherId, {
			shouldValidate: form.formState.isSubmitted
		})
	}, [selectedStudent, form])

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen)

		if (!nextOpen) {
			createLesson.reset()
			setFormError(null)
		}
	}

	function handleError(error: unknown) {
		const apiError = parseApiError(error)

		if (
			apiError.status === 409 &&
			hasMessage(apiError, 'no paid lessons')
		) {
			form.setError('studentId', {
				message: 'У ученика нет оплаченных занятий'
			})
			return
		}
		if (
			apiError.status === 409 &&
			hasMessage(apiError, 'already has a lesson')
		) {
			form.setError('time', {
				message: 'У преподавателя уже есть занятие в это время'
			})
			return
		}
		if (apiError.status === 400 && hasMessage(apiError, 'Student')) {
			form.setError('studentId', { message: 'Ученик больше недоступен' })
			return
		}
		if (apiError.status === 400 && hasMessage(apiError, 'Teacher')) {
			form.setError('teacherId', {
				message: 'Преподаватель больше недоступен'
			})
			return
		}
		if (apiError.status === 400 && hasMessage(apiError, 'startsAt')) {
			form.setError('time', {
				message: 'Занятие не может быть в будущем'
			})
			return
		}

		setFormError(
			getCommonErrorMessage(apiError) ??
				(apiError.status === 400
					? 'Проверьте данные формы'
					: UNKNOWN_ERROR_MESSAGE)
		)
	}

	function handleValidSubmit(values: LessonFormValues) {
		setFormError(null)

		createLesson.mutate(
			{ data: toCreateLessonRequest(values, timezone) },
			{
				onSuccess: lesson => {
					toast.success(
						lesson.teacherPay
							? `Занятие внесено, преподавателю начислено ${formatMoney(lesson.teacherPay, lesson.currency)}`
							: 'Занятие внесено'
					)
					handleOpenChange(false)
				},
				onError: handleError
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='flex max-h-[calc(100svh-2rem)] flex-col overflow-hidden sm:max-w-lg'>
				<form
					className='flex min-h-0 flex-col gap-4'
					onSubmit={form.handleSubmit(handleValidSubmit)}
					noValidate
				>
					<DialogHeader className='pr-8'>
						<div className='flex items-start gap-3'>
							<div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
								<GraduationCap aria-hidden='true' />
							</div>
							<div className='flex min-w-0 flex-col gap-1'>
								<DialogTitle>Добавить занятие</DialogTitle>
								<DialogDescription>
									У ученика спишется одно занятие, а
									преподавателю начислится оплата по его
									ставке.
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>

					<div className='min-h-0 overflow-y-auto overscroll-contain pr-1'>
						<FieldGroup>
							<Controller
								name='studentId'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Ученик
										</FieldLabel>
										<Combobox<StudentOption>
											items={studentOptions}
											value={selectedStudent ?? null}
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
												placeholder={
													students.isPending
														? 'Загрузка…'
														: 'Найти ученика'
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
														option: StudentOption
													) => (
														<ComboboxItem
															key={option.value}
															value={option}
														>
															<span className='flex-1'>
																{option.label}
															</span>
															<span className='text-muted-foreground text-xs tabular-nums'>
																{
																	option.lessonsLeft
																}{' '}
																ост.
															</span>
														</ComboboxItem>
													)}
												</ComboboxList>
											</ComboboxContent>
										</Combobox>
										{selectedStudent &&
										!fieldState.error ? (
											<FieldDescription
												className={
													noLessonsLeft
														? 'text-destructive'
														: undefined
												}
											>
												{noLessonsLeft
													? 'У ученика нет оплаченных занятий — сначала внесите оплату'
													: `Осталось ${formatLessons(selectedStudent.lessonsLeft)}`}
											</FieldDescription>
										) : null}
										<FieldError
											errors={[fieldState.error]}
										/>
									</Field>
								)}
							/>

							<Controller
								name='teacherId'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Преподаватель
										</FieldLabel>
										<Select
											items={teacherOptions}
											value={field.value || null}
											onValueChange={value =>
												field.onChange(value ?? '')
											}
										>
											<SelectTrigger
												id={field.name}
												aria-invalid={
													fieldState.invalid
												}
												className='h-10 w-full'
											>
												<SelectValue
													placeholder={
														teachers.isPending
															? 'Загрузка…'
															: 'Выберите преподавателя'
													}
												/>
											</SelectTrigger>
											<SelectContent
												alignItemWithTrigger={false}
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
																{option.label}
															</SelectItem>
														)
													)}
												</SelectGroup>
											</SelectContent>
										</Select>
										{selectedTeacher ? (
											<FieldDescription>
												Ставка{' '}
												{formatMoney(
													selectedTeacher.hourlyRate
												)}{' '}
												в час
											</FieldDescription>
										) : null}
										<FieldError
											errors={[fieldState.error]}
										/>
									</Field>
								)}
							/>

							<div className='grid gap-4 sm:grid-cols-3'>
								<Controller
									name='date'
									control={form.control}
									render={({ field, fieldState }) => (
										<Field
											data-invalid={fieldState.invalid}
										>
											<FieldLabel htmlFor={field.name}>
												Дата
											</FieldLabel>
											<Input
												{...field}
												id={field.name}
												type='date'
												max={schoolNow(timezone).format(
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
									name='time'
									control={form.control}
									render={({ field, fieldState }) => (
										<Field
											data-invalid={fieldState.invalid}
										>
											<FieldLabel htmlFor={field.name}>
												Начало
											</FieldLabel>
											<Input
												{...field}
												id={field.name}
												type='time'
												step={300}
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
									name='durationMin'
									control={form.control}
									render={({ field, fieldState }) => (
										<Field
											data-invalid={fieldState.invalid}
										>
											<FieldLabel htmlFor={field.name}>
												Длительность
											</FieldLabel>
											<Select
												items={lessonDurationOptions}
												value={
													field.value
														? String(field.value)
														: null
												}
												onValueChange={value =>
													field.onChange(
														value
															? Number(value)
															: undefined
													)
												}
											>
												<SelectTrigger
													id={field.name}
													aria-invalid={
														fieldState.invalid
													}
													className='h-10 w-full'
												>
													<SelectValue />
												</SelectTrigger>
												<SelectContent
													alignItemWithTrigger={false}
												>
													<SelectGroup>
														{lessonDurationOptions.map(
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

							{timezone !== getBrowserTimezone() ? (
								<p className='text-muted-foreground -mt-2 text-sm'>
									Дата и время — по часам школы (
									{formatTimezoneCity(timezone)}, сейчас{' '}
									{schoolNow(timezone).format('HH:mm')}).
								</p>
							) : null}

							<p
								aria-live='polite'
								className='bg-muted -mt-2 rounded-md px-3 py-2 text-sm'
							>
								Преподавателю начислится:{' '}
								<span className='font-semibold tabular-nums'>
									{teacherPay === null
										? '—'
										: formatMoney(teacherPay)}
								</span>
								{durationMin === 45 ? (
									<span className='text-muted-foreground'>
										{' '}
										· ставка / 60 × 45, округление вверх до
										10 ₽
									</span>
								) : null}
							</p>

							<Controller
								name='topic'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Тема
										</FieldLabel>
										<Input
											{...field}
											id={field.name}
											placeholder='Необязательно'
											aria-invalid={fieldState.invalid}
											className='h-10'
										/>
										<FieldError
											errors={[fieldState.error]}
										/>
									</Field>
								)}
							/>

							<Controller
								name='homework'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Домашнее задание
										</FieldLabel>
										<Textarea
											{...field}
											id={field.name}
											rows={2}
											placeholder='Необязательно'
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
							disabled={createLesson.isPending || noLessonsLeft}
						>
							{createLesson.isPending
								? 'Сохранение…'
								: 'Добавить занятие'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
