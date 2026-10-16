import type { Expense } from './expense-form-schema'

export const expensesData: Expense[] = [
	{
		id: 'expense-001',
		date: '2026-10-01',
		amount: 85000,
		category: 'rent',
		recipient: 'ООО «БизнесЦентр Плюс»',
		paymentMethod: 'transfer',
		status: 'paid',
		description: 'Аренда помещения за октябрь',
		comment: ''
	},
	{
		id: 'expense-002',
		date: '2026-10-05',
		amount: 62000,
		category: 'salary',
		recipient: 'Мария Иванова',
		paymentMethod: 'transfer',
		status: 'paid',
		description: 'Зарплата за сентябрь',
		comment: ''
	},
	{
		id: 'expense-003',
		date: '2026-10-05',
		amount: 54500,
		category: 'salary',
		recipient: 'Алексей Петров',
		paymentMethod: 'transfer',
		status: 'paid',
		description: 'Зарплата за сентябрь',
		comment: ''
	},
	{
		id: 'expense-004',
		date: '2026-10-07',
		amount: 18400,
		category: 'materials',
		recipient: 'Oxford University Press',
		paymentMethod: 'card',
		status: 'paid',
		description: 'Учебники English File, 8 комплектов',
		comment: 'Для новой группы Pre-Intermediate'
	},
	{
		id: 'expense-005',
		date: '2026-10-08',
		amount: 15000,
		category: 'marketing',
		recipient: 'VK Реклама',
		paymentMethod: 'card',
		status: 'paid',
		description: 'Таргетированная реклама, осенний набор',
		comment: ''
	},
	{
		id: 'expense-006',
		date: '2026-10-10',
		amount: 1290,
		category: 'software',
		recipient: 'Zoom',
		paymentMethod: 'card',
		status: 'paid',
		description: 'Подписка Zoom Pro',
		comment: ''
	},
	{
		id: 'expense-007',
		date: '2026-10-10',
		amount: 950,
		category: 'software',
		recipient: 'Ростелеком',
		paymentMethod: 'transfer',
		status: 'paid',
		description: 'Интернет в офисе',
		comment: ''
	},
	{
		id: 'expense-008',
		date: '2026-10-12',
		amount: 3450.5,
		category: 'household',
		recipient: 'Ашан',
		paymentMethod: 'cash',
		status: 'paid',
		description: 'Канцелярия, бумага для принтера, вода',
		comment: ''
	},
	{
		id: 'expense-009',
		date: '2026-10-14',
		amount: 7820,
		category: 'utilities',
		recipient: 'УК «Комфорт»',
		paymentMethod: 'transfer',
		status: 'pending',
		description: 'Электроэнергия и отопление за сентябрь',
		comment: 'Счёт получен, оплатить до 20.10'
	},
	{
		id: 'expense-010',
		date: '2026-10-15',
		amount: 12600,
		category: 'taxes',
		recipient: 'ФНС России',
		paymentMethod: 'transfer',
		status: 'pending',
		description: 'Авансовый платёж УСН за III квартал',
		comment: ''
	},
	{
		id: 'expense-011',
		date: '2026-09-01',
		amount: 85000,
		category: 'rent',
		recipient: 'ООО «БизнесЦентр Плюс»',
		paymentMethod: 'transfer',
		status: 'paid',
		description: 'Аренда помещения за сентябрь',
		comment: ''
	},
	{
		id: 'expense-012',
		date: '2026-09-05',
		amount: 58000,
		category: 'salary',
		recipient: 'Мария Иванова',
		paymentMethod: 'transfer',
		status: 'paid',
		description: 'Зарплата за август',
		comment: ''
	},
	{
		id: 'expense-013',
		date: '2026-09-10',
		amount: 24000,
		category: 'marketing',
		recipient: 'Яндекс Директ',
		paymentMethod: 'card',
		status: 'paid',
		description: 'Контекстная реклама, старт учебного года',
		comment: ''
	},
	{
		id: 'expense-014',
		date: '2026-09-18',
		amount: 6900,
		category: 'utilities',
		recipient: 'УК «Комфорт»',
		paymentMethod: 'transfer',
		status: 'paid',
		description: 'Электроэнергия и отопление за август',
		comment: ''
	},
	{
		id: 'expense-015',
		date: '2026-09-25',
		amount: 9600,
		category: 'materials',
		recipient: 'Cambridge University Press',
		paymentMethod: 'card',
		status: 'paid',
		description: "Рабочие тетради Kid's Box, 12 шт.",
		comment: ''
	}
]
