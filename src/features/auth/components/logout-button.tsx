'use client'

import { LogOut } from 'lucide-react'

import { SidebarMenuButton } from '@/components/ui/sidebar'

import { useLogout } from '../api/use-logout'

export function LogoutButton() {
	const logout = useLogout()
	const isPending = logout.isPending || logout.isSuccess

	return (
		<SidebarMenuButton
			size='lg'
			tooltip='Выйти'
			disabled={isPending}
			onClick={() => logout.mutate()}
			className='text-sidebar-foreground/80 hover:text-destructive'
		>
			<LogOut aria-hidden='true' />
			<span className='group-data-[collapsible=icon]:hidden'>
				{isPending ? 'Выходим…' : 'Выйти'}
			</span>
		</SidebarMenuButton>
	)
}
