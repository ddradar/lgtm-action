// @ts-check
/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import node from 'eslint-plugin-n'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import vitest from 'eslint-plugin-vitest'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['node_modules/**', 'dist/**'] },
  eslint.configs.recommended,
  // Node.js
  {
    ...node.configs['flat/recommended-script'],
    rules: { 'n/no-missing-import': ['off'] },
  },
  // TypeScript
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  { languageOptions: { parserOptions: { project: './tsconfig.lint.json' } } },
  // Prettier
  prettier,
  // Vitest
  { ...vitest.configs.recommended, files: ['test/**'] },
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
