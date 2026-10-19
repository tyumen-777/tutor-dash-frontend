'use client'

import { useLogout } from '../api/use-logout'

import { AuthBrand } from './auth-brand'
import { AuthSupport } from './auth-support'
import { NoOrganizations } from './no-organizations'
import { OrganizationPicker } from './organization-picker'
import type { AuthSessionResponse } from '@/api/generated/models'

export function OrganizationSelectPage({
	session,
	redirectTo
}: {
	session: AuthSessionResponse
	redirectTo: string
}) {
	const logout = useLogout()
	const isLoggingOut = logout.isPending || logout.isSuccess
	const { email } = session.user
	const hasOrganizations = session.organizations.length > 0

	return (
		<main className='flex min-h-dvh items-center justify-center bg-[#F7F8F3] px-5 py-8 text-[#101319] sm:px-8'>
			<div className='w-full max-w-md'>
				<AuthBrand />
				{hasOrganizations ? (
					<OrganizationPicker
						email={email}
						organizations={session.organizations}
						redirectTo={redirectTo}
					/>
				) : (
					<NoOrganizations email={email} />
				)}
				{!hasOrganizations && <AuthSupport />}
				<p className='mt-4 text-center text-sm leading-6 text-[#5D665B]'>
					<button
						type='button'
						disabled={isLoggingOut}
						onClick={() => logout.mutate()}
						className='font-medium text-[#3F624B] underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-[#7E9B88]/30 focus-visible:outline-none disabled:opacity-60'
					>
						{isLoggingOut ? 'Выходим…' : 'Войти в другой аккаунт'}
					</button>
				</p>
			</div>
		</main>
	)
}
