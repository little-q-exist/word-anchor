# recite-word 前端 · 词汇浏览域（现状）

涉及：`src/modules/vocabulary/`（页面组装）、`src/modules/word-core/`（单词展示与收藏等复用能力）、`src/pages/vocabulary/`

## 1. 列表页 `/words`（pages/vocabulary/Words.tsx）

页面由 `SearchWord`（搜索区）+ `WordTable`（表格）组合，状态集中在 hook `useSearchWord`：

- 状态：`page`、`selectedTags`、`search { type: 'Eng' | 'Zh'; value? }`。
- 交互：
  - 类型下拉 Eng / Zh 决定按 `english` 还是 `meaning` 查询；切换类型会清空关键词。
  - `Input.Search` 回车触发 `onSearch`；输入过程中 500ms 防抖自动搜索（`useDebounce`，shared/hooks）。
  - 标签多选 `Select`（选项来自 `GET /words/tags`），切换同样 500ms 防抖。
  - 任何搜索条件变化都重置回第 1 页。
- 列表请求：`word-core/services/words.getBy()` → `GET /words?page&tags&english|meaning`（后端默认 limit=9、分页）。`WordTable` 每页 9 条，行可点击跳转 `/words/:id`。
- 后端返回 `{ words, count, pageSize }`，经 axios 解包后使用。

## 2. 详情页 `/words/:id`（pages/vocabulary/WordInfo.tsx）

- `useQuery({ queryKey: ['wordInfo', id], queryFn: wordService.getById(id) })` → `GET /words/:id`。
- 成功：渲染 `WordCards word={word} visible` + `WordSideButtonGroup`（收藏 + 返回列表）。
- 失败/加载：antd `Result`（带 Try Again）/ `Skeleton`。

## 3. word-core 复用组件（src/modules/word-core/）

供词汇浏览与学习页共同使用：

- **WordCards / WordCard / WordCardTab**：
  - 左卡片：单词（大字号 36 / 700）+ 音标；
  - 右卡片：Tab 切换 Definitions（词性+释义列表）与 Example（例句列表），`visible=false` 时用 Skeleton 隐藏释义（学习流程“先回忆后揭晓”）。
- **WordSideButtonGroup**（antd FloatButton.Group）：
  - `FavouriteSideButton`（收藏星标，颜色 `#f5dc4d`）；
  - 可选返回按钮（`showReturn` 时 `navigate(to, { relative:'path', replace:true })`）。
- **FavouriteSideButton 逻辑**：
  - 查询收藏态：`GET /users/:id/words/:wordId?fields=favorited`（通过 word-learning/services/users.getLearningData，queryKey `['learningData', userId, wordId]`）；
  - 切换：`PATCH /users/:id/words/:wordId/favorite`（word-core/services/users.updateFavorite），带 React Query 乐观更新（onMutate 回滚快照、onError 还原、onSettled invalidate）；
  - 未登录点击提示 “Please login!”。

## 4. 类型与 API 契约

- `word-core/types.ts`：`Word`（english/definitions[{meaning,partOfSpeech}]/phonetic/exampleSentence[]/related[]/tags[]/_id/createdBy）、`NewWord`、`UserLearningData`（userId/wordId/easeFactor/interval/repetition/dueDate/lastLearned/favorited）。
- 本域实际只用到读取类接口：`GET /words`、`GET /words/:id`、`GET /words/tags`、`GET /users/:userId/words/:wordId`、`PATCH .../favorite`；写单词（POST/PUT）目前没有前端入口。

## 5. 现状备注

- `vocabulary/services/words.ts` 只提供 `getTags`；列表查询走 `word-core/services/words.getBy`，职责上略交叉（搜索组件 `SearchWord` 属于 vocabulary 模块，但其标签数据查询直接内联在组件里，未走 hooks/queries 目录）。
- 单词行悬浮样式（`vocabulary-table-row`）在 root.tsx 内联 CSS 定义。
