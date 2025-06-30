import { defineConfig } from 'vitest/config';
import { qwikVite } from '@builder.io/qwik/optimizer';

export default defineConfig({
  plugins: [qwikVite()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'build/',
        'coverage/',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    include: ['src/tests/**/*.test.{ts,tsx}'],
    exclude: ['node_modules/', 'dist/', 'build/'],
  },
  resolve: {
    alias: {
      '~': new URL('./src', import.meta.url).pathname,
    },
  },
});
