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

import {
	STUDENT_STATUS_BADGE_VARIANTS,
	STUDENT_STATUS_LABELS,
	formatAge,
	getAge,
	getStudentFullName
} from './format'
import type { StudentResponse } from '@/api/generated/models'

const columnHelper = createColumnHelper<DataTableFeatures, StudentResponse>()

export const columns = columnHelper.columns([
	columnHelper.accessor(getStudentFullName, {
		id: 'fullName',
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
		cell: ({ row, getValue }) => (
			<Link
				href={`/student/${row.original.id}`}
				className='font-medium hover:underline'
			>
				{getValue()}
			</Link>
		)
	}),
	columnHelper.accessor('birthDate', {
		header: 'Возраст',
		cell: ({ row }) => {
			const { birthDate } = row.original

			if (!birthDate) {
				return <span className='text-muted-foreground'>—</span>
			}

			return formatAge(getAge(birthDate))
		}
	}),
	columnHelper.accessor(student => student.teacher?.fullName ?? '', {
		id: 'teacher',
		header: 'Преподаватель',
		cell: ({ row }) => {
			const { teacher } = row.original

			if (!teacher) {
				return <span className='text-muted-foreground'>—</span>
			}

			return (
				<Link
					href={`/teacher/${teacher.id}`}
					className={
						teacher.isActive
							? 'hover:underline'
							: 'text-muted-foreground hover:underline'
					}
				>
					{teacher.fullName}
				</Link>
			)
		}
	}),
	columnHelper.accessor('level', {
		header: 'Уровень',
		cell: ({ row }) =>
			row.original.level ?? (
				<span className='text-muted-foreground'>—</span>
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
	columnHelper.accessor('status', {
		header: 'Статус',
		cell: ({ row }) => (
			<Badge variant={STUDENT_STATUS_BADGE_VARIANTS[row.original.status]}>
				{STUDENT_STATUS_LABELS[row.original.status]}
			</Badge>
		)
	}),
	columnHelper.display({
		id: 'actions',
		cell: ({ row }) => {
			const student = row.original

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
								navigator.clipboard.writeText(student.id)
							}
						>
							Скопировать ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							render={<Link href={`/student/${student.id}`} />}
						>
							Открыть профиль
						</DropdownMenuItem>
						<DropdownMenuItem>
							Запланировать занятие
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	})
])
