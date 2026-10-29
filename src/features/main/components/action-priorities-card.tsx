import type { LucideIcon } from 'lucide-react'
import {
	CalendarX2,
	CheckCircle2,
	ReceiptText,
	WalletCards
} from 'lucide-react'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { formatMoney } from '@/lib/format-money'
import { cn } from '@/lib/utils'

import { pluralize } from '../format'

import type { DashboardSummaryResponse } from '@/api/generated/models'
import { getStudentFullName } from '@/features/students/format'

type ActionAlert = {
	title: string
	text: string
	tone: 'warning' | 'danger'
	icon: LucideIcon
}

function getAlerts(summary: DashboardSummaryResponse): ActionAlert[] {
	const alerts: ActionAlert[] = []
	const { students, expenses, lessons, lowBalanceStudents } = summary

	if (students.lowBalanceCount > 0) {
		const names = lowBalanceStudents.slice(0, 3).map(getStudentFullName)
		const rest = students.lowBalanceCount - names.length

		alerts.push({
			title: `${pluralize(students.lowBalanceCount, {
				one: 'ученик',
				few: 'ученика',
				many: 'учеников'
			})} с остатком 0–1 занятие`,
			text: `${names.join(', ')}${rest > 0 ? ` и ещё ${rest}` : ''} — пора предложить оплату.`,
			tone: lowBalanceStudents.some(student => student.lessonsLeft <= 0)
				? 'danger'
				: 'warning',
			icon: WalletCards
		})
	}

	if (expenses && expenses.pendingCount > 0) {
		alerts.push({
			title: `${pluralize(expenses.pendingCount, {
				one: 'неоплаченный расход',
				few: 'неоплаченных расхода',
				many: 'неоплаченных расходов'
			})}`,
			text: `На сумму ${formatMoney(expenses.pendingAmount, summary.currency)}. Отметьте оплату в разделе «Расходы».`,
			tone: 'warning',
			icon: ReceiptText
		})
	}

	if (lessons.canceledCount > 0) {
		alerts.push({
			title: `${pluralize(lessons.canceledCount, {
				one: 'отменённое занятие',
				few: 'отменённых занятия',
				many: 'отменённых занятий'
			})} за месяц`,
			text: 'Проверьте причины отмен в разделе «Занятия».',
			tone: 'warning',
			icon: CalendarX2
		})
	}

	return alerts
}

export function ActionPrioritiesCard({
	summary
}: {
	summary?: DashboardSummaryResponse
}) {
	const alerts = summary ? getAlerts(summary) : []

	return (
		<Card className='rounded-lg border-[#D8DED2] bg-[#F3F6EF] shadow-none'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<CheckCircle2 className='size-5 text-[#1F5A3D]' />
					Что сделать сегодня
				</CardTitle>
				<CardDescription>
					Приоритеты, которые сильнее всего влияют на деньги и
					удержание.
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-3'>
				{alerts.map(alert => {
					const Icon = alert.icon

					return (
						<div
							key={alert.title}
							className='grid grid-cols-[36px_minmax(0,1fr)] gap-3 rounded-md border border-[#D8DED2] bg-white p-3'
						>
							<div
								className={cn(
									'flex size-9 items-center justify-center rounded-md',
									alert.tone === 'danger'
										? 'bg-[#FFE4DE] text-[#A33D32]'
										: 'bg-[#FFF3C4] text-[#806129]'
								)}
							>
								<Icon className='size-4' aria-hidden='true' />
							</div>
							<div className='min-w-0'>
								<p className='text-sm leading-5 font-semibold'>
									{alert.title}
								</p>
								<p className='text-sm leading-5 text-[#66715F]'>
									{alert.text}
								</p>
							</div>
						</div>
					)
				})}

				{!alerts.length ? (
					<p className='rounded-md border border-[#D8DED2] bg-white p-3 text-sm leading-5 text-[#66715F]'>
						{summary ? 'Срочных задач нет.' : 'Загрузка…'}
					</p>
				) : null}
			</CardContent>
		</Card>
	)
}
