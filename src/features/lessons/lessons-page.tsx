'use client'

import { Plus, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import { DataTable } from '@/components/data-table'
import { Stat } from '@/components/profile/profile-cards'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

import { formatMoney } from '@/lib/format-money'

import { useLessons } from './api/use-lessons'
import { CancelLessonDialog } from './cancel-lesson-dialog'
import { getColumns } from './columns'
import {
	type LessonFilters,
	parseLessonFilters,
	serializeLessonFilters,
	toListLessonsQuery
} from './lesson-filters'
import { LessonFormDialog } from './lesson-form-dialog'
import { lessonStatusOptions } from './lesson-options'
import type { LessonResponse } from '@/api/generated/models'
import {
	useCanManageLessons,
	useSchoolTimezone
} from '@/features/auth/api/use-organization-role'
import { formatPeriod } from '@/features/expenses/expense-filters'
import { PeriodFilter } from '@/features/expenses/expenses-filters'
import { useTeachers } from '@/features/teachers/api/use-teachers'

const ALL = 'all'

function OptionFilter<T extends string>({
	label,
	allLabel,
	options,
	value,
	onChange,
	className = 'w-40'
}: {
	label: string
	allLabel: string
	options: { value: T; label: string }[]
	value: T | null
	onChange: (value: T | null) => void
	className?: string
}) {
	const items = [{ value: ALL, label: allLabel }, ...options]

	return (
		<Select
			items={items}
			value={value ?? ALL}
			onValueChange={next =>
				onChange(next === ALL || next === null ? null : (next as T))
			}
		>
			<SelectTrigger aria-label={label} className={className}>
				<SelectValue />
			</SelectTrigger>
			<SelectContent alignItemWithTrigger={false}>
				<SelectGroup>
					{items.map(option => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}

type DialogState =
	{ type: 'create' } | { type: 'cancel'; lesson: LessonResponse } | null

export default function LessonsPage() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const query = searchParams.toString()
	const filters = useMemo(
		() => parseLessonFilters(new URLSearchParams(query)),
		[query]
	)
	const canManage = useCanManageLessons()
	const timezone = useSchoolTimezone()
	const { data, isPending, isError } = useLessons(toListLessonsQuery(filters))
	const teachers = useTeachers('all')
	const teacherOptions = useMemo(
		() =>
			(teachers.data?.items ?? []).map(teacher => ({
				value: teacher.id,
				label: teacher.fullName
			})),
		[teachers.data]
	)
	const [dialog, setDialog] = useState<DialogState>(null)

	const columns = useMemo(
		() =>
			getColumns({
				canManage,
				timezone,
				onCancel: lesson => setDialog({ type: 'cancel', lesson })
			}),
		[canManage, timezone]
	)

	function updateFilters(next: LessonFilters) {
		const nextQuery = serializeLessonFilters(next)
		router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
			scroll: false
		})
	}

	const summary = data?.summary
	const currency = data?.items[0]?.currency

	const emptyMessage = isPending
		? 'Загрузка занятий…'
		: isError
			? 'Не удалось загрузить занятия.'
			: 'За выбранный период занятий нет.'

	function closeDialog(open: boolean) {
		if (!open) setDialog(null)
	}

	return (
		<div className='container mx-auto flex flex-col gap-6 py-10'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
				<div className='space-y-1'>
					<h1 className='text-2xl font-semibold'>Занятия</h1>
					<p className='text-muted-foreground text-sm'>
						Проведённые занятия: списания у учеников и начисления
						преподавателям.
					</p>
				</div>
				{canManage ? (
					<Button
						size='lg'
						onClick={() => setDialog({ type: 'create' })}
					>
						<Plus data-icon='inline-start' />
						Добавить занятие
					</Button>
				) : null}
			</div>

			<div className='flex flex-wrap items-center gap-2'>
				<PeriodFilter
					from={filters.from}
					to={filters.to}
					onChange={period =>
						updateFilters({ ...filters, ...period })
					}
				/>
				<OptionFilter
					label='Преподаватель'
					allLabel='Все преподаватели'
					options={teacherOptions}
					value={filters.teacherId}
					onChange={teacherId =>
						updateFilters({ ...filters, teacherId })
					}
					className='w-56'
				/>
				<OptionFilter
					label='Статус'
					allLabel='Все статусы'
					options={lessonStatusOptions}
					value={filters.status}
					onChange={status => updateFilters({ ...filters, status })}
				/>
				{query ? (
					<Button
						variant='ghost'
						onClick={() =>
							router.replace(pathname, { scroll: false })
						}
					>
						Сбросить
						<X data-icon='inline-end' />
					</Button>
				) : null}
			</div>

			<section
				aria-label={`Итоги · ${formatPeriod(filters.from, filters.to)}`}
				className='grid gap-3 sm:grid-cols-3'
			>
				<Stat
					label='Проведено занятий'
					value={summary ? String(summary.lessonsCount) : '—'}
				/>
				<Stat
					label='Начислено преподавателям'
					value={
						summary
							? formatMoney(summary.teacherPayTotal, currency)
							: '—'
					}
					tone='accent'
				/>
				<Stat
					label='Отменено'
					value={summary ? String(summary.canceledCount) : '—'}
				/>
			</section>

			<div>
				<DataTable
					columns={columns}
					data={data?.items ?? []}
					searchColumn='student'
					searchPlaceholder='Найти по ученику...'
					emptyMessage={emptyMessage}
				/>
				{data && data.total > data.items.length ? (
					<p className='text-muted-foreground text-sm'>
						Показаны последние {data.items.length} из {data.total}{' '}
						занятий. Сузьте период, чтобы увидеть остальные; итоги
						посчитаны по всем.
					</p>
				) : null}
			</div>

			{canManage ? (
				<LessonFormDialog
					open={dialog?.type === 'create'}
					onOpenChange={closeDialog}
				/>
			) : null}
			{dialog?.type === 'cancel' ? (
				<CancelLessonDialog
					lesson={dialog.lesson}
					open
					onOpenChange={closeDialog}
				/>
			) : null}
		</div>
	)
}
