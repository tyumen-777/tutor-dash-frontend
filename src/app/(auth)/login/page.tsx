import AuthPage from '@/features/auth'
import { getSafeRedirectPath } from '@/features/auth/redirect'

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
	const { from } = await searchParams

	return <AuthPage redirectTo={getSafeRedirectPath(from)} />
}
