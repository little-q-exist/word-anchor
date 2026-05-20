# LearnSteps 组件
作为 LearnProgress 的子组件出现。

## 底层组件
- AntD 库的 Steps & Drawer 组件
- Empty

## 功能
### 功能细节
- LearnProgress 按钮点击后 Drawer 从屏幕左侧出现。
- Drawer 打开时无遮罩效果。
- 点击 Drawer 关闭按钮关闭。
- Drawer 中应当显示 Steps 组件。
- Steps 呈竖直方向显示，且显示单词简略信息：展示单词英文与学习状态(status)。
- 当单词学习状态(status)为 `passed` 时，Steps 的 item 可点击。也即是说，当 status 为 `idle` & `failed` 时，禁用点击。

## 实现约束
### 参数
```ts
interface LearnStepsProps {
    briefWords: BriefWordWithLearnStatus[];
    index: number;
    onChange: (index) => void;
    open: boolean;
}
```

### Failure case
- 当 briefWords 为空时，显示 Empty 组件。
- 当 briefWords 导致溢出屏幕，应当可以滚动，查看溢出的部分。
