'use client'

import { isAxiosError } from 'axios'
import { Building2, ChevronRight, LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { useSetActiveOrganization } from '../api/use-set-active-organization'
import { getOrganizationRoleLabel } from '../organization-role'

import type { UserOrganization } from '@/api/generated/models'

function getSelectErrorMessage(error: unknown) {
	if (isAxiosError(error)) {
		if (!error.response) {
			return 'Не удалось связаться с сервером. Попробуйте позже.'
		}

		if (error.response.status === 403) {
			return 'У вас нет доступа к этой организации.'
		}
	}

	return 'Не удалось выбрать организацию. Попробуйте еще раз.'
}

export function OrganizationPicker({
	email,
	organizations,
	redirectTo
}: {
	email: string
	organizations: UserOrganization[]
	redirectTo: string
}) {
	const router = useRouter()
	const setActiveOrganization = useSetActiveOrganization()
	const selectedId = setActiveOrganization.variables?.data.organizationId
	const isPending =
		setActiveOrganization.isPending || setActiveOrganization.isSuccess

	function handleSelect(organizationId: string) {
		setActiveOrganization.mutate(
			{ data: { organizationId } },
			{
				onSuccess: () => {
					router.replace(redirectTo)
					router.refresh()
				}
			}
		)
	}

	return (
		<Card className='gap-7 rounded-md border-[#D8DED2] bg-white py-5 shadow-[0_16px_60px_rgba(16,19,25,0.08)] ring-0 sm:py-7'>
			<CardHeader className='px-5 sm:px-7'>
				<CardTitle className='text-2xl leading-8 font-semibold tracking-normal'>
					Выберите организацию
				</CardTitle>
				<CardDescription className='mt-1 text-sm leading-6 text-[#5D665B]'>
					Аккаунт <span className='text-[#101319]'>{email}</span>{' '}
					{organizations.length > 1
						? 'состоит в нескольких организациях. Выберите, с какой работать сейчас.'
						: 'состоит в организации ниже. Выберите ее, чтобы продолжить.'}
				</CardDescription>
			</CardHeader>

			<CardContent className='space-y-3 px-5 sm:px-7'>
				{setActiveOrganization.isError && (
					<p
						role='alert'
						className='border-destructive/30 bg-destructive/5 text-destructive rounded-md border px-3 py-2.5 text-sm'
					>
						{getSelectErrorMessage(setActiveOrganization.error)}
					</p>
				)}

				<ul className='space-y-2'>
					{organizations.map(organization => {
						const isSelected =
							isPending && selectedId === organization.id

						return (
							<li key={organization.id}>
								<button
									type='button'
									disabled={isPending}
									aria-busy={isSelected}
									onClick={() =>
										handleSelect(organization.id)
									}
									className='group flex w-full items-center gap-3 rounded-md border border-[#CAD3C6] bg-[#FBFCF8] p-3 text-left transition-colors outline-none hover:border-[#7E9B88] hover:bg-white focus-visible:border-[#7E9B88] focus-visible:ring-3 focus-visible:ring-[#7E9B88]/20 disabled:cursor-not-allowed disabled:opacity-60 aria-busy:opacity-100'
								>
									<span className='flex size-10 shrink-0 items-center justify-center rounded-md bg-[#101319] text-[#F7F8F3]'>
										<Building2
											className='size-5'
											aria-hidden='true'
										/>
									</span>
									<span className='min-w-0 flex-1'>
										<span className='block truncate text-sm font-semibold'>
											{organization.name}
										</span>
										<span className='block truncate text-sm text-[#5D665B]'>
											{getOrganizationRoleLabel(
												organization.role
											)}
										</span>
									</span>
									{isSelected ? (
										<LoaderCircle
											className='size-4 shrink-0 animate-spin text-[#3F624B]'
											aria-label='Входим…'
										/>
									) : (
										<ChevronRight
											className='size-4 shrink-0 text-[#8A9286] transition-transform group-hover:translate-x-0.5 group-hover:text-[#3F624B]'
											aria-hidden='true'
										/>
									)}
								</button>
							</li>
						)
					})}
				</ul>
			</CardContent>
		</Card>
	)
}
