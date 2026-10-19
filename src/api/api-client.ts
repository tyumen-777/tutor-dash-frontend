import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL

if (!baseURL) {
	throw new Error('NEXT_PUBLIC_API_URL is not configured')
}

export const apiClient = axios.create({
	baseURL,
	timeout: 10_000,
	headers: {
		Accept: 'application/json'
	},
	withCredentials: true
})

const LOGIN_PATH = '/login'

/**
 * The session can expire while a page is open. On 401 from any endpoint other
 * than login itself, send the user back to the login page.
 */
apiClient.interceptors.response.use(undefined, (error: AxiosError) => {
	const isUnauthorized = error.response?.status === 401
	const isLoginRequest = error.config?.url === '/auth/login'

	if (
		isUnauthorized &&
		!isLoginRequest &&
		typeof window !== 'undefined' &&
		window.location.pathname !== LOGIN_PATH
	) {
		const from = `${window.location.pathname}${window.location.search}`
		// Full reload on purpose: it also drops the react-query cache.
		// eslint-disable-next-line @next/next/no-location-assign-relative-destination
		window.location.assign(`${LOGIN_PATH}?from=${encodeURIComponent(from)}`)
	}

	return Promise.reject(error)
})

/**
 * Orval mutator. Generated functions pass their Axios config here and receive
 * the response body, while all requests still share the instance above.
 */
export const apiRequest = <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig
): Promise<T> =>
	apiClient({
		...config,
		...options,
		headers: {
			...config.headers,
			...options?.headers
		}
	}).then(({ data }) => data)

export type ErrorType<Error> = AxiosError<Error>
export type BodyType<Body> = Body
