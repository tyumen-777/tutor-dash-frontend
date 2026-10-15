import { ActionPrioritiesCard } from './action-priorities-card'
import {
	alerts,
	dayLessons,
	focusItems,
	pipeline,
	revenueMetrics,
	teachers
} from './data'
import { DayScheduleCard } from './day-schedule-card'
import { HeroSection } from './hero-section'
import { MetricsGrid } from './metrics-grid'
import { SalesPipelineCard } from './sales-pipeline-card'
import { StudentHealthCard } from './student-health-card'
import { TeachersWorkloadCard } from './teachers-workload-card'

export default function MainPage() {
	return (
		<main className='min-h-svh bg-[#FBFCF8] text-[#101319]'>
			<div className='mx-auto flex w-full max-w-[1480px] flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8 lg:py-6'>
				<section className='grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.6fr)]'>
					<HeroSection focusItems={focusItems} />
					<ActionPrioritiesCard alerts={alerts} />
				</section>

				<MetricsGrid metrics={revenueMetrics} />

				<section className='grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'>
					<SalesPipelineCard pipeline={pipeline} />
					<DayScheduleCard lessons={dayLessons} />
				</section>

				<section className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]'>
					<TeachersWorkloadCard teachers={teachers} />
					<StudentHealthCard />
				</section>
			</div>
		</main>
	)
}
