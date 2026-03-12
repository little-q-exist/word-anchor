# Word Anchor

## 项目名称与简介

Word Anchor 是一个旨在帮助用户高效记忆单词的现代网页应用。通过科学的复习算法和流畅的交互体验，本项目致力于解决传统背单词过程中的遗忘难题，显著提升学习效率和体验。

项目亮点包括：
- **智能复习算法**：基于科学的记忆原理，使用主流记忆算法SM-2，自动安排学习与复习计划，最大化记忆留存率。
- **流畅的 SPA 体验**：使用 React 打造单页面应用，提供无缝、快速的用户交互体验。
- **类型安全保障**：全面引入 TypeScript 进行开发，在编译阶段排除潜在错误，提高代码健壮性和团队协作效率。

## 功能特性

- **用户认证系统**：支持用户登录 (Login) 与账号注册 (Register)，安全地保护个人学习数据与进度。
- **生词学习 (Learn)**：系统化地学习新单词，结合详细的词汇信息展示，加深记忆。
- **智能复习 (Review)**：针对已学单词进行科学维度的定期回顾与测试，巩固已掌握的词汇。
- **学习数据概览 (Profile)**：直观的个人学习进度统计展现，随时了解学习轨迹。（开发中）
- **丰富的词汇展示模块**：包含单词详情页 (WordInfo)、单词卡片 (WordCard) 以及友好的测试结果反馈界面。

## 技术栈详解

本项目采用主流的现代前端工程化方案开发：

- **React**: 核心视图层框架，负责构建高度组件化的前端 UI 交互。
- **TypeScript**: 提供静态类型检查，保障大型应用中的数据流向与复杂的类型安全。
- **Redux (联合 Redux Toolkit)**: 负责全局状态管理，集中控制用户的登录态、学习配额与状态等全局核心数据。
- **React Router**: 处理前端应用的视图路由分发，实现按需渲染与无刷新页面跳转。
- **Axios**: 封装与后端服务接口的 HTTP 通信逻辑，负责数据的安全拉取与上传。
- **Ant Design**: 企业级高质量 React UI 组件库，用于快速构建精美、风格统一的页面界面。
- **Vite**: 新一代前端构建与开发工具，提供极致的冷启动速度和秒级的模块热更新 (HMR体验)。

## 项目结构说明

以下是本项目源代码 `src/` 目录的核心简化结构:

```text
src/
├── components/    # 可复用的通用 UI 组件库
│   ├── common/    # 基础与通用组件 (如操作结果页 FailedResult.tsx / SuccessResult.tsx)
│   └── Words/     # 单词业务核心组件 (如学习组件 LearnWord.tsx, 单词卡片 WordCard.tsx)
├── features/      # Redux Toolkit 的 Slice 切片目录 (如 userSlice.ts管理用户状态)
├── hook/          # 自定义 React Hooks (如防抖逻辑 useDebounce.ts)
├── layout/        # 页面整体结构与通用布局组件 (如顶部导航、侧边栏 Layout.tsx)
├── pages/         # 路由级别的完整页面视图层
│   ├── Home.tsx     # 首页
│   ├── Learn.tsx    # 新词学习页
│   ├── Login.tsx    # 登录页
│   ├── Register.tsx # 注册页
│   ├── Review.tsx   # 重点复习页
│   └── Words/       # 词库列表与详情承载页
├── services/      # 后端 API 接口与 HTTP 封装层 (以业务分离：login.ts, users.ts, words.ts等)
├── constant.ts    # 全局常量配置文件
├── routes.ts      # React Router 系统路由配置文件
├── store.ts       # 全局 Redux store 的聚合与装配入口
├── types.ts       # 全局公用的 TypeScript Data Interface 定义
└── entry.client.tsx # 客户端 React 的渲染挂载入口
```

## 快速开始 (Getting Started)

### 前置条件
- 需要安装 **Node.js** (推荐不低于 v22 LTS) 以及对应包管理工具 **npm**。

### 安装步骤

1. 克隆项目仓库到本地：
```bash
git clone git@github.com:little-q-exist/word-anchor.git
cd recite-word
```

2. 安装项目运行所需的依赖包：
```bash
npm install
```

### 启动开发服务器

运行以下命令将在本地启动带有热更新模块的开发环境：
```bash
npm run dev
```

启动成功后，根据终端里暴露的网络地址（通常为 `http://localhost:5173`），在浏览器中打开即可进行预览与开发。
