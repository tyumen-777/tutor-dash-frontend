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

import { formatHourlyRate, formatStartedOn } from './format'
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
		cell: ({ row }) => formatStartedOn(row.original.startedOn)
	}),
	columnHelper.accessor('isActive', {
		header: 'Статус',
		cell: ({ row }) =>
			row.original.isActive ? (
				<Badge variant='success'>Активен</Badge>
			) : (
				<Badge variant='outline'>Неактивен</Badge>
			)
	}),
	columnHelper.display({
		id: 'actions',
		cell: ({ row }) => {
			const teacher = row.original

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
								navigator.clipboard.writeText(teacher.id)
							}
						>
							Скопировать ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							render={<Link href={`/teacher/${teacher.id}`} />}
						>
							Открыть профиль
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	})
])
