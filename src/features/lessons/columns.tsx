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
import { toSchoolTime } from '@/lib/school-time'

import {
	LESSON_STATUS_BADGE_VARIANTS,
	LESSON_STATUS_LABELS
} from './lesson-options'
import type { LessonResponse } from '@/api/generated/models'
import { getStudentFullName } from '@/features/students/format'

const columnHelper = createColumnHelper<DataTableFeatures, LessonResponse>()

export function getColumns({
	canManage,
	timezone,
	onCancel
}: {
	canManage: boolean
	timezone: string
	onCancel: (lesson: LessonResponse) => void
}) {
	return columnHelper.columns([
		columnHelper.accessor('startsAt', {
			header: ({ column }) => (
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
			),
			cell: ({ row }) => {
				const startsAt = toSchoolTime(row.original.startsAt, timezone)

				return (
					<div className='tabular-nums'>
						<span>{startsAt.format('DD.MM.YYYY')}</span>
						<span className='text-muted-foreground ml-2'>
							{startsAt.format('HH:mm')}
						</span>
					</div>
				)
			}
		}),
		columnHelper.accessor(
			lesson =>
				lesson.student ? getStudentFullName(lesson.student) : '',
			{
				id: 'student',
				header: 'Ученик',
				cell: ({ row, getValue }) => (
					<div className='max-w-64 min-w-40 whitespace-normal'>
						{row.original.student ? (
							<Link
								href={`/student/${row.original.student.id}`}
								className='font-medium hover:underline'
							>
								{getValue()}
							</Link>
						) : (
							'—'
						)}
						{row.original.topic ? (
							<p className='text-muted-foreground text-xs'>
								{row.original.topic}
							</p>
						) : null}
					</div>
				)
			}
		),
		columnHelper.accessor(lesson => lesson.teacher.fullName, {
			id: 'teacher',
			header: 'Преподаватель',
			cell: ({ row, getValue }) => (
				<Link
					href={`/teacher/${row.original.teacher.id}`}
					className='hover:underline'
				>
					{getValue()}
				</Link>
			)
		}),
		columnHelper.accessor('durationMin', {
			header: () => <div className='text-right'>Длительность</div>,
			cell: ({ row }) => (
				<div className='text-right tabular-nums'>
					{row.original.durationMin} мин
				</div>
			)
		}),
		columnHelper.accessor(lesson => Number(lesson.teacherPay ?? 0), {
			id: 'teacherPay',
			header: () => <div className='text-right'>Преподавателю</div>,
			cell: ({ row }) => {
				const { teacherPay, teacherRate, currency, status } =
					row.original

				return (
					<div className='text-right'>
						<div
							className={
								status === 'COMPLETED'
									? 'font-medium tabular-nums'
									: 'text-muted-foreground tabular-nums line-through'
							}
						>
							{teacherPay === null
								? '—'
								: formatMoney(teacherPay, currency)}
						</div>
						{teacherRate !== null ? (
							<p className='text-muted-foreground text-xs tabular-nums'>
								ставка {formatMoney(teacherRate, currency)}/ч
							</p>
						) : null}
					</div>
				)
			}
		}),
		columnHelper.accessor('status', {
			header: 'Статус',
			cell: ({ row }) => (
				<div className='max-w-48 whitespace-normal'>
					<Badge
						variant={
							LESSON_STATUS_BADGE_VARIANTS[row.original.status]
						}
					>
						{LESSON_STATUS_LABELS[row.original.status]}
					</Badge>
					{row.original.cancelReason ? (
						<p className='text-muted-foreground mt-1 text-xs'>
							{row.original.cancelReason}
						</p>
					) : null}
				</div>
			)
		}),
		columnHelper.display({
			id: 'actions',
			cell: ({ row }) => {
				const lesson = row.original
				const cancelable = canManage && lesson.status === 'COMPLETED'

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
						<DropdownMenuContent align='end' className='min-w-48'>
							<DropdownMenuLabel>Действия</DropdownMenuLabel>
							{lesson.student ? (
								<DropdownMenuItem
									render={
										<Link
											href={`/student/${lesson.student.id}`}
										/>
									}
								>
									Профиль ученика
								</DropdownMenuItem>
							) : null}
							<DropdownMenuItem
								render={
									<Link
										href={`/teacher/${lesson.teacher.id}`}
									/>
								}
							>
								Профиль преподавателя
							</DropdownMenuItem>
							{cancelable ? (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										variant='destructive'
										onClick={() => onCancel(lesson)}
									>
										Отменить занятие
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
