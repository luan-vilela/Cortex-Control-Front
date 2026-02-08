import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'dist/**',
    'node_modules/**',
    '.swc/**',
    'coverage/**',
  ]),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      // Type-safe imports enforcement
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      // No console in production
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      // Prefer const
      'prefer-const': 'error',
      // No unused variables
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
])

export default eslintConfig
