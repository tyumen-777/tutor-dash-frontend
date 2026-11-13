'use client'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { Check, Copy, KeyRound } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { SectionCard } from '@/components/profile/profile-cards'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import {
	getInviteUrl,
	useInviteTeacher,
	useRevokeTeacherAccess,
	useTeacherAccess
} from './api/use-teacher-access'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	hasMessage,
	parseApiError
} from '@/api/errors'
import type {
	TeacherAccessResponse,
	TeacherResponse
} from '@/api/generated/models'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getInviteErrorMessage(error: unknown) {
	const apiError = parseApiError(error)
	const common = getCommonErrorMessage(apiError)

	if (common) return common

	if (apiError.status === 400) return 'Укажите корректную почту'
	if (apiError.status === 404) return 'Учитель не найден'
	if (apiError.status === 409) {
		if (hasMessage(apiError, 'Archived')) {
			return 'Учитель в архиве — сначала восстановите его'
		}
		if (hasMessage(apiError, 'already has access')) {
			return 'У учителя уже есть доступ'
		}
		if (hasMessage(apiError, 'linked to another teacher')) {
			return 'Этот пользователь уже привязан к другому учителю'
		}
		if (hasMessage(apiError, 'Another pending invitation')) {
			return 'На эту почту уже отправлено другое приглашение'
		}
	}

	return UNKNOWN_ERROR_MESSAGE
}

function CopyLinkButton({ invitationId }: { invitationId: string }) {
	const [copied, setCopied] = useState(false)

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(getInviteUrl(invitationId))
			setCopied(true)
			toast.success('Ссылка скопирована')
			setTimeout(() => setCopied(false), 2000)
		} catch {
			toast.error('Не удалось скопировать ссылку')
		}
	}

	return (
		<Button type='button' size='sm' onClick={handleCopy}>
			{copied ? (
				<Check className='size-4' aria-hidden />
			) : (
				<Copy className='size-4' aria-hidden />
			)}
			Скопировать ссылку
		</Button>
	)
}

function InviteForm({ teacher }: { teacher: TeacherResponse }) {
	const [email, setEmail] = useState(teacher.email ?? '')
	const [submitted, setSubmitted] = useState(false)
	const invite = useInviteTeacher()
	const trimmed = email.trim()
	const validationError =
		submitted && !EMAIL_PATTERN.test(trimmed)
			? 'Укажите почту, на которую учитель будет входить'
			: null
	const requestError = invite.error
		? getInviteErrorMessage(invite.error)
		: null

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setSubmitted(true)

		if (!EMAIL_PATTERN.test(trimmed)) return

		invite.mutate(
			{ id: teacher.id, data: { email: trimmed } },
			{
				onSuccess: access => {
					toast.success(
						access.status === 'active'
							? 'Учётная запись привязана'
							: 'Приглашение создано — отправьте ссылку учителю'
					)
				}
			}
		)
	}

	return (
		<form className='grid gap-3' onSubmit={handleSubmit} noValidate>
			<p className='text-sm leading-5 text-[#3D453D]'>
				Учитель сможет входить в кабинет, вносить свои занятия и видеть
				свой заработок. Данные других учителей и финансы школы ему
				недоступны.
			</p>
			<Field data-invalid={Boolean(validationError)}>
				<FieldLabel htmlFor='teacher-access-email'>
					Почта для входа
				</FieldLabel>
				<Input
					id='teacher-access-email'
					type='email'
					autoComplete='off'
					value={email}
					onChange={event => setEmail(event.target.value)}
					placeholder='teacher@example.com'
					aria-invalid={Boolean(validationError)}
				/>
				<FieldError
					errors={
						validationError ? [{ message: validationError }] : []
					}
				/>
			</Field>
			{requestError ? (
				<p role='alert' className='text-destructive text-sm'>
					{requestError}
				</p>
			) : null}
			<Button
				type='submit'
				size='sm'
				className='justify-self-start'
				disabled={invite.isPending}
			>
				<KeyRound className='size-4' aria-hidden />
				{invite.isPending ? 'Создаём…' : 'Пригласить в кабинет'}
			</Button>
		</form>
	)
}

function RevokeDialog({
	teacher,
	access,
	open,
	onOpenChange
}: {
	teacher: TeacherResponse
	access: TeacherAccessResponse
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const revoke = useRevokeTeacherAccess()
	const isActive = access.status === 'active'
	const requestError = revoke.error
		? (getCommonErrorMessage(parseApiError(revoke.error)) ??
			UNKNOWN_ERROR_MESSAGE)
		: null

	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen)
		if (!nextOpen) revoke.reset()
	}

	function handleConfirm() {
		revoke.mutate(
			{ id: teacher.id },
			{
				onSuccess: () => {
					toast.success(
						isActive ? 'Доступ закрыт' : 'Приглашение отменено'
					)
					handleOpenChange(false)
				}
			}
		)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>
						{isActive ? 'Закрыть доступ?' : 'Отменить приглашение?'}
					</DialogTitle>
					<DialogDescription>
						{isActive
							? `${teacher.fullName} больше не сможет войти в кабинет школы. Занятия и начисления останутся в истории.`
							: 'Ссылка из приглашения перестанет работать.'}
					</DialogDescription>
				</DialogHeader>
				{requestError ? (
					<p role='alert' className='text-destructive text-sm'>
						{requestError}
					</p>
				) : null}
				<DialogFooter>
					<Button
						type='button'
						variant='outline'
						onClick={() => handleOpenChange(false)}
					>
						Отмена
					</Button>
					<Button
						type='button'
						variant='destructive'
						disabled={revoke.isPending}
						onClick={handleConfirm}
					>
						{isActive ? 'Закрыть доступ' : 'Отменить приглашение'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

function AccessBody({
	teacher,
	access
}: {
	teacher: TeacherResponse
	access: TeacherAccessResponse
}) {
	const [revokeOpen, setRevokeOpen] = useState(false)
	const invite = useInviteTeacher()

	if (access.status === 'none') {
		if (!teacher.isActive) {
			return (
				<p className='text-sm leading-5 text-[#5D665B]'>
					Учитель в архиве, доступа в кабинет нет.
				</p>
			)
		}

		return <InviteForm teacher={teacher} />
	}

	return (
		<div className='grid gap-3'>
			{access.status === 'active' && access.user ? (
				<>
					<Badge variant='success' className='justify-self-start'>
						Есть доступ
					</Badge>
					<p className='text-sm leading-5 text-[#3D453D]'>
						Входит как{' '}
						<span className='font-medium text-[#101319]'>
							{access.user.email}
						</span>
					</p>
				</>
			) : null}

			{access.status === 'invited' && access.invitation ? (
				<>
					<Badge variant='outline' className='justify-self-start'>
						Приглашён
					</Badge>
					<p className='text-sm leading-5 text-[#3D453D]'>
						Приглашение для{' '}
						<span className='font-medium text-[#101319]'>
							{access.invitation.email}
						</span>{' '}
						действует до{' '}
						{dayjs(access.invitation.expiresAt)
							.locale('ru')
							.format('D MMMM, HH:mm')}
						. Отправьте учителю ссылку — по ней он войдёт в кабинет.
					</p>
					<div className='flex flex-wrap gap-2'>
						<CopyLinkButton invitationId={access.invitation.id} />
						<Button
							type='button'
							size='sm'
							variant='outline'
							disabled={invite.isPending}
							onClick={() =>
								invite.mutate(
									{
										id: teacher.id,
										data: {
											email: access.invitation!.email
										}
									},
									{
										onSuccess: () =>
											toast.success(
												'Новая ссылка создана, старая больше не работает'
											),
										onError: error =>
											toast.error(
												getInviteErrorMessage(error)
											)
									}
								)
							}
						>
							Новая ссылка
						</Button>
					</div>
				</>
			) : null}

			<Button
				type='button'
				size='sm'
				variant='ghost'
				className='text-destructive justify-self-start'
				onClick={() => setRevokeOpen(true)}
			>
				{access.status === 'active'
					? 'Закрыть доступ'
					: 'Отменить приглашение'}
			</Button>

			<RevokeDialog
				teacher={teacher}
				access={access}
				open={revokeOpen}
				onOpenChange={setRevokeOpen}
			/>
		</div>
	)
}

/**
 * Personal cabinet access of the teacher: invite, share the link, revoke.
 * Rendered only for owners and admins.
 */
export function TeacherAccessCard({ teacher }: { teacher: TeacherResponse }) {
	const {
		data: access,
		isPending,
		isError
	} = useTeacherAccess(teacher.id, true)

	return (
		<SectionCard
			title='Личный кабинет'
			description='Вход преподавателя в систему.'
			icon={KeyRound}
		>
			{isPending ? (
				<Skeleton className='h-24 w-full rounded-md' />
			) : isError || !access ? (
				<p className='text-sm leading-5 text-[#5D665B]'>
					Не удалось загрузить данные о доступе.
				</p>
			) : (
				<AccessBody
					// Сбрасываем состояние формы при смене статуса
					key={access.status}
					teacher={teacher}
					access={access}
				/>
			)}
		</SectionCard>
	)
}
