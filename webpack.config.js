const { createBasicConfig } = require('./webpack');

module.exports = (env, argv) => {
    const { dev, prod } = env;
    const { mode } = argv;

    return createBasicConfig({
        title: 'react-ts-webpack-starter',
        lang: 'zh-CN',
        isDev: Boolean(dev) && Boolean(mode === 'development'),
        isProd: Boolean(prod) && Boolean(mode === 'production'),
    }).toConfig();
};
