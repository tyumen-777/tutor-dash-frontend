import { GraduationCap } from 'lucide-react'
import Link from 'next/link'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { cn } from '@/lib/utils'

import { formatHours, pluralize } from '../format'

import type { DashboardSummaryResponseTeachersItem } from '@/api/generated/models'

// Загрузка — доля от самого занятого преподавателя: нормы часов в системе нет
function WorkloadBar({ value }: { value: number }) {
	return (
		<div className='h-2 overflow-hidden rounded-full bg-[#E8EEE2]'>
			<div
				className={cn(
					'h-full rounded-full',
					value > 85
						? 'bg-[#C95E4F]'
						: value > 70
							? 'bg-[#C48A3A]'
							: 'bg-[#3F7A54]'
				)}
				style={{ width: `${value}%` }}
			/>
		</div>
	)
}

export function TeachersWorkloadCard({
	teachers
}: {
	teachers?: DashboardSummaryResponseTeachersItem[]
}) {
	const maxLessons = Math.max(
		0,
		...(teachers ?? []).map(teacher => teacher.lessonsCount)
	)

	return (
		<Card className='rounded-lg border-[#D8DED2] bg-white shadow-none'>
			<CardHeader>
				<CardTitle>Загрузка преподавателей</CardTitle>
				<CardDescription>
					Проведённые занятия и ученики за текущий месяц.
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				{teachers?.map(teacher => (
					<div
						key={teacher.id}
						className='grid gap-3 rounded-md border border-[#D8DED2] p-3 sm:grid-cols-[minmax(0,1fr)_96px_88px]'
					>
						<div className='min-w-0 space-y-2'>
							<div className='flex items-center gap-2'>
								<GraduationCap
									className='size-4 shrink-0 text-[#3F7A54]'
									aria-hidden='true'
								/>
								<Link
									href={`/teacher/${teacher.id}`}
									className='truncate text-sm font-semibold hover:underline'
								>
									{teacher.fullName}
								</Link>
							</div>
							<WorkloadBar
								value={
									maxLessons
										? (teacher.lessonsCount / maxLessons) *
											100
										: 0
								}
							/>
							<p className='text-xs text-[#66715F]'>
								{pluralize(teacher.lessonsCount, {
									one: 'занятие',
									few: 'занятия',
									many: 'занятий'
								})}{' '}
								· {formatHours(teacher.minutes)}
							</p>
						</div>
						<div>
							<p className='text-xs text-[#66715F]'>Ученики</p>
							<p className='font-mono text-lg font-semibold'>
								{teacher.studentsCount}
							</p>
						</div>
						<div>
							<p className='text-xs text-[#66715F]'>Удержание</p>
							<p className='font-mono text-lg font-semibold'>—</p>
						</div>
					</div>
				))}

				{!teachers?.length ? (
					<p className='rounded-md border border-[#D8DED2] p-3 text-sm leading-5 text-[#66715F]'>
						{teachers
							? 'Активных преподавателей нет.'
							: 'Загрузка…'}
					</p>
				) : null}
			</CardContent>
		</Card>
	)
}
