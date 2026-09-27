'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

let browserQueryClient: QueryClient | undefined

const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60_000,
				refetchOnWindowFocus: false,
				retry: 1
			}
		}
	})

const getQueryClient = () => {
	if (typeof window === 'undefined') {
		return createQueryClient()
	}

	browserQueryClient ??= createQueryClient()

	return browserQueryClient
}

export function QueryProvider({ children }: React.PropsWithChildren) {
	return (
		<QueryClientProvider client={getQueryClient()}>
			{children}
		</QueryClientProvider>
	)
}
