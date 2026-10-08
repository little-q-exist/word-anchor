# recite-word 前端 · 认证域（现状）

模块：`src/modules/auth/` + `src/features/userSlice.ts` + `src/shared/services/tokenStore.ts` + `src/layout/ProtectedRoute/`

## 1. 类型（src/modules/auth/types.ts）

- `User`：`{ accessToken: string; username: string; _id: string }`（登录/刷新接口返回体）
- `NewUser`：注册请求体 `{ username, email?, password }`
- `UserStats`：`{ todayCount, totalCount }`（Profile 使用）
- 表单字段类型：`LoginFormFieldType`、`RegisterFormFieldType`
- `StatusType = 'idle' | 'loading' | 'success' | 'failed'`

## 2. 接口调用（services/）

| 文件 | 函数 | 请求 | 后端端点 |
|---|---|---|---|
| auth/services/auth.ts | login | POST | `/login` |
| | logout | POST | `/logout` |
| | register | POST | `/users/register` |
| auth/services/users.ts | getUsernameExistence | GET | `/users/:username/existence`（当前未看到调用方） |

> baseURL 为 `VITE_SERVER_URL`（`http://localhost:3000/api`），故实际为 `/api/...`。

## 3. 登录/注册 hook 的状态机

`useLogin.ts`、`useRegister.ts`：各自维护 `status` + `errorMessage` + `reset()`。

- 登录成功：`authService.login(values)` → `dispatch(login(userToken))` → `setAccessTokenUser(JSON.stringify(userToken))` 持久化 → `navigate('..')`。
- 失败：区分 AxiosError 与非 AxiosError，把后端 `error.response.data.error` 展示为用户提示。
- 注册成功：仅置 `status='success'`，页面用 `SuccessResult` 提示“请重新登录”。

## 4. 表单组件与校验

- `LoginForm`：用户名 + 密码 + Remember me；用户名只允许中文/字母/数字；密码只允许字母数字下划线；提交走 `login(values)`，`values.remember`（checkbox）会随请求体发给后端（后端据此决定 refresh cookie 是否 30 天持久）。
- `RegisterForm`：username / email / password / agreement 勾选；校验与登录类似。
- `LogoutButton`：`useMutation(authService.logout)`，成功后 `removeAccessTokenUser()` + `dispatch(logout())`（retry 3）。
- `LogoutTip`：用于已登录却访问登录/注册页时的提示（配合 ProtectedRoute 的 `extra`）。

## 5. 页面与守卫

- `pages/Login.tsx` / `pages/Register.tsx`：卡片居中；包裹 `ProtectedRoute config={{ requiredRole:'user', mustNotLogin:true }}`，已登录用户会被拦截；登录成功后禁用守卫（`disabled={status==='success'}`）避免跳转前闪现拦截页。
- `ProtectedRoute`：默认 `{ requiredRole:'user', mustLogin:true }`（Learn/Review/Profile 等页面使用）；支持 `mustNotLogin` 变体。

## 6. 双 Token 会话机制（前端侧视角）

- 登录接口返回 `accessToken`（有效期 1 天，存于内存 + localStorage user JSON）；`refreshToken` 放在后端设置的 httpOnly signed cookie（路径 `/api/refresh`，30 天，remember 时延长）。
- 刷新：请求 401 时由 axios 拦截器自动 `POST /refresh`，成功后更新 localStorage 中的 user 并重放原请求（单飞防并发）。
- 登出：`POST /logout` 由后端清 cookie（返回 204）；前端同时清 localStorage 与 Redux。

## 7. 现状备注

- 用户名存在性接口（`/users/:username/existence`）在 service 中有定义，但当前页面组件未调用（实时查重功能未启用）。
- token 持久化键为 `reciteWordUser`，README/CLAUDE.md 中写的 `reciteWordAppUser` 与代码不一致（详见 06-notes.md）。
