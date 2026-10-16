import { Suspense } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import { columns } from './columns'
import { ExpensesDataTable } from './data-table'
import { expensesData } from './expense-data'
import { type Expense } from './expense-form-schema'

async function getData(): Promise<Expense[]> {
	return expensesData
}

export default async function ExpensesPage() {
	const data = await getData()

	return (
		<div className='container mx-auto py-10'>
			<div className='space-y-1'>
				<h1 className='text-2xl font-semibold'>Расходы</h1>
				<p className='text-muted-foreground text-sm'>
					Аренда, зарплаты, материалы и прочие траты школы.
				</p>
			</div>
			{/* useSearchParams внутри таблицы требует Suspense-границы */}
			<Suspense fallback={<Skeleton className='mt-4 h-96 w-full' />}>
				<ExpensesDataTable columns={columns} initialData={data} />
			</Suspense>
		</div>
	)
}
