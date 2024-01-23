import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			widgets: path.resolve(__dirname, './src/widgets'),
			pages: path.resolve(__dirname, './src/pages'),
			shared: path.resolve(__dirname, './src/shared'),
		},
	},
	plugins: [svgLoader(), react()],
})
