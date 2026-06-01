import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./testSetup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
      exclude: [
        'src/database/**',
        'src/commands/**',
        'src/index.ts',
        'src/config/**',
        '**/*.d.ts',
      ],
    },
    include: ['src/__tests__/**/*.test.ts', 'src/**/*.test.ts'],
  },
})

