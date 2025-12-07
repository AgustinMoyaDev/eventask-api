import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Base JavaScript recommended rules
  js.configs.recommended,

  // Configuration for TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
    },
    rules: {
      // Extend TypeScript recommended rules
      ...typescript.configs.recommended.rules,

      // Prettier integration (same as plugin:prettier/recommended)
      ...prettierConfig.rules,
      'prettier/prettier': 'warn',

      // Custom rules (like .eslintrc.cjs)
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      '@typescript-eslint/no-unused-vars': ['warn'], // Warn about unused variables as warning
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Do not force return types
      'comma-dangle': ['error', 'only-multiline'], // Commas only when helpful in multi-line
    },
  },

  // Global ignores (replaces .eslintignore)
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]
