// @ts-check
/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
import eslint from '@eslint/js'
import vitest from '@vitest/eslint-plugin'
import prettier from 'eslint-config-prettier'
import node from 'eslint-plugin-n'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['node_modules/**', 'dist/**'] },
  eslint.configs.recommended,
  // Node.js
  {
    ...node.configs['flat/recommended-script'],
    settings: { n: { allowModules: ['@octokit/webhooks-types'] } },
  },
  // TypeScript
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  { languageOptions: { parserOptions: { project: './tsconfig.lint.json' } } },
  // Prettier
  prettier,
  // Vitest
  {
    files: ['**/*.test.ts'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/consistent-test-filename': 'error',
      'vitest/consistent-test-it': ['error', { fn: 'test' }],
      'vitest/no-alias-methods': 'error',
      'vitest/no-conditional-in-test': 'error',
      'vitest/no-disabled-tests': 'warn',
      'vitest/no-duplicate-hooks': 'error',
      'vitest/no-focused-tests': 'error',
      'vitest/no-import-node-test': 'error',
      'vitest/no-standalone-expect': 'error',
      'vitest/no-test-return-statement': 'error',
      'vitest/prefer-comparison-matcher': 'error',
      'vitest/prefer-each': 'error',
      'vitest/prefer-equality-matcher': 'error',
      'vitest/prefer-hooks-in-order': 'error',
      'vitest/prefer-hooks-on-top': 'error',
      'vitest/prefer-mock-promise-shorthand': 'error',
      'vitest/prefer-strict-equal': 'error',
      'vitest/require-to-throw-message': 'error',
    },
  },
  // simple-import-sort
  {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  }
)
