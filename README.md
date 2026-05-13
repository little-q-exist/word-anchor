# WordAnchor — 用科学的方法记住每一个单词

基于**间隔重复算法（SM-2）**的英语词汇学习应用。通过智能复习调度和上下文记忆法，帮助你高效、持久地掌握英语单词。

## 功能

- **智能学习与复习** — 基于 SuperMemo SM-2 算法，根据你对每个单词的掌握程度自动计算最佳复习时间
- **学习队列管理** — 答错的单词自动加入重学队列，确保每个单词都能真正掌握
- **进度追踪** — 可视化学习进度时间线，清晰展示当前、已完成和待学习的单词状态
- **词汇浏览** — 支持按英文、中文释义和标签搜索单词，快速查阅词汇库
- **收藏单词** — 收藏重点单词，方便集中复习
- **用户系统** — JWT 认证，支持注册、登录和个人统计数据查看
- **学习会话持久化** — 学习进度实时保存，刷新页面或重新打开后可从中断处继续

## 技术栈

前端基于 **React 19** + **React Router 7**（全栈 SSR）构建，使用 **TypeScript** 开发，**Vite** 作为构建工具。UI 组件库采用 **Ant Design 6**，服务端状态管理使用 **TanStack React Query**，认证状态使用 **Redux Toolkit** 管理，HTTP 请求基于 **Axios**。端到端测试使用 **Playwright**。

后端使用 **Express 5** + **TypeScript**，数据库为 **MongoDB**（通过 **Mongoose** 建模），认证采用 **JWT** + **bcrypt** 密码哈希，API 文档基于 **Swagger**。

间隔重复核心使用 **SuperMemo SM-2 算法**，根据用户对单词的熟悉度评分（0-5）动态计算 easeFactor、间隔天数和复习次数。

## 目录结构

```
recite-word/
├── public/                          # 静态资源
├── src/
│   ├── entry.client.tsx             # 浏览器端入口
│   ├── root.tsx                     # 根布局与 App 组件
│   ├── routes.ts                    # 路由配置（扁平路由）
│   ├── store.ts                     # Redux Store 配置
│   ├── constant.ts                  # 常量配置（API 地址等）
│   ├── features/
│   │   └── userSlice.ts             # 用户状态切片（登录/登出）
│   ├── layout/
│   │   ├── Layout.tsx               # 应用主布局（Header + Menu + Content）
│   │   └── ProtectedRoute/          # 路由鉴权守卫
│   ├── modules/
│   │   ├── auth/                    # 认证模块（登录/注册）
│   │   ├── home/                    # 首页模块
│   │   ├── vocabulary/              # 词汇浏览模块（搜索/详情）
│   │   ├── word-core/               # 单词核心组件（跨模块复用）
│   │   └── word-learning/           # 学习/复习模块（核心业务）
│   ├── pages/                       # 页面组件
│   │   ├── Home.tsx                 # 首页
│   │   ├── Login.tsx                # 登录页
│   │   ├── Register.tsx             # 注册页
│   │   ├── Learn.tsx                # 学习模式页
│   │   ├── Review.tsx               # 复习模式页
│   │   ├── Profile.tsx              # 个人中心页
│   │   └── vocabulary/              # 词汇相关页面
│   ├── shared/                      # 共享组件/Hooks/样式
│   └── test/                        # E2E 测试
├── db.json                          # json-server 种子数据
├── vite.config.ts
├── tsconfig.json
├── react-router.config.ts
├── playwright.config.ts
└── package.json
```

### 核心文件说明

| 文件 | 用途 |
|------|------|
| `src/modules/word-learning/hooks/useLearnQueue.ts` | 学习队列引擎：管理单词索引、重学队列、进度计算，通过乐观锁版本号与后端同步快照 |
| `src/modules/word-learning/components/LearnWord/LearnWord.tsx` | 学习流程编排：串联会话初始化 → 队列消费 → 单词卡片展示 → 结果页面 |
| `src/modules/word-learning/components/LearnWord/LearnWordButtons.tsx` | 熟悉度评分按钮（认识/不熟悉/不认识），触发后端 SM-2 算法更新学习数据 |
| `src/modules/word-learning/components/LearnWord/LearnProgress.tsx` | 学习进度时间线组件，用颜色编码标识单词状态 |
| `src/modules/word-learning/queries/useLearningSessionQuery.ts` | 学习会话查询 Hook，自动获取或懒创建学习会话 |
| `src/shared/services/config.ts` | Axios 拦截器配置：JWT 令牌注入、响应数据标准化解包 |
| `src/layout/ProtectedRoute/ProtectedRoute.tsx` | 路由鉴权守卫，未登录自动跳转登录页 |

后端项目位于 `recite-word-server/`，其核心文件：

| 文件 | 用途 |
|------|------|
| `src/modules/learn/services/SM-2.ts` | SuperMemo SM-2 算法实现：根据质量评分计算 easeFactor、间隔天数和重复次数 |
| `src/modules/learn/services/learn.ts` | 学习业务逻辑：待学习/待复习单词筛选、学习数据更新编排 |
| `src/modules/learn/controllers/learningSession.ts` | 学习会话 CRUD，支持乐观锁并发控制 |
| `src/shared/middleware.ts` | JWT 认证中间件、错误处理中间件、请求日志 |

## 贡献指南

### 环境要求

- **Node.js** >= 18
- **npm** >= 9
- **MongoDB** 实例（本地或 Atlas）

### 拉取代码

```bash
# 克隆前端仓库
git clone <frontend-repo-url>
cd recite-word

# 克隆后端仓库
git clone <backend-repo-url> recite-word-server
cd recite-word-server
```

### 安装依赖

```bash
# 前端依赖
cd recite-word
npm install

# 后端依赖
cd ../recite-word-server
npm install
```

### 配置环境变量

在 `recite-word-server` 目录下创建 `.env` 文件：

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

### 启动开发环境

```bash
# 启动后端（端口 3000）
cd recite-word-server
npm run dev

# 新终端，启动前端（端口 5173）
cd recite-word
npm run dev
```

### 运行测试

```bash
cd recite-word
npm run test:e2e          # Playwright E2E 测试（无头模式）
npm run test:e2e:headed   # 有头模式
```

### 代码规范

```bash
npm run lint              # ESLint 检查
npm run typecheck         # TypeScript 类型检查
npm run format            # Prettier 格式化
```

## 许可证

本项目遵循 [MIT License](https://opensource.org/licenses/MIT) 开源协议。