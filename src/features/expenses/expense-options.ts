import type {
	ExpenseResponseCategory,
	ExpenseResponseStatus
} from '@/api/generated/models'

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseResponseCategory, string> =
	{
		RENT: 'Аренда',
		SALARY: 'Зарплата преподавателей',
		MATERIALS: 'Учебные материалы',
		MARKETING: 'Маркетинг и реклама',
		UTILITIES: 'Коммунальные услуги',
		SOFTWARE: 'Связь и ПО',
		HOUSEHOLD: 'Хозяйственные нужды',
		TAXES: 'Налоги и сборы',
		OTHER: 'Прочее'
	}

export const EXPENSE_STATUS_LABELS: Record<ExpenseResponseStatus, string> = {
	PAID: 'Оплачено',
	PENDING: 'Ожидает оплаты',
	CANCELED: 'Отменён'
}

export const EXPENSE_STATUS_BADGE_VARIANTS: Record<
	ExpenseResponseStatus,
	'success' | 'outline' | 'warning'
> = {
	PAID: 'success',
	PENDING: 'warning',
	CANCELED: 'outline'
}

export const categoryOptions = (
	Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseResponseCategory[]
).map(value => ({ value, label: EXPENSE_CATEGORY_LABELS[value] }))

export const statusOptions = (
	Object.keys(EXPENSE_STATUS_LABELS) as ExpenseResponseStatus[]
).map(value => ({ value, label: EXPENSE_STATUS_LABELS[value] }))

// Отменить расход можно только отдельным действием
export const editableStatusOptions = statusOptions.filter(
	option => option.value !== 'CANCELED'
)
