import { CheckCircle2 } from 'lucide-react'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { cn } from '@/lib/utils'

import type { ActionAlert } from './data'

export function ActionPrioritiesCard({ alerts }: { alerts: ActionAlert[] }) {
	return (
		<Card className='rounded-lg border-[#D8DED2] bg-[#F3F6EF] shadow-none'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<CheckCircle2 className='size-5 text-[#1F5A3D]' />
					Что сделать сегодня
				</CardTitle>
				<CardDescription>
					Приоритеты, которые сильнее всего влияют на деньги и
					удержание.
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-3'>
				{alerts.map(alert => {
					const Icon = alert.icon

					return (
						<div
							key={alert.title}
							className='grid grid-cols-[36px_minmax(0,1fr)] gap-3 rounded-md border border-[#D8DED2] bg-white p-3'
						>
							<div
								className={cn(
									'flex size-9 items-center justify-center rounded-md',
									alert.tone === 'danger'
										? 'bg-[#FFE4DE] text-[#A33D32]'
										: 'bg-[#FFF3C4] text-[#806129]'
								)}
							>
								<Icon className='size-4' aria-hidden='true' />
							</div>
							<div className='min-w-0'>
								<p className='text-sm leading-5 font-semibold'>
									{alert.title}
								</p>
								<p className='text-sm leading-5 text-[#66715F]'>
									{alert.text}
								</p>
							</div>
						</div>
					)
				})}
			</CardContent>
		</Card>
	)
}
