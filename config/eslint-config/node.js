import js from '@eslint/js'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // Base ESLint recommended
  js.configs.recommended,

  // TypeScript ESLint recommended
  ...tseslint.configs.recommended,

  // Ignore patterns
  {
    ignores: ['node_modules/**', 'dist/**'],
  },

  // Main configuration
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  // Prettier deve ser o último para sobrescrever regras conflitantes
  prettierPlugin,
)
