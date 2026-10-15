import { Clock3 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import type { DayLesson } from './data'

function getLessonBadgeVariant(status: DayLesson['status']) {
	if (status === 'риск') return 'warning'
	if (status === 'идет') return 'success'
	return 'outline'
}

export function DayScheduleCard({ lessons }: { lessons: DayLesson[] }) {
	return (
		<Card className='rounded-lg border-[#D8DED2] bg-white shadow-none'>
			<CardHeader>
				<CardTitle>Расписание дня</CardTitle>
				<CardDescription>
					Занятия, где директору важно видеть заполненность.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='overflow-hidden rounded-md border border-[#D8DED2]'>
					{lessons.map(lesson => (
						<div
							key={`${lesson.time}-${lesson.title}`}
							className='grid grid-cols-[64px_minmax(0,1fr)] gap-3 border-b border-[#D8DED2] bg-white p-3 last:border-b-0 sm:grid-cols-[72px_minmax(0,1fr)_auto]'
						>
							<div className='flex items-center gap-2 font-mono text-sm font-semibold text-[#315F72]'>
								<Clock3 className='size-4' aria-hidden='true' />
								{lesson.time}
							</div>
							<div className='min-w-0'>
								<p className='truncate text-sm font-semibold'>
									{lesson.title}
								</p>
								<p className='truncate text-sm text-[#66715F]'>
									{lesson.teacher}
								</p>
							</div>
							<div className='col-span-2 flex items-center justify-between gap-2 sm:col-span-1 sm:justify-end'>
								<Badge
									variant={getLessonBadgeVariant(
										lesson.status
									)}
								>
									{lesson.status}
								</Badge>
								<span className='font-mono text-sm text-[#66715F]'>
									{lesson.students}
								</span>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
