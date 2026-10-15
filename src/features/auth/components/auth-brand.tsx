import { BookOpenCheck } from 'lucide-react'

export function AuthBrand() {
	return (
		<div className='mb-8 flex items-center justify-center gap-3'>
			<div className='flex size-10 items-center justify-center rounded-md bg-[#101319] text-[#F7F8F3]'>
				<BookOpenCheck className='size-5' aria-hidden='true' />
			</div>
			<div>
				<p className='text-lg leading-6 font-semibold'>Tutor Dash</p>
				<p className='text-sm text-[#5D665B]'>Кабинет преподавателя</p>
			</div>
		</div>
	)
}
