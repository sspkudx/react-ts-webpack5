import Config from 'webpack-chain';
import type { LoaderOptions as EsbuildLoaderOpts } from 'esbuild-loader';

/** @description basic config of ts-loader */
const tsLoaderBasicConf = {
    transpileOnly: true,
    happyPackMode: true,
};

/** @description Options when config js/ts loading */
type LoadJsOptions = Partial<{
    /** is at prod environment */
    isProd: boolean;
    /** is using TypeScript */
    isTypeScript: boolean;
    /** is using esbuild in your dev environment */
    isEsbuildInDev: boolean;
    /** your options of esbuild loader */
    esbuildLoaderOpts: EsbuildLoaderOpts;
}>;

/**
 * @description add thread loader when isProd
 * @param confInstance the webpack chain config instance
 * @param opts other options of this function
 */
export const loadJs = (confInstance: Config, opts: LoadJsOptions = {}): Config => {
    const { isProd, isTypeScript = true, isEsbuildInDev = false, esbuildLoaderOpts = {} } = opts || {};

    // Configuration only at production environment
    if (isProd) {
        const baseConf = confInstance.module
            .rule('js')
            .test(/\.jsx?$/i)
            .use('thread-loader')
            .loader('thread-loader')
            .end()
            .use('babel')
            .loader('babel-loader')
            .options({ babelrc: true })
            .end()
            .exclude.add(/node_modules/)
            .end()
            .end();

        if (isTypeScript) {
            return baseConf
                .rule('ts')
                .test(/\.tsx?$/i)
                .use('thread-loader')
                .loader('thread-loader')
                .end()
                .use('babel')
                .loader('babel-loader')
                .options({ babelrc: true })
                .end()
                .exclude.add(/node_modules/)
                .end()
                .use('ts-loader')
                .loader('ts-loader')
                .options(tsLoaderBasicConf)
                .end()
                .end()
                .end();
        }

        return baseConf.end();
    }

    // Taking esbuild when at dev
    if (isEsbuildInDev) {
        return confInstance.module
            .rule('js-ts')
            .test(/\.[jt]sx?$/)
            .use('esbuild-loader')
            .loader('esbuild-loader')
            .options({
                target: 'es2020',
                ...esbuildLoaderOpts,
            })
            .end()
            .end()
            .end();
    }

    const baseConf = confInstance.module
        .rule('js')
        .test(/\.jsx?$/i)
        .use('babel')
        .loader('babel-loader')
        .options({ babelrc: true })
        .end()
        .exclude.add(/node_modules/)
        .end()
        .end();

    if (isTypeScript) {
        return baseConf
            .rule('ts')
            .test(/\.tsx?$/i)
            .use('babel')
            .loader('babel-loader')
            .options({ babelrc: true })
            .end()
            .exclude.add(/node_modules/)
            .end()
            .use('ts-loader')
            .loader('ts-loader')
            .options(tsLoaderBasicConf)
            .end()
            .end()
            .end();
    }

    return baseConf.end();
};
