'use client'

import { type ColumnDef, type RowData } from '@tanstack/react-table'

import { DataTable as BaseDataTable } from '@/components/data-table'

import { type DataTableFeatures } from '@/lib/data-table-features'

import { StudentFormDialog } from './student-form-dialog'

interface DataTableProps<TData extends RowData> {
	columns: ColumnDef<DataTableFeatures, TData>[]
	data: TData[]
}

export function DataTable<TData extends RowData>({
	columns,
	data
}: DataTableProps<TData>) {
	return (
		<BaseDataTable
			columns={columns}
			data={data}
			searchColumn='fullName'
			searchPlaceholder='Найти по ФИО...'
			toolbar={<StudentFormDialog />}
		/>
	)
}
