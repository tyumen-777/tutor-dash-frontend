import { redirect } from 'next/navigation'

import {
	isTeacherOnly,
	parseOrganizationRoles
} from '@/features/auth/organization-role'
import { getSession } from '@/features/auth/session'
import MainPage from '@/features/main'

export default async function Home() {
	const session = await getSession()
	const organization = session?.organizations.find(
		item => item.id === session.session.activeOrganizationId
	)

	// Сводка школы — про деньги и всех учителей; преподаватель начинает с кабинета
	if (
		organization &&
		isTeacherOnly(parseOrganizationRoles(organization.role))
	) {
		redirect('/me')
	}

	return <MainPage />
}
