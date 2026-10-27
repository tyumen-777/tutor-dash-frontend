import { Suspense } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import ExpensesPage from '@/features/expenses'

export default function Expenses() {
	return (
		// useSearchParams внутри страницы требует Suspense-границы
		<Suspense fallback={<Skeleton className='m-10 h-96' />}>
			<ExpensesPage />
		</Suspense>
	)
}
