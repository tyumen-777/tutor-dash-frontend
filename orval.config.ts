import { defineConfig } from 'orval'

export default defineConfig({
	api: {
		input:
			process.env.NEXT_PUBLIC_API_URL ??
			'http://localhost:4000/openapi.json',
		output: {
			client: 'react-query',
			httpClient: 'axios',
			mode: 'tags-split',
			target: './src/lib/api/generated/endpoints.ts',
			schemas: './src/lib/api/generated/models',
			clean: true,
			formatter: 'prettier',
			override: {
				mutator: {
					path: './src/lib/api-client.ts',
					name: 'apiRequest'
				}
			}
		}
	}
})
