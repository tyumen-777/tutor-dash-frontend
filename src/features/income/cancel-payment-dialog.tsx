'use client'

import { Ban } from 'lucide-react'
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

import { formatMoney } from '@/lib/format-money'

import { useCancelPayment } from './api/use-payment-mutations'
import { formatLessons } from './payment-options'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	hasMessage,
	parseApiError
} from '@/api/errors'
import type { PaymentResponse } from '@/api/generated/models'
import { getStudentFullName } from '@/features/students/format'

export function CancelPaymentDialog({
	payment,
	open,
	onOpenChange
}: {
	payment: PaymentResponse
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const cancelPayment = useCancelPayment()
	const apiError = cancelPayment.error
		? parseApiError(cancelPayment.error)
		: null

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen)

		if (!nextOpen) {
			cancelPayment.reset()
		}
	}

	function handleCancel() {
		cancelPayment.mutate(
			{ id: payment.id },
			{
				onSuccess: () => {
					toast.success('Оплата отменена')
					handleOpenChange(false)
				}
			}
		)
	}

	const errorMessage = !apiError
		? null
		: apiError.status === 409 && hasMessage(apiError, 'already been used')
			? 'Занятия из этого пакета уже списаны, отменить оплату нельзя.'
			: apiError.status === 409
				? 'Оплата уже отменена.'
				: (getCommonErrorMessage(apiError) ?? UNKNOWN_ERROR_MESSAGE)

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='sm:max-w-lg'>
				<DialogHeader className='pr-8'>
					<div className='flex items-start gap-3'>
						<div className='bg-destructive/10 text-destructive flex size-9 shrink-0 items-center justify-center rounded-lg'>
							<Ban aria-hidden='true' />
						</div>
						<div className='flex min-w-0 flex-col gap-1'>
							<DialogTitle>Отменить оплату?</DialogTitle>
							<DialogDescription>
								{getStudentFullName(payment.student)},{' '}
								{formatMoney(payment.amount, payment.currency)}
								{payment.lessonsCount
									? ` за ${formatLessons(payment.lessonsCount)}`
									: ''}
								. Оплата останется в истории со статусом
								«Отменена», а начисленные занятия спишутся с
								баланса ученика.
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

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
						Не отменять
					</Button>
					<Button
						type='button'
						variant='destructive'
						disabled={cancelPayment.isPending}
						onClick={handleCancel}
					>
						{cancelPayment.isPending
							? 'Отмена…'
							: 'Отменить оплату'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
