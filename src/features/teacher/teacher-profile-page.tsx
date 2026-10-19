import {
	ArrowLeft,
	CalendarDays,
	GraduationCap,
	Mail,
	MessageCircle,
	Phone,
	UserRound
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

import { LessonsCalendar } from './lessons-calendar'
import { type TeacherProfile, getTeacherProfile } from './teacher-data'
import { formatHourlyRate, formatStartedOn } from '@/features/teachers/format'

type TeacherProfilePageProps = {
	teacherId: string
}

function ProfileHeader({ teacher }: { teacher: TeacherProfile }) {
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
								{formatStartedOn(teacher.startedOn)}
							</p>
						</div>
					</div>
				</aside>

				<div className='grid content-between gap-6 p-5 sm:p-6'>
					<div>
						<div className='flex flex-wrap items-center gap-2'>
							{teacher.isActive ? (
								<Badge variant='success'>Активен</Badge>
							) : (
								<Badge variant='outline'>Неактивен</Badge>
							)}
							<Badge variant='outline'>ID: {teacher.id}</Badge>
						</div>
						<p className='mt-4 max-w-2xl text-sm leading-6 text-[#3D453D]'>
							Рабочая карточка преподавателя: занятия в календаре,
							заработок за месяц и ученики в одном месте.
						</p>
					</div>

					<div className='grid min-w-0 gap-3 sm:grid-cols-3'>
						<Stat
							label='Заработок за месяц'
							value={teacher.monthEarnings}
							tone='accent'
						/>
						<Stat
							label='Занятий в месяце'
							value={String(teacher.lessonsThisMonth)}
						/>
						<Stat
							label='Учеников'
							value={String(teacher.students.length)}
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

function Schedule({ teacher }: { teacher: TeacherProfile }) {
	return (
		<SectionCard
			title='Календарь занятий'
			description='Дни с занятиями подчеркнуты. Выберите день, чтобы увидеть расписание.'
			icon={CalendarDays}
		>
			<LessonsCalendar lessons={teacher.lessons} />
		</SectionCard>
	)
}

function Students({ teacher }: { teacher: TeacherProfile }) {
	return (
		<SectionCard
			title='Ученики'
			description='Ученики, закрепленные за преподавателем.'
			icon={GraduationCap}
		>
			{teacher.students.length ? (
				<>
					<div className='grid gap-3 md:hidden'>
						{teacher.students.map(student => (
							<Link
								key={student.id}
								href={`/student/${student.id}`}
								className='min-w-0 rounded-md border border-[#D8DED2] bg-[#FBFCF8] p-3'
							>
								<div className='flex flex-wrap items-center justify-between gap-2'>
									<p className='leading-5 font-medium text-[#101319]'>
										{student.fullName}
									</p>
									<Badge variant='outline'>
										{student.level}
									</Badge>
								</div>
								<p className='mt-2 text-xs leading-4 text-[#5D665B]'>
									Занятий в неделю: {student.lessonsPerWeek}
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
									<TableHead>Занятий в неделю</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{teacher.students.map(student => (
									<TableRow key={student.id}>
										<TableCell className='font-medium text-[#101319]'>
											<Link
												href={`/student/${student.id}`}
												className='hover:underline'
											>
												{student.fullName}
											</Link>
										</TableCell>
										<TableCell>
											<Badge variant='outline'>
												{student.level}
											</Badge>
										</TableCell>
										<TableCell>
											{student.lessonsPerWeek}
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

function Contacts({ teacher }: { teacher: TeacherProfile }) {
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

export default function TeacherProfilePage({
	teacherId
}: TeacherProfilePageProps) {
	const teacher = getTeacherProfile(teacherId)

	return (
		<main className='mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-8'>
			<ProfileHeader teacher={teacher} />

			<div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]'>
				<div className='grid min-w-0 gap-4'>
					<Schedule teacher={teacher} />
					<Students teacher={teacher} />
				</div>
				<div className='grid min-w-0 content-start gap-4'>
					<Contacts teacher={teacher} />
				</div>
			</div>
		</main>
	)
}
