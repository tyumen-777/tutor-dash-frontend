import { redirect } from 'next/navigation'

import { OrganizationSelectPage } from '@/features/auth/components/organization-select-page'
import { getSafeRedirectPath } from '@/features/auth/redirect'
import { getSession } from '@/features/auth/session'

export default async function SelectOrganizationPage({
	searchParams
}: PageProps<'/select-organization'>) {
	const [session, { from }] = await Promise.all([getSession(), searchParams])
	const redirectTo = getSafeRedirectPath(from)

	if (!session) {
		redirect('/login')
	}

	if (session.session.activeOrganizationId) {
		redirect(redirectTo)
	}

	return <OrganizationSelectPage session={session} redirectTo={redirectTo} />
}
