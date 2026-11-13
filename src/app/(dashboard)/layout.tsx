import { redirect } from 'next/navigation'

import { AppSidebar } from '@/components/layout/app-sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

import { SessionHydrator } from '@/features/auth/components/session-hydrator'
import { getSession } from '@/features/auth/session'

export default async function DashboardLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getSession()

	if (!session) {
		redirect('/login')
	}

	if (!session.session.activeOrganizationId) {
		redirect('/select-organization')
	}

	return (
		<SessionHydrator session={session}>
			<TooltipProvider>
				<AppSidebar>{children}</AppSidebar>
			</TooltipProvider>
		</SessionHydrator>
	)
}
