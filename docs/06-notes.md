# recite-word 前端 · 现状备注 / 不一致 / 风险点

以下为对照代码与 README/CLAUDE.md 逐项核对后的记录，供后续排期处理。

## 1. 文档与代码不一致

| # | 位置 | 文档说法 | 代码实际 | 建议 |
|---|---|---|---|---|
| 1 | CLAUDE.md / README.md | 用户状态持久化键 `reciteWordAppUser` | `tokenStore.ts` 实际键名 `reciteWordUser` | 二选一对齐（若改动键名需处理存量 localStorage 迁移） |
| 2 | CLAUDE.md / README.md | “Playwright E2E 测试在 `src/test/`” | `src/test` 不存在，无用例 | 补 E2E 用例或从文档移除该描述 |
| 3 | README.md 功能列表 | “支持按标签搜索…”“收藏重点单词集中复习” | 收藏目前只是详情页星标切换，无“收藏列表页”前端入口（后端有 `GET /words/favorite`） | 确认产品范围 |

## 2. 疑似死代码 / 未接线

| 代码 | 状态 |
|---|---|
| `src/modules/word-learning/services/words.ts`（getWordToLearn / getWordToReview → `GET /words/learn`、`/words/review`） | 无任何调用方；学习队列已改由 `POST /users/:id/learning-sessions/:mode` 创建（后端内部取词） |
| `word-learning/services/learningSession.deleteLearningSession`（`DELETE .../learning-sessions/:mode`） | service 有定义，无调用方 |
| `auth/services/users.getUsernameExistence`（`GET /users/:username/existence`） | service 有定义，页面未调用（注册页实时查重未启用） |
| 依赖 `isbot`、`localforage`、`use-why-did-you-update` | package.json 已安装，`src` 未引用 |
| `db.json` + `npm run server`（json-server，端口 4000） | 早期 mock 方案遗留；当前 `.env` 指向真实后端 `http://localhost:3000/api` |
| Layout Menu 中 “Settings” | 仅 `<a>`，无路由/页面 |
| 后端 `GET /words/learn`、`/words/review`、`/words/favorite`、`GET /users/:id/learning-data` 等 | 前端当前均未调用（后端侧能力超前于前端） |

## 3. 功能/交互风险点

| 主题 | 说明 |
|---|---|
| 学习会话 409 冲突 | PATCH 快照使用后端 version 乐观锁；前端 `useLearnQueue` 的 mutation `onError` 只 console.log，未消费 409 返回的最新 session 做 rebase。多标签页/多设备同时学习时可能静默不同步 |
| 401 自动刷新死锁防护 | `config.ts` 中靠 `originalRequest.url?.includes('/api/refresh')` 提前退出，而 `refreshToken()` 实际是 `baseURL + '/refresh'`；该匹配依赖 axios 对 error.config.url 的处理（历史提交 736eee4 修复过死锁）。建议补充回归验证，确认失效的 refresh cookie 场景不会无限重试 |
| token 存储结构 | localStorage 存整个 user JSON（含 accessToken）；`remember` 勾选决定 refresh cookie 30 天与否，但 accessToken 本身仍在 localStorage（非 httpOnly），XSS 下会被读取——需评估是否改为内存持有 |
| 登出 | `LogoutButton` 乐观清空本地态，若 `POST /logout` 失败（retry 3 后仍失败）后端 cookie 未清，下一次自动刷新可能又登录回来 |
| antd token 扩展 | `paddingXXL` 通过 `d.ts` 模块扩充注入，属于类型 hack；antd 升级时可能失效 |
| 生产部署 | `react-router.config.ts` 关闭 SSR 但 build/start 使用 `react-router build/serve`；需确认产物与静态托管（word-anchor.edgeone.dev）部署方式一致 |

## 4. 未覆盖领域（相对产品目标）

- 无词汇管理（新增/编辑/删除单词）前端入口；
- 无“收藏单词列表/集中复习”页面；
- 学习/词汇浏览域缺手工测试用例（docs/testing 下目前只有 auth 域）；
- 缺 E2E 用例（见 05-testing.md）。
