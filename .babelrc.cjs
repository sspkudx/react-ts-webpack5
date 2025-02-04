const { version } = require('core-js/package.json');

const corejs = version.split('.').slice(0, -1).join('.');
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
