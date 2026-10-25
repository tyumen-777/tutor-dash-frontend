import { Suspense } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import LessonsPage from '@/features/lessons'

export default function Lessons() {
	return (
		// useSearchParams внутри страницы требует Suspense-границы
		<Suspense fallback={<Skeleton className='m-10 h-96' />}>
			<LessonsPage />
		</Suspense>
	)
}
