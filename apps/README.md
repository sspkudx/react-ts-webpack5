# Apps 目录

`apps/` 存放可独立部署的应用。当前只有一个应用：

- [`example-app/`](./example-app/)（`example-app`）：Vite + React 19 + TS 示例应用，dev 端口 `9222`，依赖 `@react-app/shared`（`workspace:*`）。

## 新增应用

1. 在 `apps/` 下新建目录，自带 `package.json` / `vite.config.ts` / `tsconfig.json`（`extends: "../../tsconfig.base.json"`）。
2. 公共依赖版本走根 `pnpm-workspace.yaml` 的 catalog（`"react": "catalog:"`），workspace 包用 `"workspace:*"`。
3. 无需为 `@react-app/*` 配置 alias 或 tsconfig paths：`development` 条件机制自动完成源码联调。
