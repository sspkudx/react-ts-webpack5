module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: '3.35',
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
