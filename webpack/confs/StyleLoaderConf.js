const { loader: miniLoader } = require('mini-css-extract-plugin');

/**
 * Make parameter of the function dispatchLoaderBasedOnEnv for style loaders
 * @param {boolean} isSelf is loader self or name.
 * @returns style loader dispatch params
 */
const getStyleLoaderOptionList = (isSelf = true) => [
    {
        env: 'development',
        loader: 'style-loader',
    },
    {
        env: 'production',
        loader: isSelf ? miniLoader : 'mini-loader',
    },
];

module.exports = { getStyleLoaderOptionList };
