import { cookies } from 'next/headers'
import { cache } from 'react'

import { SESSION_COOKIE_NAMES } from './session-cookie'
import type { AuthSessionResponse } from '@/api/generated/models'

/**
 * Server-side session check. Forwards the incoming cookies to `/auth/me` and
 * returns the session, or `null` if the user is not authenticated.
 */
export const getSession = cache(
	async (): Promise<AuthSessionResponse | null> => {
		const cookieStore = await cookies()
		const hasSessionCookie = SESSION_COOKIE_NAMES.some(name =>
			cookieStore.has(name)
		)

		if (!hasSessionCookie) {
			return null
		}

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
				{
					headers: {
						Accept: 'application/json',
						cookie: cookieStore.toString()
					},
					cache: 'no-store'
				}
			)

			if (!response.ok) {
				return null
			}

			return (await response.json()) as AuthSessionResponse
		} catch {
			return null
		}
	}
)
