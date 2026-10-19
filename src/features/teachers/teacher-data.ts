import type { TeacherResponse } from '@/api/generated/models'

// TODO: заменить на API, когда появится эндпоинт списка преподавателей
export const teachers: TeacherResponse[] = [
	{
		id: 'teacher-001',
		fullName: 'Мария Иванова',
		email: 'maria.ivanova@example.com',
		phone: '+7 912 301-44-17',
		telegram: 'maria_ivanova',
		hourlyRate: '1800.00',
		startedOn: '2023-09-01',
		isActive: true,
		createdAt: '2023-08-28T10:00:00Z'
	},
	{
		id: 'teacher-002',
		fullName: 'Алексей Петров',
		email: 'alexey.petrov@example.com',
		phone: '+7 903 118-25-64',
		telegram: null,
		hourlyRate: '1500.00',
		startedOn: '2024-02-12',
		isActive: true,
		createdAt: '2024-02-10T09:30:00Z'
	},
	{
		id: 'teacher-003',
		fullName: 'Екатерина Соколова',
		email: null,
		phone: null,
		telegram: 'kate_sokolova',
		hourlyRate: '2100.50',
		startedOn: '2022-10-03',
		isActive: false,
		createdAt: '2022-09-30T12:15:00Z'
	}
]
