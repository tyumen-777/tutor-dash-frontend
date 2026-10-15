import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { cn } from '@/lib/utils'

import type { RevenueMetric } from './data'

export function MetricCard({ metric }: { metric: RevenueMetric }) {
	const Icon = metric.icon
	const isDanger = metric.tone === 'danger'
	const isWarning = metric.tone === 'warning'

	return (
		<Card className='rounded-lg border-[#DDE4D8] bg-white shadow-none'>
			<CardHeader className='gap-3'>
				<div className='flex items-start justify-between gap-3'>
					<div className='space-y-1'>
						<CardDescription className='text-xs font-medium tracking-[0.08em] text-[#66715F] uppercase'>
							{metric.label}
						</CardDescription>
						<CardTitle className='text-2xl leading-none font-semibold tracking-normal text-[#101319] sm:text-3xl'>
							{metric.value}
						</CardTitle>
					</div>
					<div
						className={cn(
							'flex size-9 shrink-0 items-center justify-center rounded-md',
							isDanger
								? 'bg-[#FFE4DE] text-[#A33D32]'
								: isWarning
									? 'bg-[#FFF3C4] text-[#806129]'
									: 'bg-[#E4EEE7] text-[#1F5A3D]'
						)}
					>
						<Icon className='size-4' aria-hidden='true' />
					</div>
				</div>
			</CardHeader>
			<CardContent className='flex items-center justify-between gap-3'>
				<p className='min-w-0 text-sm leading-5 text-[#66715F]'>
					{metric.detail}
				</p>
				<Badge
					variant={
						isDanger
							? 'destructive'
							: isWarning
								? 'warning'
								: 'success'
					}
					className='shrink-0'
				>
					{metric.tone === 'good' ? (
						<ArrowUpRight aria-hidden='true' />
					) : (
						<ArrowDownRight aria-hidden='true' />
					)}
					{metric.delta}
				</Badge>
			</CardContent>
		</Card>
	)
}
