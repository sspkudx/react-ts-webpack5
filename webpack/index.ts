import { resolve as pathResolve } from 'path';
import Config from 'webpack-chain';
import compose from 'compose-function';
import { loadStyles, loadJs } from './modules';

// plugins
import { DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { EsbuildPlugin } from 'esbuild-loader';

// types
import type { MinifyOptions } from 'terser';
import type { LoaderOptions as EsbuildLoaderOptions } from 'esbuild-loader';

type ConditionalConfigurationComposeCallback = (conf: Config) => Config;

/**
 * @description Modify the relative path to the root path of the project using `path.resolve`
 * @param suffix the relative path relative to the root path of the project
 * @returns the real path
 */
const withBasePath = (suffix = '') => pathResolve(__dirname, `../${suffix}`);

/**
 * @description get kb
 * @param kbNum kb's num, default 1
 * @returns kb
 */
const kb = (kbNum = 1) => 1024 * kbNum;

const { uglifyJsMinify: minify } = TerserPlugin;

/** @description Self-defined options. */
type SelfDefineOptions = Partial<{
    /** HTML Title */
    title: string;
    /** Language of the project */
    lang: string;
    /** For development conf */
    isDev: boolean;
    /** For production conf */
    isProd: boolean;
    /** Whether open esbuild when At dev or not */
    isEsbuildInDev: boolean;
    /** for esbuild loader options */
    esbuildLoaderOptions: EsbuildLoaderOptions;
    /** Whether open source map for styles or not */
    isOpenStyleSourceMap: (() => boolean) | boolean;
    /** babel only compile, which is more important than `babelNotCompiles` */
    babelOnlyCompiles: (string | RegExp)[];
    /** babel not compile */
    babelNotCompiles: (string | RegExp)[];
}>;

/**
 * Generate a basic config
 * @param options config options
 * @returns basic webpack conf
 */
export const createBasicConfig = (options: SelfDefineOptions = {}): Config => {
    const {
        title = 'react-ts-webpack-starter',
        lang = 'en',
        isDev = true,
        isProd = false,
        isEsbuildInDev = true,
        isOpenStyleSourceMap = false,
        esbuildLoaderOptions = { target: 'es2020' },
        babelOnlyCompiles = [],
        babelNotCompiles = [/node_modules/],
    } = options || {};

    // basic configuration for styles
    const basicStyleConf = {
        isDev,
        isOpenSourceMap: isOpenStyleSourceMap,
    };

    // configuration of loading styles
    const takeConditionalConfiguration: ConditionalConfigurationComposeCallback = compose(
        (conf: Config) =>
            loadStyles(conf, {
                ...basicStyleConf,
                styleType: 'sass',
            }),

        (conf: Config) =>
            loadStyles(conf, {
                ...basicStyleConf,
                styleType: 'scss',
                styleResourcePatterns: [
                    // use scss
                    withBasePath('/src/assets/scss/_globals.scss'),
                ],
            }),

        (conf: Config) =>
            loadStyles(conf, {
                ...basicStyleConf,
                styleType: 'css',
            }),

        (conf: Config) =>
            loadJs(conf, {
                isProd,
                isEsbuildInDev,
                esbuildLoaderOptions,
                notCompiles: babelNotCompiles,
                onlyCompiles: babelOnlyCompiles,
            })
    );

    return takeConditionalConfiguration(
        new Config()
            // set context
            .context(withBasePath())
            // set entry
            .entry('index')
            .add(withBasePath('src/index.tsx'))
            .end()
            // output
            .output.path(withBasePath('dist'))
            .hashFunction('xxhash64')
            .filename('js/[name].[contenthash].bundle.js')
            .chunkFilename('js/[name].[contenthash].js')
            // Set output.clean to replace CleanWebpackPlugin. See: https://webpack.js.org/configuration/output/#outputclean
            .set('clean', true)
            .end()
            // set alias
            .resolve.alias.set('@', withBasePath('src'))
            .end()
            .extensions.add('.js')
            .add('.jsx')
            .add('.ts')
            .add('.tsx')
            .add('.json')
            .add('.cjs')
            .add('.mjs')
            .end()
            .end()
            .module.rule('fonts')
            .test(/\.(woff2?|eot|[ot]tf)$/i)
            .set('type', 'asset/resource')
            .end()
            .rule('pics')
            .test(/\.(png|jpe?g|gif)$/i)
            .set('type', 'asset/resource')
            .set('generator', {
                filename: 'static/[hash][ext][query]',
            })
            .parser({
                dataUrlCondition: {
                    // 10kb
                    maxSize: kb(10),
                },
            })
            .end()
            .end()
            // set plugins
            .plugin('HtmlWebpackPlugin')
            .use(HtmlWebpackPlugin, [
                {
                    template: withBasePath('html/index.htm'),
                    templateParameters: { lang },
                    inject: 'body',
                    favicon: withBasePath('html/favicon.ico'),
                    title,
                },
            ])
            .end()
            .plugin('DefinePlugin')
            .use(DefinePlugin, [{ isDev, isProd }])
            .end()
            // check ts
            .plugin('ForkTsCheckerWebpackPlugin')
            .use(ForkTsCheckerWebpackPlugin, [{ devServer: false }])
            .end()
            // split chunks
            .optimization.splitChunks({
                chunks: 'all',
                minSize: 15000,
            })
            .end()
            // set in development mode
            .when(isDev, configure => {
                configure
                    .devtool('source-map')
                    .mode('development')
                    // set devServer
                    .devServer.compress(true)
                    .port(9222)
                    .hot(true)
                    .open(false)
                    .set('client', {
                        overlay: {
                            errors: true,
                            warnings: false,
                            runtimeErrors: true,
                        },
                    })
                    .end()
                    // check ts in dev environment
                    .plugin('ForkTsCheckerWebpackPlugin')
                    .tap(args => {
                        const [oldConf] = args;
                        return [
                            {
                                ...oldConf,
                                devServer: true,
                            },
                        ];
                    })
                    .end()
                    .plugin('ESLintPlugin')
                    .use(ESLintPlugin, [
                        {
                            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.mjs', '.cjs'],
                            fix: true,
                            threads: true,
                        },
                    ])
                    .end()
                    // config esbuild
                    .when(isEsbuildInDev, conf => {
                        conf.optimization.minimizer('EsbuildPlugin').use(EsbuildPlugin, [
                            {
                                target: esbuildLoaderOptions?.target || 'es2020',
                            },
                        ]);
                    });
            })
            // set in production mode
            .when(isProd, configure => {
                configure
                    .devtool('eval')
                    .mode('production')
                    .optimization.minimize(true)
                    .minimizer('TerserPlugin')
                    .use(TerserPlugin<MinifyOptions>, [
                        {
                            extractComments: true,
                            minify,
                            terserOptions: {
                                ecma: 5,
                                compress: {
                                    drop_console: true,
                                    drop_debugger: true,
                                },
                            },
                        },
                    ])
                    .end()
                    .minimizer('CssMinimizerPlugin')
                    .use(CssMinimizerPlugin)
                    .end()
                    .splitChunks({
                        cacheGroups: {
                            defaultVendors: {
                                name: 'chunk-vendors',
                                test: /[\\/]node_modules[\\/]/,
                                priority: -10,
                                chunks: 'initial',
                            },
                            common: {
                                name: 'chunk-common',
                                minChunks: 2,
                                priority: -20,
                                chunks: 'initial',
                                reuseExistingChunk: true,
                            },
                        },
                    })
                    .set('realContentHash', false)
                    // html webpack plugin
                    .end()
                    .plugin('HtmlWebpackPlugin')
                    .tap(([oldConf]) => [
                        {
                            ...oldConf,
                            minify: true,
                        },
                    ])
                    .end()
                    .plugin('MiniCssExtractPlugin')
                    .use(MiniCssExtractPlugin, [{ filename: 'style/[name]-[contenthash].css' }])
                    .end()
                    // check ts in prod environment
                    .plugin('ForkTsCheckerWebpackPlugin')
                    .tap(args => {
                        const [oldConf] = args;
                        return [
                            {
                                ...oldConf,
                                devServer: false,
                                typescript: {
                                    diagnosticOptions: {
                                        semantic: true,
                                        syntactic: true,
                                    },
                                },
                            },
                        ];
                    })
                    .end();
            })
    );
};
