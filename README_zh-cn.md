# 开发文档

这是一个极简的`React` + `webpack`项目模板，可开箱即用。

预装配置包括:

* `react @^18.2.0`
* `sass`
* `TypeScript @^5.0.0`

## 开发前必读

1. `node >= 14.15`, 且最好使用`LTS`版本
2. 如需改用`yarn`, 请删除`package-lock.json`。不建议使用`yarn`2以上的版本
3. 如需改用`pnpm`, 请删除`package-lock.json`, 并保证`node >= 16`

## 开发注意

### 自定义配置

**不建议**直接修改[基础Webpack配置](./webpack/webpack.base.js), 建议在最外层的[Webpack配置文件](./webpack.config.js)修改, 使用[Webpack Chain](https://github.com/neutrinojs/webpack-chain)语法。

示例：

```javascript
const { createConfig } = require('./webpack/webpack.base');
const YourPlugin = require('your-plugin');

const conf = createConfig({
    env: process.env.NODE_ENV,
    title: 'react-ts-webpack-starter',
    lang: 'zh-CN',
});

// 你的配置
conf.plugin('Your Plugin').use(YourPlugin, [{
    // Plugin配置
}]).end();

module.exports = conf.toConfig();
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
}

export default ParentComponent;
```

#### 方法二（推荐）：使用封装好的`ReactParentComponent`类型（或称`RFC`）

这种方法事实上是对方法一的封装，直接用就可以了。

示例：

```tsx
import type { ReactParentComponent } from '@/fixed-types';

interface TestComponentProps {}

const TestComponent: ReactParentComponent<TestComponentProps> = ({
    // correct now
    children,
}) => { ... };
```

建议多用下面的简写形式：

```tsx
import type { RFC } from '@/fixed-types';

interface TestComponentProps {}

const TestComponent: RFC<TestComponentProps> = ({
    // correct now
    children,
}) => { ... };
```
