'use client'

import { createColumnHelper } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { type DataTableFeatures } from '@/lib/data-table-features'
import { formatMoney } from '@/lib/format-money'

import {
	EXPENSE_CATEGORY_LABELS,
	EXPENSE_STATUS_BADGE_VARIANTS,
	EXPENSE_STATUS_LABELS
} from './expense-options'
import { formatDate } from './format'
import type { ExpenseResponse } from '@/api/generated/models'
import { PAYMENT_METHOD_LABELS } from '@/features/income/payment-options'

const columnHelper = createColumnHelper<DataTableFeatures, ExpenseResponse>()

function SortableHeader({
	label,
	onToggle,
	align = 'start'
}: {
	label: string
	onToggle: () => void
	align?: 'start' | 'end'
}) {
	return (
		<div className={align === 'end' ? 'flex justify-end' : undefined}>
			<Button
				variant='ghost'
				onClick={onToggle}
				className={align === 'end' ? '-mr-2' : '-ml-2'}
			>
				{label}
				<ArrowUpDown className='ml-2 h-4 w-4' />
			</Button>
		</div>
	)
}

export function getColumns({
	canManage,
	onEdit,
	onCancel
}: {
	canManage: boolean
	onEdit: (expense: ExpenseResponse) => void
	onCancel: (expense: ExpenseResponse) => void
}) {
	return columnHelper.columns([
		columnHelper.accessor('spentOn', {
			header: ({ column }) => (
				<SortableHeader
					label='Дата'
					onToggle={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
				/>
			),
			cell: ({ row }) => (
				<span className='tabular-nums'>
					{formatDate(row.original.spentOn)}
				</span>
			)
		}),
		columnHelper.accessor('category', {
			header: 'Категория',
			cell: ({ row }) => (
				<Badge variant='outline'>
					{EXPENSE_CATEGORY_LABELS[row.original.category]}
				</Badge>
			)
		}),
		columnHelper.accessor('description', {
			header: 'Описание',
			cell: ({ row }) => (
				<div className='max-w-72 min-w-48 whitespace-normal'>
					<p>{row.original.description}</p>
					{row.original.comment ? (
						<p className='text-muted-foreground text-xs'>
							{row.original.comment}
						</p>
					) : null}
				</div>
			)
		}),
		columnHelper.accessor('recipient', {
			header: 'Получатель',
			cell: ({ row }) =>
				row.original.teacher ? (
					<Link
						href={`/teacher/${row.original.teacher.id}`}
						className='hover:underline'
					>
						{row.original.recipient}
					</Link>
				) : (
					row.original.recipient
				)
		}),
		columnHelper.accessor('method', {
			header: 'Способ оплаты',
			cell: ({ row }) => PAYMENT_METHOD_LABELS[row.original.method]
		}),
		columnHelper.accessor(expense => Number(expense.amount), {
			id: 'amount',
			header: ({ column }) => (
				<SortableHeader
					label='Сумма'
					align='end'
					onToggle={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
				/>
			),
			cell: ({ row }) => (
				<div
					className={
						row.original.status === 'CANCELED'
							? 'text-muted-foreground text-right tabular-nums line-through'
							: 'text-right font-medium tabular-nums'
					}
				>
					{formatMoney(row.original.amount, row.original.currency)}
				</div>
			)
		}),
		columnHelper.accessor('status', {
			header: 'Статус',
			cell: ({ row }) => (
				<Badge
					variant={EXPENSE_STATUS_BADGE_VARIANTS[row.original.status]}
				>
					{EXPENSE_STATUS_LABELS[row.original.status]}
				</Badge>
			)
		}),
		columnHelper.display({
			id: 'actions',
			cell: ({ row }) => {
				const expense = row.original
				const editable = canManage && expense.status !== 'CANCELED'

				return (
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant='ghost'
									className='h-8 w-8 p-0'
								/>
							}
						>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal className='h-4 w-4' />
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='min-w-44'>
							<DropdownMenuLabel>Действия</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() =>
									navigator.clipboard.writeText(expense.id)
								}
							>
								Скопировать ID
							</DropdownMenuItem>
							{editable ? (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => onEdit(expense)}
									>
										Изменить
									</DropdownMenuItem>
									<DropdownMenuItem
										variant='destructive'
										onClick={() => onCancel(expense)}
									>
										Отменить расход
									</DropdownMenuItem>
								</>
							) : null}
						</DropdownMenuContent>
					</DropdownMenu>
				)
			}
		})
	])
}
