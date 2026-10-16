'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { Plus, ReceiptText } from 'lucide-react'
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
	type ExpenseFormValues,
	categoryOptions,
	expenseFormSchema,
	paymentMethodOptions,
	statusOptions
} from './expense-form-schema'

type Option = { readonly label: string; readonly value: string }

function getDefaultValues(): Partial<ExpenseFormValues> {
	return {
		date: dayjs().format('YYYY-MM-DD'),
		amount: undefined,
		category: undefined,
		recipient: '',
		paymentMethod: undefined,
		status: 'paid',
		description: '',
		comment: ''
	}
}

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

export function ExpenseFormDialog({
	onCreate
}: {
	onCreate: (values: ExpenseFormValues) => void
}) {
	const [open, setOpen] = useState(false)
	const form = useForm<ExpenseFormValues>({
		resolver: zodResolver(expenseFormSchema),
		defaultValues: getDefaultValues(),
		reValidateMode: 'onChange'
	})

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen)

		if (!nextOpen) {
			form.reset(getDefaultValues())
		}
	}

	function handleValidSubmit(values: ExpenseFormValues) {
		onCreate(values)
		form.reset(getDefaultValues())
		setOpen(false)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger render={<Button size='lg' />}>
				<Plus data-icon='inline-start' />
				Добавить расход
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
								<ReceiptText aria-hidden='true' />
							</div>
							<div className='flex min-w-0 flex-col gap-1'>
								<DialogTitle>Новый расход</DialogTitle>
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
										name='date'
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
										name='paymentMethod'
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
													options={statusOptions}
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
												<textarea
													{...field}
													id={field.name}
													rows={3}
													placeholder='Необязательно'
													aria-invalid={
														fieldState.invalid
													}
													className='border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 w-full min-w-0 resize-none rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors outline-none focus-visible:ring-3 aria-invalid:ring-3 md:text-sm'
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
						<Button type='submit'>Добавить расход</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
