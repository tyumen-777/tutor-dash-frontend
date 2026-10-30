import { z } from 'zod'

export const studyLevelFormSchema = z.object({
	code: z
		.string()
		.trim()
		.min(1, 'Введите обозначение')
		.max(20, 'Не более 20 символов'),
	name: z
		.string()
		.trim()
		.min(1, 'Введите название')
		.max(100, 'Не более 100 символов')
})

export type StudyLevelFormValues = z.infer<typeof studyLevelFormSchema>

export const emptyStudyLevel: StudyLevelFormValues = { code: '', name: '' }
