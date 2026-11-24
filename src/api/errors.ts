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

export const CLOSED_PERIOD_MESSAGE =
	'Месяц закрыт: оплаты, занятия и расходы в нём менять нельзя. Владелец может открыть его в «Настройки → Закрытие месяцев».'

/** The operation touches a month closed in «Настройки → Закрытие месяцев». */
export function isClosedPeriodError(error: ApiError) {
	return error.status === 409 && hasMessage(error, 'is closed')
}

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

	if (isClosedPeriodError(error)) {
		return CLOSED_PERIOD_MESSAGE
	}

	if (error.status === undefined) {
		return 'Нет связи с сервером. Попробуйте ещё раз.'
	}

	return null
}

export const UNKNOWN_ERROR_MESSAGE = 'Что-то пошло не так. Попробуйте ещё раз.'
