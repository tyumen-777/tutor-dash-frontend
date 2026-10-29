import { Clock3 } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { toSchoolTime } from '@/lib/school-time'

import type { DashboardSummaryResponseTodayLessonsItem } from '@/api/generated/models'
import { useSchoolTimezone } from '@/features/auth/api/use-organization-role'
import {
	LESSON_STATUS_BADGE_VARIANTS,
	LESSON_STATUS_LABELS
} from '@/features/lessons/lesson-options'
import { getStudentFullName } from '@/features/students/format'

export function DayScheduleCard({
	lessons
}: {
	lessons?: DashboardSummaryResponseTodayLessonsItem[]
}) {
	const timezone = useSchoolTimezone()

	return (
		<Card className='rounded-lg border-[#D8DED2] bg-white shadow-none'>
			<CardHeader>
				<CardTitle>Расписание дня</CardTitle>
				<CardDescription>
					Все занятия сегодня по времени школы.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{lessons?.length ? (
					<div className='overflow-hidden rounded-md border border-[#D8DED2]'>
						{lessons.map(lesson => (
							<div
								key={lesson.id}
								className='grid grid-cols-[64px_minmax(0,1fr)] gap-3 border-b border-[#D8DED2] bg-white p-3 last:border-b-0 sm:grid-cols-[72px_minmax(0,1fr)_auto]'
							>
								<div className='flex items-center gap-2 font-mono text-sm font-semibold text-[#315F72]'>
									<Clock3
										className='size-4'
										aria-hidden='true'
									/>
									{toSchoolTime(
										lesson.startsAt,
										timezone
									).format('HH:mm')}
								</div>
								<div className='min-w-0'>
									<p className='truncate text-sm font-semibold'>
										{lesson.student ? (
											<Link
												href={`/student/${lesson.student.id}`}
												className='hover:underline'
											>
												{getStudentFullName(
													lesson.student
												)}
											</Link>
										) : (
											'Без ученика'
										)}
									</p>
									<p className='truncate text-sm text-[#66715F]'>
										{[lesson.teacher.fullName, lesson.topic]
											.filter(Boolean)
											.join(' · ')}
									</p>
								</div>
								<div className='col-span-2 flex items-center justify-between gap-2 sm:col-span-1 sm:justify-end'>
									<Badge
										variant={
											LESSON_STATUS_BADGE_VARIANTS[
												lesson.status
											]
										}
									>
										{LESSON_STATUS_LABELS[lesson.status]}
									</Badge>
									<span className='font-mono text-sm text-[#66715F]'>
										{lesson.durationMin} мин
									</span>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className='rounded-md border border-[#D8DED2] p-3 text-sm leading-5 text-[#66715F]'>
						{lessons ? 'Сегодня занятий нет.' : 'Загрузка…'}
					</p>
				)}
			</CardContent>
		</Card>
	)
}
