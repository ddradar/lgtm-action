// @ts-check
/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import node from 'eslint-plugin-n'
import vitest from 'eslint-plugin-vitest'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['node_modules/**', 'dist/**'] },
  eslint.configs.recommended,
  // eslint-plugin-n
  {
    ...node.configs['flat/recommended-script'],
    rules: {
      'n/no-missing-import': ['off']
    }
  },
  // typescript-eslint
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.lint.json'
      }
    }
  },
  // Prettier
  eslintConfigPrettier,
  // vitest
  {
    files: ['test/**'],
    plugins: {
      vitest
    },
    rules: {
      ...vitest.configs.recommended.rules
    }
  }
)
