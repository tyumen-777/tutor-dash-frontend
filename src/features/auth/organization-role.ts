const ORGANIZATION_ROLE_LABELS: Record<string, string> = {
	owner: 'Владелец',
	admin: 'Администратор',
	manager: 'Менеджер',
	teacher: 'Преподаватель',
	accountant: 'Бухгалтер'
}

/**
 * better-auth stores multiple roles as a comma-separated string.
 */
export function parseOrganizationRoles(role: string) {
	return role
		.split(',')
		.map(item => item.trim())
		.filter(Boolean)
}

export function getOrganizationRoleLabel(role: string) {
	return parseOrganizationRoles(role)
		.map(item => ORGANIZATION_ROLE_LABELS[item] ?? item)
		.join(', ')
}
