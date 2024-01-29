module.exports = {
    env: {
        browser: true,
        es2022: true,
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
        /**
         * @see
         * - 'function-declaration' is used in the following manner:
         *
         * ```
         * function ReactComponent(props: ReactComponent) {
         *     ...
         * }
         * ```
         * - 'arrow-function' is utilised as shown below:
         *
         * ```
         * const ReactComponent: React.FC<ReactComponent> = props => {
         *     ...
         * };
         * ```
         *
         * Both styles are valid. You can modify this rule based on your specific needs.
         * For instance, if 'arrow-function' is predominantly used in your team, you can
         * adjust the rule as follows:
         * 'react/function-component-definition': [2, {
         *      namedComponents: ['arrow-function'],
         *      unnamedComponents: ['arrow-function'],
         * }]
         *
         * @ChineseVersion
         * - 规则'function-declaration'(用函数声明式定义组件)：
         *
         * ```
         * function ReactComponent(props: ReactComponent) {
         *     ...
         * }
         * ```
         * - 规则'arrow-function'(用箭头函数定义组件)：
         *
         * ```
         * const ReactComponent: React.FC<ReactComponent> = props => {
         *     ...
         * };
         * ```
         *
         * 这两种方式都是可以接受的，可以根据你的需求来修改下面的规则。
         * 例如，如果团队用箭头函数定义组件比较多，你可以将规则重写为：
         * 'react/function-component-definition': [2, {
         *      namedComponents: 'arrow-function',
         *      unnamedComponents: 'arrow-function',
         * }]
         */
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
