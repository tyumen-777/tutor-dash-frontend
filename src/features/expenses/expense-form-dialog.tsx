'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { ReceiptText } from 'lucide-react'
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

import { useCreateExpense, useUpdateExpense } from './api/use-expense-mutations'
import {
	type ExpenseFormValues,
	expenseFormSchema,
	getCreateDefaultValues,
	getEditDefaultValues,
	toCreateExpenseRequest,
	toUpdateExpenseRequest
} from './expense-form-schema'
import { categoryOptions, editableStatusOptions } from './expense-options'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	hasMessage,
	parseApiError
} from '@/api/errors'
import type { ExpenseResponse } from '@/api/generated/models'
import { paymentMethodOptions } from '@/features/income/payment-options'
import { useTeachers } from '@/features/teachers/api/use-teachers'

type Option = { readonly label: string; readonly value: string }

function OptionsSelect({
	id,
	options,
	value,
	onValueChange,
	placeholder,
	invalid
}: {
	id: string
	options: readonly Option[]
	value: string | undefined
	onValueChange: (value: string | null) => void
	placeholder: string
	invalid: boolean
}) {
	return (
		<Select
			items={options}
			value={value ?? null}
			onValueChange={onValueChange}
		>
			<SelectTrigger
				id={id}
				aria-invalid={invalid}
				className='h-10 w-full'
			>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent alignItemWithTrigger={false}>
				<SelectGroup>
					{options.map(option => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}

/**
 * Creates an expense or edits an existing one when `expense` is passed.
 */
export function ExpenseFormDialog({
	open,
	onOpenChange,
	expense
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
	expense?: ExpenseResponse
}) {
	const isEdit = !!expense
	const defaultValues = useMemo(
		() =>
			expense ? getEditDefaultValues(expense) : getCreateDefaultValues(),
		[expense]
	)
	const form = useForm<ExpenseFormValues>({
		resolver: zodResolver(expenseFormSchema),
		defaultValues,
		reValidateMode: 'onChange'
	})
	const createExpense = useCreateExpense()
	const updateExpense = useUpdateExpense()
	const mutation = isEdit ? updateExpense : createExpense
	const [formError, setFormError] = useState<string | null>(null)

	// Пересобираем форму при каждом открытии: диалог переиспользуется
	// для разных расходов
	useEffect(() => {
		if (open) form.reset(defaultValues)
	}, [open, defaultValues, form])

	const category = useWatch({ control: form.control, name: 'category' })
	const teachers = useTeachers('active')
	const teacherOptions = useMemo<Option[]>(() => {
		const options = (teachers.data?.items ?? []).map(teacher => ({
			value: teacher.id,
			label: teacher.fullName
		}))
		const current = expense?.teacher

		// Преподаватель мог уйти в архив после выплаты
		if (current && !options.some(option => option.value === current.id)) {
			options.push({ value: current.id, label: current.fullName })
		}

		return options
	}, [teachers.data, expense])

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
			hasMessage(apiError, 'Teacher not found')
		) {
			form.setError('teacherId', {
				message: 'Преподаватель больше недоступен'
			})
			return
		}
		if (apiError.status === 400 && hasMessage(apiError, 'spentOn')) {
			form.setError('spentOn', {
				message: 'Дата не может быть в будущем'
			})
			return
		}
		if (apiError.status === 404 || apiError.status === 409) {
			setFormError('Расход изменился или был отменён. Обновите страницу.')
			return
		}

		setFormError(
			getCommonErrorMessage(apiError) ??
				(apiError.status === 400
					? 'Проверьте данные формы'
					: UNKNOWN_ERROR_MESSAGE)
		)
	}

	function handleValidSubmit(values: ExpenseFormValues) {
		setFormError(null)

		const onSuccess = () => {
			toast.success(isEdit ? 'Расход изменён' : 'Расход добавлен')
			handleOpenChange(false)
		}

		if (expense) {
			updateExpense.mutate(
				{ id: expense.id, data: toUpdateExpenseRequest(values) },
				{ onSuccess, onError: handleError }
			)
		} else {
			createExpense.mutate(
				{ data: toCreateExpenseRequest(values) },
				{ onSuccess, onError: handleError }
			)
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='max-h-[calc(100svh-2rem)] overflow-hidden sm:max-w-2xl'>
				<form
					className='flex min-h-0 flex-col gap-4'
					onSubmit={form.handleSubmit(handleValidSubmit)}
					noValidate
				>
					<DialogHeader className='pr-8'>
						<div className='flex items-start gap-3'>
							<div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
								<ReceiptText aria-hidden='true' />
							</div>
							<div className='flex min-w-0 flex-col gap-1'>
								<DialogTitle>
									{isEdit
										? 'Изменить расход'
										: 'Новый расход'}
								</DialogTitle>
								<DialogDescription>
									Укажите сумму, категорию и получателя
									платежа.
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>

					<div className='min-h-0 overflow-y-auto pr-1'>
						<FieldGroup>
							<FieldSet>
								<FieldLegend>Основное</FieldLegend>
								<div className='grid gap-4 sm:grid-cols-2'>
									<Controller
										name='spentOn'
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
													Дата
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
										name='amount'
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
													Сумма, ₽
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
													step='0.01'
													placeholder='15000'
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
										name='category'
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
													Категория
												</FieldLabel>
												<OptionsSelect
													id={field.name}
													options={categoryOptions}
													value={field.value}
													onValueChange={
														field.onChange
													}
													placeholder='Выберите категорию'
													invalid={fieldState.invalid}
												/>
												<FieldError
													errors={[fieldState.error]}
												/>
											</Field>
										)}
									/>

									{category === 'SALARY' ? (
										<Controller
											name='teacherId'
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
														Преподаватель
													</FieldLabel>
													<Combobox<Option>
														items={teacherOptions}
														value={
															teacherOptions.find(
																option =>
																	option.value ===
																	field.value
															) ?? null
														}
														onValueChange={option =>
															field.onChange(
																option?.value ??
																	''
															)
														}
														itemToStringValue={option =>
															option.value
														}
													>
														<ComboboxInput
															id={field.name}
															placeholder={
																teachers.isPending
																	? 'Загрузка…'
																	: 'Найти преподавателя'
															}
															aria-invalid={
																fieldState.invalid
															}
															className='h-10 w-full'
														/>
														<ComboboxContent>
															<ComboboxEmpty>
																Ничего не
																найдено
															</ComboboxEmpty>
															<ComboboxList>
																{(
																	option: Option
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
													<FieldDescription>
														Необязательно. Выплата
														появится в отчётах по
														преподавателю.
													</FieldDescription>
													<FieldError
														errors={[
															fieldState.error
														]}
													/>
												</Field>
											)}
										/>
									) : null}
								</div>
							</FieldSet>

							<FieldSet>
								<FieldLegend>Оплата</FieldLegend>
								<div className='grid gap-4 sm:grid-cols-2'>
									<Controller
										name='recipient'
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
													Получатель
												</FieldLabel>
												<Input
													{...field}
													id={field.name}
													placeholder='ООО «БизнесЦентр Плюс»'
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
										name='method'
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
													Способ оплаты
												</FieldLabel>
												<OptionsSelect
													id={field.name}
													options={
														paymentMethodOptions
													}
													value={field.value}
													onValueChange={
														field.onChange
													}
													placeholder='Выберите способ'
													invalid={fieldState.invalid}
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
												<OptionsSelect
													id={field.name}
													options={
														editableStatusOptions
													}
													value={field.value}
													onValueChange={
														field.onChange
													}
													placeholder='Выберите статус'
													invalid={fieldState.invalid}
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
								<FieldLegend>Детали</FieldLegend>
								<div className='grid gap-4'>
									<Controller
										name='description'
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
													Описание
												</FieldLabel>
												<Input
													{...field}
													id={field.name}
													placeholder='Аренда помещения за октябрь'
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
										name='comment'
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
													Комментарий
												</FieldLabel>
												<Textarea
													{...field}
													id={field.name}
													rows={3}
													placeholder='Необязательно'
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
							</FieldSet>
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
									: 'Добавить расход'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
