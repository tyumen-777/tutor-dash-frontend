import { redirect } from 'next/navigation'

import { getSession } from '@/features/auth/session'

export default async function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getSession()

	if (session) {
		redirect('/')
	}

	return <main>{children}</main>
}
