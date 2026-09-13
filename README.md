# Development Documentation

An ultra-lightweight `React` + `Vite` + `TypeScript` monorepo scaffold (pnpm workspace), ready to use out of the box.

Pre-installed configurations include:

- `react @^19.3.0`
- `sass`
- `TypeScript @^6.0.3`
- `vite @^8.3.0`
- `eslint` (flat config) + `prettier` + `stylelint`

## Translations

- [中文文档](./docs/README_zh-cn.md)

## Project Structure

```
├── apps/
│   └── example-app/        # Example app (Vite + React 19 + TS, dev port 9222)
├── packages/
│   └── shared/             # @react-app/shared — shared utility library
├── tsconfig.base.json      # Shared TS config (customConditions: ["development"])
├── pnpm-workspace.yaml     # Workspace declaration + catalog versions + supply-chain policy
└── package.json            # Root orchestrator (private; scripts delegate via pnpm -F / -r)
```

See [apps/README.md](./apps/README.md) and [packages/README.md](./packages/README.md) for the conventions of each directory.

## Requirements

1. `node >= 22` (managed via `fnm` with the `.nvmrc` file).
2. `pnpm >= 11` — **required**. This monorepo relies on the `workspace:*` protocol, catalogs and `allowBuilds`, none of which work with `npm`; `yarn` is not supported either.

## Project Installation

### Clone the Project Template

```sh
pnpm dlx degit https://github.com/Allen-Bayern/react-scafflod.git YOUR_PROJECT_DIRECTORY
```

### Install Dependencies

```sh
pnpm install
```

## Development

All commands run from the repository root:

```sh
# Start the dev server (http://localhost:9222)
pnpm dev

# Build for production (topological order: packages first, then apps;
# app output goes to apps/example-app/dist)
pnpm build

# Build only the app / only the packages
pnpm build:app
pnpm build:packages

# Preview the production build
pnpm preview

# Type-check the app (no build of packages required)
pnpm typecheck

# Lint / auto-fix
pnpm lint
pnpm lint:fix

# Lint styles / auto-fix
pnpm lint:style
pnpm lint:style:fix

# Format check / write
pnpm format:check
pnpm format

# Lint + stylelint with --fix (legacy combo alias)
pnpm formatter
```

## How Workspace Linking Works

`packages/*` expose an `exports` `development` condition pointing at their source:

- **Development**: Vite dev resolves the `development` condition → reads `packages/shared/src` directly with hot reload. The TS type layer hits the same condition via `customConditions: ["development"]` in `tsconfig.base.json`, so `typecheck` works without building packages first. Apps need **no** alias or tsconfig `paths` for `@react-app/*`.
- **Production**: builds resolve `types` → `dist` declarations and `import` → `dist` artifacts. `pnpm -r run build` guarantees topological order (packages before apps).

Dependency versions are centralized in the `catalog` of `pnpm-workspace.yaml`; apps and packages reference them with `"react": "catalog:"`.

## Custom Configuration

Edit the app's [Vite configuration](./apps/example-app/vite.config.ts). It covers:

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

This method is essentially a wrapper around Method 1, so you can use it directly. It lives in [`apps/example-app/src/types/fixed-types.ts`](./apps/example-app/src/types/fixed-types.ts).

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
