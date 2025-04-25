import { reactRouter } from '@react-router/dev/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

// import { cloudflareDevProxy } from '@react-router/dev/vite/cloudflare'

export default defineConfig({
	plugins: [
		cloudflare({ viteEnvironment: { name: 'ssr' } }),
		tailwindcss(),
		AutoImport({
			imports: [
				'react',
				{
					ofetch: ['ofetch'],
					'react-router': [
						'Link',
						'useLoaderData',
						'useParams',
						'useRevalidator',
						'useNavigate',
						'data',
					],
					valibot: [['*', 'v']],
				},
				{
					from: 'valibot',
					// cant use v.Infer with the current method
					// so aliasing it to vInfer
					imports: [['Infer', 'vInfer']],
					type: true,
				},
			],
			dirs: ['app/shared', 'app/components', 'app/components/ui', 'app/lib'],
			biomelintrc: {
				enabled: true,
			},
		}),
		reactRouter(),
		tsconfigPaths(),
	],
})
