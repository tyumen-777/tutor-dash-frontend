import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import { Toaster } from 'sonner'

import { QueryProvider } from '@/app/providers/query-provider'

import './globals.css'

const ibmPlexMono = IBM_Plex_Mono({
	variable: '--font-ibm-plex-mono',
	subsets: ['cyrillic', 'latin'],
	weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
	title: 'Tutor Dash',
	description: 'Кабинет преподавателя Tutor Dash'
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html
			lang='ru'
			className={`${ibmPlexMono.variable} h-full antialiased`}
		>
			<body className='flex min-h-full flex-col'>
				<QueryProvider>{children}</QueryProvider>
				<Toaster position='top-right' richColors closeButton />
			</body>
		</html>
	)
}
