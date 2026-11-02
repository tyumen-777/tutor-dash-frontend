import { Suspense } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import PayoutsPage from '@/features/payouts'

export default function Payouts() {
	return (
		// useSearchParams внутри страницы требует Suspense-границы
		<Suspense fallback={<Skeleton className='m-10 h-96' />}>
			<PayoutsPage />
		</Suspense>
	)
}
