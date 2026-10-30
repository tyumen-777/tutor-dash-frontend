'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { Wallet } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
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

import { useCreatePayment, useUpdatePayment } from './api/use-payment-mutations'
import { usePayments } from './api/use-payments'
import {
	type PaymentFormValues,
	getCreateDefaultValues,
	getEditDefaultValues,
	paymentFormSchema,
	toCreatePaymentRequest,
	toUpdatePaymentRequest
} from './payment-form-schema'
import {
	formatLessons,
	getLessonPrice,
	paymentMethodOptions
} from './payment-options'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	hasMessage,
	parseApiError
} from '@/api/errors'
import type { PaymentResponse } from '@/api/generated/models'
import { useStudents } from '@/features/students/api/use-students'
import { getStudentFullName } from '@/features/students/format'
import { formatDate } from '@/features/teachers/format'

type StudentOption = { value: string; label: string }

function NumberInput({
	value,
	onChange,
	...props
}: Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange'> & {
	value: number | undefined
	onChange: (value: number | undefined) => void
}) {
	return (
		<Input
			{...props}
			type='number'
			value={value ?? ''}
			onChange={event => {
				const next = event.target.value
				onChange(next === '' ? undefined : Number(next))
			}}
			className='h-10'
		/>
	)
}

/**
 * Creates a payment (with an optional fixed student, e.g. from the student
 * profile) or edits an existing one when `payment` is passed.
 */
export function PaymentFormDialog({
	open,
	onOpenChange,
	payment,
	studentId: fixedStudentId
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
	payment?: PaymentResponse
	studentId?: string
}) {
	const isEdit = !!payment
	const defaultValues = useMemo(
		() =>
			payment
				? getEditDefaultValues(payment)
				: getCreateDefaultValues(fixedStudentId),
		[payment, fixedStudentId]
	)
	const form = useForm<PaymentFormValues>({
		resolver: zodResolver(paymentFormSchema),
		defaultValues,
		reValidateMode: 'onChange'
	})
	const createPayment = useCreatePayment()
	const updatePayment = useUpdatePayment()
	const mutation = isEdit ? updatePayment : createPayment
	const [formError, setFormError] = useState<string | null>(null)

	// Пересобираем форму при каждом открытии: диалог переиспользуется
	// для разных оплат
	useEffect(() => {
		if (open) form.reset(defaultValues)
	}, [open, defaultValues, form])

	const students = useStudents()
	const studentOptions = useMemo<StudentOption[]>(
		() =>
			(students.data?.items ?? []).map(student => ({
				value: student.id,
				label: getStudentFullName(student)
			})),
		[students.data]
	)

	const [studentId, amount, lessonsCount] = useWatch({
		control: form.control,
		name: ['studentId', 'amount', 'lessonsCount']
	})
	const lessonPrice = getLessonPrice(amount, lessonsCount)

	// Цена пакета у каждого ученика своя: подставляем условия последней
	// оплаты, пока пользователь не ввёл свои
	const lastPaymentQuery = usePayments(
		{ studentId, status: 'COMPLETED', limit: 1 },
		{ enabled: open && !isEdit && !!studentId }
	)
	// Пока идёт перезапрос, в кеше могут лежать условия до последнего
	// изменения оплаты — ждём свежие данные
	const lastPayment = lastPaymentQuery.isFetching
		? undefined
		: lastPaymentQuery.data?.items[0]
	const autofilledFor = useRef<string | null>(null)

	useEffect(() => {
		if (!open) {
			autofilledFor.current = null
			return
		}
		if (!lastPayment || lastPayment.student.id !== studentId) return
		if (autofilledFor.current === studentId) return

		autofilledFor.current = studentId

		if (!form.getFieldState('amount').isDirty) {
			form.setValue('amount', Number(lastPayment.amount))
		}
		if (
			!form.getFieldState('lessonsCount').isDirty &&
			lastPayment.lessonsCount
		) {
			form.setValue('lessonsCount', lastPayment.lessonsCount)
		}
		if (!form.getFieldState('method').isDirty) {
			form.setValue('method', lastPayment.method)
		}
	}, [open, lastPayment, studentId, form])

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen)

		if (!nextOpen) {
			mutation.reset()
			setFormError(null)
		}
	}

	function handleError(error: unknown) {
		const apiError = parseApiError(error)

		if (
			apiError.status === 400 &&
			hasMessage(apiError, 'Student not found')
		) {
			form.setError('studentId', { message: 'Ученик больше недоступен' })
			return
		}
		if (apiError.status === 400 && hasMessage(apiError, 'paidOn')) {
			form.setError('paidOn', { message: 'Дата не может быть в будущем' })
			return
		}
		if (apiError.status === 409 && hasMessage(apiError, 'used lessons')) {
			form.setError('lessonsCount', {
				message: 'Нельзя меньше, чем уже списано занятий'
			})
			return
		}
		if (apiError.status === 404 || apiError.status === 409) {
			setFormError(
				'Оплата изменилась или была отменена. Обновите страницу.'
			)
			return
		}

		setFormError(
			getCommonErrorMessage(apiError) ??
				(apiError.status === 400
					? 'Проверьте данные формы'
					: UNKNOWN_ERROR_MESSAGE)
		)
	}

	function handleValidSubmit(values: PaymentFormValues) {
		setFormError(null)

		const onSuccess = () => {
			toast.success(
				isEdit
					? 'Оплата изменена'
					: `Оплата внесена, начислено ${formatLessons(values.lessonsCount)}`
			)
			handleOpenChange(false)
		}

		if (payment) {
			updatePayment.mutate(
				{ id: payment.id, data: toUpdatePaymentRequest(values) },
				{ onSuccess, onError: handleError }
			)
		} else {
			createPayment.mutate(
				{ data: toCreatePaymentRequest(values) },
				{ onSuccess, onError: handleError }
			)
		}
	}

	const studentLocked = isEdit || !!fixedStudentId
	const lockedStudentName = payment
		? getStudentFullName(payment.student)
		: studentOptions.find(option => option.value === fixedStudentId)?.label

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
								<Wallet aria-hidden='true' />
							</div>
							<div className='flex min-w-0 flex-col gap-1'>
								<DialogTitle>
									{isEdit
										? 'Изменить оплату'
										: 'Внести оплату'}
								</DialogTitle>
								<DialogDescription>
									{isEdit
										? 'Исправьте сумму, количество занятий или детали оплаты.'
										: 'Укажите сумму и сколько занятий начислить ученику за неё.'}
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
										{studentLocked ? (
											<Input
												id={field.name}
												value={lockedStudentName ?? '…'}
												disabled
												className='h-10'
											/>
										) : (
											<Combobox<StudentOption>
												items={studentOptions}
												value={
													studentOptions.find(
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
																key={
																	option.value
																}
																value={option}
															>
																{option.label}
															</ComboboxItem>
														)}
													</ComboboxList>
												</ComboboxContent>
											</Combobox>
										)}
										{!isEdit && lastPayment ? (
											<FieldDescription>
												Подставлены условия последней
												оплаты от{' '}
												{formatDate(lastPayment.paidOn)}
											</FieldDescription>
										) : null}
										<FieldError
											errors={[fieldState.error]}
										/>
									</Field>
								)}
							/>

							<div className='grid gap-4 sm:grid-cols-2'>
								<Controller
									name='amount'
									control={form.control}
									render={({ field, fieldState }) => (
										<Field
											data-invalid={fieldState.invalid}
										>
											<FieldLabel htmlFor={field.name}>
												Сумма, ₽
											</FieldLabel>
											<NumberInput
												id={field.name}
												name={field.name}
												ref={field.ref}
												onBlur={field.onBlur}
												value={field.value}
												onChange={field.onChange}
												inputMode='decimal'
												min={0}
												step='0.01'
												placeholder='12000'
												aria-invalid={
													fieldState.invalid
												}
											/>
											<FieldError
												errors={[fieldState.error]}
											/>
										</Field>
									)}
								/>

								<Controller
									name='lessonsCount'
									control={form.control}
									render={({ field, fieldState }) => (
										<Field
											data-invalid={fieldState.invalid}
										>
											<FieldLabel htmlFor={field.name}>
												Количество занятий
											</FieldLabel>
											<NumberInput
												id={field.name}
												name={field.name}
												ref={field.ref}
												onBlur={field.onBlur}
												value={field.value}
												onChange={field.onChange}
												inputMode='numeric'
												min={1}
												step='1'
												placeholder='8'
												aria-invalid={
													fieldState.invalid
												}
											/>
											<FieldError
												errors={[fieldState.error]}
											/>
										</Field>
									)}
								/>
							</div>

							<p
								aria-live='polite'
								className='bg-muted -mt-2 rounded-md px-3 py-2 text-sm'
							>
								Цена занятия:{' '}
								<span className='font-semibold tabular-nums'>
									{lessonPrice === null
										? '—'
										: formatMoney(lessonPrice)}
								</span>
							</p>

							<div className='grid gap-4 sm:grid-cols-2'>
								<Controller
									name='paidOn'
									control={form.control}
									render={({ field, fieldState }) => (
										<Field
											data-invalid={fieldState.invalid}
										>
											<FieldLabel htmlFor={field.name}>
												Дата оплаты
											</FieldLabel>
											<Input
												{...field}
												id={field.name}
												type='date'
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
									name='method'
									control={form.control}
									render={({ field, fieldState }) => (
										<Field
											data-invalid={fieldState.invalid}
										>
											<FieldLabel htmlFor={field.name}>
												Способ оплаты
											</FieldLabel>
											<Select
												items={paymentMethodOptions}
												value={field.value ?? null}
												onValueChange={field.onChange}
											>
												<SelectTrigger
													id={field.name}
													aria-invalid={
														fieldState.invalid
													}
													className='h-10 w-full'
												>
													<SelectValue placeholder='Выберите способ' />
												</SelectTrigger>
												<SelectContent
													alignItemWithTrigger={false}
												>
													<SelectGroup>
														{paymentMethodOptions.map(
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

							<Controller
								name='comment'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Комментарий
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
						<Button type='submit' disabled={mutation.isPending}>
							{mutation.isPending
								? 'Сохранение…'
								: isEdit
									? 'Сохранить'
									: 'Внести оплату'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
