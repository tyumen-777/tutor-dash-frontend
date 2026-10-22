'use client'

import { parseOrganizationRoles } from '../organization-role'

import { useBackendAuthControllerMe } from '@/api/generated/backend-auth/backend-auth'

/**
 * Roles of the current user in the session's active organization.
 */
export function useOrganizationRoles() {
	const { data: session } = useBackendAuthControllerMe()
	const activeOrganizationId = session?.session.activeOrganizationId
	const organization = session?.organizations.find(
		item => item.id === activeOrganizationId
	)

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
