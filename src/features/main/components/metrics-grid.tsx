import { Banknote, PiggyBank, ReceiptText, UsersRound } from 'lucide-react'

import { formatMoney } from '@/lib/format-money'

import { getPercentChange, pluralize } from '../format'

import { type Metric, MetricCard } from './metric-card'
import type { DashboardSummaryResponse } from '@/api/generated/models'

const NO_DATA = '—'

function getMetrics(summary?: DashboardSummaryResponse): Metric[] {
	if (!summary) {
		return [
			{ label: 'Выручка месяца', icon: Banknote },
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

	const { currency, income, expenses, profit, students } = summary
	const incomeChange = getPercentChange(income.amount, income.previousAmount)

	return [
		{
			label: 'Выручка месяца',
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
			value: profit === null ? NO_DATA : formatMoney(profit, currency),
			detail:
				profit === null
					? 'Нет доступа к расходам'
					: 'Выручка минус оплаченные расходы',
			tone: profit !== null && Number(profit) < 0 ? 'danger' : 'good',
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

export function MetricsGrid({
	summary
}: {
	summary?: DashboardSummaryResponse
}) {
	return (
		<section className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
			{getMetrics(summary).map(metric => (
				<MetricCard key={metric.label} metric={metric} />
			))}
		</section>
	)
}
