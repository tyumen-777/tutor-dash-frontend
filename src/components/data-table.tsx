'use client'

import {
	type ColumnDef,
	type ColumnFiltersState,
	type RowData,
	type SortingState,
	useTable
} from '@tanstack/react-table'
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

interface DataTableProps<TData extends RowData> {
	columns: ColumnDef<DataTableFeatures, TData>[]
	data: TData[]
	searchColumn: string
	searchPlaceholder: string
	toolbar?: React.ReactNode
}

export function DataTable<TData extends RowData>({
	columns,
	data,
	searchColumn,
	searchPlaceholder,
	toolbar
}: DataTableProps<TData>) {
	const [sorting, setSorting] = React.useState<SortingState>([])
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

	return (
		<div>
			<div className='flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between'>
				<Input
					placeholder={searchPlaceholder}
					value={
						(table
							.getColumn(searchColumn)
							?.getFilterValue() as string) ?? ''
					}
					onChange={event =>
						table
							.getColumn(searchColumn)
							?.setFilterValue(event.target.value)
					}
					className='max-w-sm'
				/>
				{toolbar}
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
			<div className='flex items-center justify-end gap-2 py-4'>
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
	)
}
