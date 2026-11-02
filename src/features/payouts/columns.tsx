'use client'

import { createColumnHelper } from '@tanstack/react-table'
import { ArrowUpDown, HandCoins } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { type DataTableFeatures } from '@/lib/data-table-features'
import { formatMoney } from '@/lib/format-money'

import type { PayoutReportResponseTeachersItem } from '@/api/generated/models'

const columnHelper = createColumnHelper<
	DataTableFeatures,
	PayoutReportResponseTeachersItem
>()

function SortableHeader({
	label,
	onToggle
}: {
	label: string
	onToggle: () => void
}) {
	return (
		<div className='flex justify-end'>
			<Button variant='ghost' onClick={onToggle} className='-mr-2'>
				{label}
				<ArrowUpDown className='ml-2 h-4 w-4' />
			</Button>
		</div>
	)
}

export function getColumns({
	currency,
	canManage,
	onPay
}: {
	currency: string | undefined
	canManage: boolean
	onPay: (teacher: PayoutReportResponseTeachersItem) => void
}) {
	const moneyColumn = (
		key: 'accrued' | 'paid' | 'due' | 'dueBefore',
		label: string,
		highlight = false
	) =>
		columnHelper.accessor(row => Number(row[key]), {
			id: key,
			header: ({ column }) => (
				<SortableHeader
					label={label}
					onToggle={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
				/>
			),
			cell: ({ row }) => {
				const value = row.original[key]

				return (
					<div
						className={
							highlight && Number(value) > 0
								? 'text-right font-semibold tabular-nums'
								: 'text-muted-foreground text-right tabular-nums'
						}
					>
						{Number(value) > 0 ? formatMoney(value, currency) : '—'}
					</div>
				)
			}
		})

	return columnHelper.columns([
		columnHelper.accessor('fullName', {
			header: 'Преподаватель',
			cell: ({ row }) => (
				<div className='flex items-center gap-2'>
					<Link
						href={`/teacher/${row.original.id}`}
						className='font-medium hover:underline'
					>
						{row.original.fullName}
					</Link>
					{!row.original.isActive ? (
						<Badge variant='outline'>В архиве</Badge>
					) : null}
				</div>
			)
		}),
		columnHelper.accessor('lessonsCount', {
			header: () => <div className='text-right'>Занятий</div>,
			cell: ({ row }) => {
				const { lessonsCount, unpaidLessonsCount } = row.original

				return (
					<div className='text-right tabular-nums'>
						{lessonsCount}
						{unpaidLessonsCount > 0 &&
						unpaidLessonsCount < lessonsCount ? (
							<span className='text-muted-foreground'>
								{' '}
								· {unpaidLessonsCount} не выпл.
							</span>
						) : null}
					</div>
				)
			}
		}),
		moneyColumn('accrued', 'Начислено'),
		moneyColumn('paid', 'Выплачено'),
		moneyColumn('due', 'К выплате', true),
		moneyColumn('dueBefore', 'Долг до периода', true),
		columnHelper.display({
			id: 'actions',
			cell: ({ row }) =>
				canManage && Number(row.original.due) > 0 ? (
					<div className='flex justify-end'>
						<Button
							size='sm'
							variant='outline'
							onClick={() => onPay(row.original)}
						>
							<HandCoins data-icon='inline-start' />
							Выплатить
						</Button>
					</div>
				) : null
		})
	])
}
