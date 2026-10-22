'use client'

import {
	ArrowLeft,
	CalendarClock,
	CheckCircle2,
	Clock3,
	Mail,
	MessageCircle,
	Phone,
	ReceiptText,
	SearchX,
	UserRound,
	UsersRound
} from 'lucide-react'
import Link from 'next/link'

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

import { useStudent } from './api/use-student'
import type {
	StudentLesson,
	StudentPayment,
	StudentPreferredTime
} from './types'
import type { StudentResponse } from '@/api/generated/models'
import {
	STUDENT_STATUS_BADGE_VARIANTS,
	STUDENT_STATUS_LABELS,
	formatAge,
	getAge,
	getStudentFullName
} from '@/features/students/format'
import { TIMEZONE_OPTIONS } from '@/features/students/timezones'
import { formatDate } from '@/features/teachers/format'

// TODO: заменить на API, когда появятся эндпоинты занятий, оплат
// и предпочтительного времени ученика.
const lessons: StudentLesson[] = []
const payments: StudentPayment[] = []
const preferredTimes: StudentPreferredTime[] = []

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
						<Stat label='Остаток' value='—' tone='accent' />
						<Stat label='Посещаемость' value='—' />
					</div>
				</div>
			</div>
		</section>
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

function Lessons() {
	return (
		<SectionCard
			title='Посещенные занятия'
			description='Последние темы и короткий результат после урока.'
			icon={CheckCircle2}
		>
			{lessons.length ? (
				<>
					<div className='grid gap-3 md:hidden'>
						{lessons.map(lesson => (
							<div
								key={lesson.id}
								className='min-w-0 rounded-md border border-[#D8DED2] bg-[#FBFCF8] p-3'
							>
								<div className='flex flex-wrap items-center justify-between gap-2'>
									<p className='leading-5 font-medium text-[#101319]'>
										{lesson.date}
									</p>
									<Badge
										variant={
											lesson.result === 'Уверенно'
												? 'success'
												: 'warning'
										}
									>
										{lesson.result}
									</Badge>
								</div>
								<p className='mt-2 text-sm leading-5 text-[#3D453D]'>
									{lesson.topic}
								</p>
								<p className='mt-1 text-xs leading-4 text-[#5D665B]'>
									{lesson.duration}
								</p>
							</div>
						))}
					</div>

					<div className='hidden md:block'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Дата</TableHead>
									<TableHead>Тема</TableHead>
									<TableHead>Длительность</TableHead>
									<TableHead>Результат</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{lessons.map(lesson => (
									<TableRow key={lesson.id}>
										<TableCell className='font-medium text-[#101319]'>
											{lesson.date}
										</TableCell>
										<TableCell className='min-w-56 leading-5 whitespace-normal'>
											{lesson.topic}
										</TableCell>
										<TableCell>{lesson.duration}</TableCell>
										<TableCell>
											<Badge
												variant={
													lesson.result === 'Уверенно'
														? 'success'
														: 'warning'
												}
											>
												{lesson.result}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</>
			) : (
				<p className='text-sm leading-5 text-[#5D665B]'>—</p>
			)}
		</SectionCard>
	)
}

function Payments() {
	return (
		<SectionCard
			title='Оплаты занятий'
			description='Пакеты занятий и текущий платежный статус.'
			icon={ReceiptText}
		>
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
										{payment.amount}
									</p>
									<Badge
										variant={
											payment.status === 'Оплачено'
												? 'success'
												: 'warning'
										}
									>
										{payment.status}
									</Badge>
								</div>
								<p className='mt-2 text-sm leading-5 text-[#3D453D]'>
									{payment.lessons}
								</p>
								<p className='mt-1 text-xs leading-4 text-[#5D665B]'>
									{payment.date}
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
									<TableHead>Статус</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{payments.map(payment => (
									<TableRow key={payment.id}>
										<TableCell className='font-medium text-[#101319]'>
											{payment.date}
										</TableCell>
										<TableCell>{payment.amount}</TableCell>
										<TableCell>{payment.lessons}</TableCell>
										<TableCell>
											<Badge
												variant={
													payment.status ===
													'Оплачено'
														? 'success'
														: 'warning'
												}
											>
												{payment.status}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</>
			) : (
				<p className='text-sm leading-5 text-[#5D665B]'>—</p>
			)}
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
					<Lessons />
					<Payments />
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
