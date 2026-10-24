import { Suspense } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import IncomePage from '@/features/income'

export default function Income() {
	return (
		// useSearchParams внутри страницы требует Suspense-границы
		<Suspense fallback={<Skeleton className='m-10 h-96' />}>
			<IncomePage />
		</Suspense>
	)
}
