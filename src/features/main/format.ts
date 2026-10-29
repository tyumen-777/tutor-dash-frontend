const pluralRules = new Intl.PluralRules('ru-RU')

export function pluralize(
	count: number,
	forms: { one: string; few: string; many: string }
) {
	const rule = pluralRules.select(count)
	const form =
		rule === 'one' ? forms.one : rule === 'few' ? forms.few : forms.many

	return `${count} ${form}`
}

export function formatHours(minutes: number) {
	const hours = Math.round((minutes / 60) * 10) / 10

	return `${hours.toLocaleString('ru-RU')} ч`
}

/**
 * Change against the previous period in whole percent, or null when there
 * is nothing to compare with.
 */
export function getPercentChange(current: string, previous: string) {
	const base = Number(previous)

	if (base <= 0) return null

	return Math.round(((Number(current) - base) / base) * 100)
}
