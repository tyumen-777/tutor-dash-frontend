'use client'

import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	useTable
} from '@tanstack/react-table'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

import { type DataTableFeatures, features } from '@/lib/data-table-features'

import {
	type ExpenseFilters,
	applyExpenseFilters,
	formatPeriod,
	hasActiveFilters,
	parseExpenseFilters,
	serializeExpenseFilters
} from './expense-filters'
import { ExpenseFormDialog } from './expense-form-dialog'
import { type Expense, type ExpenseFormValues } from './expense-form-schema'
import { ExpensesFilters } from './expenses-filters'
import { formatCurrency } from './format'

interface ExpensesDataTableProps {
	columns: ColumnDef<DataTableFeatures, Expense>[]
	initialData: Expense[]
}

export function ExpensesDataTable({
	columns,
	initialData
}: ExpensesDataTableProps) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const query = searchParams.toString()
	const filters = React.useMemo(
		() => parseExpenseFilters(new URLSearchParams(query)),
		[query]
	)

	const [expenses, setExpenses] = React.useState<Expense[]>(initialData)
	const data = React.useMemo(
		() => applyExpenseFilters(expenses, filters),
		[expenses, filters]
	)
	const [sorting, setSorting] = React.useState<SortingState>([
		{ id: 'date', desc: true }
	])
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([])
	const table = useTable({
		features,
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		state: {
			sorting,
			columnFilters
		}
	})

	const filteredRows = table.getFilteredRowModel().rows
	const total = filteredRows.reduce(
		(sum, row) => sum + row.original.amount,
		0
	)

	function updateFilters(nextFilters: ExpenseFilters) {
		const nextQuery = serializeExpenseFilters(nextFilters)
		router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
			scroll: false
		})
		table.setPageIndex(0)
	}

	function handleReset() {
		router.replace(pathname, { scroll: false })
		table.getColumn('description')?.setFilterValue(undefined)
		table.setPageIndex(0)
	}

	function handleCreate(values: ExpenseFormValues) {
		setExpenses(current => [
			{ id: crypto.randomUUID(), ...values },
			...current
		])
	}

	const searchValue =
		(table.getColumn('description')?.getFilterValue() as string) ?? ''

	return (
		<div>
			<div className='flex flex-col gap-3 py-4 lg:flex-row lg:items-start lg:justify-between'>
				<div className='flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center'>
					<Input
						placeholder='Найти по описанию...'
						value={searchValue}
						onChange={event =>
							table
								.getColumn('description')
								?.setFilterValue(event.target.value)
						}
						className='sm:w-64'
					/>
					<ExpensesFilters
						filters={filters}
						onChange={updateFilters}
						onReset={handleReset}
						canReset={hasActiveFilters(filters) || !!searchValue}
					/>
				</div>
				<ExpenseFormDialog onCreate={handleCreate} />
			</div>
			<div className='overflow-hidden rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : (
												<table.FlexRender
													header={header}
												/>
											)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && 'selected'
									}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											<table.FlexRender cell={cell} />
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									Ничего не найдено.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between'>
				<p className='text-muted-foreground text-sm'>
					Итого · {formatPeriod(filters.from, filters.to)} ·{' '}
					{filteredRows.length} шт.:{' '}
					<span className='text-foreground font-semibold tabular-nums'>
						{formatCurrency(total)}
					</span>
				</p>
				<div className='flex items-center justify-end gap-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Назад
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Вперед
					</Button>
				</div>
			</div>
		</div>
	)
}
