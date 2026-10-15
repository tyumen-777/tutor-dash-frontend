export type Lesson = {
	id: string
	date: string
	topic: string
	duration: string
	result: string
}

export type Payment = {
	id: string
	date: string
	amount: string
	lessons: string
	status: 'Оплачено' | 'Ожидает'
}

export type PreferredTime = {
	day: string
	time: string
	format: 'Онлайн' | 'Офлайн'
}

export type StudentProfile = {
	id: string
	fullName: string
	age: number
	level: string
	teacher: string
	goal: string
	nextLesson: string
	balance: string
	attendance: string
	contacts: {
		phone: string
		email: string
		messenger: string
		parent: string
	}
	notes: string[]
	lessons: Lesson[]
	payments: Payment[]
	preferredTimes: PreferredTime[]
}

const students: StudentProfile[] = [
	{
		id: 'student-001',
		fullName: 'Анна Смирнова',
		age: 12,
		level: 'Elementary',
		teacher: 'Мария Иванова',
		goal: 'Подтянуть школьную программу и спокойно говорить на занятиях.',
		nextLesson: 'Пятница, 19 сентября, 16:30',
		balance: '4 занятия',
		attendance: '18 из 20',
		contacts: {
			phone: '+7 912 456-18-02',
			email: 'anna.smirnova@example.com',
			messenger: '@anna_smirnova',
			parent: 'Ольга Смирнова'
		},
		notes: [
			'Лучше реагирует на короткие устные разминки в начале занятия.',
			'Домашнее задание удобно отправлять вечером в день занятия.'
		],
		lessons: [
			{
				id: 'lesson-01',
				date: '12 сен',
				topic: 'Past Simple: вопросы и короткие ответы',
				duration: '60 мин',
				result: 'Уверенно'
			},
			{
				id: 'lesson-02',
				date: '9 сен',
				topic: 'Speaking: school routine',
				duration: '45 мин',
				result: 'Нужна практика'
			},
			{
				id: 'lesson-03',
				date: '5 сен',
				topic: 'Vocabulary: hobbies',
				duration: '60 мин',
				result: 'Уверенно'
			}
		],
		payments: [
			{
				id: 'payment-01',
				date: '10 сен',
				amount: '8 000 ₽',
				lessons: '8 занятий',
				status: 'Оплачено'
			},
			{
				id: 'payment-02',
				date: '25 авг',
				amount: '4 000 ₽',
				lessons: '4 занятия',
				status: 'Оплачено'
			}
		],
		preferredTimes: [
			{ day: 'Понедельник', time: '16:00-18:00', format: 'Онлайн' },
			{ day: 'Среда', time: '17:30-19:00', format: 'Онлайн' },
			{ day: 'Суббота', time: '11:00-13:00', format: 'Офлайн' }
		]
	},
	{
		id: 'student-002',
		fullName: 'Михаил Кузнецов',
		age: 15,
		level: 'Pre-Intermediate',
		teacher: 'Алексей Петров',
		goal: 'Подготовиться к контрольным и начать смотреть короткие видео без субтитров.',
		nextLesson: 'Суббота, 20 сентября, 12:00',
		balance: '2 занятия',
		attendance: '11 из 12',
		contacts: {
			phone: '+7 922 304-44-18',
			email: 'm.kuznetsov@example.com',
			messenger: '@m_kuznetsov',
			parent: 'Ирина Кузнецова'
		},
		notes: [
			'Хорошо идет через задания на выбор ответа, затем устное объяснение.',
			'Просит больше примеров из технологий и игр.'
		],
		lessons: [
			{
				id: 'lesson-01',
				date: '13 сен',
				topic: 'Present Perfect vs Past Simple',
				duration: '60 мин',
				result: 'Уверенно'
			},
			{
				id: 'lesson-02',
				date: '6 сен',
				topic: 'Listening: travel plans',
				duration: '60 мин',
				result: 'Нужна практика'
			}
		],
		payments: [
			{
				id: 'payment-01',
				date: '1 сен',
				amount: '6 000 ₽',
				lessons: '6 занятий',
				status: 'Оплачено'
			},
			{
				id: 'payment-02',
				date: '18 сен',
				amount: '6 000 ₽',
				lessons: '6 занятий',
				status: 'Ожидает'
			}
		],
		preferredTimes: [
			{ day: 'Вторник', time: '18:00-20:00', format: 'Онлайн' },
			{ day: 'Суббота', time: '12:00-15:00', format: 'Онлайн' }
		]
	}
]

export function getStudentProfile(id: string) {
	return students.find(student => student.id === id) ?? students[0]
}
