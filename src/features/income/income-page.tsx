'use client'

import { Plus, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import { DataTable } from '@/components/data-table'
import { Stat } from '@/components/profile/profile-cards'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

import { formatMoney } from '@/lib/format-money'

import { usePayments } from './api/use-payments'
import { CancelPaymentDialog } from './cancel-payment-dialog'
import { getColumns } from './columns'
import {
	type IncomeFilters,
	parseIncomeFilters,
	serializeIncomeFilters,
	toListPaymentsQuery
} from './income-filters'
import { PaymentFormDialog } from './payment-form-dialog'
import { paymentMethodOptions, paymentStatusOptions } from './payment-options'
import type { PaymentResponse } from '@/api/generated/models'
import { useCanManageFinance } from '@/features/auth/api/use-organization-role'
import { formatPeriod } from '@/features/expenses/expense-filters'
import { PeriodFilter } from '@/features/expenses/expenses-filters'

const ALL = 'all'

function OptionFilter<T extends string>({
	label,
	allLabel,
	options,
	value,
	onChange
}: {
	label: string
	allLabel: string
	options: { value: T; label: string }[]
	value: T | null
	onChange: (value: T | null) => void
}) {
	const items = [{ value: ALL, label: allLabel }, ...options]

	return (
		<Select
			items={items}
			value={value ?? ALL}
			onValueChange={next =>
				onChange(next === ALL || next === null ? null : (next as T))
			}
		>
			<SelectTrigger aria-label={label} className='w-40'>
				<SelectValue />
			</SelectTrigger>
			<SelectContent alignItemWithTrigger={false}>
				<SelectGroup>
					{items.map(option => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}

type DialogState =
	| { type: 'create' }
	| { type: 'edit'; payment: PaymentResponse }
	| { type: 'cancel'; payment: PaymentResponse }
	| null

export default function IncomePage() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const query = searchParams.toString()
	const filters = useMemo(
		() => parseIncomeFilters(new URLSearchParams(query)),
		[query]
	)
	const canManage = useCanManageFinance()
	const { data, isPending, isError } = usePayments(
		toListPaymentsQuery(filters)
	)
	const [dialog, setDialog] = useState<DialogState>(null)

	const columns = useMemo(
		() =>
			getColumns({
				canManage,
				onEdit: payment => setDialog({ type: 'edit', payment }),
				onCancel: payment => setDialog({ type: 'cancel', payment })
			}),
		[canManage]
	)

	function updateFilters(next: IncomeFilters) {
		const nextQuery = serializeIncomeFilters(next)
		router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
			scroll: false
		})
	}

	const summary = data?.summary
	const currency = data?.items[0]?.currency
	const averagePrice =
		summary && summary.lessonsCount
			? Number(summary.totalAmount) / summary.lessonsCount
			: null

	const emptyMessage = isPending
		? 'Загрузка оплат…'
		: isError
			? 'Не удалось загрузить оплаты.'
			: 'За выбранный период оплат нет.'

	function closeDialog(open: boolean) {
		if (!open) setDialog(null)
	}

	return (
		<div className='container mx-auto flex flex-col gap-6 py-10'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
				<div className='space-y-1'>
					<h1 className='text-2xl font-semibold'>Поступления</h1>
					<p className='text-muted-foreground text-sm'>
						Оплаты учеников и начисленные за них пакеты занятий.
					</p>
				</div>
				{canManage ? (
					<Button
						size='lg'
						onClick={() => setDialog({ type: 'create' })}
					>
						<Plus data-icon='inline-start' />
						Внести оплату
					</Button>
				) : null}
			</div>

			<div className='flex flex-wrap items-center gap-2'>
				<PeriodFilter
					from={filters.from}
					to={filters.to}
					onChange={period =>
						updateFilters({ ...filters, ...period })
					}
				/>
				<OptionFilter
					label='Способ оплаты'
					allLabel='Все способы'
					options={paymentMethodOptions}
					value={filters.method}
					onChange={method => updateFilters({ ...filters, method })}
				/>
				<OptionFilter
					label='Статус'
					allLabel='Все статусы'
					options={paymentStatusOptions}
					value={filters.status}
					onChange={status => updateFilters({ ...filters, status })}
				/>
				{query ? (
					<Button
						variant='ghost'
						onClick={() =>
							router.replace(pathname, { scroll: false })
						}
					>
						Сбросить
						<X data-icon='inline-end' />
					</Button>
				) : null}
			</div>

			<section
				aria-label={`Итоги · ${formatPeriod(filters.from, filters.to)}`}
				className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'
			>
				<Stat
					label='Поступило'
					value={
						summary
							? formatMoney(summary.totalAmount, currency)
							: '—'
					}
					tone='accent'
				/>
				<Stat
					label='Оплат'
					value={summary ? String(summary.paymentsCount) : '—'}
				/>
				<Stat
					label='Начислено занятий'
					value={summary ? String(summary.lessonsCount) : '—'}
				/>
				<Stat
					label='Средняя цена занятия'
					value={
						averagePrice === null
							? '—'
							: formatMoney(averagePrice, currency)
					}
				/>
			</section>

			<div>
				<DataTable
					columns={columns}
					data={data?.items ?? []}
					searchColumn='student'
					searchPlaceholder='Найти по ученику...'
					emptyMessage={emptyMessage}
				/>
				{data && data.total > data.items.length ? (
					<p className='text-muted-foreground text-sm'>
						Показаны последние {data.items.length} из {data.total}{' '}
						оплат. Сузьте период, чтобы увидеть остальные; итоги
						посчитаны по всем.
					</p>
				) : null}
			</div>

			{canManage ? (
				<PaymentFormDialog
					open={dialog?.type === 'create' || dialog?.type === 'edit'}
					onOpenChange={closeDialog}
					payment={
						dialog?.type === 'edit' ? dialog.payment : undefined
					}
				/>
			) : null}
			{dialog?.type === 'cancel' ? (
				<CancelPaymentDialog
					payment={dialog.payment}
					open
					onOpenChange={closeDialog}
				/>
			) : null}
		</div>
	)
}
