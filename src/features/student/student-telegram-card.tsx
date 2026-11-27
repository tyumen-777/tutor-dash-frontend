'use client'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { Check, Copy, Link2, Send, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { SectionCard } from '@/components/profile/profile-cards'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import {
	useCreateTelegramInvite,
	useDeleteTelegramLink,
	useStudentTelegram
} from './api/use-student-telegram'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	parseApiError
} from '@/api/errors'
import type {
	StudentResponse,
	StudentTelegramInviteResponse,
	StudentTelegramLink
} from '@/api/generated/models'

function getErrorMessage(error: unknown) {
	const apiError = parseApiError(error)

	if (apiError.status === 503) return 'Telegram-бот не настроен на сервере'
	if (apiError.status === 400) return 'Ученик в архиве'

	return getCommonErrorMessage(apiError) ?? UNKNOWN_ERROR_MESSAGE
}

function formatLinkName(link: StudentTelegramLink) {
	if (link.displayName && link.username) {
		return `${link.displayName} (@${link.username})`
	}

	return link.displayName ?? (link.username ? `@${link.username}` : 'Чат')
}

function InviteLink({ invite }: { invite: StudentTelegramInviteResponse }) {
	const [copied, setCopied] = useState(false)

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(invite.url)
			setCopied(true)
			toast.success('Ссылка скопирована')
			setTimeout(() => setCopied(false), 2000)
		} catch {
			toast.error('Не удалось скопировать ссылку')
		}
	}

	return (
		<div className='grid gap-2 rounded-md border border-[#D8DED2] bg-[#F6F8F4] p-3'>
			<p className='text-sm leading-5 text-[#3D453D]'>
				Отправьте ссылку ученику или родителю. Нужно открыть её и нажать
				«Старт» в Telegram. Ссылка одноразовая, действует до{' '}
				{dayjs(invite.expiresAt).locale('ru').format('D MMMM, HH:mm')}.
			</p>
			<div className='flex gap-2'>
				<Input
					readOnly
					value={invite.url}
					aria-label='Ссылка подключения'
					onFocus={event => event.target.select()}
					className='h-8 min-w-0 font-mono text-xs'
				/>
				<Button type='button' size='sm' onClick={handleCopy}>
					{copied ? (
						<Check className='size-4' aria-hidden />
					) : (
						<Copy className='size-4' aria-hidden />
					)}
					Копировать
				</Button>
			</div>
		</div>
	)
}

/**
 * Telegram chats connected to the student's notifications: create a one-time
 * connect link, see who is connected, disconnect. Managers only.
 */
export function StudentTelegramCard({ student }: { student: StudentResponse }) {
	const { data, isPending, isError } = useStudentTelegram(student.id)
	const createInvite = useCreateTelegramInvite()
	const deleteLink = useDeleteTelegramLink(student.id)
	const isArchived = student.status === 'ARCHIVED'

	function handleCreateInvite() {
		createInvite.mutate(
			{ id: student.id },
			{ onError: error => toast.error(getErrorMessage(error)) }
		)
	}

	function handleDelete(link: StudentTelegramLink) {
		deleteLink.mutate(
			{ id: student.id, linkId: link.id },
			{
				onSuccess: () => toast.success('Чат отключён'),
				onError: error => toast.error(getErrorMessage(error))
			}
		)
	}

	return (
		<SectionCard
			title='Telegram-уведомления'
			description='Бот сообщает о проведённых занятиях и остатке абонемента.'
			icon={Send}
		>
			{isPending ? (
				<Skeleton className='h-20 w-full rounded-md' />
			) : isError || !data ? (
				<p className='text-sm leading-5 text-[#5D665B]'>
					Не удалось загрузить подключения.
				</p>
			) : !data.botEnabled ? (
				<p className='text-sm leading-5 text-[#5D665B]'>
					Telegram-бот не настроен на сервере.
				</p>
			) : (
				<div className='grid gap-3'>
					{data.links.length ? (
						<ul className='grid gap-2'>
							{data.links.map(link => (
								<li
									key={link.id}
									className='flex items-center gap-2'
								>
									<Badge variant='success'>Подключён</Badge>
									<span className='min-w-0 flex-1 truncate text-sm text-[#101319]'>
										{formatLinkName(link)}
									</span>
									<Button
										type='button'
										size='icon-sm'
										variant='ghost'
										aria-label={`Отключить ${formatLinkName(link)}`}
										disabled={deleteLink.isPending}
										onClick={() => handleDelete(link)}
									>
										<X className='size-4' aria-hidden />
									</Button>
								</li>
							))}
						</ul>
					) : (
						<p className='text-sm leading-5 text-[#5D665B]'>
							Пока никто не подключён.
						</p>
					)}

					{createInvite.data ? (
						<InviteLink invite={createInvite.data} />
					) : null}

					{isArchived ? null : (
						<Button
							type='button'
							size='sm'
							variant='outline'
							className='justify-self-start'
							disabled={createInvite.isPending}
							onClick={handleCreateInvite}
						>
							<Link2 className='size-4' aria-hidden />
							{createInvite.data
								? 'Новая ссылка'
								: 'Ссылка для подключения'}
						</Button>
					)}
				</div>
			)}
		</SectionCard>
	)
}
