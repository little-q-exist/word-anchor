# recite-word 前端 · 测试现状

## 1. 单元测试（Vitest）

配置 `vitest.config.ts`：jsdom 环境、globals、setup `src/test-setup.ts`、排除 `src/test/**`（E2E 目录），别名与 vite 一致。命令：`npm run test`（vitest run）、`npm run test:watch`。

现有测试文件：

| 文件 | 被测对象 | 要点 |
|---|---|---|
| `src/modules/word-learning/hooks/useLearnQueue.test.ts` | useLearnQueue 队列引擎 | mock `@tanstack/react-query` 的 `useMutation`（捕获 onSuccess/onError）与 learningSession service；覆盖 index 推进、repeatQueue 追加/弹出、重学阶段、快照同步等行为 |
| `src/modules/word-learning/components/LearnWord/LearnSteps.test.tsx` | LearnSteps 步骤抽屉 | 步骤状态（process/finish/error/wait）、可跳转性 |
| `src/modules/word-learning/components/LearnWord/LearnProgress.test.tsx` | LearnProgress 进度条 | 百分比计算与渲染 |

## 2. 组件/设计规格文档（与代码同目录的 .md）

- `LearnWord/LearnProgress.md`、`LearnWord/LearnSteps.md`、`hooks/useLearnQueue.md`、`hooks/useLearnQueue.test.md`——描述组件/引擎设计与测试思路，属开发过程中的“先写文档后写测试”产物，可作为行为规格参考。

## 3. E2E（Playwright）——配置存在但用例未落地

- `playwright.config.ts`：`testDir: './src/test'`、baseURL `http://localhost:5173`、webServer 自动 `npm run dev`、超时 60s。
- **现状**：`src/test` 目录不存在，仓库中也没有任何 `*.spec.ts` / `*.e2e.ts`；因此 `npm run test:e2e` 目前无法通过（找不到测试目录）。
- 命令 `test:e2e` / `test:e2e:headed` 已写在 package.json，属“待补”状态。

## 4. 手工测试文档

- `docs/testing/auth-test-cases.md`：注册/登录手工用例清单（正常流程、表单校验、SQL 注入/XSS、会话与访问控制、异常处理），含一张“已执行结果”表（部分 REG/LOG/SEC 用例已回填）。
- 目录命名 `docs/testing/` 表明测试文档按领域组织，目前仅有认证域用例，学习/词汇域的手工用例尚未补充。

## 5. 其它质量基建

- ESLint 9 flat config（`eslint.config.js`）：typescript-eslint、react-hooks、react-refresh、`@tanstack/eslint-plugin-query`、prettier 兼容。
- `npm run typecheck`：先生成 `.react-router` 类型再 `tsc --noEmit`（tsconfig.app.json）。
- Prettier（`.prettierrc.json`），`npm run format` 只格式化 `src/**/*.{ts,tsx}`。
- 依赖 `use-why-did-you-update` 已装但未在代码中使用（可能是排查重渲染时的调试依赖）。
