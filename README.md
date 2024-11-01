# Development Documentation

This is an ultra-lightweight template for a `React` + `webpack` project that you can use out of the box.

Pre-installed configurations include:

-   `react @^18.3.0`
-   `sass`
-   `TypeScript @^5.0.0`

## Translations

-   [中文文档](./docs/README_zh-cn.md)

## Pre-Development Considerations

1. Ensure that you have `node >= 16` installed, preferably using the **LTS** version.
2. If you prefer to use `npm`, delete the `pnpm-lock.yaml` file. Note that using `yarn` versions 2 and above is not recommended.
3. If you prefer to use `yarn`, delete the`pnpm-lock.yaml` file. Note that using `yarn` versions 2 and above is not recommended.
4. If you prefer to use `pnpm`, make sure your `node >= 16`.

## Project Installation

### Clone the Project Template

```sh
# Using npx
npx degit https://github.com/sspkudx/react-ts-webpack5.git YOUR_PROJECT_DIRECTORY

# Using yarn
yarn dlx degit https://github.com/sspkudx/react-ts-webpack5.git YOUR_PROJECT_DIRECTORY

# Using pnpm
pnpm dlx degit https://github.com/sspkudx/react-ts-webpack5.git YOUR_PROJECT_DIRECTORY
```

### Install Dependencies

```sh
# Using npm
npm install

# Using yarn
yarn

# Using pnpm
pnpm install

# If you want to take the latest packages, run command below instead.
pnpm up
```

## Development Considerations

### Custom Configuration

**Avoid** directly modifying the [basic Webpack configuration](./webpack/index.ts). Instead, it's recommended to modify the [Webpack configuration file](./webpack.config.ts) at the top level using the [Webpack Chain](https://github.com/neutrinojs/webpack-chain/tree/v6.5.1) syntax.

Example:

```typescript
import { Configuration } from 'webpack';
import { createBasicConfig } from './webpack';

const webpackConfigCallback = (environments: Record<string, boolean>): Configuration => {
    // Use env and process.env
    const { dev, prod } = env;
    const { NODE_ENV = 'development' } = process.env;

    return (
        createBasicConfig({
            title: 'react-ts-webpack-starter',
            lang: 'zh-CN',
            isDev: Boolean(dev) && NODE_ENV === 'development',
            isProd: Boolean(prod) && NODE_ENV === 'production',
        })
            // Example: Add your custom configuration below
            .plugin('YourPlugin')
            .use(YourPlugin, [
                {
                    // Plugin configuration
                },
            ])
            .end()
            // Don't forget to end with .toConfig()
            .toConfig()
    );
};

export default webpackConfigCallback;
```

### Fixing `React.FC`

In `React 18`, the `React.FC` type has been rewritten, causing issues with destructuring `children`. There are two ways to address this:

#### Method 1: Manually Import `PropsWithChildren` Type When Needed

Although the official recommendation is for developers to define components using the `function` keyword, many developers still prefer using `React.FC`. However, even when using `React.FC` to represent components, you still need to manually import the `PropsWithChildren` type in `React 18`.

The official recommendation is to define components like this when they have `children`:

```tsx
import { PropsWithChildren } from 'react';

interface IProps {
    value: string;
}

function ParentComponent(props: PropsWithChildren<IProps>) {
    const { value, children } = props;
    return (
        <div>
            <p>{value}</p>
            {children}
        </div>
    );
}

export default ParentComponent;
```

However, the common practice is as follows:

```tsx
// Import { PropsWithChildren } when needed for 'children'
import React, { PropsWithChildren } from 'react';

interface IProps {
    value: string;
}

const ParentComponent: React.FC<PropsWithChildren<IProps>> = props => {
    const { value, children } = props;

    return (
        <div>
            <p>{value}</p>
            {children}
        </div>
    );
};

export default ParentComponent;
```

#### Method 2 (Recommended): Use the Encapsulated `ReactParentComponent` Type (or `RFC`)

This method is essentially a wrapper around Method 1, so you can use it directly.

Example:

```tsx
import type { ReactParentComponent } from '@/types/fixed-types';

interface TestComponentProps {}

const TestComponent: ReactParentComponent<TestComponentProps> = ({
    // Correct now
    children,
}) => { ... };
```

Even better, you can use the following shorthand form:

```tsx
import type { RFC } from '@/types/fixed-types';

interface TestComponentProps {}

const TestComponent: RFC<TestComponentProps> = ({
    // Correct now
    children,
}) => { ... };
```
