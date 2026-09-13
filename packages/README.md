# Packages 目录

`packages/` 存放可被 `apps/` 下所有应用复用的依赖包（workspace 包）。当前只有一个包：

- [`shared/`](./shared/)（`@react-app/shared`）：纯工具库（类型守卫 + 数字工具）。

## 包的标准结构

```
packages/{package-name}/
├── src/
│   └── index.ts          # 包入口，导出全部公共 API
├── package.json          # exports 必须带 development 条件（见下）
├── vite.config.ts        # Vite lib 模式：ESM 产物 → dist/index.js
├── tsconfig.json         # 继承 ../../tsconfig.base.json，types 显式声明 ["node"]
└── tsconfig.build.json   # tsc 只发 .d.ts → dist/index.d.ts
```

## 核心机制：exports `development` 条件联调

`package.json` 的 `exports` 必须保留 `development` 条件（置于 `types`/`import` 之前，自含 `types`+`default` 指向 src）：

```json
"exports": {
    ".": {
        "development": {
            "types": "./src/index.ts",
            "default": "./src/index.ts"
        },
        "types": "./dist/index.d.ts",
        "import": "./dist/index.js"
    }
}
```

- **开发（dev + 类型层）**：Vite dev 默认解析 `development` 条件 → 源码直读、热更新；TS 类型层由 `tsconfig.base.json` 的 `customConditions: ["development"]` 命中同一条件 → 类型同步且 `typecheck` 不依赖先构建 dist。应用**无需**为 `@react-app/*` 配置 alias 或 tsconfig paths。
- **生产**：构建解析 `types` → dist 声明、`import` → dist 产物；`pnpm -r run build` 的拓扑排序保证包先于应用构建。
