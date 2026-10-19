import {
	ArrowLeft,
	CalendarClock,
	CheckCircle2,
	Clock3,
	Mail,
	MessageCircle,
	Phone,
	ReceiptText,
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

import { type StudentProfile, getStudentProfile } from './student-data'

type StudentProfilePageProps = {
	studentId: string
}

function ProfileHeader({ student }: { student: StudentProfile }) {
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
							{student.fullName
								.split(' ')
								.map(part => part[0])
								.join('')}
						</div>
						<div className='min-w-0'>
							<h1 className='text-2xl leading-8 font-semibold tracking-normal'>
								{student.fullName}
							</h1>
							<p className='mt-1 text-sm leading-5 text-white/70'>
								{student.age} лет, {student.level}
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
								{student.goal}
							</p>
						</div>
						<div>
							<p className='text-sm leading-5 text-white/60'>
								Преподаватель
							</p>
							<p className='mt-1 text-sm leading-5 font-medium text-white'>
								{student.teacher}
							</p>
						</div>
					</div>
				</aside>

				<div className='grid content-between gap-6 p-5 sm:p-6'>
					<div>
						<div className='flex flex-wrap items-center gap-2'>
							<Badge variant='success'>Активный ученик</Badge>
							<Badge variant='outline'>ID: {student.id}</Badge>
						</div>
						<p className='mt-4 max-w-2xl text-sm leading-6 text-[#3D453D]'>
							Профиль собран как рабочая карточка преподавателя:
							ближайшее занятие, остаток, контакты и история
							доступны без переходов.
						</p>
					</div>

					<div className='grid min-w-0 gap-3 sm:grid-cols-3'>
						<Stat
							label='Следующее занятие'
							value={student.nextLesson}
						/>
						<Stat
							label='Остаток'
							value={student.balance}
							tone='accent'
						/>
						<Stat label='Посещаемость' value={student.attendance} />
					</div>
				</div>
			</div>
		</section>
	)
}

function Contacts({ student }: { student: StudentProfile }) {
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
					value={student.contacts.phone}
				/>
				<ContactRow
					icon={Mail}
					label='Почта'
					value={student.contacts.email}
				/>
				<ContactRow
					icon={MessageCircle}
					label='Мессенджер'
					value={student.contacts.messenger}
				/>
				<ContactRow
					icon={UsersRound}
					label='Родитель'
					value={student.contacts.parent}
				/>
			</div>
		</SectionCard>
	)
}

function Lessons({ student }: { student: StudentProfile }) {
	return (
		<SectionCard
			title='Посещенные занятия'
			description='Последние темы и короткий результат после урока.'
			icon={CheckCircle2}
		>
			<div className='grid gap-3 md:hidden'>
				{student.lessons.map(lesson => (
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
						{student.lessons.map(lesson => (
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
		</SectionCard>
	)
}

function Payments({ student }: { student: StudentProfile }) {
	return (
		<SectionCard
			title='Оплаты занятий'
			description='Пакеты занятий и текущий платежный статус.'
			icon={ReceiptText}
		>
			<div className='grid gap-3 md:hidden'>
				{student.payments.map(payment => (
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
						{student.payments.map(payment => (
							<TableRow key={payment.id}>
								<TableCell className='font-medium text-[#101319]'>
									{payment.date}
								</TableCell>
								<TableCell>{payment.amount}</TableCell>
								<TableCell>{payment.lessons}</TableCell>
								<TableCell>
									<Badge
										variant={
											payment.status === 'Оплачено'
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
		</SectionCard>
	)
}

function PreferredTime({ student }: { student: StudentProfile }) {
	return (
		<SectionCard
			title='Предпочтительное время'
			description='Окна, в которые проще назначать регулярные занятия.'
			icon={CalendarClock}
		>
			<div className='grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-1'>
				{student.preferredTimes.map(slot => (
					<div
						key={`${slot.day}-${slot.time}`}
						className='grid gap-3 rounded-md border border-[#D8DED2] bg-[#FBFCF8] p-3'
					>
						<div className='flex items-center justify-between gap-3'>
							<p className='leading-5 font-medium text-[#101319]'>
								{slot.day}
							</p>
							<Badge variant='outline'>{slot.format}</Badge>
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
		</SectionCard>
	)
}

function Notes({ student }: { student: StudentProfile }) {
	return (
		<SectionCard title='Общая информация' icon={UserRound}>
			<div className='space-y-3'>
				{student.notes.map(note => (
					<p
						key={note}
						className='rounded-md border border-[#D8DED2] bg-[#FBFCF8] px-3 py-2 text-sm leading-6 text-[#3D453D]'
					>
						{note}
					</p>
				))}
			</div>
		</SectionCard>
	)
}

export default function StudentProfilePage({
	studentId
}: StudentProfilePageProps) {
	const student = getStudentProfile(studentId)

	return (
		<main className='mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-8'>
			<ProfileHeader student={student} />

			<div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]'>
				<div className='grid min-w-0 gap-4'>
					<Contacts student={student} />
					<Lessons student={student} />
					<Payments student={student} />
				</div>
				<div className='grid min-w-0 content-start gap-4'>
					<Notes student={student} />
					<PreferredTime student={student} />
				</div>
			</div>
		</main>
	)
}
