'use client'

import { createColumnHelper } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { type DataTableFeatures } from '@/lib/data-table-features'

import {
	type Expense,
	categoryOptions,
	getOptionLabel,
	paymentMethodOptions,
	statusOptions
} from './expense-form-schema'
import { formatCurrency, formatDate } from './format'

const columnHelper = createColumnHelper<DataTableFeatures, Expense>()

export const columns = columnHelper.columns([
	columnHelper.accessor('date', {
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='-ml-2'
				>
					Дата
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		},
		cell: ({ row }) => (
			<span className='tabular-nums'>
				{formatDate(row.original.date)}
			</span>
		)
	}),
	columnHelper.accessor('category', {
		header: 'Категория',
		cell: ({ row }) => (
			<Badge variant='outline'>
				{getOptionLabel(categoryOptions, row.original.category)}
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
		header: 'Получатель'
	}),
	columnHelper.accessor('paymentMethod', {
		header: 'Способ оплаты',
		cell: ({ row }) =>
			getOptionLabel(paymentMethodOptions, row.original.paymentMethod)
	}),
	columnHelper.accessor('amount', {
		header: ({ column }) => {
			return (
				<div className='flex justify-end'>
					<Button
						variant='ghost'
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === 'asc')
						}
						className='-mr-2'
					>
						Сумма
						<ArrowUpDown className='ml-2 h-4 w-4' />
					</Button>
				</div>
			)
		},
		cell: ({ row }) => (
			<div className='text-right font-medium tabular-nums'>
				{formatCurrency(row.original.amount)}
			</div>
		)
	}),
	columnHelper.accessor('status', {
		header: 'Статус',
		cell: ({ row }) => (
			<Badge
				variant={row.original.status === 'paid' ? 'success' : 'warning'}
			>
				{getOptionLabel(statusOptions, row.original.status)}
			</Badge>
		)
	}),
	columnHelper.display({
		id: 'actions',
		cell: ({ row }) => {
			const expense = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button variant='ghost' className='h-8 w-8 p-0' />
						}
					>
						<span className='sr-only'>Open menu</span>
						<MoreHorizontal className='h-4 w-4' />
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Действия</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(expense.id)
							}
						>
							Скопировать ID
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	})
])
