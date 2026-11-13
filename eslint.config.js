import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist/**', 'public/hanzi/**', '.lesson-reference-tmp/**']),

  // Shared base for every linted file.
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },

  // Type-aware rules for TypeScript sources (floating promises, unsafe any, ...).
  {
    files: ['src/**/*.{ts,tsx}', 'scripts/**/*.ts', '*.config.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Browser app code.
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
    plugins: { 'react-refresh': reactRefresh },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },

  // Tests (Vitest APIs are imported explicitly, so no extra globals needed).
  {
    files: ['src/**/*.test.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // Asymmetric matchers (expect.any, expect.stringMatching) are typed as any.
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },

  // Node scripts and root config files.
  {
    files: ['scripts/**/*.ts', '*.config.ts', '*.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Must stay last: turns off rules that conflict with Prettier.
  eslintConfigPrettier,
);
