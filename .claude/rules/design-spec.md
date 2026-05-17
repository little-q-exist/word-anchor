---
paths: 
  - 'src/layout/**/*.{tsx,ts}'
  - 'src/modules/**/components/**/*.{tsx,ts}'
  - 'src/modules/**/pages/**/*.{tsx,ts}'
  - 'src/shared/components/**/*.{tsx,ts}'
---


# WordAnchor 设计规范

## 项目分析

WordAnchor 是一款基于 SM-2 间隔重复算法的英语词汇学习应用，面向以大学生为主的语言学习者。用户需要长时间专注学习，界面应减少视觉干扰，帮助用户聚焦于单词内容本身。核心场景包括：学习新词、复习已学词汇、浏览词汇库、追踪学习进度。

## 风格关键词

| 关键词 | 说明 |
|--------|------|
| **极简主义** | 去除装饰元素，以内容为核心，大量留白 |
| **学术感** | 沉稳、可信赖，传递"科学记忆"的品牌感知 |
| **专注** | 低视觉噪音，帮助用户进入心流状态 |
| **清晰** | 信息层级分明，操作意图明确 |
| **温暖** | 避免冰冷的工具感，用微妙的暖色调营造亲和力 |

---

## 1. 字体

### 字体族

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
  'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
  sans-serif;
```

使用系统默认字体栈，保证各平台最佳渲染效果，零额外加载成本。中文优先使用苹方（macOS）和微软雅黑（Windows）。

### 字体大小与行高

| 层级 | 字号 | 行高 | 字重 | 用途 |
|------|------|------|------|------|
| H1 | 32px | 1.2 | 700 | 页面主标题 |
| H2 | 24px | 1.3 | 600 | 区块标题 |
| H3 | 18px | 1.4 | 600 | 卡片标题 |
| 正文大 | 16px | 1.6 | 400 | 核心阅读内容、单词展示 |
| 正文 | 14px | 1.6 | 400 | 常规文本、表单、菜单 |
| 辅助文 | 12px | 1.5 | 400 | 说明文字、时间戳、标签 |

### 单词展示专用

学习卡片中的单词需特殊强调：

| 元素 | 字号 | 字重 | 说明 |
|------|------|------|------|
| 英文单词 | 36px | 700 | 卡片核心，加粗突出 |
| 音标 | 16px | 400 | 单词下方，次要信息 |
| 中文释义 | 18px | 500 | 中等强调 |

### Ant Design Token 映射

```ts
token: {
  fontSize: 14,
  fontSizeHeading1: 32,
  fontSizeHeading2: 24,
  fontSizeHeading3: 18,
  lineHeight: 1.6,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif",
}
```

---

## 2. 颜色

### 主色调

以 Ant Design 6 默认蓝色为基础，保持品牌一致性，同时通过中性色板营造温暖学术氛围。

```
Primary:          #1677ff   主色，按钮、链接、选中态
Primary Hover:    #4096ff   悬停态
Primary Active:   #0958d9   按下态
Primary Light:    #e6f4ff   浅色背景（标签、选中背景）
```

### 中性色

采用略带蓝调的灰色，避免纯灰色的冰冷感。

```
Base Background:  #f5f7fa   页面底色（Layout 背景）
Container:        #ffffff   容器/卡片背景
Border:           #e5e7eb   边框
Divider:          #f0f0f0   分割线
```

### 文字色

```
Text Primary:     #1a1a2e   主要文字（深蓝黑，非纯黑）
Text Secondary:   #6b7280   次要文字
Text Tertiary:    #9ca3af   辅助/占位文字
Text Disabled:    #bfbfbf   禁用态文字
```

### 语义色

对应学习场景中的三种评分结果：

```
Success (Known):      #22c55e   认识 — 单词已掌握
Warning (Unfamiliar): #f59e0b   不熟悉 — 需要复习
Error (Unknown):      #ef4444   不认识 — 进入重学队列
```

### 功能色

```
Link:              #1677ff   链接（同 Primary）
Favourite:         #f5dc4d   收藏星标
```

### Ant Design Token 映射

```ts
token: {
  colorPrimary: '#1677ff',
  colorSuccess: '#22c55e',
  colorWarning: '#f59e0b',
  colorError: '#ef4444',
  colorInfo: '#1677ff',
  colorLink: '#1677ff',
  colorTextBase: '#1a1a2e',
  colorText: '#1a1a2e',
  colorTextSecondary: '#6b7280',
  colorTextTertiary: '#9ca3af',
  colorBgBase: '#ffffff',
  colorBgLayout: '#f5f7fa',
  colorBgContainer: '#ffffff',
  colorBorder: '#e5e7eb',
  colorSplit: '#f0f0f0',
}
```

---

## 3. 布局

保持现有 Layout（Header + Content）结构不变。

### 间距体系

以 4px 为基准单位：

| Token | 值 | 用途 |
|-------|-----|------|
| xs | 4px | 紧凑间距（图标与文字） |
| sm | 8px | 组内元素间距 |
| md | 12px | 相关元素间距 |
| lg | 16px | 区块内边距 |
| xl | 20px | 卡片内边距 |
| xxl | 24px | 内容区内边距 |
| 3xl | 32px | 区块间距 |
| 4xl | 40px | 大区块间距 |
| 5xl | 48px | 页面级间距 |

### 布局参数

| 参数 | 值 | 说明 |
|------|-----|------|
| Header 高度 | 56px | 顶部导航栏 |
| Content 水平内边距 | 24px | 内容区左右留白 |
| 内容最大宽度 | 960px | 学习/复习页面居中最大宽度 |
| 卡片圆角 | 12px | 所有 Card 组件 |
| 按钮圆角 | 8px | Button 组件 |
| 输入框圆角 | 8px | Input 组件 |
| 标签圆角 | 6px | Tag 组件 |

### 学习页面布局

```
┌─────────────────────────────────────────────┐
│                  Header (56px)              │
├─────────────────────────────────────────────┤
│                                             │
│          ┌─────────────────────┐            │
│          │   Progress Timeline │            │
│          └─────────────────────┘            │
│                                             │
│          ┌─────────────────────┐            │
│          │                     │            │
│          │    Word Card        │            │
│          │    (max 600px)      │            │
│          │                     │            │
│          └─────────────────────┘            │
│                                             │
│          ┌─────────────────────┐            │
│          │   Rating Buttons    │            │
│          └─────────────────────┘            │
│                                             │
└─────────────────────────────────────────────┘
```

- 进度条与卡片间距：32px
- 卡片与按钮间距：32px
- 整体垂直居中

### Ant Design Token 映射

```ts
token: {
  padding: 16,
  paddingXS: 4,
  paddingSM: 8,
  paddingMD: 12,
  paddingLG: 16,
  paddingXL: 20,
  paddingXXL: 24,
  borderRadius: 12,
  borderRadiusLG: 12,
  borderRadiusSM: 8,
  borderRadiusXS: 6,
  controlHeight: 36,
  controlHeightLG: 48,
  controlHeightSM: 28,
  lineWidth: 1,
}
```

---

## 4. 动画

### 原则

动画应**快速、微妙、有目的性**。不打断用户心流，仅用于引导注意力和提供反馈。

### 时长

| 类型 | 时长 | 缓动 | 用途 |
|------|------|------|------|
| 微交互 | 150ms | `cubic-bezier(0.4, 0, 0.2, 1)` | 按钮 hover、图标变色 |
| 标准过渡 | 200ms | `cubic-bezier(0.4, 0, 0.2, 1)` | 组件显示/隐藏、卡片 hover |
| 页面切换 | 250ms | `cubic-bezier(0.4, 0, 0.2, 1)` | 路由切换淡入 |
| 弹窗 | 200ms | `cubic-bezier(0.08, 0.52, 0.52, 1)` | Modal、Drawer 进出 |

缓动函数统一使用 Ant Design 的 `motionEaseInOut`（标准）和 `motionEaseOut`（弹窗）。

### 具体动画

**按钮 hover**：`transform: translateY(-1px)` + `box-shadow` 增强，150ms

**卡片 hover**：`transform: translateY(-2px)` + `box-shadow` 增强，200ms

**进度条填充**：宽度变化使用 400ms `cubic-bezier(0.4, 0, 0.2, 1)`，营造流畅的进度感

**单词卡片翻转**（可选进阶效果）：300ms `cubic-bezier(0.4, 0, 0.2, 1)` 实现释义显示/隐藏

**评分反馈**：
- 点击"认识"：卡片短暂绿色发光 → 向上滑出，200ms
- 点击"不熟悉"：卡片轻微抖动 → 移入重学队列，200ms
- 点击"不认识"：卡片红色闪烁 → 移入重学队列，200ms

**加载状态**：使用 Ant Design `Spin` 组件默认动画，配合 `Skeleton` 占位

**列表/表格行 hover**：背景色过渡 150ms，轻微抬高

### Ant Design Token 映射

```ts
token: {
  motionDurationFast: '150ms',
  motionDurationMid: '200ms',
  motionDurationSlow: '250ms',
  motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  motionEaseOut: 'cubic-bezier(0.08, 0.52, 0.52, 1)',
}
```

---

## 5. 阴影

| 层级 | 阴影值 | 用途 |
|------|--------|------|
| 悬浮 | `0 2px 8px rgba(0,0,0,0.06)` | 卡片默认 |
| 抬起 | `0 4px 16px rgba(0,0,0,0.08)` | 卡片 hover |
| 弹出 | `0 8px 24px rgba(0,0,0,0.10)` | Dropdown、Modal |
| 主按钮 | `0 4px 12px rgba(22,119,255,0.20)` | 主要按钮阴影 |

---

## 6. 图标

统一使用 `@ant-design/icons` 的 `Outlined` 风格（线性图标），保持轻盈感。特殊强调场景可使用 `Filled` 风格。

图标尺寸：16px（行内）、20px（按钮内）、24px（独立展示）。

---

## 7. 空白页与状态

| 状态 | 处理方式 |
|------|----------|
| 数据为空 | `Empty` 组件 + 引导文案，图标使用定制插画风格 |
| 加载中 | `Skeleton` 占位（首选），避免全屏 `Spin` |
| 错误 | `Result` 组件 + 重试按钮 |
| 成功 | `Result` 组件 + 自动跳转或手动确认 |

---

## 8. 全局 ConfigProvider

建议在 `src/root.tsx` 添加一层全局 `ConfigProvider`，将以上所有 token 统一注入，替代当前零散的内联样式覆盖。

```tsx
<ConfigProvider
  theme={{
    token: {
      // 字体
      fontSize: 14,
      fontSizeHeading1: 32,
      fontSizeHeading2: 24,
      fontSizeHeading3: 18,
      lineHeight: 1.6,
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      // 颜色
      colorPrimary: '#1677ff',
      colorSuccess: '#22c55e',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      colorInfo: '#1677ff',
      colorLink: '#1677ff',
      colorTextBase: '#1a1a2e',
      colorBgLayout: '#f5f7fa',
      colorBgContainer: '#ffffff',
      colorBorder: '#e5e7eb',
      colorSplit: '#f0f0f0',
      // 圆角
      borderRadius: 12,
      borderRadiusSM: 8,
      borderRadiusXS: 6,
      // 间距
      padding: 16,
      paddingXS: 4,
      paddingSM: 8,
      paddingMD: 12,
      paddingLG: 16,
      paddingXL: 20,
      paddingXXL: 24,
      // 控件高度
      controlHeight: 36,
      controlHeightLG: 48,
      controlHeightSM: 28,
      // 动画
      motionDurationFast: '150ms',
      motionDurationMid: '200ms',
      motionDurationSlow: '250ms',
      motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      motionEaseOut: 'cubic-bezier(0.08, 0.52, 0.52, 1)',
      // 边框
      lineWidth: 1,
    },
    components: {
      Button: {
        controlHeightLG: 48,
        fontSizeLG: 16,
        borderRadius: 8,
      },
      Card: {
        borderRadiusLG: 12,
        paddingLG: 20,
      },
      Input: {
        borderRadius: 8,
        controlHeight: 36,
      },
      Modal: {
        borderRadiusLG: 16,
      },
      Tag: {
        borderRadiusSM: 6,
      },
    },
  }}
>
  <App />
</ConfigProvider>
```
