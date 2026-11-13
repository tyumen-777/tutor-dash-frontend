'use client'

import { ShieldX } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

import { useIsTeacherOnly } from '@/features/auth/api/use-organization-role'
import { isTeacherPath } from '@/features/auth/organization-role'

// Ссылки на профиль преподавателя у учителя ведут на него самого
const TEACHER_PROFILE_PREFIX = '/teacher/'

function NoAccess() {
	return (
		<main className='mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8 lg:py-8'>
			<section className='grid justify-items-start gap-4 rounded-lg border border-[#C9D6CC] bg-[#F7F8F3] p-6'>
				<div className='flex size-10 items-center justify-center rounded-md bg-[#E4EEE7] text-[#1F5A3D]'>
					<ShieldX className='size-5' aria-hidden />
				</div>
				<div>
					<h1 className='text-lg leading-7 font-semibold text-[#101319]'>
						Раздел недоступен
					</h1>
					<p className='mt-1 text-sm leading-6 text-[#3D453D]'>
						Этот раздел открыт только администрации школы.
					</p>
				</div>
				<Button
					variant='outline'
					size='sm'
					nativeButton={false}
					render={<Link href='/me' />}
				>
					В личный кабинет
				</Button>
			</section>
		</main>
	)
}

/**
 * Keeps a teacher-only member inside their sections. The backend refuses the
 * data anyway; this replaces broken pages with a clear message.
 */
export function TeacherRouteGuard({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const router = useRouter()
	const isTeacherOnly = useIsTeacherOnly()
	// После входа без перезагрузки страницы серверный редирект с «/» не срабатывает
	const shouldRedirect =
		isTeacherOnly &&
		(pathname === '/' || pathname.startsWith(TEACHER_PROFILE_PREFIX))

	useEffect(() => {
		if (shouldRedirect) router.replace('/me')
	}, [shouldRedirect, router])

	if (!isTeacherOnly || isTeacherPath(pathname)) {
		return children
	}

	return shouldRedirect ? null : <NoAccess />
}
