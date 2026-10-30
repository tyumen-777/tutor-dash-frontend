'use client'

import { useCanManageSettings } from '@/features/auth/api/use-organization-role'
import { StudyLevelsCard } from '@/features/study-levels/study-levels-card'

export function CompanySettingsPage() {
	const canManage = useCanManageSettings()

	return (
		<div className='container mx-auto flex max-w-3xl flex-col gap-6 py-10'>
			<div className='space-y-1'>
				<h1 className='text-2xl font-semibold'>Компания</h1>
				<p className='text-muted-foreground text-sm'>
					Справочники, которыми пользуется вся школа.
					{canManage
						? null
						: ' Изменять их могут владелец и администратор.'}
				</p>
			</div>

			<StudyLevelsCard canManage={canManage} />
		</div>
	)
}
