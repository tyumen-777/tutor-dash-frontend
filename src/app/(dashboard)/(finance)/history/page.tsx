import { Suspense } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import FinanceHistoryPage from '@/features/finance-history'

export default function FinanceHistory() {
	return (
		// useSearchParams внутри страницы требует Suspense-границы
		<Suspense fallback={<Skeleton className='m-10 h-96' />}>
			<FinanceHistoryPage />
		</Suspense>
	)
}
