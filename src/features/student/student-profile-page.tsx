'use client'

import {
	ArrowLeft,
	CalendarClock,
	CheckCircle2,
	Clock3,
	Mail,
	MessageCircle,
	Phone,
	Plus,
	ReceiptText,
	SearchX,
	UserRound,
	UsersRound
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

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
import { toSchoolTime } from '@/lib/school-time'

import { useStudent } from './api/use-student'
import type { StudentPreferredTime } from './types'
import type { StudentResponse } from '@/api/generated/models'
import {
	useCanManageFinance,
	useSchoolTimezone
} from '@/features/auth/api/use-organization-role'
import {
	usePayments,
	useStudentBalance
} from '@/features/income/api/use-payments'
import { PaymentFormDialog } from '@/features/income/payment-form-dialog'
import {
	PAYMENT_METHOD_LABELS,
	PAYMENT_STATUS_BADGE_VARIANTS,
	PAYMENT_STATUS_LABELS,
	formatLessons
} from '@/features/income/payment-options'
import { useLessons } from '@/features/lessons/api/use-lessons'
import {
	LESSON_STATUS_BADGE_VARIANTS,
	LESSON_STATUS_LABELS
} from '@/features/lessons/lesson-options'
import {
	STUDENT_STATUS_BADGE_VARIANTS,
	STUDENT_STATUS_LABELS,
	formatAge,
	getAge,
	getStudentFullName
} from '@/features/students/format'
import { TIMEZONE_OPTIONS } from '@/features/students/timezones'
import { formatDate } from '@/features/teachers/format'

// TODO: заменить на API, когда появятся шаблоны расписания (ScheduleRule).
const preferredTimes: StudentPreferredTime[] = []

// Один и тот же запрос в шапке и в блоке занятий — react-query загрузит его один раз
function getStudentLessonsQuery(studentId: string) {
	return { studentId, limit: 10 }
}

function getInitials(fullName: string) {
	return fullName
		.split(' ')
		.map(part => part[0])
		.join('')
}

function getTimezoneLabel(timezone: string | null) {
	if (!timezone) return 'Как в организации'

	return (
		TIMEZONE_OPTIONS.find(option => option.value === timezone)?.label ??
		timezone
	)
}

type StudentProfilePageProps = {
	studentId: string
}

function ProfileHeader({ student }: { student: StudentResponse }) {
	const fullName = getStudentFullName(student)
	const subtitle = [
		student.birthDate && formatAge(getAge(student.birthDate)),
		student.level
	]
		.filter(Boolean)
		.join(', ')

	return (
		<section className='overflow-hidden rounded-lg border border-[#C9D6CC] bg-[#F7F8F3]'>
			<div className='grid gap-0 lg:grid-cols-[minmax(18rem,22rem)_1fr]'>
				<aside className='border-b border-[#C9D6CC] bg-[#101319] p-5 text-white lg:border-r lg:border-b-0'>
					<Button
						variant='outline'
						size='sm'
						nativeButton={false}
						className='mb-8 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white'
						render={<Link href='/students' />}
					>
						<ArrowLeft className='size-4' aria-hidden />К списку
					</Button>

					<div className='flex items-start gap-4'>
						<div className='flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#E4EEE7] text-xl font-semibold text-[#1F5A3D]'>
							{getInitials(fullName)}
						</div>
						<div className='min-w-0'>
							<h1 className='text-2xl leading-8 font-semibold tracking-normal'>
								{fullName}
							</h1>
							<p className='mt-1 text-sm leading-5 text-white/70'>
								{subtitle || 'Ученик'}
							</p>
						</div>
					</div>

					<Separator className='my-6 bg-white/15' />

					<div className='space-y-4'>
						<div>
							<p className='text-sm leading-5 text-white/60'>
								Цель обучения
							</p>
							<p className='mt-1 text-sm leading-6 text-white'>
								—
							</p>
						</div>
						<div>
							<p className='text-sm leading-5 text-white/60'>
								Преподаватель
							</p>
							<p className='mt-1 text-sm leading-5 font-medium text-white'>
								{student.teacher ? (
									<Link
										href={`/teacher/${student.teacher.id}`}
										className='hover:underline'
									>
										{student.teacher.fullName}
									</Link>
								) : (
									'—'
								)}
							</p>
						</div>
						<div>
							<p className='text-sm leading-5 text-white/60'>
								Часовой пояс
							</p>
							<p className='mt-1 text-sm leading-5 font-medium text-white'>
								{getTimezoneLabel(student.timezone)}
							</p>
						</div>
						<div>
							<p className='text-sm leading-5 text-white/60'>
								Добавлен
							</p>
							<p className='mt-1 text-sm leading-5 font-medium text-white'>
								{formatDate(student.createdAt)}
							</p>
						</div>
					</div>
				</aside>

				<div className='grid content-between gap-6 p-5 sm:p-6'>
					<div>
						<div className='flex flex-wrap items-center gap-2'>
							<Badge
								variant={
									STUDENT_STATUS_BADGE_VARIANTS[
										student.status
									]
								}
							>
								{STUDENT_STATUS_LABELS[student.status]}
							</Badge>
							<Badge variant='outline'>ID: {student.id}</Badge>
						</div>
						<p className='mt-4 max-w-2xl text-sm leading-6 text-[#3D453D]'>
							Профиль собран как рабочая карточка преподавателя:
							ближайшее занятие, остаток, контакты и история
							доступны без переходов.
						</p>
					</div>

					<div className='grid min-w-0 gap-3 sm:grid-cols-3'>
						<Stat label='Следующее занятие' value='—' />
						<BalanceStat studentId={student.id} />
						<CompletedLessonsStat studentId={student.id} />
					</div>
				</div>
			</div>
		</section>
	)
}

function BalanceStat({ studentId }: { studentId: string }) {
	const { data: balance } = useStudentBalance(studentId)

	return (
		<Stat
			label='Остаток'
			value={balance ? formatLessons(balance.lessonsLeft) : '—'}
			tone='accent'
		/>
	)
}

function CompletedLessonsStat({ studentId }: { studentId: string }) {
	const { data } = useLessons(getStudentLessonsQuery(studentId))

	return (
		<Stat
			label='Проведено занятий'
			value={data ? String(data.summary.lessonsCount) : '—'}
		/>
	)
}

function Contacts({ student }: { student: StudentResponse }) {
	return (
		<SectionCard
			title='Контакты'
			description='Каналы для связи с учеником и родителем.'
			icon={UserRound}
		>
			<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
				<ContactRow
					icon={Phone}
					label='Телефон'
					value={student.phone ?? '—'}
				/>
				<ContactRow
					icon={Mail}
					label='Почта'
					value={student.email ?? '—'}
				/>
				<ContactRow
					icon={MessageCircle}
					label='Telegram'
					value={student.telegram ? `@${student.telegram}` : '—'}
				/>
				<ContactRow icon={UsersRound} label='Родитель' value='—' />
			</div>
		</SectionCard>
	)
}

function Lessons({ studentId }: { studentId: string }) {
	const timezone = useSchoolTimezone()
	const { data, isPending, isError } = useLessons(
		getStudentLessonsQuery(studentId)
	)
	const lessons = data?.items ?? []

	return (
		<SectionCard
			title='Занятия'
			description='Последние занятия ученика: дата, преподаватель и тема.'
			icon={CheckCircle2}
		>
			{lessons.length ? (
				<>
					<div className='grid gap-3 md:hidden'>
						{lessons.map(lesson => {
							const startsAt = toSchoolTime(
								lesson.startsAt,
								timezone
							)

							return (
								<div
									key={lesson.id}
									className='min-w-0 rounded-md border border-[#D8DED2] bg-[#FBFCF8] p-3'
								>
									<div className='flex flex-wrap items-center justify-between gap-2'>
										<p className='leading-5 font-medium text-[#101319] tabular-nums'>
											{startsAt.format(
												'DD.MM.YYYY HH:mm'
											)}
										</p>
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
									<p className='mt-2 text-sm leading-5 text-[#3D453D]'>
										{lesson.topic ?? 'Без темы'}
									</p>
									<p className='mt-1 text-xs leading-4 text-[#5D665B]'>
										{lesson.teacher.fullName} ·{' '}
										{lesson.durationMin} мин
									</p>
								</div>
							)
						})}
					</div>

					<div className='hidden md:block'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Дата</TableHead>
									<TableHead>Преподаватель</TableHead>
									<TableHead>Тема</TableHead>
									<TableHead>Длительность</TableHead>
									<TableHead>Статус</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{lessons.map(lesson => {
									const startsAt = toSchoolTime(
										lesson.startsAt,
										timezone
									)

									return (
										<TableRow key={lesson.id}>
											<TableCell className='font-medium text-[#101319] tabular-nums'>
												{startsAt.format('DD.MM.YYYY')}
												<span className='ml-2 font-normal text-[#5D665B]'>
													{startsAt.format('HH:mm')}
												</span>
											</TableCell>
											<TableCell>
												<Link
													href={`/teachers/${lesson.teacher.id}`}
													className='hover:underline'
												>
													{lesson.teacher.fullName}
												</Link>
											</TableCell>
											<TableCell className='min-w-56 leading-5 whitespace-normal'>
												{lesson.topic ?? '—'}
											</TableCell>
											<TableCell>
												{lesson.durationMin} мин
											</TableCell>
											<TableCell>
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
											</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table>
					</div>
					{data && data.total > lessons.length ? (
						<p className='mt-3 text-sm leading-5 text-[#5D665B]'>
							Показаны последние {lessons.length} из {data.total}.
						</p>
					) : null}
				</>
			) : (
				<p className='text-sm leading-5 text-[#5D665B]'>
					{isPending
						? 'Загрузка занятий…'
						: isError
							? 'Не удалось загрузить занятия.'
							: 'Занятий пока нет.'}
				</p>
			)}
		</SectionCard>
	)
}

function Payments({ studentId }: { studentId: string }) {
	const canManage = useCanManageFinance()
	const [dialogOpen, setDialogOpen] = useState(false)
	const { data: balance } = useStudentBalance(studentId)
	const { data, isPending, isError } = usePayments({ studentId, limit: 20 })
	const payments = data?.items ?? []

	return (
		<SectionCard
			title='Оплаты занятий'
			description='Внесённые оплаты и начисленные за них пакеты занятий.'
			icon={ReceiptText}
		>
			<div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
				<p className='text-sm leading-5 text-[#3D453D]'>
					{balance ? (
						<>
							Начислено {balance.lessonsTotal}, использовано{' '}
							{balance.lessonsUsed}, осталось{' '}
							<span className='font-semibold text-[#1F5A3D]'>
								{balance.lessonsLeft}
							</span>
							{balance.lastPaidOn
								? ` · последняя оплата ${formatDate(balance.lastPaidOn)}`
								: ''}
						</>
					) : (
						'—'
					)}
				</p>
				{canManage ? (
					<Button size='sm' onClick={() => setDialogOpen(true)}>
						<Plus data-icon='inline-start' />
						Внести оплату
					</Button>
				) : null}
			</div>

			{payments.length ? (
				<>
					<div className='grid gap-3 md:hidden'>
						{payments.map(payment => (
							<div
								key={payment.id}
								className='min-w-0 rounded-md border border-[#D8DED2] bg-[#FBFCF8] p-3'
							>
								<div className='flex flex-wrap items-center justify-between gap-2'>
									<p className='leading-5 font-medium text-[#101319]'>
										{formatMoney(
											payment.amount,
											payment.currency
										)}
									</p>
									<Badge
										variant={
											PAYMENT_STATUS_BADGE_VARIANTS[
												payment.status
											]
										}
									>
										{PAYMENT_STATUS_LABELS[payment.status]}
									</Badge>
								</div>
								<p className='mt-2 text-sm leading-5 text-[#3D453D]'>
									{payment.lessonsCount
										? formatLessons(payment.lessonsCount)
										: '—'}
									, {PAYMENT_METHOD_LABELS[payment.method]}
								</p>
								<p className='mt-1 text-xs leading-4 text-[#5D665B]'>
									{formatDate(payment.paidOn)}
								</p>
							</div>
						))}
					</div>

					<div className='hidden md:block'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Дата</TableHead>
									<TableHead>Сумма</TableHead>
									<TableHead>Пакет</TableHead>
									<TableHead>Способ</TableHead>
									<TableHead>Статус</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{payments.map(payment => (
									<TableRow key={payment.id}>
										<TableCell className='font-medium text-[#101319]'>
											{formatDate(payment.paidOn)}
										</TableCell>
										<TableCell className='tabular-nums'>
											{formatMoney(
												payment.amount,
												payment.currency
											)}
										</TableCell>
										<TableCell>
											{payment.lessonsCount
												? formatLessons(
														payment.lessonsCount
													)
												: '—'}
										</TableCell>
										<TableCell>
											{
												PAYMENT_METHOD_LABELS[
													payment.method
												]
											}
										</TableCell>
										<TableCell>
											<Badge
												variant={
													PAYMENT_STATUS_BADGE_VARIANTS[
														payment.status
													]
												}
											>
												{
													PAYMENT_STATUS_LABELS[
														payment.status
													]
												}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</>
			) : (
				<p className='text-sm leading-5 text-[#5D665B]'>
					{isPending
						? 'Загрузка…'
						: isError
							? 'Не удалось загрузить оплаты.'
							: 'Оплат пока нет.'}
				</p>
			)}

			{canManage ? (
				<PaymentFormDialog
					open={dialogOpen}
					onOpenChange={setDialogOpen}
					studentId={studentId}
				/>
			) : null}
		</SectionCard>
	)
}

function PreferredTime() {
	return (
		<SectionCard
			title='Предпочтительное время'
			description='Окна, в которые проще назначать регулярные занятия.'
			icon={CalendarClock}
		>
			{preferredTimes.length ? (
				<>
					<div className='grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-1'>
						{preferredTimes.map(slot => (
							<div
								key={`${slot.day}-${slot.time}`}
								className='grid gap-3 rounded-md border border-[#D8DED2] bg-[#FBFCF8] p-3'
							>
								<div className='flex items-center justify-between gap-3'>
									<p className='leading-5 font-medium text-[#101319]'>
										{slot.day}
									</p>
									<Badge variant='outline'>
										{slot.format}
									</Badge>
								</div>
								<div className='flex items-center gap-2 text-sm leading-5 text-[#3D453D]'>
									<Clock3
										className='size-4 text-[#1F5A3D]'
										aria-hidden
									/>
									{slot.time}
								</div>
							</div>
						))}
					</div>
				</>
			) : (
				<p className='text-sm leading-5 text-[#5D665B]'>—</p>
			)}
		</SectionCard>
	)
}

function Notes({ student }: { student: StudentResponse }) {
	return (
		<SectionCard title='Общая информация' icon={UserRound}>
			<p className='rounded-md border border-[#D8DED2] bg-[#FBFCF8] px-3 py-2 text-sm leading-6 whitespace-pre-line text-[#3D453D]'>
				{student.note ?? '—'}
			</p>
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
				render={<Link href='/students' />}
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

function StudentProfileContent({ studentId }: StudentProfilePageProps) {
	const { data: student, isPending, error } = useStudent(studentId)

	if (isPending) {
		return <ProfileSkeleton />
	}

	if (error || !student) {
		return error?.response?.status === 404 ? (
			<ProfileState
				title='Ученик не найден'
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
			<ProfileHeader student={student} />

			<div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]'>
				<div className='grid min-w-0 gap-4'>
					<Contacts student={student} />
					<Lessons studentId={student.id} />
					<Payments studentId={student.id} />
				</div>
				<div className='grid min-w-0 content-start gap-4'>
					<Notes student={student} />
					<PreferredTime />
				</div>
			</div>
		</>
	)
}

export default function StudentProfilePage({
	studentId
}: StudentProfilePageProps) {
	return (
		<main className='mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-8'>
			<StudentProfileContent studentId={studentId} />
		</main>
	)
}
