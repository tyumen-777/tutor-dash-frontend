'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Building2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList
} from '@/components/ui/combobox'
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import {
	useOrganizationSettings,
	useUpdateOrganization
} from './api/use-organization-settings'
import {
	type OrganizationFormValues,
	organizationFormSchema,
	toOrganizationFormValues,
	toUpdateOrganizationRequest
} from './organization-form-schema'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	hasMessage,
	parseApiError
} from '@/api/errors'
import type { OrganizationSettingsResponse } from '@/api/generated/models'
import { useCanManageSettings } from '@/features/auth/api/use-organization-role'
import {
	TIMEZONE_OPTIONS,
	type TimezoneOption
} from '@/features/students/timezones'

function OrganizationForm({
	settings,
	canManage
}: {
	settings: OrganizationSettingsResponse
	canManage: boolean
}) {
	const updateOrganization = useUpdateOrganization()
	const form = useForm<OrganizationFormValues>({
		resolver: zodResolver(organizationFormSchema),
		defaultValues: toOrganizationFormValues(settings)
	})
	const { isDirty } = form.formState

	useEffect(() => {
		form.reset(toOrganizationFormValues(settings))
	}, [form, settings])

	// Зона школы может отсутствовать в нашем списке — тогда добавляем её
	const timezoneOptions = useMemo<TimezoneOption[]>(
		() =>
			TIMEZONE_OPTIONS.some(option => option.value === settings.timezone)
				? TIMEZONE_OPTIONS
				: [
						{ value: settings.timezone, label: settings.timezone },
						...TIMEZONE_OPTIONS
					],
		[settings.timezone]
	)

	function handleError(error: unknown) {
		const apiError = parseApiError(error)

		if (apiError.status === 400 && hasMessage(apiError, 'timezone')) {
			form.setError('timezone', { message: 'Неизвестный часовой пояс' })
			return
		}

		if (apiError.status === 400 && hasMessage(apiError, 'name')) {
			form.setError('name', { message: 'Проверьте название школы' })
			return
		}

		toast.error(getCommonErrorMessage(apiError) ?? UNKNOWN_ERROR_MESSAGE)
	}

	function onSubmit(values: OrganizationFormValues) {
		updateOrganization.mutate(
			{ data: toUpdateOrganizationRequest(values, settings) },
			{
				onSuccess: () => toast.success('Настройки сохранены'),
				onError: handleError
			}
		)
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<CardContent>
				<FieldGroup>
					<Controller
						name='name'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									Название
								</FieldLabel>
								<Input
									{...field}
									id={field.name}
									disabled={!canManage}
									aria-invalid={fieldState.invalid}
									className='h-10'
								/>
								<FieldError errors={[fieldState.error]} />
							</Field>
						)}
					/>

					<Controller
						name='timezone'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									Часовой пояс
								</FieldLabel>
								<Combobox<TimezoneOption>
									items={timezoneOptions}
									value={
										timezoneOptions.find(
											option =>
												option.value === field.value
										) ?? null
									}
									onValueChange={option =>
										field.onChange(option?.value ?? '')
									}
									itemToStringValue={option => option.value}
									disabled={!canManage}
								>
									<ComboboxInput
										id={field.name}
										placeholder='Выберите часовой пояс'
										disabled={!canManage}
										aria-invalid={fieldState.invalid}
										className='h-10 w-full'
									/>
									<ComboboxContent>
										<ComboboxEmpty>
											Ничего не найдено
										</ComboboxEmpty>
										<ComboboxList>
											{(option: TimezoneOption) => (
												<ComboboxItem
													key={option.value}
													value={option}
												>
													{option.label}
												</ComboboxItem>
											)}
										</ComboboxList>
									</ComboboxContent>
								</Combobox>
								<FieldDescription>
									По нему считаются границы дня для занятий,
									итоги месяца на главной и запрет дат в
									будущем.
								</FieldDescription>
								<FieldError errors={[fieldState.error]} />
							</Field>
						)}
					/>

					<div className='grid gap-4 sm:grid-cols-2'>
						<Field>
							<FieldLabel htmlFor='currency'>Валюта</FieldLabel>
							<Input
								id='currency'
								value={settings.currency}
								readOnly
								disabled
								className='h-10'
							/>
							<FieldDescription>
								Не меняется: валюта записана в каждой оплате и
								расходе.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor='slug'>Адрес школы</FieldLabel>
							<Input
								id='slug'
								value={settings.slug}
								readOnly
								disabled
								className='h-10'
							/>
							<FieldDescription>
								Идентификатор школы в системе.
							</FieldDescription>
						</Field>
					</div>
				</FieldGroup>
			</CardContent>

			<CardFooter className='mt-6 flex flex-wrap items-center justify-between gap-3'>
				{canManage ? (
					<>
						<p className='text-muted-foreground text-sm'>
							{isDirty ? 'Есть несохранённые изменения.' : null}
						</p>
						<div className='flex gap-2'>
							<Button
								type='button'
								variant='outline'
								disabled={
									!isDirty || updateOrganization.isPending
								}
								onClick={() =>
									form.reset(
										toOrganizationFormValues(settings)
									)
								}
							>
								Отменить
							</Button>
							<Button
								type='submit'
								disabled={
									!isDirty || updateOrganization.isPending
								}
							>
								{updateOrganization.isPending
									? 'Сохранение…'
									: 'Сохранить'}
							</Button>
						</div>
					</>
				) : (
					<p className='text-muted-foreground text-sm'>
						Изменять настройки могут владелец и администратор.
					</p>
				)}
			</CardFooter>
		</form>
	)
}

export default function SettingsPage() {
	const canManage = useCanManageSettings()
	const { data: settings, isPending, isError } = useOrganizationSettings()

	return (
		<div className='container mx-auto flex max-w-3xl flex-col gap-6 py-10'>
			<div className='space-y-1'>
				<h1 className='text-2xl font-semibold'>Школа</h1>
				<p className='text-muted-foreground text-sm'>
					Название, часовой пояс и валюта школы.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Building2 className='size-5' aria-hidden='true' />
						Реквизиты
					</CardTitle>
					<CardDescription>
						Название и часовой пояс, в котором работает школа.
					</CardDescription>
				</CardHeader>

				{settings ? (
					<OrganizationForm
						settings={settings}
						canManage={canManage}
					/>
				) : (
					<CardContent>
						{isPending ? (
							<div className='flex flex-col gap-4'>
								<Skeleton className='h-10' />
								<Skeleton className='h-10' />
								<Skeleton className='h-10' />
							</div>
						) : isError ? (
							<p
								role='alert'
								className='text-destructive text-sm'
							>
								Не удалось загрузить настройки. Обновите
								страницу или попробуйте позже.
							</p>
						) : null}
					</CardContent>
				)}
			</Card>
		</div>
	)
}
