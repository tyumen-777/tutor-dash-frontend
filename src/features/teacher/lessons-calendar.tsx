'use client'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { Clock3 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { ru } from 'react-day-picker/locale'

import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'

import { formatMoney } from '@/lib/format-money'
import { schoolToday, toSchoolTime } from '@/lib/school-time'

import type { LessonResponse } from '@/api/generated/models'
import {
	LESSON_STATUS_BADGE_VARIANTS,
	LESSON_STATUS_LABELS
} from '@/features/lessons/lesson-options'
import { getStudentFullName } from '@/features/students/format'

const DAY_FORMAT = 'YYYY-MM-DD'

/**
 * Month calendar of the teacher's lessons. Days are calendar days of the
 * school timezone. The parent loads lessons for the visible month and gets
 * notified when the user switches months.
 */
export function LessonsCalendar({
	lessons,
	timezone,
	month,
	onMonthChange,
	isLoading
}: {
	lessons: LessonResponse[]
	timezone: string
	month: Date
	onMonthChange: (month: Date) => void
	isLoading?: boolean
}) {
	const [selected, setSelected] = useState<Date | undefined>(() =>
		schoolToday(timezone)
	)
	// Календарь работает с днями браузера, поэтому день школы переносим
	// в локальную дату без сдвига
	const dayOf = (lesson: LessonResponse) =>
		toSchoolTime(lesson.startsAt, timezone).format(DAY_FORMAT)
	const lessonDays = lessons
		.filter(lesson => lesson.status !== 'CANCELED')
		.map(lesson => dayjs(dayOf(lesson)).toDate())
	const selectedDay = selected ? dayjs(selected).format(DAY_FORMAT) : null
	const dayLessons = selectedDay
		? lessons
				.filter(lesson => dayOf(lesson) === selectedDay)
				.sort((a, b) => a.startsAt.localeCompare(b.startsAt))
		: []

	return (
		<div className='grid min-w-0 gap-4 md:grid-cols-[auto_minmax(0,1fr)]'>
			<div className='w-fit rounded-md border border-[#D8DED2] bg-white'>
				<Calendar
					mode='single'
					locale={ru}
					selected={selected}
					onSelect={setSelected}
					month={month}
					onMonthChange={onMonthChange}
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
						dayLessons.map(lesson => {
							const startsAt = toSchoolTime(
								lesson.startsAt,
								timezone
							)

							return (
								<div
									key={lesson.id}
									className='grid gap-2 rounded-md border border-[#D8DED2] bg-[#FBFCF8] p-3'
								>
									<div className='flex flex-wrap items-center justify-between gap-2'>
										{lesson.student ? (
											<Link
												href={`/student/${lesson.student.id}`}
												className='leading-5 font-medium text-[#101319] hover:underline'
											>
												{getStudentFullName(
													lesson.student
												)}
											</Link>
										) : (
											<span className='leading-5 font-medium text-[#101319]'>
												—
											</span>
										)}
										<Badge
											variant={
												LESSON_STATUS_BADGE_VARIANTS[
													lesson.status
												]
											}
										>
											{
												LESSON_STATUS_LABELS[
													lesson.status
												]
											}
										</Badge>
									</div>
									<div className='flex flex-wrap items-center justify-between gap-2 text-sm leading-5 text-[#3D453D]'>
										<span className='flex items-center gap-2'>
											<Clock3
												className='size-4 text-[#1F5A3D]'
												aria-hidden
											/>
											{startsAt.format('HH:mm')}–
											{startsAt
												.add(
													lesson.durationMin,
													'minute'
												)
												.format('HH:mm')}{' '}
											· {lesson.durationMin} мин
										</span>
										{lesson.teacherPay !== null ? (
											<span
												className={
													lesson.status ===
													'COMPLETED'
														? 'font-medium tabular-nums'
														: 'tabular-nums line-through'
												}
											>
												{formatMoney(
													lesson.teacherPay,
													lesson.currency
												)}
											</span>
										) : null}
									</div>
									{lesson.topic ? (
										<p className='text-xs leading-4 text-[#5D665B]'>
											{lesson.topic}
										</p>
									) : null}
								</div>
							)
						})
					) : (
						<p className='rounded-md border border-dashed border-[#D8DED2] px-3 py-6 text-center text-sm leading-5 text-[#5D665B]'>
							{isLoading
								? 'Загрузка занятий…'
								: 'В этот день занятий нет.'}
						</p>
					)}
				</div>
			</div>
		</div>
	)
}
