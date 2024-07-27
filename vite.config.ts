import {
	vitePlugin as remix,
	cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [
		AutoImport({
			imports: [
				'react',
				{
					ofetch: ['ofetch'],
					'@remix-run/cloudflare': [['unstable_defineLoader', 'defineLoader']],
					'@remix-run/react': [
						'Link',
						'useLoaderData',
						'useParams',
						'useRevalidator',
						'useNavigate',
						'json',
					],
					valibot: [['*', 'v']],
				},
				{
					from: '@remix-run/cloudflare',
					type: true,
					imports: ['LoaderFunctionArgs', 'MetaFunction'],
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
		remixCloudflareDevProxy(),
		remix({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
				unstable_singleFetch: true,
				unstable_fogOfWar: true,
			},
		}),
		tsconfigPaths(),
	],
});
