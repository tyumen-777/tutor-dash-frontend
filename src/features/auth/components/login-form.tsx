'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { LockKeyhole, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

import { useLogin } from '../api/use-login'
import { type LoginFormValues, loginFormSchema } from '../login-form-schema'

const inputClassName =
	'h-11 w-full rounded-md border border-[#CAD3C6] bg-[#FBFCF8] pr-3 pl-10 text-sm transition-colors outline-none placeholder:text-[#8A9286] focus:border-[#7E9B88] focus:ring-3 focus:ring-[#7E9B88]/20 aria-invalid:border-destructive aria-invalid:focus:ring-destructive/20'

function getLoginErrorMessage(error: unknown) {
	if (isAxiosError(error)) {
		if (!error.response) {
			return 'Не удалось связаться с сервером. Попробуйте позже.'
		}

		if (error.response.status === 401 || error.response.status === 400) {
			return 'Неверная почта или пароль.'
		}
	}

	return 'Не удалось войти. Попробуйте еще раз.'
}

export function LoginForm({ redirectTo }: { redirectTo: string }) {
	const router = useRouter()
	const login = useLogin()
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: { email: '', password: '' }
	})
	const { errors } = form.formState

	function handleValidSubmit(values: LoginFormValues) {
		login.mutate(
			{ data: values },
			{
				onSuccess: () => {
					router.replace(redirectTo)
					router.refresh()
				}
			}
		)
	}

	const isPending = login.isPending || login.isSuccess

	return (
		<Card className='gap-7 rounded-md border-[#D8DED2] bg-white py-5 shadow-[0_16px_60px_rgba(16,19,25,0.08)] ring-0 sm:py-7'>
			<CardHeader className='px-5 sm:px-7'>
				<CardTitle className='text-2xl leading-8 font-semibold tracking-normal'>
					Войти в аккаунт
				</CardTitle>
				<CardDescription className='mt-1 text-sm leading-6 text-[#5D665B]'>
					Используйте почту и пароль, чтобы открыть панель занятий.
				</CardDescription>
			</CardHeader>

			<CardContent className='px-5 sm:px-7'>
				<form
					className='space-y-5'
					onSubmit={form.handleSubmit(handleValidSubmit)}
					noValidate
				>
					{login.isError && (
						<p
							role='alert'
							className='border-destructive/30 bg-destructive/5 text-destructive rounded-md border px-3 py-2.5 text-sm'
						>
							{getLoginErrorMessage(login.error)}
						</p>
					)}

					<div className='space-y-2'>
						<label
							className='text-sm leading-none font-medium'
							htmlFor='email'
						>
							Почта
						</label>
						<div className='relative'>
							<Mail
								className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7E9B88]'
								aria-hidden='true'
							/>
							<input
								{...form.register('email')}
								id='email'
								type='email'
								autoComplete='email'
								placeholder='teacher@example.com'
								aria-invalid={Boolean(errors.email)}
								aria-describedby={
									errors.email ? 'email-error' : undefined
								}
								className={inputClassName}
							/>
						</div>
						{errors.email && (
							<p
								id='email-error'
								className='text-destructive text-sm'
							>
								{errors.email.message}
							</p>
						)}
					</div>

					<div className='space-y-2'>
						<div className='flex items-center justify-between gap-4'>
							<label
								className='text-sm leading-none font-medium'
								htmlFor='password'
							>
								Пароль
							</label>
							<a
								href='#'
								className='text-sm font-medium text-[#3F624B] underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-[#7E9B88]/30 focus-visible:outline-none'
							>
								Забыли пароль?
							</a>
						</div>
						<div className='relative'>
							<LockKeyhole
								className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7E9B88]'
								aria-hidden='true'
							/>
							<input
								{...form.register('password')}
								id='password'
								type='password'
								autoComplete='current-password'
								placeholder='Введите пароль'
								aria-invalid={Boolean(errors.password)}
								aria-describedby={
									errors.password
										? 'password-error'
										: undefined
								}
								className={inputClassName}
							/>
						</div>
						{errors.password && (
							<p
								id='password-error'
								className='text-destructive text-sm'
							>
								{errors.password.message}
							</p>
						)}
					</div>

					<Button
						type='submit'
						disabled={isPending}
						className='h-11 w-full rounded-md bg-[#101319] text-sm font-semibold text-white hover:bg-[#30343B]'
					>
						{isPending ? 'Входим…' : 'Войти'}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
