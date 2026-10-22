export type StudentLesson = {
	id: string
	date: string
	topic: string
	duration: string
	result: string
}

export type StudentPayment = {
	id: string
	date: string
	amount: string
	lessons: string
	status: 'Оплачено' | 'Ожидает'
}

export type StudentPreferredTime = {
	day: string
	time: string
	format: 'Онлайн' | 'Офлайн'
}
