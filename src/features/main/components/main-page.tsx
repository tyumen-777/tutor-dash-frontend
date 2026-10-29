'use client'

import { useDashboardSummary } from '../api/use-dashboard-summary'

import { ActionPrioritiesCard } from './action-priorities-card'
import { DayScheduleCard } from './day-schedule-card'
import { HeroSection } from './hero-section'
import { MetricsGrid } from './metrics-grid'
import { SalesPipelineCard } from './sales-pipeline-card'
import { StudentHealthCard } from './student-health-card'
import { TeachersWorkloadCard } from './teachers-workload-card'

export default function MainPage() {
	const { data: summary, isError } = useDashboardSummary()

	return (
		<main className='min-h-svh bg-[#FBFCF8] text-[#101319]'>
			<div className='mx-auto flex w-full max-w-[1480px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8 lg:py-6'>
				{isError ? (
					<p
						role='alert'
						className='rounded-md border border-[#F0C9C2] bg-[#FFF4F1] px-4 py-3 text-sm text-[#8F332A]'
					>
						Не удалось загрузить сводку. Обновите страницу или
						попробуйте позже.
					</p>
				) : null}

				<section className='grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.6fr)]'>
					<HeroSection summary={summary} />
					<ActionPrioritiesCard summary={summary} />
				</section>

				<MetricsGrid summary={summary} />

				<section className='grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'>
					<SalesPipelineCard />
					<DayScheduleCard lessons={summary?.todayLessons} />
				</section>

				<section className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]'>
					<TeachersWorkloadCard teachers={summary?.teachers} />
					<StudentHealthCard summary={summary} />
				</section>
			</div>
		</main>
	)
}
