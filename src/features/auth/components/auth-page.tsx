import { AuthBrand } from './auth-brand'
import { AuthSupport } from './auth-support'
import { LoginForm } from './login-form'

export default function AuthPage({ redirectTo }: { redirectTo: string }) {
	return (
		<main className='flex min-h-dvh items-center justify-center bg-[#F7F8F3] px-5 py-8 text-[#101319] sm:px-8'>
			<div className='w-full max-w-md'>
				<section>
					<div className='mx-auto w-full max-w-md'>
						<AuthBrand />
						<LoginForm redirectTo={redirectTo} />
						<AuthSupport />
					</div>
				</section>
			</div>
		</main>
	)
}
