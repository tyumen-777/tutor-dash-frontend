import type { LucideIcon } from 'lucide-react'
import {
	AlertTriangle,
	Banknote,
	BookOpenCheck,
	CalendarClock,
	MessageSquareWarning,
	PhoneCall,
	ReceiptText,
	Sparkles,
	Target,
	TrendingUp,
	UsersRound
} from 'lucide-react'

export type SignalTone = 'good' | 'warning' | 'danger'

export type RevenueMetric = {
	label: string
	value: string
	delta: string
	detail: string
	tone: SignalTone
	icon: LucideIcon
}

export type PipelineStep = {
	label: string
	value: number
	accent: string
}

export type DayLesson = {
	time: string
	title: string
	teacher: string
	status: 'идет' | 'готово' | 'риск' | 'план'
	students: string
}

export type ActionAlert = {
	title: string
	text: string
	tone: Exclude<SignalTone, 'good'>
	icon: LucideIcon
}

export type TeacherLoad = {
	name: string
	load: number
	students: number
	retention: string
}

export type FocusItem = {
	label: string
	value: string
	icon: LucideIcon
}

export const revenueMetrics: RevenueMetric[] = [
	{
		label: 'Выручка месяца',
		value: '3,42 млн ₽',
		delta: '+12%',
		detail: '76% месячного плана',
		tone: 'good',
		icon: Banknote
	},
	{
		label: 'Активные ученики',
		value: '418',
		delta: '+23',
		detail: '38 новых за 30 дней',
		tone: 'good',
		icon: UsersRound
	},
	{
		label: 'Долги',
		value: '286 тыс ₽',
		delta: '-8%',
		detail: '17 платежей просрочены',
		tone: 'warning',
		icon: ReceiptText
	},
	{
		label: 'Риск ухода',
		value: '31',
		delta: '+6',
		detail: 'нет следующего урока или оплаты',
		tone: 'danger',
		icon: MessageSquareWarning
	}
]

export const pipeline: PipelineStep[] = [
	{ label: 'Новые лиды', value: 64, accent: '#315F72' },
	{ label: 'Пробный урок', value: 38, accent: '#3F7A54' },
	{ label: 'Ожидают оплату', value: 19, accent: '#C48A3A' },
	{ label: 'Оплатили', value: 14, accent: '#C95E4F' }
]

export const dayLessons: DayLesson[] = [
	{
		time: '09:00',
		title: 'Speaking A2',
		teacher: 'Мария Иванова',
		status: 'идет',
		students: '6/7'
	},
	{
		time: '11:30',
		title: 'ЕГЭ интенсив',
		teacher: 'Алексей Петров',
		status: 'готово',
		students: '8/8'
	},
	{
		time: '15:00',
		title: 'Math Junior',
		teacher: 'Екатерина Соколова',
		status: 'риск',
		students: '3/6'
	},
	{
		time: '18:30',
		title: 'English B1',
		teacher: 'Мария Иванова',
		status: 'план',
		students: '9/10'
	}
]

export const alerts: ActionAlert[] = [
	{
		title: '7 пробных уроков без follow-up',
		text: 'Менеджерам нужно связаться сегодня до 17:00.',
		icon: PhoneCall,
		tone: 'danger'
	},
	{
		title: '23 ученика без следующего урока',
		text: 'Большая часть после переносов на прошлой неделе.',
		icon: CalendarClock,
		tone: 'warning'
	},
	{
		title: 'Посещаемость ниже нормы в Math Junior',
		text: 'Группа просела до 71%, проверьте расписание.',
		icon: AlertTriangle,
		tone: 'warning'
	}
]

export const teachers: TeacherLoad[] = [
	{ name: 'Мария Иванова', load: 92, students: 86, retention: '94%' },
	{ name: 'Алексей Петров', load: 78, students: 64, retention: '91%' },
	{ name: 'Екатерина Соколова', load: 61, students: 43, retention: '84%' }
]

export const focusItems: FocusItem[] = [
	{ label: 'План-факт', value: '76%', icon: Target },
	{ label: 'Конверсия в оплату', value: '36%', icon: TrendingUp },
	{ label: 'Уроков сегодня', value: '42', icon: BookOpenCheck },
	{ label: 'NPS уроков', value: '8.7', icon: Sparkles }
]
