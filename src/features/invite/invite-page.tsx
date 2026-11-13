'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { MailX } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import { UNKNOWN_ERROR_MESSAGE, hasMessage, parseApiError } from '@/api/errors'
import { useBackendAuthControllerLogout } from '@/api/generated/backend-auth/backend-auth'
import type { InvitationResponse } from '@/api/generated/models'
import {
	useOrganizationInvitationsControllerAcceptInvitation,
	useOrganizationInvitationsControllerGetInvitation
} from '@/api/generated/organization-invitations/organization-invitations'
import { AuthBrand } from '@/features/auth/components/auth-brand'
import { getOrganizationRoleLabel } from '@/features/auth/organization-role'

const AFTER_ACCEPT_PATH = '/'

const createAccountSchema = z
	.object({
		name: z.string().trim().min(1, 'Введите имя'),
		password: z
			.string()
			.min(8, 'Минимум 8 символов')
			.max(128, 'Пароль не может быть длиннее 128 символов'),
		passwordRepeat: z.string()
	})
	.refine(values => values.password === values.passwordRepeat, {
		message: 'Пароли не совпадают',
		path: ['passwordRepeat']
	})

type CreateAccountValues = z.infer<typeof createAccountSchema>

function getAcceptErrorMessage(error: unknown) {
	const apiError = parseApiError(error)

	if (apiError.status === undefined) {
		return 'Нет связи с сервером. Попробуйте ещё раз.'
	}
	if (apiError.status === 429) {
		return 'Слишком много попыток. Подождите минуту.'
	}
	if (apiError.status === 410) {
		return 'Срок приглашения истёк. Попросите новую ссылку.'
	}
	if (apiError.status === 409) {
		if (hasMessage(apiError, 'Teacher profile')) {
			return 'Карточка преподавателя больше недоступна. Обратитесь в школу.'
		}
		if (hasMessage(apiError, 'already a member')) {
			return 'Вы уже состоите в этой школе.'
		}
		return 'Приглашение уже использовано или отменено.'
	}
	if (apiError.status === 401 || apiError.status === 403) {
		return 'Войдите под почтой, на которую пришло приглашение.'
	}

	return UNKNOWN_ERROR_MESSAGE
}

function useAccept() {
	const router = useRouter()
	const queryClient = useQueryClient()

	return useOrganizationInvitationsControllerAcceptInvitation({
		mutation: {
			onSuccess: () => {
				queryClient.clear()
				router.replace(AFTER_ACCEPT_PATH)
				router.refresh()
			}
		}
	})
}

function InviteShell({ children }: { children: React.ReactNode }) {
	return (
		<main className='flex min-h-dvh items-center justify-center bg-[#F7F8F3] px-4 py-8 text-[#101319] sm:px-8'>
			<div className='w-full max-w-md'>
				<AuthBrand />
				<Card className='gap-6 rounded-md border-[#D8DED2] bg-white py-5 shadow-[0_16px_60px_rgba(16,19,25,0.08)] ring-0 sm:py-7'>
					{children}
				</Card>
			</div>
		</main>
	)
}

function InviteMessage({
	title,
	description
}: {
	title: string
	description: string
}) {
	return (
		<InviteShell>
			<CardHeader className='px-5 sm:px-7'>
				<div className='mb-2 flex size-10 items-center justify-center rounded-md bg-[#E4EEE7] text-[#1F5A3D]'>
					<MailX className='size-5' aria-hidden />
				</div>
				<CardTitle className='text-xl leading-7 font-semibold'>
					{title}
				</CardTitle>
				<CardDescription className='text-sm leading-6 text-[#5D665B]'>
					{description}
				</CardDescription>
			</CardHeader>
			<CardContent className='px-5 sm:px-7'>
				<Button
					variant='outline'
					nativeButton={false}
					render={<Link href='/login' />}
				>
					Перейти ко входу
				</Button>
			</CardContent>
		</InviteShell>
	)
}

function InviteHeader({ invitation }: { invitation: InvitationResponse }) {
	const role = invitation.teacher
		? 'преподавателя'
		: getOrganizationRoleLabel(invitation.role).toLowerCase()

	return (
		<CardHeader className='px-5 sm:px-7'>
			<CardTitle className='text-2xl leading-8 font-semibold tracking-normal'>
				Приглашение в «{invitation.organization.name}»
			</CardTitle>
			<CardDescription className='mt-1 text-sm leading-6 text-[#5D665B]'>
				Вас пригласили в роли {role}. Почта для входа —{' '}
				<span className='font-medium text-[#101319]'>
					{invitation.email}
				</span>
				. Ссылка действует до{' '}
				{dayjs(invitation.expiresAt).locale('ru').format('D MMMM')}.
			</CardDescription>
		</CardHeader>
	)
}

function CreateAccountForm({ invitation }: { invitation: InvitationResponse }) {
	const accept = useAccept()
	const form = useForm<CreateAccountValues>({
		resolver: zodResolver(createAccountSchema),
		defaultValues: {
			name: invitation.teacher?.fullName ?? '',
			password: '',
			passwordRepeat: ''
		}
	})
	const { errors } = form.formState
	const isPending = accept.isPending || accept.isSuccess

	function handleValidSubmit(values: CreateAccountValues) {
		accept.mutate({
			id: invitation.id,
			data: { name: values.name, password: values.password }
		})
	}

	return (
		<form
			className='space-y-4'
			onSubmit={form.handleSubmit(handleValidSubmit)}
			noValidate
		>
			{accept.isError ? (
				<p
					role='alert'
					className='border-destructive/30 bg-destructive/5 text-destructive rounded-md border px-3 py-2.5 text-sm'
				>
					{getAcceptErrorMessage(accept.error)}
				</p>
			) : null}

			<Field data-invalid={Boolean(errors.name)}>
				<FieldLabel htmlFor='invite-name'>Имя</FieldLabel>
				<Input
					{...form.register('name')}
					id='invite-name'
					autoComplete='name'
					aria-invalid={Boolean(errors.name)}
				/>
				<FieldError errors={[errors.name]} />
			</Field>

			<Field data-invalid={Boolean(errors.password)}>
				<FieldLabel htmlFor='invite-password'>Пароль</FieldLabel>
				<Input
					{...form.register('password')}
					id='invite-password'
					type='password'
					autoComplete='new-password'
					aria-invalid={Boolean(errors.password)}
				/>
				<FieldError errors={[errors.password]} />
			</Field>

			<Field data-invalid={Boolean(errors.passwordRepeat)}>
				<FieldLabel htmlFor='invite-password-repeat'>
					Повторите пароль
				</FieldLabel>
				<Input
					{...form.register('passwordRepeat')}
					id='invite-password-repeat'
					type='password'
					autoComplete='new-password'
					aria-invalid={Boolean(errors.passwordRepeat)}
				/>
				<FieldError errors={[errors.passwordRepeat]} />
			</Field>

			<Button
				type='submit'
				disabled={isPending}
				className='h-11 w-full rounded-md bg-[#101319] text-sm font-semibold text-white hover:bg-[#30343B]'
			>
				{isPending ? 'Создаём доступ…' : 'Создать пароль и войти'}
			</Button>
		</form>
	)
}

function ExistingAccount({
	invitation,
	sessionEmail
}: {
	invitation: InvitationResponse
	sessionEmail: string | null
}) {
	const router = useRouter()
	const accept = useAccept()
	const logout = useBackendAuthControllerLogout()
	const loginPath = `/login?from=${encodeURIComponent(`/invite/${invitation.id}`)}`
	const isInvitedUser =
		sessionEmail?.toLowerCase() === invitation.email.toLowerCase()

	if (!sessionEmail) {
		return (
			<div className='space-y-3'>
				<p className='text-sm leading-6 text-[#3D453D]'>
					У вас уже есть учётная запись. Войдите, чтобы принять
					приглашение.
				</p>
				<Button
					nativeButton={false}
					className='h-11 w-full rounded-md bg-[#101319] text-sm font-semibold text-white hover:bg-[#30343B]'
					render={<Link href={loginPath} />}
				>
					Войти
				</Button>
			</div>
		)
	}

	if (!isInvitedUser) {
		return (
			<div className='space-y-3'>
				<p className='text-sm leading-6 text-[#3D453D]'>
					Вы вошли как{' '}
					<span className='font-medium text-[#101319]'>
						{sessionEmail}
					</span>
					, а приглашение отправлено на {invitation.email}. Выйдите и
					войдите под нужной почтой.
				</p>
				<Button
					variant='outline'
					className='w-full'
					disabled={logout.isPending}
					onClick={() =>
						logout.mutate(undefined, {
							onSuccess: () => {
								router.replace(loginPath)
								router.refresh()
							}
						})
					}
				>
					Выйти
				</Button>
			</div>
		)
	}

	return (
		<div className='space-y-3'>
			{accept.isError ? (
				<p
					role='alert'
					className='border-destructive/30 bg-destructive/5 text-destructive rounded-md border px-3 py-2.5 text-sm'
				>
					{getAcceptErrorMessage(accept.error)}
				</p>
			) : null}
			<Button
				className='h-11 w-full rounded-md bg-[#101319] text-sm font-semibold text-white hover:bg-[#30343B]'
				disabled={accept.isPending || accept.isSuccess}
				onClick={() => accept.mutate({ id: invitation.id, data: {} })}
			>
				Принять приглашение
			</Button>
		</div>
	)
}

export function InvitePage({
	invitationId,
	sessionEmail
}: {
	invitationId: string
	sessionEmail: string | null
}) {
	const {
		data: invitation,
		isPending,
		error
	} = useOrganizationInvitationsControllerGetInvitation(invitationId, {
		query: { retry: false }
	})

	if (isPending) {
		return (
			<InviteShell>
				<CardContent className='space-y-3 px-5 sm:px-7'>
					<Skeleton className='h-8 w-3/4' />
					<Skeleton className='h-16 w-full' />
					<Skeleton className='h-11 w-full' />
				</CardContent>
			</InviteShell>
		)
	}

	if (error || !invitation) {
		const status = parseApiError(error).status

		return status === 404 || status === 400 ? (
			<InviteMessage
				title='Приглашение не найдено'
				description='Проверьте ссылку или попросите школу прислать новую.'
			/>
		) : (
			<InviteMessage
				title='Не удалось открыть приглашение'
				description='Обновите страницу или попробуйте позже.'
			/>
		)
	}

	if (invitation.status === 'accepted') {
		return (
			<InviteMessage
				title='Приглашение уже принято'
				description='Войдите в кабинет со своей почтой и паролем.'
			/>
		)
	}

	if (invitation.status !== 'pending') {
		return (
			<InviteMessage
				title='Приглашение отменено'
				description='Эта ссылка больше не работает. Попросите школу прислать новую.'
			/>
		)
	}

	if (dayjs(invitation.expiresAt).isBefore(dayjs())) {
		return (
			<InviteMessage
				title='Срок приглашения истёк'
				description='Попросите школу прислать новую ссылку.'
			/>
		)
	}

	return (
		<InviteShell>
			<InviteHeader invitation={invitation} />
			<CardContent className='px-5 sm:px-7'>
				{invitation.accountExists ? (
					<ExistingAccount
						invitation={invitation}
						sessionEmail={sessionEmail}
					/>
				) : (
					<CreateAccountForm invitation={invitation} />
				)}
			</CardContent>
		</InviteShell>
	)
}
