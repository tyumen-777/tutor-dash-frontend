/**
 * Returns a safe in-app path to redirect to after login. Rejects absolute and
 * protocol-relative URLs so the `from` parameter can't be used as an open
 * redirect.
 */
export function getSafeRedirectPath(from: string | string[] | undefined) {
	if (typeof from !== 'string') {
		return '/'
	}

	if (
		!from.startsWith('/') ||
		from.startsWith('//') ||
		from.startsWith('/\\')
	) {
		return '/'
	}

	return from
}
