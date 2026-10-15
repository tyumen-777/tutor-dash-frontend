import { ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import type { PipelineStep } from './data'

export function SalesPipelineCard({ pipeline }: { pipeline: PipelineStep[] }) {
	return (
		<Card className='rounded-lg border-[#D8DED2] bg-white shadow-none'>
			<CardHeader>
				<CardTitle>Воронка продаж</CardTitle>
				<CardDescription>
					От заявки до оплаты за последние 7 дней.
				</CardDescription>
				<CardAction>
					<Button variant='ghost' size='sm'>
						Сделки
						<ChevronRight className='size-4' aria-hidden='true' />
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent className='space-y-4'>
				{pipeline.map((step, index) => (
					<div key={step.label} className='space-y-2'>
						<div className='flex items-center justify-between gap-3'>
							<div className='flex min-w-0 items-center gap-2'>
								<span
									className='size-2.5 rounded-full'
									style={{ backgroundColor: step.accent }}
								/>
								<span className='truncate text-sm font-medium'>
									{step.label}
								</span>
							</div>
							<span className='font-mono text-sm font-semibold'>
								{step.value}
							</span>
						</div>
						<div className='h-3 overflow-hidden rounded-full bg-[#EEF2EA]'>
							<div
								className='h-full rounded-full'
								style={{
									width: `${Math.max(18, (step.value / 64) * 100)}%`,
									backgroundColor: step.accent
								}}
							/>
						</div>
						{index === 1 ? (
							<p className='text-xs leading-5 text-[#66715F]'>
								Главная потеря сейчас между пробным уроком и
								первой оплатой.
							</p>
						) : null}
					</div>
				))}
			</CardContent>
		</Card>
	)
}
