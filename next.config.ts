import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// Минимальная сборка для Docker-образа (см. Dockerfile)
	output: 'standalone'
}

export default nextConfig
