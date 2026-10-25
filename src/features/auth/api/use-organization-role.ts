'use client'

import { getBrowserTimezone } from '@/lib/school-time'

import { parseOrganizationRoles } from '../organization-role'

import { useBackendAuthControllerMe } from '@/api/generated/backend-auth/backend-auth'

/**
 * Roles of the current user in the session's active organization.
 */
export function useOrganizationRoles() {
	const organization = useActiveOrganization()

	return organization ? parseOrganizationRoles(organization.role) : []
}

const TEACHER_MANAGER_ROLES = ['owner', 'admin']

/**
 * Creating, archiving, restoring and deleting teachers is limited to owners
 * and admins.
 */
export function useCanManageTeachers() {
	return useOrganizationRoles().some(role =>
		TEACHER_MANAGER_ROLES.includes(role)
	)
}

const STUDENT_MANAGER_ROLES = ['owner', 'admin', 'manager']

/**
 * Adding students is available to owners, admins and managers.
 */
export function useCanManageStudents() {
	return useOrganizationRoles().some(role =>
		STUDENT_MANAGER_ROLES.includes(role)
	)
}

const FINANCE_MANAGER_ROLES = ['owner', 'admin']

/**
 * Registering, editing and canceling student payments is limited to owners
 * and admins.
 */
export function useCanManageFinance() {
	return useOrganizationRoles().some(role =>
		FINANCE_MANAGER_ROLES.includes(role)
	)
}

const LESSON_MANAGER_ROLES = ['owner', 'admin', 'manager']

/**
 * Registering and canceling held lessons is available to owners, admins and
 * managers.
 */
export function useCanManageLessons() {
	return useOrganizationRoles().some(role =>
		LESSON_MANAGER_ROLES.includes(role)
	)
}

/**
 * The active organization of the session (school), if one is selected.
 */
export function useActiveOrganization() {
	const { data: session } = useBackendAuthControllerMe()
	const activeOrganizationId = session?.session.activeOrganizationId

	return session?.organizations.find(item => item.id === activeOrganizationId)
}

/**
 * Timezone of the school; until the session is loaded the browser one is
 * used.
 */
export function useSchoolTimezone() {
	return useActiveOrganization()?.timezone ?? getBrowserTimezone()
}
