import { z } from 'zod'

export const loginFormSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, 'Введите почту')
		.pipe(z.email('Введите корректную почту')),
	password: z
		.string()
		.min(1, 'Введите пароль')
		.max(128, 'Пароль не может быть длиннее 128 символов')
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
