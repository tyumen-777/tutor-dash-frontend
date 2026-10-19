import type { TeacherResponse } from '@/api/generated/models'
import { teachers } from '@/features/teachers/teacher-data'

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

export type TeacherProfile = TeacherResponse & {
	monthEarnings: string
	lessonsThisMonth: number
	students: TeacherStudent[]
	lessons: TeacherLesson[]
}

type TeacherDetails = Omit<TeacherProfile, keyof TeacherResponse>

// TODO: заменить на API, когда появится эндпоинт профиля преподавателя
const details: Record<string, TeacherDetails> = {
	'teacher-001': {
		monthEarnings: '43 200 ₽',
		lessonsThisMonth: 24,
		students: [
			{
				id: 'student-001',
				fullName: 'Анна Смирнова',
				level: 'Elementary',
				lessonsPerWeek: 2
			},
			{
				id: 'student-003',
				fullName: 'София Орлова',
				level: 'Beginner',
				lessonsPerWeek: 3
			}
		],
		lessons: [
			{
				id: 'lesson-101',
				date: '2026-10-05',
				time: '16:30',
				studentId: 'student-001',
				studentName: 'Анна Смирнова',
				status: 'Проведено'
			},
			{
				id: 'lesson-102',
				date: '2026-10-05',
				time: '18:00',
				studentId: 'student-003',
				studentName: 'София Орлова',
				status: 'Проведено'
			},
			{
				id: 'lesson-103',
				date: '2026-10-12',
				time: '16:30',
				studentId: 'student-001',
				studentName: 'Анна Смирнова',
				status: 'Отменено'
			},
			{
				id: 'lesson-104',
				date: '2026-10-19',
				time: '16:30',
				studentId: 'student-001',
				studentName: 'Анна Смирнова',
				status: 'Запланировано'
			},
			{
				id: 'lesson-105',
				date: '2026-10-21',
				time: '17:00',
				studentId: 'student-003',
				studentName: 'София Орлова',
				status: 'Запланировано'
			},
			{
				id: 'lesson-106',
				date: '2026-10-26',
				time: '16:30',
				studentId: 'student-001',
				studentName: 'Анна Смирнова',
				status: 'Запланировано'
			}
		]
	},
	'teacher-002': {
		monthEarnings: '27 000 ₽',
		lessonsThisMonth: 18,
		students: [
			{
				id: 'student-002',
				fullName: 'Михаил Кузнецов',
				level: 'Pre-Intermediate',
				lessonsPerWeek: 2
			}
		],
		lessons: [
			{
				id: 'lesson-201',
				date: '2026-10-07',
				time: '15:00',
				studentId: 'student-002',
				studentName: 'Михаил Кузнецов',
				status: 'Проведено'
			},
			{
				id: 'lesson-202',
				date: '2026-10-14',
				time: '15:00',
				studentId: 'student-002',
				studentName: 'Михаил Кузнецов',
				status: 'Проведено'
			},
			{
				id: 'lesson-203',
				date: '2026-10-21',
				time: '15:00',
				studentId: 'student-002',
				studentName: 'Михаил Кузнецов',
				status: 'Запланировано'
			}
		]
	},
	'teacher-003': {
		monthEarnings: '0 ₽',
		lessonsThisMonth: 0,
		students: [
			{
				id: 'student-004',
				fullName: 'Даниил Волков',
				level: 'Intermediate',
				lessonsPerWeek: 1
			}
		],
		lessons: []
	}
}

export function getTeacherProfile(id: string): TeacherProfile {
	const teacher = teachers.find(item => item.id === id) ?? teachers[0]

	return { ...teacher, ...details[teacher.id] }
}
