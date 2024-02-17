import { createBasicConfig } from './webpack';
import { checkNodejsVersion } from './confs/CheckNodejsVersion';
import type { Configuration } from 'webpack';

/**
 * @description Export a Config Function.
 * See: https://webpack.js.org/configuration/configuration-types/#exporting-a-function
 * @param  environments environments, like dev, prod ...
 * @returns a webpack config
 */
const webpackConfigCallback = (environments: Record<string, unknown>): Configuration => {
    checkNodejsVersion();
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

export default webpackConfigCallback;
