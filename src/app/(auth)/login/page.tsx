import { BookOpenCheck, LockKeyhole, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'

export default function LoginPage() {
	return (
		<main className='flex min-h-dvh items-center justify-center bg-[#F7F8F3] px-5 py-8 text-[#101319] sm:px-8'>
			<div className='w-full max-w-md'>
				<section>
					<div className='mx-auto w-full max-w-md'>
						<div className='mb-8 flex items-center justify-center gap-3'>
							<div className='flex size-10 items-center justify-center rounded-md bg-[#101319] text-[#F7F8F3]'>
								<BookOpenCheck
									className='size-5'
									aria-hidden='true'
								/>
							</div>
							<div>
								<p className='text-lg leading-6 font-semibold'>
									Tutor Dash
								</p>
								<p className='text-sm text-[#5D665B]'>
									Кабинет преподавателя
								</p>
							</div>
						</div>

						<Card className='gap-7 rounded-md border-[#D8DED2] bg-white py-5 shadow-[0_16px_60px_rgba(16,19,25,0.08)] ring-0 sm:py-7'>
							<CardHeader className='px-5 sm:px-7'>
								<CardTitle className='text-2xl leading-8 font-semibold tracking-normal'>
									Войти в аккаунт
								</CardTitle>
								<CardDescription className='mt-1 text-sm leading-6 text-[#5D665B]'>
									Используйте почту и пароль, чтобы открыть
									панель занятий.
								</CardDescription>
							</CardHeader>

							<CardContent className='px-5 sm:px-7'>
								<form className='space-y-5'>
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
												id='email'
												name='email'
												type='email'
												autoComplete='email'
												required
												placeholder='teacher@example.com'
												className='h-11 w-full rounded-md border border-[#CAD3C6] bg-[#FBFCF8] pr-3 pl-10 text-sm transition-colors outline-none placeholder:text-[#8A9286] focus:border-[#7E9B88] focus:ring-3 focus:ring-[#7E9B88]/20'
											/>
										</div>
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
												id='password'
												name='password'
												type='password'
												autoComplete='current-password'
												required
												placeholder='Введите пароль'
												className='h-11 w-full rounded-md border border-[#CAD3C6] bg-[#FBFCF8] pr-3 pl-10 text-sm transition-colors outline-none placeholder:text-[#8A9286] focus:border-[#7E9B88] focus:ring-3 focus:ring-[#7E9B88]/20'
											/>
										</div>
									</div>

									<Button
										type='submit'
										className='h-11 w-full rounded-md bg-[#101319] text-sm font-semibold text-white hover:bg-[#30343B]'
									>
										Войти
									</Button>
								</form>
							</CardContent>
						</Card>

						<p className='mt-6 text-center text-sm leading-6 text-[#5D665B]'>
							Нет доступа?{' '}
							<a
								href='#'
								className='font-medium text-[#3F624B] underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-[#7E9B88]/30 focus-visible:outline-none'
							>
								Напишите администратору
							</a>
						</p>
					</div>
				</section>
			</div>
		</main>
	)
}
