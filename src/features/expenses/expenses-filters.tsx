'use client'

import dayjs from 'dayjs'
import { CalendarDays, ChevronDown, Tags, X } from 'lucide-react'
import { useState } from 'react'
import { type DateRange } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

import {
	type ExpenseCategory,
	type ExpenseFilters,
	type ExpenseStatus,
	formatPeriod,
	getPresetRange,
	periodPresets,
	toDateString
} from './expense-filters'
import { categoryOptions, statusOptions } from './expense-options'

const ALL_STATUSES = 'all'

const statusFilterOptions = [
	{ label: 'Все статусы', value: ALL_STATUSES },
	...statusOptions
]

interface ExpensesFiltersProps {
	filters: ExpenseFilters
	onChange: (filters: ExpenseFilters) => void
	onReset: () => void
	canReset: boolean
}

export function PeriodFilter({
	from,
	to,
	onChange
}: {
	from: string
	to: string
	onChange: (period: { from: string; to: string }) => void
}) {
	const [month, setMonth] = useState(() => dayjs(from).toDate())
	// Начало нового диапазона: пока выбран только первый день,
	// период в URL не меняется
	const [draftStart, setDraftStart] = useState<Date | null>(null)

	const selected: DateRange = draftStart
		? { from: draftStart, to: undefined }
		: { from: dayjs(from).toDate(), to: dayjs(to).toDate() }

	function handleSelect(_range: DateRange | undefined, day: Date) {
		if (!draftStart) {
			setDraftStart(day)
			return
		}

		const [start, end] =
			day < draftStart ? [day, draftStart] : [draftStart, day]
		onChange({
			from: toDateString(dayjs(start)),
			to: toDateString(dayjs(end))
		})
		setDraftStart(null)
	}

	return (
		<Popover
			onOpenChange={open => {
				setDraftStart(null)
				if (open) setMonth(dayjs(from).toDate())
			}}
		>
			<PopoverTrigger
				render={
					<Button
						variant='outline'
						className='h-8 justify-start font-normal'
					/>
				}
			>
				<CalendarDays data-icon='inline-start' />
				{formatPeriod(from, to)}
				<ChevronDown data-icon='inline-end' className='opacity-50' />
			</PopoverTrigger>
			<PopoverContent align='start' className='w-auto p-0'>
				<div className='flex flex-col sm:flex-row'>
					<div className='flex flex-wrap gap-1 border-b p-2 sm:w-40 sm:flex-col sm:border-r sm:border-b-0'>
						{periodPresets.map(preset => {
							const range = getPresetRange(preset)
							const isActive =
								range.from === from && range.to === to

							return (
								<Button
									key={preset.label}
									variant={isActive ? 'secondary' : 'ghost'}
									size='sm'
									className='justify-start'
									onClick={() => {
										onChange(range)
										setDraftStart(null)
										setMonth(dayjs(range.from).toDate())
									}}
								>
									{preset.label}
								</Button>
							)
						})}
					</div>
					<Calendar
						mode='range'
						locale={ru}
						selected={selected}
						onSelect={handleSelect}
						month={month}
						onMonthChange={setMonth}
						disabled={{ after: new Date() }}
					/>
				</div>
			</PopoverContent>
		</Popover>
	)
}

function CategoryFilter({
	value,
	onChange
}: {
	value: ExpenseCategory[]
	onChange: (categories: ExpenseCategory[]) => void
}) {
	function toggle(category: ExpenseCategory, checked: boolean) {
		onChange(
			checked
				? [...value, category]
				: value.filter(item => item !== category)
		)
	}

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						variant='outline'
						className='h-8 justify-start font-normal'
					/>
				}
			>
				<Tags data-icon='inline-start' />
				Статья расходов
				{value.length ? (
					<Badge variant='secondary' className='ml-1'>
						{value.length}
					</Badge>
				) : null}
				<ChevronDown data-icon='inline-end' className='opacity-50' />
			</PopoverTrigger>
			<PopoverContent align='start' className='w-64 gap-1 p-1'>
				{categoryOptions.map(option => (
					<label
						key={option.value}
						className='hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5'
					>
						<Checkbox
							checked={value.includes(option.value)}
							onCheckedChange={checked =>
								toggle(option.value, checked)
							}
						/>
						{option.label}
					</label>
				))}
				{value.length ? (
					<Button
						variant='ghost'
						size='sm'
						className='mt-1 justify-center'
						onClick={() => onChange([])}
					>
						Очистить
					</Button>
				) : null}
			</PopoverContent>
		</Popover>
	)
}

export function ExpensesFilters({
	filters,
	onChange,
	onReset,
	canReset
}: ExpensesFiltersProps) {
	return (
		<div className='flex flex-wrap items-center gap-2'>
			<PeriodFilter
				from={filters.from}
				to={filters.to}
				onChange={period => onChange({ ...filters, ...period })}
			/>
			<CategoryFilter
				value={filters.categories}
				onChange={categories => onChange({ ...filters, categories })}
			/>
			<Select
				items={statusFilterOptions}
				value={filters.status ?? ALL_STATUSES}
				onValueChange={value =>
					onChange({
						...filters,
						status:
							value === ALL_STATUSES || value === null
								? null
								: (value as ExpenseStatus)
					})
				}
			>
				<SelectTrigger aria-label='Статус' className='w-40'>
					<SelectValue />
				</SelectTrigger>
				<SelectContent alignItemWithTrigger={false}>
					<SelectGroup>
						{statusFilterOptions.map(option => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			{canReset ? (
				<Button variant='ghost' onClick={onReset}>
					Сбросить
					<X data-icon='inline-end' />
				</Button>
			) : null}
		</div>
	)
}
