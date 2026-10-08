# recite-word 前端 · 学习/复习域（现状）

模块：`src/modules/word-learning/`；页面：`pages/Learn.tsx`（mode=`learn`）、`pages/Review.tsx`（mode=`review`），两者共用同一套 `LearnWord` 组件。

## 1. 核心流程总览

```
进入 /learn 或 /review（ProtectedRoute）
  └─ useLearningSessionQuery(mode, userId)
       ├─ GET /users/:userId/learning-sessions/:mode      # 拉取已有会话
       │    ├─ 有会话 → 用 session.queueSnapshot / words 恢复
       │    └─ 无会话（null）→ POST /users/:userId/learning-sessions/:mode 创建（后端按模式取词）
       └─ LearnWord 渲染：LearnProgress(进度) + WordCards(单词卡片) + LearnWordButtons(熟练度) 
            ├─ 当前单词详情：useDetailedWordQuery(wordId) → GET /words/:id
            ├─ 队列推进：useLearnQueue（index/repeatQueue/isRepeating/isFinished）
            └─ 结束后 → LearnResult（结果表格 + 返回）
```

- 后端返回“没有单词可学/可复习”（words 为空）时创建接口返回 `null`，前端 `noWordReturned` 置位并展示 Empty（“You have learned all the words in this session.”）。
- 单词卡片先只显示单词与音标，用户自评后才 `shouldShowInfo` 展示释义/例句（先回忆后揭晓）。

## 2. 会话查询与创建（hooks/queries/useLearningSessionQuery.ts）

- `useSuccessQuery` 基座（ref 持有回调防闭包过期）。
- queryKey `['learningSession', userId, mode]`，`refetchOnWindowFocus: false`。
- 查询成功回调：若 `session == null` 且未创建过（`hasMutated` ref 防重），`POST .../learning-sessions/:mode` 创建并把结果 `setQueryData` 写回缓存。
- 注意：`noWordReturned` 直接读 `hasMutated.current`（非响应式），仅在“创建后仍无词”时让页面显示 Empty。

## 3. 学习队列引擎（hooks/useLearnQueue.ts，核心）

状态：

- `index`：当前在 words 数组中的位置（进度条按 `index / words.length` 计算百分比）；
- `repeatQueue`：答错（familiarity < 4）需要重学的单词**下标**队列；
- `isRepeating`：是否处于重学阶段；
- `isFinished`：全部（含重学）完成；
- `version`：与后端对齐的快照版本（乐观锁 token）；
- `briefWords`：`{ _id, english, status: 'idle'|'passed'|'failed' }[]`。

关键动作：

| 函数 | 行为 |
|---|---|
| `toNextWord()` | 正常阶段：index+1；到末尾且 repeatQueue 非空 → 进入重学阶段（跳到队首下标）；否则完成 |
| `addToRepeatQueue(wordId)` | 把该词下标追加到重学队列（去重由调用方保证，实现为 concat） |
| `handleRepeat(familiarity)` | 重学阶段：弹出队首；若仍 <4 再放回队尾（本轮继续重学），否则丢弃 |
| `markWordStatus(wordId, status)` | 更新 briefWords 状态（passed/failed/idle），驱动 Steps/进度 UI |

同步与乐观锁：

- `queueSnapshot = { index, isRepeating, repeatQueue, version }`；仅在 `hydrateQueue` 存在（即有后端会话）时才生成。
- 状态变化 useEffect 比较 `isSnapshotEqual(lastSyncedRef.current, queueSnapshot)`，不等则 `PATCH /users/:userId/learning-sessions/:mode`（body：queueSnapshot + 所有 words 的 `{_id,status}`）。
- 后端 PATCH 成功会把服务端新 `queueSnapshot` 回写本地（index/isRepeating/repeatQueue/version），实现“以服务端为准”。
- 页面加载时用会话的 `queueSnapshot` hydrate（`hydrateKey = mode-userId`），刷新后可从中断处继续。
- **现状缺口**：PATCH 冲突（后端 409 返回最新 session）在 `onError` 仅 `console.log('queue snapshot error')`，前端没有做 rebase 处理。

## 4. 熟练度按钮与打分（components/LearnWord/LearnWordButtons.tsx）

三个按钮（自评档位，映射后端 quality 0–5）：

| 按钮 | familiarity | 含义 | 动作 |
|---|---|---|---|
| Known（绿） | 5 | 掌握 | 正常阶段 → `PATCH .../familiarity`；重学阶段 → 本地处理 |
| Unfamiliar（橙） | 3 | 需复习 | 同上，且标记 failed + 加入重学队列 |
| Unknown | 0 | 不会 | 同上 |

- 打分 < 4 视为应重复（`shouldRepeat`），乐观置 `failed` 并入重学队列；≥4 置 `passed`。
- 正常阶段走 `PATCH /users/:userId/words/:wordId/familiarity`（触发后端 SM-2 计算并返回 `shouldRepeat`，以服务端结果为准覆盖状态）；重学阶段纯本地（`onHandleRepeat`，不再打接口）。
- `isOnJump`（用户在 Steps 抽屉跳到了别的词）时按钮区变成 Back（跳回当前 index）。
- 评分后进入“查看释义”态（`showInfo=true`），点 Next 才推进（`toNextWord`）。
- 错误处理：mutate 失败提示 message、把该词重新入队并置回 idle，防止丢失。

## 5. 进度与步骤（LearnProgress / LearnSteps）

- `LearnProgress`：左侧按钮打开抽屉，中间 antd `Progress`（index/words.length），右侧步骤信息。
- `LearnSteps`：Drawer 内垂直 Steps，每词一项：当前 = process、passed = finish、failed = error、其余 = wait；`disabled` 非当前且非 passed 的词不可点；`onChange` 允许跳转到已通过词查看（`jumpToIndex` → `isOnJump` 状态）。

## 6. 结果页（components/LearnResult/）

- `LearnResult`：标题 + `LearnResultTable` + “Finish and Go Back”。
- `LearnResultTable`：对 session 的每个词并发 `useQueries` 拉详情（queryKey `['word', wordId]`），展示英文/音标/释义；行内 Skeleton 表示加载中。

## 7. 本域 API 汇总

| 函数（services） | 请求 |
|---|---|
| learningSession.getLearningSession | `GET /users/:userId/learning-sessions/:mode` |
| learningSession.createLearningSession | `POST /users/:userId/learning-sessions/:mode` |
| learningSession.updateLearningSession | `PATCH /users/:userId/learning-sessions/:mode`（queueSnapshot + words 状态） |
| learningSession.deleteLearningSession | `DELETE /users/:userId/learning-sessions/:mode`（service 已定义，当前无调用方） |
| users.updateFamiliarity | `PATCH /users/:userId/words/:wordId/familiarity` |
| words.getWordToLearn / getWordToReview | `GET /words/learn`、`GET /words/review`（service 已定义，当前无调用方，见 06-notes.md） |

## 8. Profile 统计（顺带）

`pages/Profile.tsx`：登录用户 `GET /users/:userId/stats` → `{ todayCount, totalCount }`，antd Statistic 卡片展示今日/累计学习单词数。

## 9. 组件规格与单测

`LearnWord/` 下存在 Markdown 规格文档与对应单测：`LearnProgress.md`、`LearnSteps.md`、`useLearnQueue.md`、`useLearnQueue.test.md`（设计说明），以及 `LearnProgress.test.tsx`、`LearnSteps.test.tsx`、`useLearnQueue.test.ts`（详见 docs/05-testing.md）。
