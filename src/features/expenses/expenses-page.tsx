'use client'

import { Plus } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import { DataTable } from '@/components/data-table'
import { Stat } from '@/components/profile/profile-cards'
import { Button } from '@/components/ui/button'

import { formatMoney } from '@/lib/format-money'

import { useExpenses } from './api/use-expenses'
import { CancelExpenseDialog } from './cancel-expense-dialog'
import { getColumns } from './columns'
import {
	type ExpenseFilters,
	formatPeriod,
	hasActiveFilters,
	parseExpenseFilters,
	serializeExpenseFilters,
	toListExpensesQuery
} from './expense-filters'
import { ExpenseFormDialog } from './expense-form-dialog'
import { ExpensesFilters } from './expenses-filters'
import type { ExpenseResponse } from '@/api/generated/models'
import { useCanManageExpenses } from '@/features/auth/api/use-organization-role'

type DialogState =
	| { type: 'create' }
	| { type: 'edit'; expense: ExpenseResponse }
	| { type: 'cancel'; expense: ExpenseResponse }
	| null

export default function ExpensesPage() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const query = searchParams.toString()
	const filters = useMemo(
		() => parseExpenseFilters(new URLSearchParams(query)),
		[query]
	)
	const canManage = useCanManageExpenses()
	const { data, isPending, isError } = useExpenses(
		toListExpensesQuery(filters)
	)
	const [dialog, setDialog] = useState<DialogState>(null)

	const columns = useMemo(
		() =>
			getColumns({
				canManage,
				onEdit: expense => setDialog({ type: 'edit', expense }),
				onCancel: expense => setDialog({ type: 'cancel', expense })
			}),
		[canManage]
	)

	function updateFilters(next: ExpenseFilters) {
		const nextQuery = serializeExpenseFilters(next)
		router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
			scroll: false
		})
	}

	const summary = data?.summary
	const currency = data?.items[0]?.currency

	const emptyMessage = isPending
		? 'Загрузка расходов…'
		: isError
			? 'Не удалось загрузить расходы.'
			: 'За выбранный период расходов нет.'

	function closeDialog(open: boolean) {
		if (!open) setDialog(null)
	}

	return (
		<div className='container mx-auto flex flex-col gap-6 py-10'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
				<div className='space-y-1'>
					<h1 className='text-2xl font-semibold'>Расходы</h1>
					<p className='text-muted-foreground text-sm'>
						Аренда, зарплаты, материалы и прочие траты школы.
					</p>
				</div>
				{canManage ? (
					<Button
						size='lg'
						onClick={() => setDialog({ type: 'create' })}
					>
						<Plus data-icon='inline-start' />
						Добавить расход
					</Button>
				) : null}
			</div>

			<ExpensesFilters
				filters={filters}
				onChange={updateFilters}
				onReset={() => router.replace(pathname, { scroll: false })}
				canReset={hasActiveFilters(filters)}
			/>

			<section
				aria-label={`Итоги · ${formatPeriod(filters.from, filters.to)}`}
				className='grid gap-3 sm:grid-cols-3'
			>
				<Stat
					label='Оплачено'
					value={
						summary
							? formatMoney(summary.paidAmount, currency)
							: '—'
					}
					tone='accent'
				/>
				<Stat
					label='Ожидает оплаты'
					value={
						summary
							? formatMoney(summary.pendingAmount, currency)
							: '—'
					}
				/>
				<Stat
					label='Расходов'
					value={summary ? String(summary.expensesCount) : '—'}
				/>
			</section>

			<div>
				<DataTable
					columns={columns}
					data={data?.items ?? []}
					searchColumn='description'
					searchPlaceholder='Найти по описанию...'
					emptyMessage={emptyMessage}
				/>
				{data && data.total > data.items.length ? (
					<p className='text-muted-foreground text-sm'>
						Показаны последние {data.items.length} из {data.total}{' '}
						расходов. Сузьте период, чтобы увидеть остальные; итоги
						посчитаны по всем.
					</p>
				) : null}
			</div>

			{canManage ? (
				<ExpenseFormDialog
					open={dialog?.type === 'create' || dialog?.type === 'edit'}
					onOpenChange={closeDialog}
					expense={
						dialog?.type === 'edit' ? dialog.expense : undefined
					}
				/>
			) : null}
			{dialog?.type === 'cancel' ? (
				<CancelExpenseDialog
					expense={dialog.expense}
					open
					onOpenChange={closeDialog}
				/>
			) : null}
		</div>
	)
}
