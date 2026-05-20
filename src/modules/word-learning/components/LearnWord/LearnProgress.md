# LearnProgress 组件
## 底层组件
- AntD 库的 Progress 组件
- LearnSteps
- Button 组件

## 功能
### 用户故事
- 为用户展示学习进度与本次学习的单词
- 作为用户，希望可以回顾刚刚学过的单词的详细信息，加深记忆。同时，不希望看到还未学习单词的信息，避免影响学习过程的回忆效果。

### 功能细节
- Progress 正常展示当前学习进度：将当前学习队列 index 与单词列表总长度的比值转换为百分比，作为进度条展示，但不展示百分比数字。
- Progress 左侧按钮可点击，点击后 LearnSteps 的 Drawer 从屏幕左侧出现。
- 按钮应为中尺寸，展示图标，不允许展示文字。

## 实现约束
### 参数
```ts
interface LearnProgressProps {
    briefWords: BriefWordWithLearnStatus[];
    index: number;
    onChange: (index) => void;
}
```
