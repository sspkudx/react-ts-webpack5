import { resolve as pathResolve } from 'path';
import Config from 'webpack-chain';
import compose from 'compose-function';
import { loadStyles } from './modules/LoadStyles';

// plugins
import { DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

// types
import type { MinifyOptions } from 'terser';

/** @description Self-defined options. */
type SelfDefineOptions = Partial<{
    /** HTML Title */
    title: string;
    /** Language of the project */
    lang: string;
    /** for development conf */
    isDev: boolean;
    /** for production conf */
    isProd: boolean;
}>;

/**
 * @description Modify the relative path to the root path of the project using `path.resolve`
 * @param suffix the relative path relative to the root path of the project
 * @returns the real path
 */
const withBasePath = (suffix = '') => pathResolve(__dirname, `../${suffix}`);

const { uglifyJsMinify: minify } = TerserPlugin;

/**
 * Generate a basic config
 * @param options config options
 * @returns basic webpack conf
 */
export const createBasicConfig = (options: SelfDefineOptions = {}): Config => {
    const { title = 'react-ts-webpack-starter', lang = 'en', isDev = true, isProd = false } = options || {};

    // configuration of loading styles
    const configLoadStyle = compose(
        (conf: Config) =>
            loadStyles(conf, {
                isDev,
                styleType: 'sass',
            }),

        (conf: Config) =>
            loadStyles(conf, {
                isDev,
                styleType: 'scss',
                styleResourcePatterns: [
                    // use scss
                    withBasePath('/src/assets/scss/_globals.scss'),
                ],
            }),

        (conf: Config) =>
            loadStyles(conf, {
                isDev,
                styleType: 'css',
            })
    );

    return configLoadStyle(
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
            .module.rule('js')
            .test(/\.[jt]sx?$/i)
            .use('babel')
            .loader('babel-loader')
            .options({ babelrc: true })
            .end()
            .exclude.add(/node_modules/)
            .end()
            .end()
            // add pics
            .rule('pics')
            .test(/\.(png|svg|jpe?g|gif)$/i)
            .set('type', 'asset/resource')
            .parser({
                dataUrlCondition: {
                    maxSize: 10 * 1024,
                },
            })
            .end()
            .rule('fonts')
            .test(/\.(woff2?|eot|[ot]tf)$/i)
            .set('type', 'asset/resource')
            .end()
            .end()
            // set plugins
            .plugin('HtmlWebpackPlugin')
            .use(HtmlWebpackPlugin, [
                {
                    template: withBasePath('html/index.htm'),
                    templateParameters: {
                        lang,
                    },
                    inject: 'body',
                    favicon: withBasePath('html/favicon.ico'),
                    title,
                },
            ])
            .end()
            .plugin('DefinePlugin')
            .use(DefinePlugin, [
                {
                    isDev,
                    isProd,
                },
            ])
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
                    .end()
                    // check ts in dev environment
                    .plugin('ForkTsCheckerWebpackPlugin')
                    .use(ForkTsCheckerWebpackPlugin, [
                        {
                            devServer: true,
                        },
                    ])
                    .end()
                    .plugin('ESLintPlugin')
                    .use(ESLintPlugin, [
                        {
                            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.mjs', '.cjs'],
                            fix: true,
                            threads: true,
                        },
                    ])
                    .end();
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
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                    .tap(args => [
                        ...args,
                        {
                            minify: true,
                        },
                    ])
                    .end()
                    .plugin('MiniCssExtractPlugin')
                    .use(MiniCssExtractPlugin, [
                        {
                            filename: 'style/[name]-[contenthash].css',
                        },
                    ])
                    .end();
            })
    );
};
