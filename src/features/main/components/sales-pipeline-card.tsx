import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

const pipeline = [
	{ label: 'Новые лиды', accent: '#315F72' },
	{ label: 'Пробный урок', accent: '#3F7A54' },
	{ label: 'Ожидают оплату', accent: '#C48A3A' },
	{ label: 'Оплатили', accent: '#C95E4F' }
]

// Заявки и пробные уроки пока не ведутся в системе — этапы показаны без данных
export function SalesPipelineCard() {
	return (
		<Card className='rounded-lg border-[#D8DED2] bg-white shadow-none'>
			<CardHeader>
				<CardTitle>Воронка продаж</CardTitle>
				<CardDescription>
					От заявки до оплаты за последние 7 дней.
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				{pipeline.map(step => (
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
								—
							</span>
						</div>
						<div className='h-3 rounded-full bg-[#EEF2EA]' />
					</div>
				))}
				<p className='text-xs leading-5 text-[#66715F]'>
					Появится, когда в системе начнут вестись заявки и пробные
					уроки.
				</p>
			</CardContent>
		</Card>
	)
}
