## 测试覆盖内容（27 个测试，全部通过）

- **初始状态**：默认值、无 hydrateQueue 时 queueSnapshot 为 undefined
- **Hydration**：首次 hydration、相同 key 不重复 hydration、新 key 触发重新 hydration
- **toNextWord**：前进、进入复习模式、完成、复习模式下行为、briefWords 为 undefined 时跳过
- **addToRepeatQueue**：添加单词、单词未找到时跳过、briefWords 为 undefined 时跳过
- **handleRepeat**：familiarity<4 时重新排队、familiarity>=4 时移除、边界值 0
- **queueSnapshot**：反映当前状态、无 hydrateQueue 时为 undefined
- **Sync 行为**：toNextWord/addToRepeatQueue/handleRepeat 触发同步、hydration 不触发同步、hydrateKey 变化不触发同步、缺少 userId/mode 时不同步、onSuccess 后不产生循环同步、queueSnapshot 不变时不触发同步