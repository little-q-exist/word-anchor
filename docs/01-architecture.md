# recite-word 前端 · 架构与工程约定（现状）

## 1. 运行骨架

- **入口**：`src/entry.client.tsx` 在 `startTransition` 中 hydrate `document`，最外层为 React `StrictMode` + Redux `<Provider store={store}>`，内部为 `<HydratedRouter />`。
- **根布局**：`src/root.tsx` 的 `Layout` 输出 `<html>`，通过 antd `ConfigProvider theme={themeConfig}` 注入全局主题 token（字号、圆角、间距、主色 `#1677ff`、字体栈等）；`App` 组件内包裹 `QueryClientProvider`，并在导航 `loading` 时显示顶部进度条。
- **登录态初始化**：`App` 挂载时从 `tokenStore.getAccessTokenUser()` 读取 localStorage 中的用户 JSON 并 `dispatch(login(user))`。
- **错误边界**：`root.tsx` 的 `ErrorBoundary` 区分 React Router 错误响应 / 普通 Error / 未知错误，分别渲染 antd `Result`。

## 2. 路由（src/routes.ts）

所有路由嵌套在 `layout/Layout.tsx` 下：

| 路径 | 页面组件 | 鉴权 |
|---|---|---|
| `/` | pages/Home.tsx | 公开 |
| `/login`、`/register` | pages/Login、Register | 页面内用 `ProtectedRoute mustNotLogin` 拦截已登录用户 |
| `/words`、`/words/:id` | vocabulary/Words、WordInfo | 公开 |
| `/learn`、`/review` | pages/Learn、Review | `ProtectedRoute`（mustLogin 默认），进入后按 mode 加载学习/复习会话 |
| `/profile` | pages/Profile | `ProtectedRoute` |

- 布局 `Layout.tsx`：Header 含品牌名 WordAnchor + 横向 Menu。未登录只显示 Login / Words；登录后显示 Learn / Review / Words / 用户头像下拉（Profile、Settings 占位、Logout）。注意 Menu 中 "Settings" 只有 `<a>` 无实际路由。
- `ProtectedRoute`：读取 Redux user，`requiredRole: 'user'` + `mustLogin`（未登录提示并跳 `/login`）或 `mustNotLogin`（已登录提示可返回）。

## 3. 状态管理拆分

| 状态类型 | 归属 | 说明 |
|---|---|---|
| 认证态 | Redux Toolkit（`features/userSlice.ts`） | state = `User \| null`（`{ accessToken, username, _id }`），reducer 仅 `login` / `logout`；持久化键见 `tokenStore.ts`（`reciteWordUser`） |
| 服务端数据 | TanStack React Query | queryKey 约定：`['learningSession', userId, mode]`、`['word', wordId]`、`['wordInfo', id]`、`['words', {...}]`、`['tags']`、`['learningData', userId, wordId]` |
| 局部 UI 状态 | useState / 自定义 hook | 如 useSearchWord、useLearnQueue、useLogin/useRegister 的状态机 |

## 4. Axios 封装（src/shared/services/config.ts）

- `axios.defaults.baseURL = SERVER_URL`（`VITE_SERVER_URL`，`http://localhost:3000/api`），`withCredentials = true`。
- 各 service 文件模块加载时调用 `globalConfig()`（幂等，`configured` 标志防重复注册）。
- **请求拦截器**：从 localStorage 读用户 JSON，取 `accessToken`，注入 `Authorization: Bearer ...`。
- **响应拦截器（解包）**：若响应体形如 `{ code, data, message }`（后端统一信封），则替换 `response.data = response.data.data`，service 拿到的就是解包后的数据；错误响应也把 `message` 映射到 `error` 字段。
- **401 自动刷新**：非 `/refresh` 请求返回 401 且未重试过时，置 `_retry` 后调用 `refreshToken()`（`POST /refresh`，带 cookie，单飞 Promise 防并发），成功后用新 accessToken 重放原请求。历史上 736eee4 提交为 /refresh 401 死锁加了提前退出判断。

## 5. tokenStore（src/shared/services/tokenStore.ts）

- localStorage 键名：`reciteWordUser`（**注意：README/CLAUDE.md 中写的 `reciteWordAppUser` 与代码不一致，见 06-notes.md**）。
- API：`getAccessTokenUser()` / `setAccessTokenUser(userJson)` / `removeAccessTokenUser()`。存储的是整个 user JSON 而非纯 token。

## 6. 路径别名与模块约定

- vite/vitest/tsconfig 统一别名：`@/` → `src/`，`@modules/` → `src/modules/`，`@shared/` → `src/shared/`。
- 约定：当相对导入需要出现两级以上 `../` 时改用别名。
- 模块内结构：`components/`、`hooks/`（含 `hooks/queries/` 放 React Query hook）、`services/`（纯 Axios 函数，返回 Promise）、`types.ts`。
- `useSuccessQuery.ts`：用 ref 持有 `onSuccess`/`onError`，避免 query 回调闭包过期；是各查询 hook 的基础封装。

## 7. 主题与样式

- `root.tsx` `themeConfig`：基础字号 14、标题 32/24/18、主色 `#1677ff`、圆角 12/8/6、自定义 motion、背景 `#f5f7fa` 等；组件级覆盖 Button/Card/Input/Modal/Tag。
- `src/shared/styles/`：`centerStyle.ts`、`shadowStyle.ts`（卡片/悬浮/主按钮阴影 + 过渡常量）。
- `antd.token.d.ts` 通过模块扩充新增 `paddingXXL` token（注释自嘲为“适配 AI 写的屎”，属于对 antd 类型的扩展 hack）。
- `cardStyle.ts`（word-core/styles）定义单词卡片通用样式。
