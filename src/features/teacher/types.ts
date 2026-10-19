export type TeacherLessonStatus = 'Проведено' | 'Запланировано' | 'Отменено'

export type TeacherLesson = {
	id: string
	date: string
	time: string
	studentId: string
	studentName: string
	status: TeacherLessonStatus
}

export type TeacherStudent = {
	id: string
	fullName: string
	level: string
	lessonsPerWeek: number
}
