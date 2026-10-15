import type { RevenueMetric } from './data'
import { MetricCard } from './metric-card'

export function MetricsGrid({ metrics }: { metrics: RevenueMetric[] }) {
	return (
		<section className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
			{metrics.map(metric => (
				<MetricCard key={metric.label} metric={metric} />
			))}
		</section>
	)
}
