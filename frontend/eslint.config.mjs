// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint, { parser } from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import importSort from 'eslint-plugin-simple-import-sort';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jestPlugin from 'eslint-plugin-jest';
import nextPlugin from '@next/eslint-plugin-next';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      prettier,
      'simple-import-sort': importSort,
      'jsx-a11y': jsxA11y,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // General style rules
      'prettier/prettier': 'error', // Enforce proper formatting
      'no-console': 'warn', // Warn on leftover console statements
      'no-debugger': 'error', // Disallow debugger in committed code

      // TypeScript style
      '@typescript-eslint/no-explicit-any': 'warn', // Avoid using any when possible
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error', // Use import type
      '@typescript-eslint/no-deprecated': 'off',

      // React rules
      'react/react-in-jsx-scope': 'off', // Next.js does not require importing React
      'react/jsx-uses-react': 'off', // Outdated React 17 rule
      'react/jsx-uses-vars': 'warn', // Ensure JSX vars are not removed by mistake

      // React Hooks
      'react-hooks/rules-of-hooks': 'error', // Hooks must be used correctly
      'react-hooks/exhaustive-deps': 'warn', // Keep dependency arrays complete

      // MUI / JSX accessibility recommendations
      'jsx-a11y/alt-text': 'warn', // Ensure img/Image has alt attributes
      'jsx-a11y/anchor-is-valid': 'warn', // Ensure <a> usage is valid
      'jsx-a11y/click-events-have-key-events': 'warn', // Ensure click handlers support keyboard

      // Next.js recommended settings
      '@next/next/no-img-element': 'warn', // Prefer <Image /> over <img /> for performance/safety
      '@next/next/no-html-link-for-pages': 'off', // Allow <a href> navigation
      '@next/next/no-sync-scripts': 'error', // Disallow synchronous <script>
      '@next/next/no-title-in-document-head': 'error', // Do not set <title> in _document.js
      '@next/next/no-document-import-in-page': 'error', // Prevent importing _document.js in page components
      '@next/next/no-head-element': 'error', // Use <Head /> instead of raw <head>

      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/*.test.tsx', '**/*.test.ts'],
    plugins: { jest: jestPlugin },
    languageOptions: {
      globals: { ...globals.jest },
    },
    rules: {
      'jest/no-disabled-tests': 'warn', // Avoid forgetting test.skip
      'jest/expect-expect': 'warn', // Each test should include expect
    },
  },
);
