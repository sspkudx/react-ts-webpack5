# CHANGELOG

## Upgraded on April 6th, 2023 (UTC + 8)

-   Upgraded the webpack version from 4 to 5.
-   Added style loaders, including `style-loader`, `css-loader`, `postcss-loader`, and `sass-loader`.
-   Split the configuration for different environments. You can find `webpack.common.js`, `webpack.dev.js`, and `webpack.prod.js` in the `./conf` folder. Feel free to modify them.

## Upgraded on April 20th, 2023 (UTC + 8)

-   Utilized `webpack-chain` to rewrite the `webpack.config.js`.
-   Installed `@solidjs/router`.

## Upgraded on May 30th, 2023 (UTC + 8)

-   Added ESLint, Stylelint, and Prettier configurations with basic settings.

## Upgraded on June 30th, 2023 (UTC + 8)

-   Included a `stylelint` configuration in `.vscode/settings.json`.

## Upgraded on August 5th, 2023 (UTC + 8)

-   Added a favicon.

## Featured on August 5th, 2023 (UTC + 8)

-   Adjusted settings for `React`.

## Featured on August 12th, 2023 (UTC + 8)

-   Added support for `CSS modules`.

## Featured on August 26th, 2023 (UTC + 8)

-   Customized the HTML `lang` attribute.

## Featured on January 16th, 2024 (UTC + 8)

-   Introduced the `ReactParentComponent` type (also known as `RFC`) as a replacement for the previous `React.FC`. Refer to [the guide](./src/types/fixed-types.ts) for more details.

## Featured on February 12, 2024 (UTC + 8)

-   Changed the `module.exports` in `webpack.config.js` to a functional approach.
-   Fixed the issue preventing simultaneous support for regular `css` and `css modules`.
-   Rewrote the documentation in both Chinese and English.

## Featured on February 14, 2024 (UTC + 8)

-   Switch the config file from `webpack.config.js` to `webpack.config.ts`.
-   Discard `clean-webpack-plugin`. Opt for `output.clean` instead.

## Featured on February 22, 2024 (UTC + 8)

-   Incorporate `esbuild-loader` in the development environment. It can be toggled by passing an `isEsbuildInDev` option, which defaults to `true`.
