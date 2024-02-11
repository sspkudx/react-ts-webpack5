const { createBasicConfig } = require('./webpack');

module.exports = env => {
    // use env and process.env
    const { dev, prod } = env;
    const { NODE_ENV = 'development' } = process.env;

    return createBasicConfig({
        title: 'react-ts-webpack-starter',
        lang: 'zh-CN',
        isDev: !!dev && NODE_ENV === 'development',
        isProd: !!prod && NODE_ENV === 'production',
    }).toConfig();
};
