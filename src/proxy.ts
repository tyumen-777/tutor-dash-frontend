import { type NextRequest, NextResponse } from 'next/server'

import { SESSION_COOKIE_NAMES } from '@/features/auth/session-cookie'

const LOGIN_PATH = '/login'

/**
 * Optimistic auth check: redirects to the login page when there is no session
 * cookie at all. The session itself is validated in the dashboard layout.
 */
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	if (pathname === LOGIN_PATH || pathname.startsWith(`${LOGIN_PATH}/`)) {
		return NextResponse.next()
	}

	const hasSessionCookie = SESSION_COOKIE_NAMES.some(name =>
		request.cookies.has(name)
	)

	if (!hasSessionCookie) {
		return NextResponse.redirect(new URL(LOGIN_PATH, request.nextUrl))
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		// Skip Next.js internals and static files from `public/`
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'
	]
}
