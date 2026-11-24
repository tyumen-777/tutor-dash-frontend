'use client'

import { CalendarCheck, Lock, LockOpen } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'

import { toSchoolTime } from '@/lib/school-time'

import {
	useClosePeriod,
	usePeriodLocks,
	useReopenPeriod
} from './api/use-period-locks'
import { formatMonth, getEndedMonths } from './format'
import {
	UNKNOWN_ERROR_MESSAGE,
	getCommonErrorMessage,
	parseApiError
} from '@/api/errors'
import type { PeriodLockResponse } from '@/api/generated/models'
import {
	useCanClosePeriods,
	useIsOwner,
	useSchoolTimezone
} from '@/features/auth/api/use-organization-role'

type DialogState = { type: 'close' | 'reopen'; month: string } | null

function ClosePeriodDialog({
	month,
	onOpenChange
}: {
	month: string
	onOpenChange: (open: boolean) => void
}) {
	const closePeriod = useClosePeriod()
	const apiError = closePeriod.error ? parseApiError(closePeriod.error) : null
	const errorMessage = !apiError
		? null
		: apiError.status === 409
			? 'Месяц уже закрыт.'
			: apiError.status === 400
				? 'Месяц ещё не закончился — закрыть можно только прошедший.'
				: (getCommonErrorMessage(apiError) ?? UNKNOWN_ERROR_MESSAGE)

	return (
		<Dialog open onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Закрыть {formatMonth(month)}?</DialogTitle>
					<DialogDescription>
						Оплаты, занятия, расходы и выплаты с датой в этом месяце
						больше нельзя будет внести, изменить или отменить.
						Комментарии, тему и домашнее задание поправить можно.
						Открыть месяц снова сможет только владелец.
					</DialogDescription>
				</DialogHeader>

				{errorMessage ? (
					<p role='alert' className='text-destructive text-sm'>
						{errorMessage}
					</p>
				) : null}

				<DialogFooter>
					<Button
						type='button'
						variant='outline'
						onClick={() => onOpenChange(false)}
					>
						Не закрывать
					</Button>
					<Button
						type='button'
						disabled={closePeriod.isPending}
						onClick={() =>
							closePeriod.mutate(
								{ data: { month } },
								{
									onSuccess: () => {
										toast.success(
											`${formatMonth(month)} закрыт`
										)
										onOpenChange(false)
									}
								}
							)
						}
					>
						<Lock data-icon='inline-start' />
						{closePeriod.isPending ? 'Закрытие…' : 'Закрыть месяц'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

function ReopenPeriodDialog({
	month,
	onOpenChange
}: {
	month: string
	onOpenChange: (open: boolean) => void
}) {
	const reopenPeriod = useReopenPeriod()
	const apiError = reopenPeriod.error
		? parseApiError(reopenPeriod.error)
		: null
	const errorMessage = !apiError
		? null
		: apiError.status === 404
			? 'Месяц уже открыт.'
			: (getCommonErrorMessage(apiError) ?? UNKNOWN_ERROR_MESSAGE)

	return (
		<Dialog open onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Открыть {formatMonth(month)}?</DialogTitle>
					<DialogDescription>
						Операции этого месяца снова можно будет менять, а его
						итоги могут измениться. Открытие попадёт в историю
						операций.
					</DialogDescription>
				</DialogHeader>

				{errorMessage ? (
					<p role='alert' className='text-destructive text-sm'>
						{errorMessage}
					</p>
				) : null}

				<DialogFooter>
					<Button
						type='button'
						variant='outline'
						onClick={() => onOpenChange(false)}
					>
						Не открывать
					</Button>
					<Button
						type='button'
						variant='destructive'
						disabled={reopenPeriod.isPending}
						onClick={() =>
							reopenPeriod.mutate(
								{ month },
								{
									onSuccess: () => {
										toast.success(
											`${formatMonth(month)} снова открыт`
										)
										onOpenChange(false)
									}
								}
							)
						}
					>
						<LockOpen data-icon='inline-start' />
						{reopenPeriod.isPending ? 'Открытие…' : 'Открыть месяц'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export function PeriodLocksPage() {
	const { data, isPending, isError } = usePeriodLocks()
	const canClose = useCanClosePeriods()
	const isOwner = useIsOwner()
	const timezone = useSchoolTimezone()
	const [dialog, setDialog] = useState<DialogState>(null)

	const locks = new Map<string, PeriodLockResponse>(
		(data?.items ?? []).map(lock => [lock.month, lock])
	)
	const months = data
		? getEndedMonths(data.currentMonth, [...locks.keys()])
		: []

	function closeDialog(open: boolean) {
		if (!open) setDialog(null)
	}

	return (
		<div className='container mx-auto flex max-w-3xl flex-col gap-6 py-10'>
			<div className='space-y-1'>
				<h1 className='text-2xl font-semibold'>Закрытие месяцев</h1>
				<p className='text-muted-foreground text-sm'>
					Когда итоги месяца сведены, закройте его — и цифры за него
					больше не изменятся.
					{canClose
						? null
						: ' Закрывать месяцы могут владелец и администратор.'}
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<CalendarCheck className='size-5' aria-hidden='true' />
						Прошедшие месяцы
					</CardTitle>
					<CardDescription>
						В закрытом месяце нельзя вносить, менять и отменять
						оплаты, занятия, расходы и выплаты. Текущий месяц
						закрыть нельзя.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isPending ? (
						<div className='flex flex-col gap-2'>
							<Skeleton className='h-10' />
							<Skeleton className='h-10' />
							<Skeleton className='h-10' />
						</div>
					) : isError ? (
						<p role='alert' className='text-destructive text-sm'>
							Не удалось загрузить месяцы. Обновите страницу или
							попробуйте позже.
						</p>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Месяц</TableHead>
									<TableHead>Статус</TableHead>
									<TableHead className='hidden sm:table-cell'>
										Кто закрыл
									</TableHead>
									<TableHead className='w-36'>
										<span className='sr-only'>
											Действия
										</span>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{months.map(month => {
									const lock = locks.get(month)

									return (
										<TableRow key={month}>
											<TableCell className='font-medium'>
												{formatMonth(month)}
											</TableCell>
											<TableCell>
												{lock ? (
													<Badge variant='secondary'>
														<Lock aria-hidden='true' />
														Закрыт
													</Badge>
												) : (
													<Badge variant='outline'>
														Открыт
													</Badge>
												)}
											</TableCell>
											<TableCell className='text-muted-foreground hidden whitespace-normal sm:table-cell'>
												{lock
													? `${lock.closedBy.name}, ${toSchoolTime(
															lock.closedAt,
															timezone
														).format(
															'DD.MM.YYYY HH:mm'
														)}`
													: '—'}
											</TableCell>
											<TableCell>
												<div className='flex justify-end'>
													{lock && isOwner ? (
														<Button
															variant='ghost'
															size='sm'
															onClick={() =>
																setDialog({
																	type: 'reopen',
																	month
																})
															}
														>
															<LockOpen data-icon='inline-start' />
															Открыть
														</Button>
													) : null}
													{!lock && canClose ? (
														<Button
															variant='outline'
															size='sm'
															onClick={() =>
																setDialog({
																	type: 'close',
																	month
																})
															}
														>
															<Lock data-icon='inline-start' />
															Закрыть
														</Button>
													) : null}
												</div>
											</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{dialog?.type === 'close' ? (
				<ClosePeriodDialog
					month={dialog.month}
					onOpenChange={closeDialog}
				/>
			) : null}
			{dialog?.type === 'reopen' ? (
				<ReopenPeriodDialog
					month={dialog.month}
					onOpenChange={closeDialog}
				/>
			) : null}
		</div>
	)
}
