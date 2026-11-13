'use client'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { Plus, UserRoundX, WalletCards } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { SectionCard, Stat } from '@/components/profile/profile-cards'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { formatMoney } from '@/lib/format-money'
import { schoolToday } from '@/lib/school-time'

import { useMyEarnings, useMyTeacher } from './api/use-me'
import type {
	MyEarningsResponse,
	TeacherResponse
} from '@/api/generated/models'
import { useSchoolTimezone } from '@/features/auth/api/use-organization-role'
import { formatLessons } from '@/features/income/payment-options'
import { LessonFormDialog } from '@/features/lessons/lesson-form-dialog'
import {
	useTeacherLessons,
	useTeacherStudents
} from '@/features/teacher/api/use-teacher-activity'
import {
	Contacts,
	Schedule,
	Students,
	getMonthPeriod
} from '@/features/teacher/teacher-profile-page'
import { formatDate, formatHourlyRate } from '@/features/teachers/format'

function Header({
	teacher,
	earnings,
	monthLabel,
	onAddLesson
}: {
	teacher: TeacherResponse
	earnings: MyEarningsResponse | undefined
	monthLabel: string
	onAddLesson: () => void
}) {
	const money = (value: string) =>
		earnings ? formatMoney(value, earnings.currency) : '—'
	const toPay = earnings
		? String(Number(earnings.due) + Number(earnings.dueBefore))
		: '0'

	return (
		<section className='rounded-lg border border-[#C9D6CC] bg-[#F7F8F3] p-5 sm:p-6'>
			<div className='flex flex-wrap items-start justify-between gap-4'>
				<div className='min-w-0'>
					<p className='text-sm leading-5 text-[#5D665B]'>
						Личный кабинет
					</p>
					<h1 className='mt-1 text-2xl leading-8 font-semibold tracking-normal text-[#101319]'>
						{teacher.fullName}
					</h1>
					<div className='mt-2 flex flex-wrap items-center gap-2 text-sm leading-5 text-[#3D453D]'>
						<Badge variant='outline'>
							Ставка {formatHourlyRate(teacher.hourlyRate)}
						</Badge>
						<span>Работаете с {formatDate(teacher.startedOn)}</span>
					</div>
				</div>
				<Button size='lg' onClick={onAddLesson}>
					<Plus data-icon='inline-start' />
					Добавить занятие
				</Button>
			</div>

			<div className='mt-5 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
				<Stat
					label={`Заработок · ${monthLabel}`}
					value={money(earnings?.accrued ?? '0')}
					tone='accent'
				/>
				<Stat
					label={`Занятий · ${monthLabel}`}
					value={earnings ? String(earnings.lessonsCount) : '—'}
				/>
				<Stat
					label={`Выплачено · ${monthLabel}`}
					value={money(earnings?.paid ?? '0')}
				/>
				<Stat label='К выплате' value={money(toPay)} />
			</div>
			{earnings && Number(earnings.dueBefore) > 0 ? (
				<p className='mt-3 text-sm leading-5 text-[#3D453D]'>
					В том числе за прошлые месяцы:{' '}
					{formatMoney(earnings.dueBefore, earnings.currency)}
				</p>
			) : null}
		</section>
	)
}

function Payouts({
	earnings,
	monthLabel
}: {
	earnings: MyEarningsResponse | undefined
	monthLabel: string
}) {
	const payouts = earnings?.payouts ?? []

	return (
		<SectionCard
			title='Выплаты'
			description={`Выплаты школы за ${monthLabel}.`}
			icon={WalletCards}
		>
			{!earnings ? (
				<Skeleton className='h-16 w-full rounded-md' />
			) : payouts.length ? (
				<ul className='grid gap-2'>
					{payouts.map(payout => (
						<li
							key={payout.id}
							className='flex items-center justify-between gap-3 rounded-md border border-[#D8DED2] bg-[#FBFCF8] px-3 py-2'
						>
							<div className='min-w-0'>
								<p className='text-sm leading-5 font-medium text-[#101319]'>
									{formatDate(payout.paidOn)}
								</p>
								<p className='text-xs leading-4 text-[#5D665B]'>
									{payout.lessonsCount
										? formatLessons(payout.lessonsCount)
										: 'Без привязки к занятиям'}
								</p>
							</div>
							<p className='text-sm font-semibold text-[#1F5A3D] tabular-nums'>
								{formatMoney(payout.amount, earnings.currency)}
							</p>
						</li>
					))}
				</ul>
			) : (
				<p className='text-sm leading-5 text-[#5D665B]'>
					В этом месяце выплат не было.
				</p>
			)}
		</SectionCard>
	)
}

function NotLinked() {
	return (
		<section className='grid justify-items-start gap-4 rounded-lg border border-[#C9D6CC] bg-[#F7F8F3] p-6'>
			<div className='flex size-10 items-center justify-center rounded-md bg-[#E4EEE7] text-[#1F5A3D]'>
				<UserRoundX className='size-5' aria-hidden />
			</div>
			<div>
				<h1 className='text-lg leading-7 font-semibold text-[#101319]'>
					Карточка преподавателя не привязана
				</h1>
				<p className='mt-1 text-sm leading-6 text-[#3D453D]'>
					Попросите администратора школы пригласить вас из карточки
					преподавателя.
				</p>
			</div>
			<Button
				variant='outline'
				size='sm'
				nativeButton={false}
				render={<Link href='/lessons' />}
			>
				К занятиям
			</Button>
		</section>
	)
}

function CabinetContent() {
	const { data: teacher, isPending, error } = useMyTeacher()

	if (isPending) {
		return (
			<>
				<Skeleton className='h-56 w-full rounded-lg' />
				<Skeleton className='h-96 w-full rounded-lg' />
			</>
		)
	}

	if (error || !teacher) {
		return error?.response?.status === 404 ? (
			<NotLinked />
		) : (
			<p className='text-sm text-[#5D665B]'>
				Не удалось загрузить кабинет. Обновите страницу.
			</p>
		)
	}

	return <CabinetBody teacher={teacher} />
}

function CabinetBody({ teacher }: { teacher: TeacherResponse }) {
	const timezone = useSchoolTimezone()
	// Месяц — по часам школы, как и итоги на бэкенде
	const [month, setMonth] = useState(() =>
		dayjs(schoolToday(timezone)).startOf('month').toDate()
	)
	const period = useMemo(() => getMonthPeriod(month), [month])
	const monthLabel = dayjs(month).locale('ru').format('MMMM')
	const lessons = useTeacherLessons(teacher.id, period)
	const students = useTeacherStudents(teacher.id)
	const earnings = useMyEarnings(period)
	const [addOpen, setAddOpen] = useState(false)

	return (
		<>
			<Header
				teacher={teacher}
				earnings={earnings.data}
				monthLabel={monthLabel}
				onAddLesson={() => setAddOpen(true)}
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
					<Payouts earnings={earnings.data} monthLabel={monthLabel} />
					<Contacts teacher={teacher} />
				</div>
			</div>

			<LessonFormDialog
				ownTeacher={teacher}
				open={addOpen}
				onOpenChange={setAddOpen}
			/>
		</>
	)
}

export default function MyCabinetPage() {
	return (
		<main className='mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-8'>
			<CabinetContent />
		</main>
	)
}
