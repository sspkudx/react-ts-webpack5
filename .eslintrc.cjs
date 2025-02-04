module.exports = {
    env: {
        browser: true,
        es2024: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:react/all',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
    ],
    overrides: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier', 'react', 'react-hooks'],
    rules: {
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
            },
        ],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single', { avoidEscape: true }],
        semi: ['error', 'always'],
        'prettier/prettier': [
            'error',
            {},
            {
                usePrettierrc: true,
            },
        ],
        '@typescript-eslint/no-var-requires': 'off',
        'react/jsx-filename-extension': [
            'error',
            {
                extensions: ['.js', '.jsx', '.tsx'],
            },
        ],
        'react/jsx-no-literals': 'off',
        'react/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],
        'react-hooks/exhaustive-deps': 'off',
        'react/jsx-no-bind': [
            1,
            {
                allowArrowFunctions: true,
                allowFunctions: true,
                allowBind: true,
            },
        ],
        'react/function-component-definition': [
            2,
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
        'react/prop-types': 'off',
    },
};
