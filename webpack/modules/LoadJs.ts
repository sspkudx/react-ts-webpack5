import Config from 'webpack-chain';

type LoadJsOptions = Partial<{
    isProd: boolean;
    isTypeScript: boolean;
}>;

/** @description add thread loader when isProd */
export const loadJs = (confInstance: Config, opts: LoadJsOptions = {}) => {
    const { isProd, isTypeScript = true } = opts || {};

    // basic config of ts-loader
    const tsLoaderBasicConf = {
        transpileOnly: true,
        happyPackMode: false,
    };

    if (isProd) {
        if (isTypeScript) {
            return confInstance.module
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
                .options({
                    ...tsLoaderBasicConf,
                    happyPackMode: true,
                })
                .end()
                .end()
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
                .end()
                .end();
        }

        return confInstance.module
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
            .end()
            .end();
    }

    if (isTypeScript) {
        return confInstance.module
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
            .options({
                ...tsLoaderBasicConf,
                happyPackMode: true,
            })
            .end()
            .end()
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
            .end()
            .end();
    }

    return confInstance.module
        .rule('js')
        .test(/\.jsx?$/i)
        .use('babel')
        .loader('babel-loader')
        .options({ babelrc: true })
        .end()
        .exclude.add(/node_modules/)
        .end()
        .end()
        .end();
};
