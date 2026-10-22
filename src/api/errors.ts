import { isAxiosError } from 'axios'

type ApiErrorBody = {
	statusCode?: number
	message?: string | string[]
	archivedTeacherId?: string
}

export type ApiError = {
	status: number | undefined
	messages: string[]
	archivedTeacherId: string | undefined
}

/**
 * Backend messages are English and not meant for users: callers branch on the
 * status (and sometimes the raw message) and show their own texts.
 */
export function parseApiError(error: unknown): ApiError {
	if (!isAxiosError<ApiErrorBody>(error)) {
		return { status: undefined, messages: [], archivedTeacherId: undefined }
	}

	const body = error.response?.data
	const message = body?.message

	return {
		status: error.response?.status,
		messages: Array.isArray(message) ? message : message ? [message] : [],
		archivedTeacherId: body?.archivedTeacherId
	}
}

export function hasMessage(error: ApiError, text: string) {
	return error.messages.some(message => message.includes(text))
}

const SELECT_ORGANIZATION_PATH = '/select-organization'

/**
 * Errors shared by every organization endpoint. Returns the text to show, or null
 * when the caller should handle the error itself.
 */
export function getCommonErrorMessage(error: ApiError) {
	if (error.status === 403) {
		if (hasMessage(error, 'Active organization is required')) {
			// Full reload on purpose: it also drops the react-query cache.
			// eslint-disable-next-line @next/next/no-location-assign-relative-destination
			window.location.assign(SELECT_ORGANIZATION_PATH)
			return null
		}

		return 'Недостаточно прав'
	}

	if (error.status === undefined) {
		return 'Нет связи с сервером. Попробуйте ещё раз.'
	}

	return null
}

export const UNKNOWN_ERROR_MESSAGE = 'Что-то пошло не так. Попробуйте ещё раз.'
