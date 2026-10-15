import { GraduationCap } from 'lucide-react'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { cn } from '@/lib/utils'

import type { TeacherLoad } from './data'

function WorkloadBar({ value }: { value: number }) {
	return (
		<div className='h-2 overflow-hidden rounded-full bg-[#E8EEE2]'>
			<div
				className={cn(
					'h-full rounded-full',
					value > 85
						? 'bg-[#C95E4F]'
						: value > 70
							? 'bg-[#C48A3A]'
							: 'bg-[#3F7A54]'
				)}
				style={{ width: `${value}%` }}
			/>
		</div>
	)
}

export function TeachersWorkloadCard({
	teachers
}: {
	teachers: TeacherLoad[]
}) {
	return (
		<Card className='rounded-lg border-[#D8DED2] bg-white shadow-none'>
			<CardHeader>
				<CardTitle>Загрузка преподавателей</CardTitle>
				<CardDescription>
					Держим баланс между выручкой, качеством и риском выгорания.
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				{teachers.map(teacher => (
					<div
						key={teacher.name}
						className='grid gap-3 rounded-md border border-[#D8DED2] p-3 sm:grid-cols-[minmax(0,1fr)_96px_88px]'
					>
						<div className='min-w-0 space-y-2'>
							<div className='flex items-center gap-2'>
								<GraduationCap
									className='size-4 shrink-0 text-[#3F7A54]'
									aria-hidden='true'
								/>
								<p className='truncate text-sm font-semibold'>
									{teacher.name}
								</p>
							</div>
							<WorkloadBar value={teacher.load} />
						</div>
						<div>
							<p className='text-xs text-[#66715F]'>Ученики</p>
							<p className='font-mono text-lg font-semibold'>
								{teacher.students}
							</p>
						</div>
						<div>
							<p className='text-xs text-[#66715F]'>Удержание</p>
							<p className='font-mono text-lg font-semibold'>
								{teacher.retention}
							</p>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	)
}
