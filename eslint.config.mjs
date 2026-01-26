// @ts-check
import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import node from 'eslint-plugin-n'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default defineConfig(
  { ignores: ['node_modules/**', 'dist/**'] },
  eslint.configs.recommended,
  // Node.js
  {
    ...node.configs['flat/recommended-script'],
    settings: { n: { allowModules: ['@octokit/webhooks-types'] } },
    rules: {
      'n/no-unsupported-features/node-builtins': [
        'error',
        { ignores: ['test', 'test.mock', 'test.mock.module'] },
      ],
    },
  },
  // TypeScript
  {
    files: ['**/*.ts'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: { parserOptions: { project: './tsconfig.lint.json' } },
  },
  { files: ['**/*.mjs'], languageOptions: { sourceType: 'module' } },
  // Prettier
  prettier,
  // simple-import-sort
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  }
)
