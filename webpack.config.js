const { createBasicConfig } = require('./webpack');

/**
 * @description Export a Config Function. See: https://webpack.js.org/configuration/configuration-types/#exporting-a-function
 * @param {Record<string, unknown>} environments environments
 * @returns a webpack config
 */
module.exports = environments => {
    // use env and process.env
    const { dev, prod } = environments;
    const { NODE_ENV = 'development' } = process.env;

    return createBasicConfig({
        title: 'react-ts-webpack-starter',
        lang: 'zh-CN',
        isDev: !!dev && NODE_ENV === 'development',
        isProd: !!prod && NODE_ENV === 'production',
    }).toConfig();
};
