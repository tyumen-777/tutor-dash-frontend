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

import { useCancelExpense } from './api/use-expense-mutations'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	parseApiError
} from '@/api/errors'
import type { ExpenseResponse } from '@/api/generated/models'

export function CancelExpenseDialog({
	expense,
	open,
	onOpenChange
}: {
	expense: ExpenseResponse
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const cancelExpense = useCancelExpense()
	const apiError = cancelExpense.error
		? parseApiError(cancelExpense.error)
		: null

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen)

		if (!nextOpen) {
			cancelExpense.reset()
		}
	}

	function handleCancel() {
		cancelExpense.mutate(
			{ id: expense.id },
			{
				onSuccess: () => {
					toast.success('Расход отменён')
					handleOpenChange(false)
				}
			}
		)
	}

	const errorMessage = !apiError
		? null
		: apiError.status === 409
			? 'Расход уже отменён.'
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
							<DialogTitle>Отменить расход?</DialogTitle>
							<DialogDescription>
								{expense.description},{' '}
								{formatMoney(expense.amount, expense.currency)}.
								Расход останется в истории со статусом «Отменён»
								и перестанет учитываться в итогах.
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
						disabled={cancelExpense.isPending}
						onClick={handleCancel}
					>
						{cancelExpense.isPending
							? 'Отмена…'
							: 'Отменить расход'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
