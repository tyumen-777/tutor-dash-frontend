import { UserRoundCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

export function StudentHealthCard() {
	return (
		<Card className='rounded-lg border-[#D8DED2] bg-[#EEF4F6] shadow-none'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<UserRoundCheck className='size-5 text-[#315F72]' />
					Здоровье базы
				</CardTitle>
				<CardDescription>
					Быстрый взгляд на удержание учеников.
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='rounded-md bg-white p-4'>
					<p className='text-xs font-medium tracking-[0.08em] text-[#66715F] uppercase'>
						Средняя длина обучения
					</p>
					<p className='mt-2 text-3xl leading-none font-semibold'>
						8,4 мес
					</p>
				</div>
				<div className='grid grid-cols-2 gap-3'>
					<div className='rounded-md bg-white p-3'>
						<p className='text-xs text-[#66715F]'>На паузе</p>
						<p className='font-mono text-xl font-semibold'>18</p>
					</div>
					<div className='rounded-md bg-white p-3'>
						<p className='text-xs text-[#66715F]'>No-show</p>
						<p className='font-mono text-xl font-semibold'>4,8%</p>
					</div>
				</div>
				<Button className='w-full bg-[#101319] text-white hover:bg-[#263027]'>
					Открыть учеников в риске
				</Button>
			</CardContent>
		</Card>
	)
}
