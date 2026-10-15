'use client'

import { createColumnHelper } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { type DataTableFeatures } from './data-table-features'

export type Student = {
	id: string
	fullName: string
	age: number
	teacher: string
	level: 'Beginner' | 'Elementary' | 'Pre-Intermediate' | 'Intermediate'
}

const columnHelper = createColumnHelper<DataTableFeatures, Student>()

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
		}
	}),
	columnHelper.accessor('age', {
		header: 'Возраст',
		cell: ({ row }) => <span>{row.getValue('age')} лет</span>
	}),
	columnHelper.accessor('teacher', {
		header: 'Преподаватель'
	}),
	columnHelper.accessor('level', {
		header: 'Уровень'
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
