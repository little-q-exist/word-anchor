# useLearnQueue

## 功能

管理学习/复习流程中的单词队列状态，包括当前位置、重学队列、阶段切换，并自动将队列快照同步至后端以支持跨刷新恢复。

### 暴露的方法与变量

| 名称 | 类型 | 简述 |
|------|------|------|
| `index` | `number` | 当前单词在 `briefWords` 中的索引位置 |
| `isRepeating` | `boolean` | 是否处于重复阶段（正在复习出错的单词） |
| `isFinished` | `boolean` | 学习流程是否已完成（所有单词已过完且无待复习项） |
| `repeatQueue` | `number[]` | 待重复学习的单词索引列表 |
| `queueSnapshot` | `QueueSnapshot \| undefined` | 当前队列状态的快照，用于持久化同步 |
| `toNextWord` | `() => void` | 前进到下一个单词；若已到末尾且有重学项则进入重复阶段 |
| `addToRepeatQueue` | `(wordId: string) => void` | 根据单词 `_id` 将其加入重学队列 |
| `handleRepeat` | `(familiarity: number) => void` | 处理重复阶段的熟悉度评分：从队列移出当前项，若评分 < 4 则重新入队 |

### 如何使用

在学习页面 `LearnWord` 中，钩子作为核心队列引擎驱动整个学习流程：

1. **初始化**：传入 `briefWords`（来自 `useLearningSession` 查询结果）和 `hydrateQueue`（可从后端恢复上次的队列状态），绑定用户 ID 与学习模式。
2. **驱动展示**：组件通过 `index` 从 `briefWords` 取当前单词，交给 `WordCards` 渲染。
3. **用户评分**：在"认识/不熟悉/不认识"按钮点击时：
   - 不熟悉/不认识（familiarity < 4）：调用 `addToRepeatQueue` 标记该单词需重学。
   - 随后调用 `toNextWord` 进入下一个词。
4. **重复阶段**：正常流程走完后，`isRepeating` 变为 `true`，队列开始逐个复习错词。每次评分调用 `handleRepeat(familiarity)`，熟悉度足够则移出队列，不够则重新入队。
5. **结束判断**：`isFinished` 变为 `true` 时，组件切换为 `<LearnResult />` 展示学习结果。

---

## 内部实现

### 状态管理

- **`index`**：当前单词在列表中的索引。`toNextWord` 中 +1 前移，`jumpToIndex` 直接设置。
- **`repeatQueue`**：出错单词的索引数组。`addToRepeatQueue` 通过 `_id` 查找索引后 concat 追加；`handleRepeat` 从头部移除当前项，若 familiarity < 4 则在尾部重新追加。
- **`isRepeating`**：正常阶段 (`false`) 和重复阶段 (`true`) 的切换标记。正常阶段走完时，如果 `repeatQueue` 不为空，自动置 `true`。
- **`isFinished`**：当正常阶段结束时 `repeatQueue` 为空，或重复阶段队列清空时，置为 `true`。
- **`version`**：乐观锁版本号，与服务端同步，防止并发覆盖。

### 队列同步

- `queueSnapshot` 由 `index`、`isRepeating`、`repeatQueue`、`version` 组成。
- 通过 `useEffect` 监听 `queueSnapshot` 变化，与 `lastSyncedRef` 比较避免重复同步，调用 `PATCH /users/:id/learning-sessions/:mode` 将快照持久化到后端。
- 同步成功后，后端返回最新快照（含服务端 `version`），主动同步回本地状态，完成双向同步。

### 队列恢复（Hydration）

- 若传入 `hydrateQueue`（含 `initialState` 和 `hydrateKey`），在 `useEffect` 中将本地状态恢复为服务端保存的快照，实现页面刷新后无缝继续学习。

---

## 约束

### 参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `briefWords` | `BriefWordWithLearnStatus[]` | 否 | 当前学习会话的单词列表，作为队列的索引依据 |
| `hydrateQueue` | `{ initialState: QueueSnapshot; hydrateKey: string }` | 否 | 队列恢复配置，`initialState` 为后端保存的快照，`hydrateKey` 用于去重防止重复恢复 |
| `userId` | `string` | 否 | 用户 ID，用于队列同步的 API 调用 |
| `mode` | `LearningMode` (`'learn' \| 'review'`) | 否 | 学习模式，用于队列同步的 API 路径 |

### 其他注意事项

- **`briefWords` 不可变引用**：`addToRepeatQueue` 和 `toNextWord` 内部通过闭包访问 `briefWords`，若单词列表可能变化，需确保使用 `useCallback` 依赖或通过 ref 保持最新引用。
- **`hydrateKey` 去重**：同一会话重复传入相同 `hydrateKey` 不会重复恢复状态，由 `appliedHydrateKey` 状态保证。切换会话时需更换 `hydrateKey`（当前实践为 `${mode}-${userId}`）。
- **`handleRepeat` 仅用于重复阶段**：正常阶段的熟悉度评分由外部通过 `addToRepeatQueue` + `toNextWord` 处理，`handleRepeat` 设计为在 `isRepeating === true` 时调用。
- **同步是异步的**：快照同步通过 React Query mutation 异步执行，不会阻塞 UI。短时间内多次状态变更会以最终快照为准同步。
