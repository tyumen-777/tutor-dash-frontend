import dayjs, { type Dayjs } from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Lesson times are entered and shown in the school timezone, not the
 * browser one, so every employee sees the same days and periods as the
 * backend reports.
 */
export function toSchoolTime(value: string | Date, timezone: string): Dayjs {
	return dayjs(value).tz(timezone)
}

export function schoolNow(timezone: string): Dayjs {
	return dayjs().tz(timezone)
}

/**
 * The moment of a date (YYYY-MM-DD) and time (HH:mm) on the school clock.
 */
export function fromSchoolTime(
	date: string,
	time: string,
	timezone: string
): Dayjs {
	return dayjs.tz(`${date}T${time}`, timezone)
}

/**
 * Today on the school clock as a local Date for calendar widgets, which
 * work with plain calendar days.
 */
export function schoolToday(timezone: string): Date {
	return dayjs(schoolNow(timezone).format('YYYY-MM-DD')).toDate()
}

export function getBrowserTimezone() {
	return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Human-readable city of an IANA timezone: «Europe/Moscow» → «Moscow».
 */
export function formatTimezoneCity(timezone: string) {
	return timezone.split('/').at(-1)?.replaceAll('_', ' ') ?? timezone
}
