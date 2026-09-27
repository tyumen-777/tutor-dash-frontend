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
