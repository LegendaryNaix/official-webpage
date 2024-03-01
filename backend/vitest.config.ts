/* eslint-disable @typescript-eslint/naming-convention */
import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.spec.ts'],
    globals: true,
    root: './',
    coverage: {
      provider: 'v8',
      include: ['**/*.{service,controller}.ts']
    }
  },
  resolve: {
    alias: {
      '@/*': 'app/src/*',
      '@libs/prisma': './libs/prisma/src/index.ts',
      '@libs/auth': './libs/auth/src/index.ts',
      '@libs/exception': './libs/exception/src/index.ts',
      '@libs/decorator': './libs/decorator/src/index.ts',
      '@libs/constants': './libs/constants/src/index.ts',
      '@libs/cache': './libs/cache/src/index.ts',
      '@libs/storage': './libs/storage/src/index.ts'
    }
  },
  plugins: [swc.vite()]
})
