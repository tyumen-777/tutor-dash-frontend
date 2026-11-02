import { WalletCards } from 'lucide-react'
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

import { pluralize } from '../format'

import type { DashboardSummaryResponse } from '@/api/generated/models'
import { useSchoolTimezone } from '@/features/auth/api/use-organization-role'
import { formatDate } from '@/features/expenses/format'
import { getStudentFullName } from '@/features/students/format'

function formatLessonsLeft(lessonsLeft: number) {
	return lessonsLeft <= 0
		? 'Нет занятий'
		: pluralize(lessonsLeft, {
				one: 'занятие',
				few: 'занятия',
				many: 'занятий'
			})
}

export function LowBalanceCard({
	summary
}: {
	summary?: DashboardSummaryResponse
}) {
	const timezone = useSchoolTimezone()
	const students = summary?.lowBalanceStudents
	const rest = summary
		? summary.students.lowBalanceCount - summary.lowBalanceStudents.length
		: 0

	return (
		<Card className='rounded-lg border-[#D8DED2] bg-white shadow-none'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<WalletCards className='size-5 text-[#A33D32]' />
					Заканчиваются абонементы
				</CardTitle>
				<CardDescription>
					Активные ученики с остатком 0–1 оплаченное занятие — им пора
					предложить продление.
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-3'>
				{students?.length ? (
					<div className='overflow-hidden rounded-md border border-[#D8DED2]'>
						<div className='hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_150px_150px_120px] gap-3 border-b border-[#D8DED2] bg-[#F7F9F4] px-3 py-2 text-xs text-[#66715F] md:grid'>
							<span>Ученик</span>
							<span>Преподаватель</span>
							<span>Последняя оплата</span>
							<span>Последнее занятие</span>
							<span className='text-right'>Остаток</span>
						</div>
						{students.map(student => (
							<div
								key={student.id}
								className='grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 border-b border-[#D8DED2] p-3 last:border-b-0 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_150px_150px_120px] md:items-center'
							>
								<Link
									href={`/student/${student.id}`}
									className='truncate text-sm font-semibold hover:underline'
								>
									{getStudentFullName(student)}
								</Link>
								<div className='flex justify-end md:order-last'>
									<Badge
										variant={
											student.lessonsLeft <= 0
												? 'destructive'
												: 'warning'
										}
									>
										{formatLessonsLeft(student.lessonsLeft)}
									</Badge>
								</div>
								<p className='col-span-2 truncate text-sm text-[#66715F] md:col-span-1'>
									{student.teacher ? (
										<Link
											href={`/teacher/${student.teacher.id}`}
											className='hover:underline'
										>
											{student.teacher.fullName}
										</Link>
									) : (
										'Без преподавателя'
									)}
								</p>
								<p className='col-span-2 text-sm text-[#66715F] md:col-span-1'>
									<span className='md:hidden'>Оплата: </span>
									{student.lastPaidOn
										? formatDate(student.lastPaidOn)
										: 'не было'}
								</p>
								<p className='col-span-2 text-sm text-[#66715F] md:col-span-1'>
									<span className='md:hidden'>Занятие: </span>
									{student.lastLessonAt
										? toSchoolTime(
												student.lastLessonAt,
												timezone
											).format('DD.MM.YYYY')
										: 'не было'}
								</p>
							</div>
						))}
					</div>
				) : (
					<p className='rounded-md border border-[#D8DED2] p-3 text-sm leading-5 text-[#66715F]'>
						{summary
							? 'У всех активных учеников есть оплаченные занятия.'
							: 'Загрузка…'}
					</p>
				)}

				{rest > 0 ? (
					<p className='text-sm text-[#66715F]'>
						И ещё {rest}.{' '}
						<Link
							href='/students'
							className='font-medium text-[#101319] hover:underline'
						>
							Открыть учеников
						</Link>{' '}
						и отсортировать по остатку.
					</p>
				) : null}
			</CardContent>
		</Card>
	)
}
