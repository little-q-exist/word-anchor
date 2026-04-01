# Word Anchor

Word Anchor 是一个用于英语词汇学习与复习的前端应用，基于 React Router 7 + React 19 构建，提供「学习 / 复习 / 词库检索 / 用户认证」等核心能力。

近期版本已完成前端学习流的重大重构：

- 引入 `@tanstack/react-query`，统一服务端数据请求与缓存管理。
- 引入 `localforage`，将学习队列与进度缓存从单一 `localStorage` 升级为 IndexedDB 持久化方案。
- 代码结构重构为模块化分层（`src/modules/*`），按业务域组织认证、词库、学习流程。

---

## 核心功能

- 用户登录 / 注册
- 单词学习（Learn）
- 到期复习（Review）
- 词库检索与详情查看（Words / WordInfo）
- 学习数据统计（Profile）

---

## 技术栈

### 前端框架与工程化

- React 19
- React Router 7（SPA 模式，`ssr: false`）
- TypeScript
- Vite

### 状态与数据层

- Redux Toolkit（用户登录态等全局状态）
- TanStack React Query（接口请求与缓存）
- Axios（统一请求配置与拦截）

### 持久化与存储

- localStorage：登录用户信息（`reciteWordAppUser`）
- localforage（IndexedDB）：学习流程缓存（learn/review）

### UI 与测试

- Ant Design + @ant-design/icons
- Playwright（E2E）

---

## 前端持久化设计（新版）

学习与复习流程使用 `localforage` 持久化，核心实现在：

- `src/modules/word-learning/hooks/LearnWord/useWordCache.ts`

按 `userId + mode` 生成缓存键，支持按用户隔离与 learn/review 双模式隔离：

- `${userId}-learn-briefWords` / `${userId}-review-briefWords`
- `${userId}-learn-lastLearnedIndex` / `${userId}-review-lastLearnedIndex`
- `${userId}-learn-learnQueueSnapshot` / `${userId}-review-learnQueueSnapshot`

缓存内容包括：

- 词条列表及学习状态（`BriefWordWithLearnStatus[]`）
- 最近学习索引
- 学习队列快照（`index`、`isRepeating`、`repeatQueue`、`updatedAt`）

这使得页面刷新、路由切换后可恢复学习上下文，并降低短时网络波动对学习体验的影响。

---

## 目录结构（重构后）

```text
src/
├── modules/
│   ├── auth/                 # 登录/注册相关组件、hooks、services
│   ├── vocabulary/           # 词库搜索与列表
│   ├── word-core/            # 单词通用组件（卡片、侧边按钮等）
│   └── word-learning/        # 学习/复习主流程与缓存逻辑
├── pages/                    # 路由页面（Home/Learn/Review/Login/Register/Profile）
├── shared/                   # 通用 services/hooks/components
├── features/                 # Redux slices
├── routes.ts                 # React Router 路由定义
├── store.ts                  # Redux store
└── types.ts                  # 全局类型
```

---

## 快速开始

### 1) 环境要求

- Node.js（建议 20+）
- npm

### 2) 安装依赖

```bash
npm install
```

### 3) 本地开发

```bash
# 前端开发服务
npm run dev

# Mock 数据服务（可选）
npm run server
```

> 默认前端 API 地址定义在 `src/constant.ts`：
>
> `SERVER_URL = 'http://localhost:3000/api'`
>
> 如使用本地 mock 服务，请根据实际后端代理/端口配置调整。

---

## 可用脚本

- `npm run dev`：启动开发环境
- `npm run build`：构建生产包
- `npm run start`：启动生产构建产物
- `npm run lint`：执行 ESLint
- `npm run typecheck`：生成路由类型并执行 TypeScript 检查
- `npm run test:e2e`：执行 Playwright E2E
- `npm run test:e2e:headed`：有头模式执行 E2E
- `npm run server`：启动 json-server（`db.json`）
- `npm run format`：格式化 `src/**/*.ts(x)`

---

## 测试说明

当前端到端测试位于：

- `src/test/learn-cache.e2e.spec.ts`

覆盖学习缓存相关关键场景（含 localforage 缓存读写与学习流程连通性验证）。

---

## 说明

本仓库 README 已根据当前代码结构、持久化实现与依赖版本更新。
