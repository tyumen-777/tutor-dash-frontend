import { Building2 } from 'lucide-react'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

export function NoOrganizations({ email }: { email: string }) {
	return (
		<Card className='gap-5 rounded-md border-[#D8DED2] bg-white py-5 shadow-[0_16px_60px_rgba(16,19,25,0.08)] ring-0 sm:py-7'>
			<CardHeader className='px-5 sm:px-7'>
				<div className='mb-3 flex size-10 items-center justify-center rounded-md border border-[#CAD3C6] bg-[#FBFCF8] text-[#7E9B88]'>
					<Building2 className='size-5' aria-hidden='true' />
				</div>
				<CardTitle className='text-2xl leading-8 font-semibold tracking-normal'>
					Нет доступа ни к одной организации
				</CardTitle>
				<CardDescription className='mt-1 text-sm leading-6 text-[#5D665B]'>
					Аккаунт <span className='text-[#101319]'>{email}</span> пока
					не добавлен ни в одну организацию.
				</CardDescription>
			</CardHeader>

			<CardContent className='px-5 sm:px-7'>
				<p className='rounded-md border border-[#D8DED2] bg-[#F7F8F3] px-3 py-2.5 text-sm leading-6 text-[#5D665B]'>
					Попросите администратора школы отправить вам приглашение,
					затем войдите снова.
				</p>
			</CardContent>
		</Card>
	)
}
