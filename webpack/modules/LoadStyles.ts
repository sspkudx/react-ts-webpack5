import Config from 'webpack-chain';
import { loader as miniLoader } from 'mini-css-extract-plugin';

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
 * @param styleType style type supported
 * @param isWithCssModule is css-module config generated
 */
const genCssLoaderOption = (styleType = 'scss', isWithCssModule = true) => {
    const importLoaders = Number(styleType !== 'css') + 1;

    // conf without modules
    const basicConf = {
        sourceMap: false,
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
const genStyleConfigWithPreloader = (styleType = 'scss') => {
    const styleTypeList = ['sass', 'scss', 'less', 'styl', 'stylus'];
    const sourceMap = false;

    if (styleTypeList.includes(styleType)) {
        // List basic keys
        let regex = /\.scss$/i;
        let selfLoaderName = 'sass-loader';
        let selfLoaderOptions = { sourceMap };

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

/** the second parameter's type of `loadStyles` */
type LoadStylesOtherConf = Partial<{
    isDev: boolean;
    styleType: ['css', 'sass', 'scss', 'less', 'styl', 'stylus'][number];
    styleResourcePatterns: string[];
}>;

/**
 * @description config style loads
 * @param confInstance
 * @param  otherConf
 * @returns the config instance
 */
export const loadStyles = (
    confInstance: Config,
    { isDev = true, styleType = 'css', styleResourcePatterns = [] }: LoadStylesOtherConf
) => {
    const sourceMap = false;

    const cssPreConfs = genStyleConfigWithPreloader(styleType);
    if (cssPreConfs) {
        const { regex, selfLoaderName, selfLoaderOptions } = cssPreConfs;

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
            .options(genCssLoaderOption(styleType))
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
            .oneOf('css-modules')
            .use('style')
            .loader(isDev ? 'style-loader' : miniLoader)
            .end()
            .use('css')
            .loader('css-loader')
            .options(genCssLoaderOption(styleType, false))
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
        .options(genCssLoaderOption(styleType))
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
        .options(genCssLoaderOption(styleType, false))
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
