const { createBasicConfig } = require('./webpack');

module.exports = env => {
    // use env and process.env
    const { dev, prod } = env;
    const { NODE_ENV = 'development' } = process.env;

    return createBasicConfig({
        title: 'react-ts-webpack-starter',
        lang: 'zh-CN',
        isDev: Boolean(dev) && Boolean(NODE_ENV === 'development'),
        isProd: Boolean(prod) && Boolean(NODE_ENV === 'production'),
    }).toConfig();
};
