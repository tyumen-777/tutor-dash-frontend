'use client'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import {
	Archive,
	ArrowLeft,
	CalendarDays,
	GraduationCap,
	Mail,
	MessageCircle,
	Phone,
	SearchX,
	UserRound
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import {
	ContactRow,
	SectionCard,
	Stat
} from '@/components/profile/profile-cards'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

import { formatMoney } from '@/lib/format-money'
import { schoolToday } from '@/lib/school-time'

import { useTeacher } from './api/use-teacher'
import {
	type MonthPeriod,
	useTeacherLessons,
	useTeacherStudents
} from './api/use-teacher-activity'
import { LessonsCalendar } from './lessons-calendar'
import type {
	LessonListResponse,
	StudentResponse,
	TeacherResponse
} from '@/api/generated/models'
import { useSchoolTimezone } from '@/features/auth/api/use-organization-role'
import { getStudentFullName } from '@/features/students/format'
import { formatDate, formatHourlyRate } from '@/features/teachers/format'
import { TeacherActions } from '@/features/teachers/teacher-actions'

function getMonthPeriod(month: Date): MonthPeriod {
	const start = dayjs(month).startOf('month')

	return {
		from: start.format('YYYY-MM-DD'),
		to: start.endOf('month').format('YYYY-MM-DD')
	}
}

type TeacherProfilePageProps = {
	teacherId: string
}

function ProfileHeader({
	teacher,
	month,
	lessons,
	studentsCount,
	onDeleted
}: {
	teacher: TeacherResponse
	month: Date
	lessons: LessonListResponse | undefined
	studentsCount: number | undefined
	onDeleted: () => void
}) {
	const monthLabel = dayjs(month).locale('ru').format('MMMM')
	const summary = lessons?.summary

	return (
		<section className='overflow-hidden rounded-lg border border-[#C9D6CC] bg-[#F7F8F3]'>
			<div className='grid gap-0 lg:grid-cols-[minmax(18rem,22rem)_1fr]'>
				<aside className='border-b border-[#C9D6CC] bg-[#101319] p-5 text-white lg:border-r lg:border-b-0'>
					<Button
						variant='outline'
						size='sm'
						nativeButton={false}
						className='mb-8 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white'
						render={<Link href='/teachers' />}
					>
						<ArrowLeft className='size-4' aria-hidden />К списку
					</Button>

					<div className='flex items-start gap-4'>
						<div className='flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#E4EEE7] text-xl font-semibold text-[#1F5A3D]'>
							{teacher.fullName
								.split(' ')
								.map(part => part[0])
								.join('')}
						</div>
						<div className='min-w-0'>
							<h1 className='text-2xl leading-8 font-semibold tracking-normal'>
								{teacher.fullName}
							</h1>
							<p className='mt-1 text-sm leading-5 text-white/70'>
								Преподаватель
							</p>
						</div>
					</div>

					<Separator className='my-6 bg-white/15' />

					<div className='space-y-4'>
						<div>
							<p className='text-sm leading-5 text-white/60'>
								Ставка
							</p>
							<p className='mt-1 text-sm leading-5 font-medium text-white'>
								{formatHourlyRate(teacher.hourlyRate)}
							</p>
						</div>
						<div>
							<p className='text-sm leading-5 text-white/60'>
								Работает с
							</p>
							<p className='mt-1 text-sm leading-5 font-medium text-white'>
								{formatDate(teacher.startedOn)}
							</p>
						</div>
					</div>
				</aside>

				<div className='grid content-between gap-6 p-5 sm:p-6'>
					<div>
						<div className='flex flex-wrap items-start justify-between gap-3'>
							<div className='flex flex-wrap items-center gap-2'>
								{teacher.isActive ? (
									<Badge variant='success'>Активен</Badge>
								) : (
									<Badge variant='outline'>В архиве</Badge>
								)}
								<Badge variant='outline'>
									ID: {teacher.id}
								</Badge>
							</div>
							<TeacherActions
								teacher={teacher}
								variant='profile'
								onDeleted={onDeleted}
							/>
						</div>
						{!teacher.isActive ? (
							<div className='mt-4 flex items-center gap-3 rounded-md border border-[#D8DED2] bg-white px-3 py-2 text-sm leading-5 text-[#3D453D]'>
								<Archive
									className='size-4 shrink-0 text-[#5D665B]'
									aria-hidden
								/>
								{teacher.endedOn
									? `В архиве с ${formatDate(teacher.endedOn)}`
									: 'В архиве'}
							</div>
						) : null}
						<p className='mt-4 max-w-2xl text-sm leading-6 text-[#3D453D]'>
							Рабочая карточка преподавателя: занятия в календаре,
							заработок за месяц и ученики в одном месте.
							Заработок считается по проведённым занятиям.
						</p>
					</div>

					<div className='grid min-w-0 gap-3 sm:grid-cols-3'>
						<Stat
							label={`Заработок · ${monthLabel}`}
							value={
								summary
									? formatMoney(
											summary.teacherPayTotal,
											lessons.items[0]?.currency
										)
									: '—'
							}
							tone='accent'
						/>
						<Stat
							label={`Занятий · ${monthLabel}`}
							value={summary ? String(summary.lessonsCount) : '—'}
						/>
						<Stat
							label='Учеников'
							value={
								studentsCount === undefined
									? '—'
									: String(studentsCount)
							}
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

function Schedule({
	lessons,
	timezone,
	month,
	onMonthChange,
	isLoading
}: {
	lessons: LessonListResponse | undefined
	timezone: string
	month: Date
	onMonthChange: (month: Date) => void
	isLoading: boolean
}) {
	return (
		<SectionCard
			title='Календарь занятий'
			description='Проведённые и отменённые занятия по дням. Выберите день, чтобы увидеть занятия и начисления.'
			icon={CalendarDays}
		>
			<LessonsCalendar
				lessons={lessons?.items ?? []}
				timezone={timezone}
				month={month}
				onMonthChange={onMonthChange}
				isLoading={isLoading}
			/>
		</SectionCard>
	)
}

function Students({ students }: { students: StudentResponse[] }) {
	return (
		<SectionCard
			title='Ученики'
			description='Ученики, закрепленные за преподавателем.'
			icon={GraduationCap}
		>
			{students.length ? (
				<>
					<div className='grid gap-3 md:hidden'>
						{students.map(student => (
							<Link
								key={student.id}
								href={`/student/${student.id}`}
								className='min-w-0 rounded-md border border-[#D8DED2] bg-[#FBFCF8] p-3'
							>
								<div className='flex flex-wrap items-center justify-between gap-2'>
									<p className='leading-5 font-medium text-[#101319]'>
										{getStudentFullName(student)}
									</p>
									{student.level ? (
										<Badge variant='outline'>
											{student.level.code}
										</Badge>
									) : null}
								</div>
								<p className='mt-2 text-xs leading-4 text-[#5D665B]'>
									Осталось занятий: {student.lessonsLeft}
								</p>
							</Link>
						))}
					</div>

					<div className='hidden md:block'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ФИО</TableHead>
									<TableHead>Уровень</TableHead>
									<TableHead>Осталось занятий</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{students.map(student => (
									<TableRow key={student.id}>
										<TableCell className='font-medium text-[#101319]'>
											<Link
												href={`/student/${student.id}`}
												className='hover:underline'
											>
												{getStudentFullName(student)}
											</Link>
										</TableCell>
										<TableCell>
											{student.level ? (
												<Badge variant='outline'>
													{student.level.code}
												</Badge>
											) : (
												'—'
											)}
										</TableCell>
										<TableCell className='tabular-nums'>
											{student.lessonsLeft}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</>
			) : (
				<p className='text-sm leading-5 text-[#5D665B]'>
					За преподавателем пока нет учеников.
				</p>
			)}
		</SectionCard>
	)
}

function Contacts({ teacher }: { teacher: TeacherResponse }) {
	return (
		<SectionCard
			title='Контакты'
			description='Каналы для связи с преподавателем.'
			icon={UserRound}
		>
			<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-1'>
				<ContactRow
					icon={Phone}
					label='Телефон'
					value={teacher.phone ?? '—'}
				/>
				<ContactRow
					icon={Mail}
					label='Почта'
					value={teacher.email ?? '—'}
				/>
				<ContactRow
					icon={MessageCircle}
					label='Telegram'
					value={teacher.telegram ? `@${teacher.telegram}` : '—'}
				/>
			</div>
		</SectionCard>
	)
}

function ProfileState({
	title,
	description
}: {
	title: string
	description: string
}) {
	return (
		<section className='grid justify-items-start gap-4 rounded-lg border border-[#C9D6CC] bg-[#F7F8F3] p-6'>
			<div className='flex size-10 items-center justify-center rounded-md bg-[#E4EEE7] text-[#1F5A3D]'>
				<SearchX className='size-5' aria-hidden />
			</div>
			<div>
				<h1 className='text-lg leading-7 font-semibold text-[#101319]'>
					{title}
				</h1>
				<p className='mt-1 text-sm leading-6 text-[#3D453D]'>
					{description}
				</p>
			</div>
			<Button
				variant='outline'
				size='sm'
				nativeButton={false}
				render={<Link href='/teachers' />}
			>
				<ArrowLeft className='size-4' aria-hidden />К списку
			</Button>
		</section>
	)
}

function ProfileSkeleton() {
	return (
		<>
			<Skeleton className='h-80 w-full rounded-lg' />
			<div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]'>
				<Skeleton className='h-96 w-full rounded-lg' />
				<Skeleton className='h-48 w-full rounded-lg' />
			</div>
		</>
	)
}

function TeacherProfileContent({ teacherId }: TeacherProfilePageProps) {
	const router = useRouter()
	const { data: teacher, isPending, error } = useTeacher(teacherId)
	const timezone = useSchoolTimezone()
	// Месяц и дни календаря — по часам школы, как и итоги на бэкенде
	const [month, setMonth] = useState(() =>
		dayjs(schoolToday(timezone)).startOf('month').toDate()
	)
	const period = useMemo(() => getMonthPeriod(month), [month])
	const lessons = useTeacherLessons(teacherId, period)
	const students = useTeacherStudents(teacherId)

	if (isPending) {
		return <ProfileSkeleton />
	}

	if (error || !teacher) {
		return error?.response?.status === 404 ? (
			<ProfileState
				title='Преподаватель не найден'
				description='Возможно, он был удалён или относится к другой организации.'
			/>
		) : (
			<ProfileState
				title='Не удалось загрузить профиль'
				description='Обновите страницу или попробуйте позже.'
			/>
		)
	}

	return (
		<>
			<ProfileHeader
				teacher={teacher}
				month={month}
				lessons={lessons.data}
				studentsCount={students.data?.total}
				onDeleted={() => router.replace('/teachers')}
			/>

			<div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]'>
				<div className='grid min-w-0 gap-4'>
					<Schedule
						lessons={lessons.data}
						timezone={timezone}
						month={month}
						onMonthChange={next =>
							setMonth(dayjs(next).startOf('month').toDate())
						}
						isLoading={lessons.isPending}
					/>
					<Students students={students.data?.items ?? []} />
				</div>
				<div className='grid min-w-0 content-start gap-4'>
					<Contacts teacher={teacher} />
				</div>
			</div>
		</>
	)
}

export default function TeacherProfilePage({
	teacherId
}: TeacherProfilePageProps) {
	return (
		<main className='mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-8'>
			<TeacherProfileContent teacherId={teacherId} />
		</main>
	)
}
