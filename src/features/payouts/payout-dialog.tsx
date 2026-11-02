'use client'

import dayjs from 'dayjs'
import { HandCoins } from 'lucide-react'
import { useState } from 'react'
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
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
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

import { useCreatePayout } from './api/use-payouts'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	hasMessage,
	parseApiError
} from '@/api/errors'
import type {
	CreatePayoutRequestMethod,
	PayoutReportResponseTeachersItem
} from '@/api/generated/models'
import { formatPeriod } from '@/features/expenses/expense-filters'
import { paymentMethodOptions } from '@/features/income/payment-options'
import { pluralize } from '@/features/main/format'

/**
 * Pays the teacher for every unpaid held lesson of the period. The amount
 * is not editable: the backend sums the lessons' pay.
 */
export function PayoutDialog({
	teacher,
	period,
	currency,
	open,
	onOpenChange
}: {
	teacher: PayoutReportResponseTeachersItem
	period: { from: string; to: string }
	currency: string | undefined
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const today = dayjs().format('YYYY-MM-DD')
	const [paidOn, setPaidOn] = useState(today)
	const [method, setMethod] = useState<CreatePayoutRequestMethod>('TRANSFER')
	const [comment, setComment] = useState('')
	const [dateError, setDateError] = useState<string | null>(null)
	const [formError, setFormError] = useState<string | null>(null)
	const createPayout = useCreatePayout()

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen)

		if (!nextOpen) {
			createPayout.reset()
		}
	}

	function handleError(error: unknown) {
		const apiError = parseApiError(error)

		if (apiError.status === 400 && hasMessage(apiError, 'paidOn')) {
			setDateError('Дата не может быть в будущем')
			return
		}
		if (apiError.status === 409) {
			setFormError(
				'Занятия периода уже выплачены или изменились. Обновите страницу.'
			)
			return
		}

		setFormError(getCommonErrorMessage(apiError) ?? UNKNOWN_ERROR_MESSAGE)
	}

	function handleSubmit(event: React.FormEvent) {
		event.preventDefault()
		setDateError(null)
		setFormError(null)

		if (!paidOn) {
			setDateError('Укажите дату')
			return
		}

		createPayout.mutate(
			{
				data: {
					teacherId: teacher.id,
					...period,
					paidOn,
					method,
					comment: comment.trim() || undefined
				}
			},
			{
				onSuccess: expense => {
					toast.success(
						`Выплата ${formatMoney(expense.amount, expense.currency)} внесена в расходы`
					)
					handleOpenChange(false)
				},
				onError: handleError
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='sm:max-w-lg'>
				<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
					<DialogHeader className='pr-8'>
						<div className='flex items-start gap-3'>
							<div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
								<HandCoins aria-hidden='true' />
							</div>
							<div className='flex min-w-0 flex-col gap-1'>
								<DialogTitle>
									Выплата · {teacher.fullName}
								</DialogTitle>
								<DialogDescription>
									{formatPeriod(period.from, period.to)}:{' '}
									{pluralize(teacher.unpaidLessonsCount, {
										one: 'невыплаченное занятие',
										few: 'невыплаченных занятия',
										many: 'невыплаченных занятий'
									})}
									. Выплата появится в расходах как зарплата,
									а занятия будут отмечены выплаченными.
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>

					<div className='bg-muted/50 rounded-lg border px-4 py-3'>
						<p className='text-muted-foreground text-xs'>
							К выплате
						</p>
						<p className='text-2xl font-semibold tabular-nums'>
							{formatMoney(teacher.due, currency)}
						</p>
						{Number(teacher.dueBefore) > 0 ? (
							<p className='text-muted-foreground mt-1 text-sm'>
								Ещё {formatMoney(teacher.dueBefore, currency)}{' '}
								не выплачено за занятия до периода — чтобы
								включить их, расширьте период.
							</p>
						) : null}
					</div>

					<div className='grid gap-4 sm:grid-cols-2'>
						<Field data-invalid={!!dateError}>
							<FieldLabel htmlFor='payout-paid-on'>
								Дата выплаты
							</FieldLabel>
							<Input
								id='payout-paid-on'
								type='date'
								value={paidOn}
								max={today}
								onChange={event =>
									setPaidOn(event.target.value)
								}
								aria-invalid={!!dateError}
								className='h-10'
							/>
							<FieldError
								errors={
									dateError ? [{ message: dateError }] : []
								}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor='payout-method'>
								Способ оплаты
							</FieldLabel>
							<Select
								items={paymentMethodOptions}
								value={method}
								onValueChange={value => {
									if (value) setMethod(value)
								}}
							>
								<SelectTrigger
									id='payout-method'
									className='h-10 w-full'
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent alignItemWithTrigger={false}>
									<SelectGroup>
										{paymentMethodOptions.map(option => (
											<SelectItem
												key={option.value}
												value={option.value}
											>
												{option.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</Field>
						<Field className='sm:col-span-2'>
							<FieldLabel htmlFor='payout-comment'>
								Комментарий
							</FieldLabel>
							<Textarea
								id='payout-comment'
								rows={2}
								maxLength={500}
								placeholder='Необязательно'
								value={comment}
								onChange={event =>
									setComment(event.target.value)
								}
							/>
						</Field>
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
						<Button type='submit' disabled={createPayout.isPending}>
							{createPayout.isPending
								? 'Сохранение…'
								: `Выплатить ${formatMoney(teacher.due, currency)}`}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
