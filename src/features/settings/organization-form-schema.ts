import { z } from 'zod'

import type {
	OrganizationSettingsResponse,
	UpdateOrganizationRequest
} from '@/api/generated/models'

export const organizationFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, 'Введите название школы')
		.max(100, 'Не больше 100 символов'),
	timezone: z.string().min(1, 'Выберите часовой пояс')
})

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>

export function toOrganizationFormValues(
	settings: OrganizationSettingsResponse
): OrganizationFormValues {
	return { name: settings.name, timezone: settings.timezone }
}

/**
 * Only changed fields are sent, so saving the name never touches the
 * timezone and the other way round.
 */
export function toUpdateOrganizationRequest(
	values: OrganizationFormValues,
	settings: OrganizationSettingsResponse
): UpdateOrganizationRequest {
	const name = values.name.trim()

	return {
		...(name !== settings.name ? { name } : {}),
		...(values.timezone !== settings.timezone
			? { timezone: values.timezone }
			: {})
	}
}
