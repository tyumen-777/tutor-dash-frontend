import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import type { LucideIcon } from 'lucide-react'
import { BookOpenCheck, Sparkles, Target, TrendingUp } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

import { cn } from '@/lib/utils'

import type { DashboardSummaryResponse } from '@/api/generated/models'

type FocusItem = {
	label: string
	value: string
	icon: LucideIcon
}

// Прочерк — показатель, для которого в системе пока нет данных
const NO_DATA = '—'

export function HeroSection({
	summary
}: {
	summary?: DashboardSummaryResponse
}) {
	const today = dayjs(summary?.today).locale('ru')
	const lessonsToday = summary ? String(summary.lessons.todayCount) : NO_DATA

	const focusItems: FocusItem[] = [
		{ label: 'План-факт', value: NO_DATA, icon: Target },
		{ label: 'Конверсия в оплату', value: NO_DATA, icon: TrendingUp },
		{ label: 'Уроков сегодня', value: lessonsToday, icon: BookOpenCheck },
		{ label: 'NPS уроков', value: NO_DATA, icon: Sparkles }
	]

	const controlSignals = [
		{ label: 'Деньги', value: NO_DATA },
		{ label: 'Продажи', value: NO_DATA },
		{ label: 'Уроки', value: lessonsToday },
		{
			label: 'Риски',
			value: summary ? String(summary.students.lowBalanceCount) : NO_DATA
		}
	]

	return (
		<Card className='relative rounded-lg border-[#D8DED2] bg-[#101319] p-0 text-white shadow-none'>
			<div className='grid gap-0 lg:grid-cols-[minmax(0,1fr)_240px]'>
				<div className='space-y-6 p-5 sm:p-7'>
					<div className='flex flex-wrap items-center gap-2'>
						<Badge className='bg-[#FFE4DE] text-[#8F332A] hover:bg-[#FFE4DE]'>
							CEO-пульт
						</Badge>
						<Badge
							variant='outline'
							className='border-white/20 text-white/75'
						>
							Сегодня, {today.format('D MMMM')}
						</Badge>
					</div>

					<div className='max-w-3xl space-y-3'>
						<h1 className='text-3xl leading-[1.05] font-semibold tracking-normal text-balance sm:text-5xl'>
							Сводка школы за {today.format('MMMM')}
						</h1>
						<p className='max-w-2xl text-sm leading-6 text-white/68 sm:text-base'>
							Деньги, ученики и занятия в одном рабочем экране.
							Прочерк — показатель, для которого в системе пока
							нет данных.
						</p>
					</div>

					<div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-4'>
						{focusItems.map(item => {
							const Icon = item.icon

							return (
								<div
									key={item.label}
									className='rounded-md border border-white/10 bg-white/[0.06] p-3'
								>
									<div className='mb-3 flex items-center justify-between gap-2 text-white/55'>
										<span className='text-xs font-medium tracking-[0.08em] uppercase'>
											{item.label}
										</span>
										<Icon
											className='size-4'
											aria-hidden='true'
										/>
									</div>
									<p className='text-2xl leading-none font-semibold'>
										{item.value}
									</p>
								</div>
							)
						})}
					</div>
				</div>

				<div className='border-t border-white/10 p-5 lg:border-t-0 lg:border-l'>
					<div className='grid h-full grid-cols-4 gap-2 lg:grid-cols-1'>
						{controlSignals.map((signal, index) => (
							<div
								key={signal.label}
								className={cn(
									'flex min-h-16 flex-col justify-between rounded-md border border-white/10 p-3',
									index === 3
										? 'bg-[#C95E4F]'
										: 'bg-white/[0.06]'
								)}
							>
								<span className='text-[0.68rem] font-medium tracking-[0.08em] text-white/60 uppercase'>
									{signal.label}
								</span>
								<span className='font-mono text-lg font-semibold'>
									{signal.value}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</Card>
	)
}
