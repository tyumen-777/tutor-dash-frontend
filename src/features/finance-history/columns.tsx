'use client'

import { createColumnHelper } from '@tanstack/react-table'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'

import { type DataTableFeatures } from '@/lib/data-table-features'
import { toSchoolTime } from '@/lib/school-time'

import { ACTION_BADGE_VARIANTS, getActionLabel } from './history-filters'
import type { FinanceLogResponse } from '@/api/generated/models'

const columnHelper = createColumnHelper<DataTableFeatures, FinanceLogResponse>()

export function getColumns(timezone: string) {
	return columnHelper.columns([
		columnHelper.accessor('createdAt', {
			header: 'Дата',
			cell: ({ row }) => {
				const at = toSchoolTime(row.original.createdAt, timezone)

				return (
					<div className='whitespace-nowrap tabular-nums'>
						<p>{at.format('DD.MM.YYYY')}</p>
						<p className='text-muted-foreground text-xs'>
							{at.format('HH:mm')}
						</p>
					</div>
				)
			}
		}),
		columnHelper.accessor(log => log.actor.name, {
			id: 'actor',
			header: 'Сотрудник',
			cell: ({ row }) => (
				<span className='whitespace-nowrap'>
					{row.original.actor.name}
				</span>
			)
		}),
		columnHelper.accessor('action', {
			header: 'Действие',
			cell: ({ row }) => (
				<Badge variant={ACTION_BADGE_VARIANTS[row.original.action]}>
					{getActionLabel(
						row.original.action,
						row.original.entityType
					)}
				</Badge>
			)
		}),
		columnHelper.accessor('description', {
			header: 'Описание',
			cell: ({ row }) => {
				const { student, teacher } = row.original

				return (
					<div className='max-w-xl min-w-64 whitespace-normal'>
						<p>{row.original.description}</p>
						{student ? (
							<Link
								href={`/student/${student.id}`}
								className='text-muted-foreground text-xs hover:underline'
							>
								Профиль ученика
							</Link>
						) : null}
						{teacher ? (
							<Link
								href={`/teacher/${teacher.id}`}
								className='text-muted-foreground text-xs hover:underline'
							>
								Профиль преподавателя
							</Link>
						) : null}
					</div>
				)
			}
		})
	])
}
