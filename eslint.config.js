import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
    { ignores: ['dist', 'node_modules'] },
    {
        files: ['src/**/*.{js,jsx,ts,tsx}'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            react.configs.flat['jsx-runtime'],
            reactHooks.configs.flat.recommended,
            prettierConfig,
        ],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            prettier,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            indent: ['error', 4, { SwitchCase: 1 }],
            'linebreak-style': ['error', 'unix'],
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            'prettier/prettier': 'error',
            '@typescript-eslint/no-var-requires': 'off',
            'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.tsx'] }],
            'react/jsx-no-literals': 'off',
            'react/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],
            'react-hooks/exhaustive-deps': 'off',
            'react/jsx-no-bind': [1, { allowArrowFunctions: true, allowFunctions: true, allowBind: true }],
            'react/function-component-definition': [
                2,
                { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
            ],
            'react/prop-types': 'off',
        },
    }
);
