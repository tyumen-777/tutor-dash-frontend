'use client'

import { createColumnHelper } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { type DataTableFeatures } from '@/lib/data-table-features'

import { formatDate, formatHourlyRate } from './format'
import { TeacherActions } from './teacher-actions'
import type { TeacherResponse } from '@/api/generated/models'

const columnHelper = createColumnHelper<DataTableFeatures, TeacherResponse>()

export const columns = columnHelper.columns([
	columnHelper.accessor('fullName', {
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className='-ml-2'
				>
					ФИО
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		},
		cell: ({ row }) => (
			<Link
				href={`/teacher/${row.original.id}`}
				className='font-medium hover:underline'
			>
				{row.original.fullName}
			</Link>
		)
	}),
	columnHelper.display({
		id: 'contacts',
		header: 'Контакты',
		cell: ({ row }) => {
			const { phone, email, telegram } = row.original
			const contacts = [phone, email, telegram && `@${telegram}`].filter(
				Boolean
			)

			if (!contacts.length) {
				return <span className='text-muted-foreground'>—</span>
			}

			return (
				<div className='flex flex-col'>
					{contacts.map(contact => (
						<span key={contact}>{contact}</span>
					))}
				</div>
			)
		}
	}),
	columnHelper.accessor('hourlyRate', {
		header: 'Ставка',
		cell: ({ row }) => formatHourlyRate(row.original.hourlyRate)
	}),
	columnHelper.accessor('startedOn', {
		header: 'Работает с',
		cell: ({ row }) => formatDate(row.original.startedOn)
	}),
	columnHelper.accessor('isActive', {
		header: 'Статус',
		cell: ({ row }) => {
			const { isActive, endedOn } = row.original

			if (isActive) return <Badge variant='success'>Активен</Badge>

			return (
				<Badge variant='outline'>
					{endedOn ? `Уволен ${formatDate(endedOn)}` : 'В архиве'}
				</Badge>
			)
		}
	}),
	columnHelper.display({
		id: 'actions',
		cell: ({ row }) => (
			<TeacherActions teacher={row.original} variant='row' />
		)
	})
])
