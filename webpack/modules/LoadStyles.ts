import Config from 'webpack-chain';
import { loader as miniLoader } from 'mini-css-extract-plugin';

/** valid style types */
type StyleType = ['css', 'sass', 'scss', 'less', 'styl', 'stylus'][number];

/**
 * @description Generate a function used by 'auto'
 * @param suffix style suffix without dot
 * @returns a function used by 'auto'
 */
const genAutoFunc = (suffix = 'scss') => {
    /** @param rp resolvedPath */
    function cb(rp: string) {
        if (['styl', 'stylus'].includes(suffix)) {
            return rp.endsWith('.styl') || rp.endsWith('.stylus');
        }

        return rp.endsWith(`.${suffix}`);
    }

    return cb;
};

/**
 * @description generate options of css loaders
 * @param opts options
 */
const genCssLoaderOption = (
    opts: Partial<{
        styleType: StyleType;
        isWithCssModule: boolean;
        sourceMap: boolean;
    }> = {}
) => {
    const { styleType = 'scss', isWithCssModule = true, sourceMap = false } = opts || {};
    const importLoaders = Number(styleType !== 'css') + 1;

    // conf without modules
    const basicConf = {
        sourceMap,
        importLoaders,
        modules: false,
    };

    if (isWithCssModule) {
        // conf with modules
        return {
            ...basicConf,
            modules: {
                auto: genAutoFunc(styleType),
                // css-module hash
                localIdentName: '[local]__[hash:base64]',
                exportLocalsConvention: 'camelCase',
            },
        };
    }

    return basicConf;
};

/**
 * @description Generate some config of css preprocessors
 * @param styleType style type supported
 */
const genStyleConfigWithPreloader = (opts: { styleType?: StyleType; sourceMap?: boolean } = {}) => {
    const { styleType = 'scss', sourceMap = false } = opts;
    const styleTypeList = ['sass', 'scss', 'less', 'styl', 'stylus'];

    if (styleTypeList.includes(styleType)) {
        // List basic keys
        let regex = /\.scss$/i;
        let selfLoaderName = 'sass-loader';
        let selfLoaderOptions = { sourceMap: styleType === 'scss' ? true : sourceMap };

        // for sass
        if (styleType === 'sass') {
            regex = /\.sass$/i;
            selfLoaderOptions = Object.assign(selfLoaderOptions, {
                sassOptions: {
                    indentedSyntax: true,
                },
            });
        }

        // for less
        if (styleType === 'less') {
            regex = /\.less$/i;
            selfLoaderName = 'less-loader';
            selfLoaderOptions = Object.assign(selfLoaderOptions, {
                lessOptions: {
                    // If you use antd as your project's UI library, this line is very important!
                    javascriptEnabled: true,
                },
            });
        }

        // for stylus
        if (['styl', 'stylus'].includes(styleType)) {
            regex = /\.styl(us)?$/i;
            selfLoaderName = 'stylus-loader';
        }

        return {
            regex,
            selfLoaderName,
            selfLoaderOptions,
        };
    }

    return null;
};

/**
 * @description config style loads
 * @param confInstance
 * @param  otherConf
 * @returns the config instance
 */
export const loadStyles = (
    confInstance: Config,
    opts: Partial<{
        isDev: boolean;
        styleType: StyleType;
        styleResourcePatterns: string[];
        /** toggle source map option to users */
        isOpenSourceMap: (() => boolean) | boolean;
    }> = {}
) => {
    const { isDev = true, styleType = 'css', styleResourcePatterns = [], isOpenSourceMap } = opts || {};
    const sourceMap = typeof isOpenSourceMap === 'function' ? isOpenSourceMap() : Boolean(isOpenSourceMap);
    /** the basic parameter of thr function genCssLoaderOption */
    const basicOptGenCssLoaderOption = { styleType, sourceMap };
    const cssPreConfiguration = genStyleConfigWithPreloader({ styleType, sourceMap });

    if (cssPreConfiguration) {
        const { regex, selfLoaderName, selfLoaderOptions } = cssPreConfiguration;

        if (styleType === 'scss') {
            // add 'resolve-url-loader' to fix `url()` in scss
            return confInstance.module
                .rule(styleType)
                .test(regex)
                .oneOf('css-module')
                .test(/\.module\.\w+$/i)
                .use('style')
                .loader(isDev ? 'style-loader' : miniLoader)
                .end()
                .use('css')
                .loader('css-loader')
                .options(genCssLoaderOption(basicOptGenCssLoaderOption))
                .end()
                .use('postcss')
                .loader('postcss-loader')
                .options({ sourceMap })
                .end()
                .use('resolve-url-loader')
                .loader('resolve-url-loader')
                .end()
                .use(styleType)
                .loader(selfLoaderName)
                .options(selfLoaderOptions)
                .end()
                .use('style-resource')
                .loader('style-resources-loader')
                .options({
                    patterns: Array.isArray(styleResourcePatterns) ? styleResourcePatterns : [],
                })
                .end()
                .end()
                .oneOf('style-normal')
                .use('style')
                .loader(isDev ? 'style-loader' : miniLoader)
                .end()
                .use('css')
                .loader('css-loader')
                .options(genCssLoaderOption({ isWithCssModule: false, ...basicOptGenCssLoaderOption }))
                .end()
                .use('postcss')
                .loader('postcss-loader')
                .options({ sourceMap })
                .end()
                .use(styleType)
                .loader(selfLoaderName)
                .options(selfLoaderOptions)
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
            .rule(styleType)
            .test(regex)
            .oneOf('css-module')
            .test(/\.module\.\w+$/i)
            .use('style')
            .loader(isDev ? 'style-loader' : miniLoader)
            .end()
            .use('css')
            .loader('css-loader')
            .options(genCssLoaderOption(basicOptGenCssLoaderOption))
            .end()
            .use('postcss')
            .loader('postcss-loader')
            .options({ sourceMap })
            .end()
            .use(styleType)
            .loader(selfLoaderName)
            .options(selfLoaderOptions)
            .end()
            .use('style-resource')
            .loader('style-resources-loader')
            .options({
                patterns: Array.isArray(styleResourcePatterns) ? styleResourcePatterns : [],
            })
            .end()
            .end()
            .oneOf('style-normal')
            .use('style')
            .loader(isDev ? 'style-loader' : miniLoader)
            .end()
            .use('css')
            .loader('css-loader')
            .options(genCssLoaderOption({ isWithCssModule: false, ...basicOptGenCssLoaderOption }))
            .end()
            .use('postcss')
            .loader('postcss-loader')
            .options({ sourceMap })
            .end()
            .use(styleType)
            .loader(selfLoaderName)
            .options(selfLoaderOptions)
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

    // for css only
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
        .options(genCssLoaderOption(basicOptGenCssLoaderOption))
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
        .oneOf('style-normal')
        .use('style')
        .loader(isDev ? 'style-loader' : miniLoader)
        .end()
        .use('css')
        .loader('css-loader')
        .options(genCssLoaderOption({ isWithCssModule: false, ...basicOptGenCssLoaderOption }))
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
