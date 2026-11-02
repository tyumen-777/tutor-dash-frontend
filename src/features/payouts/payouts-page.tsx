'use client'

import dayjs from 'dayjs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import { DataTable } from '@/components/data-table'
import { Stat } from '@/components/profile/profile-cards'

import { formatMoney } from '@/lib/format-money'

import { usePayoutReport } from './api/use-payouts'
import { getColumns } from './columns'
import { PayoutDialog } from './payout-dialog'
import type { PayoutReportResponseTeachersItem } from '@/api/generated/models'
import { useCanManageExpenses } from '@/features/auth/api/use-organization-role'
import {
	formatPeriod,
	getDefaultPeriod
} from '@/features/expenses/expense-filters'
import { PeriodFilter } from '@/features/expenses/expenses-filters'

function parsePeriod(params: Pick<URLSearchParams, 'get'>) {
	const from = params.get('from')
	const to = params.get('to')
	const isValid = (value: string | null): value is string =>
		!!value && dayjs(value, 'YYYY-MM-DD').isValid()

	if (!isValid(from) || !isValid(to)) return getDefaultPeriod()

	return from > to ? { from: to, to: from } : { from, to }
}

export default function PayoutsPage() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const query = searchParams.toString()
	const period = useMemo(
		() => parsePeriod(new URLSearchParams(query)),
		[query]
	)
	const canManage = useCanManageExpenses()
	const { data, isPending, isError } = usePayoutReport(period)
	const [payingTeacher, setPayingTeacher] =
		useState<PayoutReportResponseTeachersItem | null>(null)

	const currency = data?.currency
	const columns = useMemo(
		() => getColumns({ currency, canManage, onPay: setPayingTeacher }),
		[currency, canManage]
	)

	function updatePeriod(next: { from: string; to: string }) {
		const defaultPeriod = getDefaultPeriod()
		const isDefault =
			next.from === defaultPeriod.from && next.to === defaultPeriod.to

		router.replace(
			isDefault
				? pathname
				: `${pathname}?${new URLSearchParams(next).toString()}`,
			{ scroll: false }
		)
	}

	const totals = data?.totals
	const emptyMessage = isPending
		? 'Загрузка выплат…'
		: isError
			? 'Не удалось загрузить выплаты.'
			: 'За выбранный период проведённых занятий нет.'

	return (
		<div className='container mx-auto flex flex-col gap-6 py-10'>
			<div className='space-y-1'>
				<h1 className='text-2xl font-semibold'>Выплаты</h1>
				<p className='text-muted-foreground text-sm'>
					Начисления преподавателям за проведённые занятия и их
					выплата. Выплата вносится в расходы как зарплата.
				</p>
			</div>

			<div className='flex flex-wrap items-center gap-2'>
				<PeriodFilter
					from={period.from}
					to={period.to}
					onChange={updatePeriod}
				/>
			</div>

			<section
				aria-label={`Итоги · ${formatPeriod(period.from, period.to)}`}
				className='grid grid-cols-2 gap-3 lg:grid-cols-4'
			>
				<Stat
					label='Начислено'
					value={totals ? formatMoney(totals.accrued, currency) : '—'}
				/>
				<Stat
					label='Выплачено'
					value={totals ? formatMoney(totals.paid, currency) : '—'}
				/>
				<Stat
					label='К выплате'
					value={totals ? formatMoney(totals.due, currency) : '—'}
					tone='accent'
				/>
				<Stat
					label='Долг до периода'
					value={
						totals ? formatMoney(totals.dueBefore, currency) : '—'
					}
				/>
			</section>

			<DataTable
				columns={columns}
				data={data?.teachers ?? []}
				searchColumn='fullName'
				searchPlaceholder='Найти преподавателя...'
				emptyMessage={emptyMessage}
			/>

			{payingTeacher ? (
				<PayoutDialog
					teacher={payingTeacher}
					period={period}
					currency={currency}
					open
					onOpenChange={open => {
						if (!open) setPayingTeacher(null)
					}}
				/>
			) : null}
		</div>
	)
}
