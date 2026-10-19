'use client'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { Clock3 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { ru } from 'react-day-picker/locale'

import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'

import type { TeacherLesson, TeacherLessonStatus } from './types'

const statusVariant: Record<
	TeacherLessonStatus,
	'success' | 'outline' | 'destructive'
> = {
	Проведено: 'success',
	Запланировано: 'outline',
	Отменено: 'destructive'
}

function toKey(date: Date) {
	return dayjs(date).format('YYYY-MM-DD')
}

export function LessonsCalendar({ lessons }: { lessons: TeacherLesson[] }) {
	const [selected, setSelected] = useState<Date | undefined>(() => new Date())
	const lessonDays = lessons.map(lesson => dayjs(lesson.date).toDate())
	const dayLessons = selected
		? lessons.filter(lesson => lesson.date === toKey(selected))
		: []

	return (
		<div className='grid min-w-0 gap-4 md:grid-cols-[auto_minmax(0,1fr)]'>
			<div className='w-fit rounded-md border border-[#D8DED2] bg-white'>
				<Calendar
					mode='single'
					locale={ru}
					selected={selected}
					onSelect={setSelected}
					defaultMonth={selected}
					modifiers={{ lesson: lessonDays }}
					modifiersClassNames={{
						lesson: 'font-semibold text-[#1F5A3D] [&_button]:underline [&_button]:decoration-2 [&_button]:underline-offset-4'
					}}
					className='rounded-md bg-transparent'
				/>
			</div>

			<div className='min-w-0'>
				<p className='text-sm leading-5 font-medium text-[#101319]'>
					{selected
						? dayjs(selected).locale('ru').format('D MMMM, dddd')
						: 'Выберите день'}
				</p>
				<div className='mt-3 grid gap-3'>
					{dayLessons.length ? (
						dayLessons.map(lesson => (
							<div
								key={lesson.id}
								className='grid gap-2 rounded-md border border-[#D8DED2] bg-[#FBFCF8] p-3'
							>
								<div className='flex flex-wrap items-center justify-between gap-2'>
									<Link
										href={`/student/${lesson.studentId}`}
										className='leading-5 font-medium text-[#101319] hover:underline'
									>
										{lesson.studentName}
									</Link>
									<Badge
										variant={statusVariant[lesson.status]}
									>
										{lesson.status}
									</Badge>
								</div>
								<div className='flex items-center gap-2 text-sm leading-5 text-[#3D453D]'>
									<Clock3
										className='size-4 text-[#1F5A3D]'
										aria-hidden
									/>
									{lesson.time}
								</div>
							</div>
						))
					) : (
						<p className='rounded-md border border-dashed border-[#D8DED2] px-3 py-6 text-center text-sm leading-5 text-[#5D665B]'>
							В этот день занятий нет.
						</p>
					)}
				</div>
			</div>
		</div>
	)
}
