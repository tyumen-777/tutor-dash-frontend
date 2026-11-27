'use client'

import { BellRing } from 'lucide-react'
import { useState } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import { useUpdateOrganization } from './api/use-organization-settings'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	parseApiError
} from '@/api/errors'
import type {
	OrganizationSettingsResponse,
	UpdateOrganizationRequest
} from '@/api/generated/models'

const MAX_THRESHOLD = 20
const DEFAULT_THRESHOLD = 1

function parseThreshold(value: string): number | null {
	if (!/^\d+$/.test(value)) return null

	const threshold = Number(value)

	return threshold <= MAX_THRESHOLD ? threshold : null
}

/**
 * Telegram notifications to students: a message after each held lesson
 * and a low-balance warning. Stored on the organization.
 */
export function LowBalanceNotifyCard({
	settings,
	canManage
}: {
	settings: OrganizationSettingsResponse
	canManage: boolean
}) {
	const savedThreshold = settings.lowBalanceNotifyAt
	const savedLesson = settings.notifyLessonCompleted
	const [lessonEnabled, setLessonEnabled] = useState(savedLesson)
	const [lowEnabled, setLowEnabled] = useState(savedThreshold !== null)
	const [value, setValue] = useState(
		String(savedThreshold ?? DEFAULT_THRESHOLD)
	)
	const updateOrganization = useUpdateOrganization()

	const threshold = parseThreshold(value)
	const nextThreshold = lowEnabled ? threshold : null
	const isInvalid = lowEnabled && threshold === null
	const isDirty =
		nextThreshold !== savedThreshold || lessonEnabled !== savedLesson

	function reset() {
		setLessonEnabled(savedLesson)
		setLowEnabled(savedThreshold !== null)
		setValue(String(savedThreshold ?? DEFAULT_THRESHOLD))
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()

		if (isInvalid) return

		const data: UpdateOrganizationRequest = {
			...(nextThreshold !== savedThreshold
				? { lowBalanceNotifyAt: nextThreshold }
				: {}),
			...(lessonEnabled !== savedLesson
				? { notifyLessonCompleted: lessonEnabled }
				: {})
		}

		updateOrganization.mutate(
			{ data },
			{
				onSuccess: () => toast.success('Настройки сохранены'),
				onError: error =>
					toast.error(
						getCommonErrorMessage(parseApiError(error)) ??
							UNKNOWN_ERROR_MESSAGE
					)
			}
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<BellRing className='size-5' aria-hidden='true' />
					Уведомления ученикам
				</CardTitle>
				<CardDescription>
					Telegram-бот пишет ученикам и родителям, которые
					подключились по ссылке из карточки ученика.
				</CardDescription>
			</CardHeader>

			<form onSubmit={handleSubmit} noValidate>
				<CardContent className='grid gap-6'>
					<Field>
						<label className='flex items-center gap-2 text-sm font-medium'>
							<Checkbox
								checked={lessonEnabled}
								disabled={!canManage}
								onCheckedChange={checked =>
									setLessonEnabled(checked)
								}
							/>
							Сообщать о проведённом занятии
						</label>
						<FieldDescription>
							После каждого внесённого занятия: дата,
							преподаватель и остаток занятий в абонементе.
						</FieldDescription>
					</Field>

					<div className='grid gap-4'>
						<label className='flex items-center gap-2 text-sm font-medium'>
							<Checkbox
								checked={lowEnabled}
								disabled={!canManage}
								onCheckedChange={checked =>
									setLowEnabled(checked)
								}
							/>
							Предупреждать о низком остатке ❗️
						</label>

						<Field data-invalid={isInvalid}>
							<FieldLabel htmlFor='low-balance-notify-at'>
								Когда осталось занятий
							</FieldLabel>
							<Input
								id='low-balance-notify-at'
								type='number'
								inputMode='numeric'
								min={0}
								max={MAX_THRESHOLD}
								step={1}
								value={value}
								disabled={!canManage || !lowEnabled}
								aria-invalid={isInvalid}
								onChange={event => setValue(event.target.value)}
								// Field растягивает детей (*:w-full) — сужаем явно
								className='h-10 w-32!'
							/>
							<FieldDescription>
								{lessonEnabled
									? 'Пока остаток не больше этого числа, в сообщении о занятии остаток выделяется ❗️❗️❗️ с просьбой пополнить абонемент.'
									: 'Отдельное сообщение с ❗️❗️❗️ уходит один раз — когда остаток после занятия становится равен этому числу.'}{' '}
								0 — когда занятия закончились.
							</FieldDescription>
							<FieldError
								errors={
									isInvalid
										? [
												{
													message: `Целое число от 0 до ${MAX_THRESHOLD}`
												}
											]
										: []
								}
							/>
						</Field>
					</div>
				</CardContent>

				<CardFooter className='mt-6 flex flex-wrap items-center justify-end gap-2'>
					{canManage ? (
						<>
							<Button
								type='button'
								variant='outline'
								disabled={
									!isDirty || updateOrganization.isPending
								}
								onClick={reset}
							>
								Отменить
							</Button>
							<Button
								type='submit'
								disabled={
									!isDirty ||
									isInvalid ||
									updateOrganization.isPending
								}
							>
								{updateOrganization.isPending
									? 'Сохранение…'
									: 'Сохранить'}
							</Button>
						</>
					) : (
						<p className='text-muted-foreground mr-auto text-sm'>
							Изменять настройки могут владелец и администратор.
						</p>
					)}
				</CardFooter>
			</form>
		</Card>
	)
}
