const { version: corejs } = require('core-js/package.json');

module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs,
            },
        ],
        [
            '@babel/preset-react',
            {
                runtime: 'automatic',
            },
        ],
        '@babel/preset-typescript',
    ],
    plugins: ['@babel/plugin-syntax-dynamic-import'],
};
