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
	PAYMENT_METHOD_LABELS,
	PAYMENT_STATUS_BADGE_VARIANTS,
	PAYMENT_STATUS_LABELS,
	getLessonPrice
} from './payment-options'
import type { PaymentResponse } from '@/api/generated/models'
import { formatDate } from '@/features/expenses/format'
import { getStudentFullName } from '@/features/students/format'

const columnHelper = createColumnHelper<DataTableFeatures, PaymentResponse>()

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
	onEdit: (payment: PaymentResponse) => void
	onCancel: (payment: PaymentResponse) => void
}) {
	return columnHelper.columns([
		columnHelper.accessor('paidOn', {
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
					{formatDate(row.original.paidOn)}
				</span>
			)
		}),
		columnHelper.accessor(payment => getStudentFullName(payment.student), {
			id: 'student',
			header: 'Ученик',
			cell: ({ row, getValue }) => (
				<div className='max-w-64 min-w-40 whitespace-normal'>
					<Link
						href={`/student/${row.original.student.id}`}
						className='font-medium hover:underline'
					>
						{getValue()}
					</Link>
					{row.original.comment ? (
						<p className='text-muted-foreground text-xs'>
							{row.original.comment}
						</p>
					) : null}
				</div>
			)
		}),
		columnHelper.accessor(payment => Number(payment.amount), {
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
						row.original.status === 'COMPLETED'
							? 'text-right font-medium tabular-nums'
							: 'text-muted-foreground text-right tabular-nums line-through'
					}
				>
					{formatMoney(row.original.amount, row.original.currency)}
				</div>
			)
		}),
		columnHelper.accessor('lessonsCount', {
			header: () => <div className='text-right'>Занятий</div>,
			cell: ({ row }) => (
				<div className='text-right tabular-nums'>
					{row.original.lessonsCount ?? '—'}
				</div>
			)
		}),
		columnHelper.display({
			id: 'lessonPrice',
			header: () => <div className='text-right'>Цена занятия</div>,
			cell: ({ row }) => {
				const price = getLessonPrice(
					row.original.amount,
					row.original.lessonsCount
				)

				return (
					<div className='text-muted-foreground text-right tabular-nums'>
						{price === null
							? '—'
							: formatMoney(price, row.original.currency)}
					</div>
				)
			}
		}),
		columnHelper.accessor('method', {
			header: 'Способ',
			cell: ({ row }) => PAYMENT_METHOD_LABELS[row.original.method]
		}),
		columnHelper.accessor('status', {
			header: 'Статус',
			cell: ({ row }) => (
				<Badge
					variant={PAYMENT_STATUS_BADGE_VARIANTS[row.original.status]}
				>
					{PAYMENT_STATUS_LABELS[row.original.status]}
				</Badge>
			)
		}),
		columnHelper.accessor(payment => payment.createdBy.name, {
			id: 'createdBy',
			header: 'Внёс',
			cell: ({ getValue }) => (
				<span className='text-muted-foreground'>{getValue()}</span>
			)
		}),
		columnHelper.display({
			id: 'actions',
			cell: ({ row }) => {
				const payment = row.original
				const editable = canManage && payment.status === 'COMPLETED'

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
								render={
									<Link
										href={`/student/${payment.student.id}`}
									/>
								}
							>
								Профиль ученика
							</DropdownMenuItem>
							{editable ? (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => onEdit(payment)}
									>
										Изменить
									</DropdownMenuItem>
									<DropdownMenuItem
										variant='destructive'
										onClick={() => onCancel(payment)}
									>
										Отменить оплату
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
