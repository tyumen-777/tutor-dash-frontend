import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

type ProfileIcon = React.ComponentType<{
	className?: string
	'aria-hidden'?: boolean
}>

export function Stat({
	label,
	value,
	tone = 'default'
}: {
	label: string
	value: string
	tone?: 'default' | 'accent'
}) {
	return (
		<div className='min-w-0 rounded-md border border-[#D8DED2] bg-white px-3 py-2'>
			<p className='text-xs leading-4 text-[#5D665B]'>{label}</p>
			<p
				className={
					tone === 'accent'
						? 'truncate text-lg leading-7 font-semibold text-[#1F5A3D]'
						: 'truncate text-lg leading-7 font-semibold text-[#101319]'
				}
			>
				{value}
			</p>
		</div>
	)
}

export function ContactRow({
	icon: Icon,
	label,
	value
}: {
	icon: ProfileIcon
	label: string
	value: string
}) {
	return (
		<div className='grid grid-cols-[2rem_1fr] gap-3'>
			<div className='flex size-8 items-center justify-center rounded-md bg-[#E4EEE7] text-[#1F5A3D]'>
				<Icon className='size-4' aria-hidden />
			</div>
			<div className='min-w-0'>
				<p className='text-xs leading-4 text-[#5D665B]'>{label}</p>
				<p className='text-sm leading-5 font-medium break-words text-[#101319]'>
					{value}
				</p>
			</div>
		</div>
	)
}

export function SectionCard({
	title,
	description,
	icon: Icon,
	children
}: {
	title: string
	description?: string
	icon: ProfileIcon
	children: React.ReactNode
}) {
	return (
		<Card className='min-w-0 rounded-lg border-[#D8DED2] shadow-none'>
			<CardHeader className='gap-3 sm:grid-cols-[1fr_auto]'>
				<div className='min-w-0'>
					<CardTitle className='text-[1rem] leading-6 text-[#101319]'>
						{title}
					</CardTitle>
					{description ? (
						<CardDescription className='leading-5'>
							{description}
						</CardDescription>
					) : null}
				</div>
				<div className='flex size-9 items-center justify-center rounded-md bg-[#F1F5EF] text-[#1F5A3D]'>
					<Icon className='size-4' aria-hidden />
				</div>
			</CardHeader>
			<CardContent className='min-w-0'>{children}</CardContent>
		</Card>
	)
}
