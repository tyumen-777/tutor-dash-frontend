export type StudentLesson = {
	id: string
	date: string
	topic: string
	duration: string
	result: string
}

export type StudentPreferredTime = {
	day: string
	time: string
	format: 'Онлайн' | 'Офлайн'
}
