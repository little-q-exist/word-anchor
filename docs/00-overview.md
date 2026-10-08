# recite-word 前端 · 项目总览（现状整理）

> 整理日期：2026-09-08
> 范围：`D:\Q\frontEnd\ReciteWord\recite-word`（前端 SPA）
> 配套文档：后端请见 `../recite-word-server/docs/`

## 1. 项目定位

WordAnchor（包名 `recite-word`）——基于 **SM-2 间隔重复算法**的英语词汇学习应用前端。当前代码库为一个 React SPA（SSR 关闭），提供：

- 用户注册 / 登录 / 登出（JWT access token + refresh cookie）
- 词汇库浏览与搜索（英文 / 中文释义 / 标签筛选，分页）
- 单词学习（learn）与到期复习（review）会话，学习进度实时持久化
- 单词详情卡片、收藏功能、个人学习统计

## 2. 技术栈（依据 package.json / 配置文件）

| 领域 | 选型 | 说明 |
|---|---|---|
| UI 框架 | React 19 + React Router 7 | SPA 模式（`react-router.config.ts` 中 `ssr: false`），扁平路由 `src/routes.ts` |
| 构建 | Vite 7 + `@react-router/dev` | 别名 `@` / `@modules` / `@shared`，dev 端口 5173（监听 IPv6 `::`） |
| 语言 | TypeScript 5.9 | `tsc` 类型检查，`react-router typegen` 生成路由类型 |
| UI 组件 | Ant Design 6 + @ant-design/icons 6 | `ConfigProvider` 全局主题（见 `root.tsx`） |
| 认证状态 | Redux Toolkit 2 + react-redux 9 | `features/userSlice.ts`，持久化到 localStorage |
| 服务端状态 | TanStack React Query 5 | 学习会话、单词、收藏、统计等所有服务端数据 |
| HTTP | Axios 1.x | 统一拦截器：注入 token、解包响应、401 自动刷新重试 |
| 单测 | Vitest 4 + Testing Library + jsdom | 现有 3 个测试文件（见 `docs/05-testing.md`） |
| E2E | Playwright（仅配置） | `src/test` 目录尚不存在，无用例落地 |

依赖中 `isbot`、`localforage`、`use-why-did-you-update` 已安装但当前 `src/` 内未使用。

## 3. 目录结构（现状）

```
recite-word/
├── public/                 # 静态资源（favicon 等）
├── src/
│   ├── entry.client.tsx    # 浏览器端入口：Redux Provider + HydratedRouter
│   ├── root.tsx            # 根文档布局 / 主题 / 导航加载条 / ErrorBoundary / RQ Provider
│   ├── routes.ts           # 扁平路由配置
│   ├── store.ts            # Redux store（仅 user）
│   ├── constant.ts         # SERVER_URL = VITE_SERVER_URL
│   ├── features/userSlice.ts
│   ├── layout/
│   │   ├── Layout.tsx      # Header + 横向 Menu + Content
│   │   └── ProtectedRoute/ # 鉴权守卫（mustLogin / mustNotLogin）
│   ├── modules/
│   │   ├── auth/           # 认证（表单/hooks/services）
│   │   ├── home/           # 首页 Hero/Feature
│   │   ├── vocabulary/     # 词汇浏览页组装（搜索条 + 表格 + useSearchWord）
│   │   ├── word-core/      # 跨域复用：WordCards、收藏/返回悬浮按钮、单词 API
│   │   └── word-learning/  # 学习/复习核心：LearnWord、队列引擎、查询 hooks
│   ├── pages/              # 路由页面（Home/Login/Register/Learn/Review/Profile/words）
│   └── shared/             # 通用组件、hooks、axios 配置、tokenStore、样式
├── docs/                   # 本文档目录（另有 testing/ 手工测试清单）
├── db.json                 # json-server mock 数据（旧 mock 方案遗留）
├── playwright.config.ts    # E2E 配置（testDir 指向不存在的 src/test）
├── vitest.config.ts
├── vite.config.ts
└── .env                    # VITE_SERVER_URL=http://localhost:3000/api
```

## 4. 常用命令

| 命令 | 作用 |
|---|---|
| `npm run dev` | React Router dev server（5173） |
| `npm run build` | 生产构建（`react-router build`） |
| `npm run typecheck` | `react-router typegen && tsc` |
| `npm run lint` | ESLint |
| `npm run test` / `test:watch` | Vitest 单测 |
| `npm run test:e2e` | Playwright（当前因无 `src/test` 会失败） |
| `npm run server` | json-server 旧 mock（4000 端口，已不被默认配置使用） |
| `npm run format` | Prettier 格式化 |

## 5. 环境与后端关系

- `.env` 中 `VITE_SERVER_URL=http://localhost:3000/api` 指向后端 `recite-word-server`。
- 后端 CORS 白名单含 `http://localhost:5173` 与生产域 `https://word-anchor.edgeone.dev`。
- 生产前端构建产物在 `build/`（`react-router` 产物；SSR 关闭但 `react-router build` 仍产出 server 目录，`start` 脚本用 `react-router-serve`，需注意与 SPA 模式的匹配性）。

## 6. 文档索引

| 文件 | 内容 |
|---|---|
| `00-overview.md` | 本文档：总览 / 技术栈 / 目录 / 命令 |
| `01-architecture.md` | 架构、状态管理、Axios 封装、路由、工程约定 |
| `02-auth.md` | 认证域（注册/登录/登出/刷新/受保护路由） |
| `03-vocabulary.md` | 词汇浏览域（搜索/表格/详情/收藏） |
| `04-learning.md` | 学习复习域（会话、队列引擎、熟练度、结果页） |
| `05-testing.md` | 测试现状（单测/E2E/手工用例） |
| `06-notes.md` | 现状备注：文档与代码不一致、死代码、风险点 |
