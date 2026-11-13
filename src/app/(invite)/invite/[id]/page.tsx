import { getSession } from '@/features/auth/session'
import { InvitePage } from '@/features/invite/invite-page'

export default async function InviteRoute({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const [{ id }, session] = await Promise.all([params, getSession()])

	return (
		<InvitePage
			invitationId={id}
			sessionEmail={session?.user.email ?? null}
		/>
	)
}
