# 开发文档

这是一个极简的`React` + `webpack`项目模板，可开箱即用。

预装配置包括:

-   `react @^18.3.0`
-   `sass`
-   `TypeScript @^5.0.0`

## 开发前必读

1. `node >= 16`, 且最好使用`LTS`版本。
2. 如需改用`npm`, 请删除`pnpm-lock.yaml`。
3. 如需改用`yarn`, 请删除`pnpm-lock.yaml`。不建议使用`yarn` 2 以上的版本。
4. 如需改用`pnpm`, 检查`node`版本, 确保`node >= 16`。

## 安装项目

### 复制项目模板

```sh
# npx
npx degit https://github.com/sspkudx/react-ts-webpack5.git YOUR_PROJECT_DIRECTORY

# yarn
yarn dlx degit https://github.com/sspkudx/react-ts-webpack5.git YOUR_PROJECT_DIRECTORY

# pnpm
pnpm dlx degit https://github.com/sspkudx/react-ts-webpack5.git YOUR_PROJECT_DIRECTORY
```

### 安装依赖

```sh
# npm
npm i

# yarn
yarn

# pnpm
pnpm i

# 如希望直接使用最新版本依赖, 直接运行下面的命令而非`pnpm i`
pnpm up
```

## 开发注意事项

### 自定义配置

**不建议**直接修改[基础Webpack配置](../webpack/index.ts), 建议在最外层的[Webpack配置文件](../webpack.config.ts)修改, 使用[Webpack Chain](https://github.com/neutrinojs/webpack-chain/tree/v6.5.1)语法。

示例：

```typescript
import { Configuration } from 'webpack';
import { createBasicConfig } from './webpack';

const webpackConfigCallback = (environments: Record<string, boolean>): Configuration => {
    // use env and process.env
    const { dev, prod } = env;
    const { NODE_ENV = 'development' } = process.env;

    return (
        createBasicConfig({
            title: 'react-ts-webpack-starter',
            lang: 'zh-CN',
            isDev: Boolean(dev) && NODE_ENV === 'development',
            isProd: Boolean(prod) && NODE_ENV === 'production',
        })
            // 例: 你的配置写在下方
            .plugin('YourPlugin')
            .use(YourPlugin, [
                {
                    // Plugin配置
                },
            ])
            .end()
            // 重要‼️: 以.toConfig结尾不要忘记
            .toConfig()
    );
};

export default webpackConfigCallback;
```

### `React.FC` 修正

`React 18`的`React.FC`类型重写，导致无法解构`children`。因此有两种方法可以解决这一问题。

#### 方法一：需要`children`时手动引入`PropsWithChildren`类型

这是因为官方更希望开发者以`function`关键字来定义组件。许多国外开发者是这样做的，但国内开发者主流习惯依然是`React.FC`。但在`React 18`中，即使你是用`React.FC`表示组件，你仍然需要手动引入`PropsWithChildren`类型。

官方希望你这样定义带有`children`的组件。

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

但我们一般习惯是这样:

```tsx
// 需要children时引入{ PropsWithChildren }
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

#### 方法二（推荐）：使用封装好的`ReactParentComponent`类型（或称`RFC`）

这种方法事实上是对方法一的封装，直接用就可以了。

示例：

```tsx
import type { ReactParentComponent } from '@/types/fixed-types';

interface TestComponentProps {}

const TestComponent: ReactParentComponent<TestComponentProps> = ({
    // correct now
    children,
}) => { ... };
```

更建议用下面的简写形式：

```tsx
import type { RFC } from '@/types/fixed-types';

interface TestComponentProps {}

const TestComponent: RFC<TestComponentProps> = ({
    // correct now
    children,
}) => { ... };
```
