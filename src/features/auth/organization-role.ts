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

const SCHOOL_WIDE_ROLES = ['owner', 'admin', 'manager', 'accountant']

/**
 * A member who is only a teacher sees their own cabinet, lessons and students.
 * The backend applies the same rule (see `resolveTeacherScope`).
 */
export function isTeacherOnly(roles: string[]) {
	return (
		roles.includes('teacher') &&
		!roles.some(role => SCHOOL_WIDE_ROLES.includes(role))
	)
}

/** Sections a teacher-only member may open; everything else is «no access». */
export const TEACHER_PATHS = ['/me', '/lessons', '/students', '/student']

export function isTeacherPath(pathname: string) {
	return TEACHER_PATHS.some(
		path => pathname === path || pathname.startsWith(`${path}/`)
	)
}
