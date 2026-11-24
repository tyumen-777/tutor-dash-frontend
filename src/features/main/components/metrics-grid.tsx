import {
	Banknote,
	HandCoins,
	Hourglass,
	PiggyBank,
	ReceiptText,
	UsersRound,
	Wallet
} from 'lucide-react'

import { formatMoney } from '@/lib/format-money'

import { getPercentChange, pluralize } from '../format'

import { type Metric, MetricCard } from './metric-card'
import type { DashboardSummaryResponse } from '@/api/generated/models'

const NO_DATA = '—'

function getMetrics(summary?: DashboardSummaryResponse): Metric[] {
	if (!summary) {
		return [
			{ label: 'Поступления', icon: Banknote },
			{ label: 'Расходы месяца', icon: ReceiptText },
			{ label: 'Прибыль', icon: PiggyBank },
			{ label: 'Активные ученики', icon: UsersRound }
		].map(metric => ({
			...metric,
			value: NO_DATA,
			detail: 'Загрузка…',
			tone: 'good'
		}))
	}

	const { currency, income, expenses, finance, students } = summary
	const incomeChange = getPercentChange(income.amount, income.previousAmount)

	return [
		{
			label: 'Поступления',
			value: formatMoney(income.amount, currency),
			detail: `${pluralize(income.paymentsCount, {
				one: 'оплата',
				few: 'оплаты',
				many: 'оплат'
			})}, прошлый месяц за те же дни — ${formatMoney(
				income.previousAmount,
				currency
			)}`,
			delta:
				incomeChange === null
					? null
					: `${incomeChange > 0 ? '+' : ''}${incomeChange}%`,
			trend:
				incomeChange === null
					? null
					: incomeChange >= 0
						? 'up'
						: 'down',
			tone:
				incomeChange !== null && incomeChange < 0 ? 'warning' : 'good',
			icon: Banknote
		},
		{
			label: 'Расходы месяца',
			value: expenses
				? formatMoney(expenses.paidAmount, currency)
				: NO_DATA,
			detail: !expenses
				? 'Нет доступа к расходам'
				: expenses.pendingCount
					? `Ещё ${formatMoney(expenses.pendingAmount, currency)} ожидает оплаты`
					: 'Оплаченные расходы за месяц',
			tone: expenses?.pendingCount ? 'warning' : 'good',
			icon: ReceiptText
		},
		{
			label: 'Прибыль',
			value: finance ? formatMoney(finance.profit, currency) : NO_DATA,
			detail: finance
				? `Занятия ${formatMoney(finance.revenue, currency)} − зарплата ${formatMoney(
						finance.teacherPay,
						currency
					)} − прочие расходы ${formatMoney(finance.otherExpenses, currency)}`
				: 'Нет доступа к расходам',
			tone: finance && Number(finance.profit) < 0 ? 'danger' : 'good',
			icon: PiggyBank
		},
		{
			label: 'Активные ученики',
			value: String(students.activeCount),
			detail: `${pluralize(students.newCount, {
				one: 'новый',
				few: 'новых',
				many: 'новых'
			})} за 30 дней`,
			delta: students.newCount ? `+${students.newCount}` : null,
			trend: students.newCount ? 'up' : null,
			tone: 'good',
			icon: UsersRound
		}
	]
}

// Движение денег и обязательства школы: видны тем, у кого есть доступ к расходам
function getFinanceMetrics(summary: DashboardSummaryResponse): Metric[] | null {
	const { currency, finance } = summary

	if (!finance) return null

	return [
		{
			label: 'Деньги за месяц',
			value: formatMoney(finance.cashFlow, currency),
			detail: 'Поступления минус оплаченные расходы, включая выплаты преподавателям',
			tone: Number(finance.cashFlow) < 0 ? 'warning' : 'good',
			icon: Wallet
		},
		{
			label: 'Предоплата учеников',
			value: formatMoney(finance.prepaid, currency),
			detail: 'Оплаченные, но ещё не проведённые занятия — школа должна их уроками',
			tone: 'good',
			icon: Hourglass
		},
		{
			label: 'Долг преподавателям',
			value: formatMoney(finance.teacherDebt, currency),
			detail: 'Начислено за проведённые занятия, но ещё не выплачено',
			tone: Number(finance.teacherDebt) > 0 ? 'warning' : 'good',
			icon: HandCoins
		}
	]
}

export function MetricsGrid({
	summary
}: {
	summary?: DashboardSummaryResponse
}) {
	const financeMetrics = summary ? getFinanceMetrics(summary) : null

	return (
		<>
			<section className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
				{getMetrics(summary).map(metric => (
					<MetricCard key={metric.label} metric={metric} />
				))}
			</section>

			{financeMetrics ? (
				<section className='flex flex-col gap-2'>
					<div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
						{financeMetrics.map(metric => (
							<MetricCard key={metric.label} metric={metric} />
						))}
					</div>
					<p className='text-xs leading-5 text-[#66715F]'>
						Прибыль считается по проведённым в месяце занятиям: цена
						занятия — стоимость пакета, делённая на число занятий в
						нём. Зарплата учитывается в месяце занятий, а не в день
						выплаты. Если изменить сумму или число занятий в оплате,
						пересчитается и стоимость уже проведённых занятий из
						этого пакета.
					</p>
				</section>
			) : null}
		</>
	)
}
