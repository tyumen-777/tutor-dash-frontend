'use client'

import { X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

import { useFinanceLogs } from './api/use-finance-logs'
import { getColumns } from './columns'
import {
	type HistoryAction,
	type HistoryFilters,
	actionOptions,
	parseHistoryFilters,
	serializeHistoryFilters,
	toListFinanceLogsQuery
} from './history-filters'
import { useSchoolTimezone } from '@/features/auth/api/use-organization-role'
import { PeriodFilter } from '@/features/expenses/expenses-filters'

const ALL_ACTIONS = 'all'

const actionFilterOptions = [
	{ label: 'Все действия', value: ALL_ACTIONS },
	...actionOptions
]

export default function FinanceHistoryPage() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const query = searchParams.toString()
	const filters = useMemo(
		() => parseHistoryFilters(new URLSearchParams(query)),
		[query]
	)
	const timezone = useSchoolTimezone()
	const { data, isPending, isError } = useFinanceLogs(
		toListFinanceLogsQuery(filters)
	)
	const columns = useMemo(() => getColumns(timezone), [timezone])

	function updateFilters(next: HistoryFilters) {
		const nextQuery = serializeHistoryFilters(next)
		router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
			scroll: false
		})
	}

	const canReset = serializeHistoryFilters(filters) !== ''
	const emptyMessage = isPending
		? 'Загрузка истории…'
		: isError
			? 'Не удалось загрузить историю операций.'
			: 'За выбранный период операций нет.'

	return (
		<div className='container mx-auto flex flex-col gap-6 py-10'>
			<div className='space-y-1'>
				<h1 className='text-2xl font-semibold'>История операций</h1>
				<p className='text-muted-foreground text-sm'>
					Кто и когда вносил, изменял и отменял оплаты учеников.
					Записи нельзя изменить или удалить.
				</p>
			</div>

			<div className='flex flex-wrap items-center gap-2'>
				<PeriodFilter
					from={filters.from}
					to={filters.to}
					onChange={period =>
						updateFilters({ ...filters, ...period })
					}
				/>
				<Select
					items={actionFilterOptions}
					value={filters.action ?? ALL_ACTIONS}
					onValueChange={value =>
						updateFilters({
							...filters,
							action:
								value === ALL_ACTIONS || value === null
									? null
									: (value as HistoryAction)
						})
					}
				>
					<SelectTrigger aria-label='Действие' className='w-44'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent alignItemWithTrigger={false}>
						<SelectGroup>
							{actionFilterOptions.map(option => (
								<SelectItem
									key={option.value}
									value={option.value}
								>
									{option.label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				{canReset ? (
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

			<div>
				<DataTable
					columns={columns}
					data={data?.items ?? []}
					searchColumn='description'
					searchPlaceholder='Найти по описанию...'
					emptyMessage={emptyMessage}
				/>
				{data && data.total > data.items.length ? (
					<p className='text-muted-foreground text-sm'>
						Показаны последние {data.items.length} из {data.total}{' '}
						операций. Сузьте период, чтобы увидеть остальные.
					</p>
				) : null}
			</div>
		</div>
	)
}
