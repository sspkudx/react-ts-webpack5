const { createConfig } = require('./webpack/webpack.base');

module.exports = createConfig({
    env: process.env.NODE_ENV,
    title: 'react-ts-webpack-starter',
    lang: 'zh-CN',
}).toConfig();
