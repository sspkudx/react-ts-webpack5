# 开发文档

这是一个极简的 `React` + `Vite` + `TypeScript` monorepo 脚手架（pnpm workspace），可开箱即用。

预装配置包括：

- `react @^19.3.0`
- `sass`
- `TypeScript @^6.0.3`
- `vite @^8.3.0`
- `eslint`（flat config）+ `prettier` + `stylelint`

## 项目结构

```
├── apps/
│   └── example-app/        # 示例应用（Vite + React 19 + TS，dev 端口 9222）
├── packages/
│   └── shared/             # @react-app/shared 共享工具库
├── tsconfig.base.json      # 公共 TS 配置（customConditions: ["development"]）
├── pnpm-workspace.yaml     # workspace 声明 + catalog 统一版本 + 供应链策略
└── package.json            # 根编排者（private；脚本经 pnpm -F / -r 委托）
```

各目录的约定详见 [apps/README.md](../apps/README.md) 与 [packages/README.md](../packages/README.md)。

## 开发前必读

1. `node >= 22`，推荐使用 `fnm` 配合 `.nvmrc` 管理版本。
2. **必须使用 `pnpm >= 11`**。本 monorepo 依赖 `workspace:*` 协议、catalog 与 `allowBuilds`，`npm` 不支持这些特性，也不要使用 `yarn`。

## 安装项目

### 复制项目模板

```sh
pnpm dlx degit https://github.com/Allen-Bayern/react-scafflod.git YOUR_PROJECT_DIRECTORY
```

### 安装依赖

```sh
pnpm install
```

## 开发注意事项

### 常用命令

以下命令均在仓库根目录执行：

```sh
# 启动开发服务器 (http://localhost:9222)
pnpm dev

# 生产构建（拓扑序：先 packages 后 apps，应用产物在 apps/example-app/dist）
pnpm build

# 只构建应用 / 只构建依赖包
pnpm build:app
pnpm build:packages

# 预览生产构建产物
pnpm preview

# 类型检查（无需先构建 packages）
pnpm typecheck

# lint / 自动修复
pnpm lint
pnpm lint:fix

# 样式 lint / 自动修复
pnpm lint:style
pnpm lint:style:fix

# 格式化检查 / 写入
pnpm format:check
pnpm format

# eslint + stylelint 自动修复（旧的组合别名）
pnpm formatter
```

### Workspace 联调机制

`packages/*` 的 `exports` 带有 `development` 条件，指向包的源码：

- **开发**：Vite dev 命中 `development` 条件 → 直读 `packages/shared/src` 源码，热更新；TS 类型层经 `tsconfig.base.json` 的 `customConditions: ["development"]` 走同一条件，`typecheck` 无需先构建 dist。应用**无需**为 `@react-app/*` 配置 alias 或 tsconfig `paths`。
- **生产**：构建解析 `types` → dist 声明、`import` → dist 产物；`pnpm -r run build` 的拓扑排序保证包先于应用构建。

依赖版本集中在 `pnpm-workspace.yaml` 的 `catalog` 里管理，应用与包通过 `"react": "catalog:"` 引用。

### 自定义配置

直接修改应用的 [Vite 配置文件](../apps/example-app/vite.config.ts) 即可，已内置：

- `@` 别名指向 `./src`
- CSS Modules（`.module.scss`），`camelCase` 导出
- 从 `./src/assets/scss/_globals.scss` 自动注入全局 scss 变量
- `isDev` / `isProd` 全局变量
- 开发服务器端口 `9222`
- 生产构建分包（`chunk-vendors`）与移除 console/debugger

### `React.FC` 修正

`React 18+` 的 `React.FC` 类型重写，导致无法解构 `children`。因此有两种方法可以解决这一问题。

#### 方法一：需要 `children` 时手动引入 `PropsWithChildren` 类型

这是因为官方更希望开发者以 `function` 关键字来定义组件。许多国外开发者是这样做的，但国内开发者主流习惯依然是 `React.FC`。但在 `React 18` 中，即使你是用 `React.FC` 表示组件，你仍然需要手动引入 `PropsWithChildren` 类型。

官方希望你这样定义带有 `children` 的组件。

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

#### 方法二（推荐）：使用封装好的 `ReactParentComponent` 类型（或称 `RFC`）

这种方法事实上是对方法一的封装，直接用就可以了。定义在 [`apps/example-app/src/types/fixed-types.ts`](../apps/example-app/src/types/fixed-types.ts)。

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
