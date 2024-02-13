import Config from 'webpack-chain';
import { loader as miniLoader } from 'mini-css-extract-plugin';

interface OtherConf {
    isDev: boolean;
    styleType: 'sass' | 'scss' | 'less' | 'stylus' | 'css';
    styleResourcePatterns?: string[];
}

/**
 * @description Generate a function used by 'auto'
 * @param suffix style suffix without dot
 * @returns a function used by 'auto'
 */
const genAutoFunc = (suffix = 'scss') => {
    function cb(rp: string) {
        return rp.endsWith(`.${suffix}`);
    }

    return cb;
};

/**
 * @description config style loads
 * @param confInstance
 * @param  otherConf
 * @returns the config instance
 */
export const loadStyles = (
    confInstance: Config,
    { isDev = true, styleType = 'css', styleResourcePatterns = [] }: OtherConf
): Config => {
    const sourceMap = !isDev;

    if (styleType === 'sass') {
        return confInstance.module
            .rule('sass')
            .test(/\.sass$/i)
            .oneOf('css-modules')
            .test(/\.module\.\w+$/i)
            .use('style')
            .loader(isDev ? 'style-loader' : miniLoader)
            .end()
            .use('css')
            .loader('css-loader')
            .options({
                sourceMap,
                importLoaders: 2,
                // css-module hash
                modules: {
                    auto: genAutoFunc('sass'),
                    localIdentName: '[local]__[hash:base64]',
                },
            })
            .end()
            .use('postcss')
            .loader('postcss-loader')
            .options({ sourceMap })
            .end()
            .use('sass')
            .loader('sass-loader')
            .options({
                sourceMap,
                sassOptions: {
                    indentedSyntax: true,
                },
            })
            .end()
            .use('style-resource')
            .loader('style-resources-loader')
            .options({
                patterns: Array.isArray(styleResourcePatterns) ? styleResourcePatterns : [],
            })
            .end()
            .end()
            .oneOf('css-normal')
            .use('style')
            .loader(isDev ? 'style-loader' : miniLoader)
            .end()
            .use('css')
            .loader('css-loader')
            .options({
                sourceMap,
                importLoaders: 2,
                // css-module hash
                modules: false,
            })
            .end()
            .use('postcss')
            .loader('postcss-loader')
            .options({ sourceMap })
            .end()
            .use('sass')
            .loader('sass-loader')
            .options({
                sourceMap,
                sassOptions: {
                    indentedSyntax: true,
                },
            })
            .end()
            .use('style-resource')
            .loader('style-resources-loader')
            .options({
                patterns: Array.isArray(styleResourcePatterns) ? styleResourcePatterns : [],
            })
            .end()
            .end()
            .end()
            .end();
    }

    if (styleType === 'scss') {
        return confInstance.module
            .rule('scss')
            .test(/\.scss$/i)
            .oneOf('css-module')
            .test(/\.module\.\w+$/i)
            .use('style')
            .loader(isDev ? 'style-loader' : miniLoader)
            .end()
            .use('css')
            .loader('css-loader')
            .options({
                sourceMap,
                importLoaders: 2,
                // css-module hash
                modules: {
                    auto: genAutoFunc('scss'),
                    localIdentName: '[local]__[hash:base64]',
                },
            })
            .end()
            .use('postcss')
            .loader('postcss-loader')
            .options({ sourceMap })
            .end()
            .use('scss')
            .loader('sass-loader')
            .options({ sourceMap })
            .end()
            .use('style-resource')
            .loader('style-resources-loader')
            .options({
                patterns: Array.isArray(styleResourcePatterns) ? styleResourcePatterns : [],
            })
            .end()
            .end()
            .oneOf('css-modules')
            .use('style')
            .loader(isDev ? 'style-loader' : miniLoader)
            .end()
            .use('css')
            .loader('css-loader')
            .options({
                sourceMap,
                importLoaders: 2,
                // css-module hash
                modules: false,
            })
            .end()
            .use('postcss')
            .loader('postcss-loader')
            .options({ sourceMap })
            .end()
            .use('scss')
            .loader('sass-loader')
            .options({ sourceMap })
            .end()
            .use('style-resource')
            .loader('style-resources-loader')
            .options({
                patterns: Array.isArray(styleResourcePatterns) ? styleResourcePatterns : [],
            })
            .end()
            .end()
            .end()
            .end();
    }

    if (styleType === 'less') {
        return confInstance.module
            .rule('less')
            .test(/\.less$/i)
            .oneOf('css-modules')
            .test(/\.module\.\w+$/i)
            .use('style')
            .loader(isDev ? 'style-loader' : miniLoader)
            .end()
            .use('css')
            .loader('css-loader')
            .options({
                sourceMap,
                importLoaders: 2,
                // css-module hash
                modules: {
                    auto: genAutoFunc('less'),
                    localIdentName: '[local]__[hash:base64]',
                },
            })
            .end()
            .use('postcss')
            .loader('postcss-loader')
            .options({ sourceMap })
            .end()
            .use('less')
            .loader('less-loader')
            .options({ sourceMap })
            .end()
            .use('style-resource')
            .loader('style-resources-loader')
            .options({
                patterns: Array.isArray(styleResourcePatterns) ? styleResourcePatterns : [],
            })
            .end()
            .end()
            .oneOf('css-modules')
            .use('style')
            .loader(isDev ? 'style-loader' : miniLoader)
            .end()
            .use('css')
            .loader('css-loader')
            .options({
                sourceMap,
                importLoaders: 2,
                // css-module hash
                modules: false,
            })
            .end()
            .use('postcss')
            .loader('postcss-loader')
            .options({ sourceMap })
            .end()
            .use('less')
            .loader('less-loader')
            .options({ sourceMap })
            .end()
            .use('style-resource')
            .loader('style-resources-loader')
            .options({
                patterns: Array.isArray(styleResourcePatterns) ? styleResourcePatterns : [],
            })
            .end()
            .end()
            .end()
            .end();
    }

    if (styleType === 'stylus') {
        return confInstance.module
            .rule('stylus')
            .test(/\.styl(us)?$/i)
            .oneOf('css-modules')
            .test(/\.module\.\w+$/i)
            .use('style')
            .loader(isDev ? 'style-loader' : miniLoader)
            .end()
            .use('css')
            .loader('css-loader')
            .options({
                sourceMap,
                importLoaders: 2,
                // css-module hash
                modules: {
                    auto: genAutoFunc('styl') || genAutoFunc('stylus'),
                    localIdentName: '[local]__[hash:base64]',
                },
            })
            .end()
            .use('postcss')
            .loader('postcss-loader')
            .options({ sourceMap })
            .end()
            .use('less')
            .loader('stylus-loader')
            .options({ sourceMap })
            .end()
            .use('style-resource')
            .loader('style-resources-loader')
            .options({
                patterns: Array.isArray(styleResourcePatterns) ? styleResourcePatterns : [],
            })
            .end()
            .end()
            .oneOf('normal')
            .use('style')
            .loader(isDev ? 'style-loader' : miniLoader)
            .end()
            .use('css')
            .loader('css-loader')
            .options({
                sourceMap,
                importLoaders: 2,
                // css-module hash
                modules: false,
            })
            .end()
            .use('postcss')
            .loader('postcss-loader')
            .options({ sourceMap })
            .end()
            .use('stylus')
            .loader('stylus-loader')
            .options({ sourceMap })
            .end()
            .use('style-resource')
            .loader('style-resources-loader')
            .options({
                patterns: Array.isArray(styleResourcePatterns) ? styleResourcePatterns : [],
            })
            .end()
            .end()
            .end()
            .end();
    }

    return confInstance.module
        .rule('css')
        .test(/\.css$/i)
        .oneOf('css-module')
        .test(/\.module\.\w+$/i)
        .use('style')
        .loader(isDev ? 'style-loader' : miniLoader)
        .end()
        .use('css')
        .loader('css-loader')
        .options({
            sourceMap,
            importLoaders: 1,
            // css-module hash
            modules: {
                auto: genAutoFunc('css'),
                localIdentName: '[local]__[hash:base64]',
            },
        })
        .end()
        .use('postcss')
        .loader('postcss-loader')
        .options({ sourceMap })
        .end()
        .use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: Array.isArray(styleResourcePatterns) ? styleResourcePatterns : [],
        })
        .end()
        .end()
        .oneOf('css-modules')
        .use('style')
        .loader(isDev ? 'style-loader' : miniLoader)
        .end()
        .use('css')
        .loader('css-loader')
        .options({
            sourceMap,
            importLoaders: 1,
            // css-module hash
            modules: false,
        })
        .end()
        .use('postcss')
        .loader('postcss-loader')
        .options({ sourceMap })
        .end()
        .use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: Array.isArray(styleResourcePatterns) ? styleResourcePatterns : [],
        })
        .end()
        .end()
        .end()
        .end();
};
