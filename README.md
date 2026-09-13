# Development Documentation

This is an ultra-lightweight template for a `React` + `Vite` project that you can use out of the box.

Pre-installed configurations include:

- `react @^19.3.0`
- `sass`
- `TypeScript @^7.0.0`
- `vite @^8.0.0`
- `eslint` (flat config) + `prettier` + `stylelint`

## Translations

- [中文文档](./docs/README_zh-cn.md)

## Pre-Development Considerations

1. Ensure that you have `node >= 22` installed (managed via `fnm` with the `.nvmrc` file).
2. If you prefer to use `npm`, delete the `pnpm-lock.yaml` file. Note that using `yarn` versions 2 and above is not recommended.

## Project Installation

### Clone the Project Template

```sh
# npx
npx degit https://github.com/sspkudx/react-ts-webpack5.git YOUR_PROJECT_DIRECTORY

# yarn
yarn dlx degit https://github.com/sspkudx/react-ts-webpack5.git YOUR_PROJECT_DIRECTORY

# pnpm
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
```

## Development

```sh
# Start the dev server (http://localhost:9222)
pnpm dev

# Build for production (output to ./dist)
pnpm build

# Preview the production build
pnpm preview

# Format & lint (eslint + stylelint with --fix)
pnpm formatter
```

## Custom Configuration

Edit the [Vite configuration](./vite.config.ts) at the top level. It covers:

- `@` alias pointing to `./src`
- CSS modules (`.module.scss`) with `camelCase` exports
- Global scss variables injected from `./src/assets/scss/_globals.scss`
- `isDev` / `isProd` globals
- Dev server on port `9222`
- Production chunk splitting (`chunk-vendors`) and console/debugger stripping

## Fixing `React.FC`

In `React 18+`, the `React.FC` type has been rewritten, causing issues with destructuring `children`. There are two ways to address this:

#### Method 1: Manually Import `PropsWithChildren` Type When Needed

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
