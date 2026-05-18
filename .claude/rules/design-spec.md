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

使用系统默认字体栈，保证各平台最佳渲染效果，零额外加载成本。中文优先使用苹方（macOS）和微软雅黑（Windows）。注意：中文系统字体栈无需替换为 Geist/Outfit 等拉丁字体——中文字体渲染效果远优于拉丁字体降级。

### 字体大小与行高

| 层级 | 字号 | 行高 | 字重 | 用途 |
|------|------|------|------|------|
| H1 | 32px | 1.15 | 700 | 页面主标题 |
| H2 | 24px | 1.25 | 600 | 区块标题 |
| H3 | 18px | 1.35 | 600 | 卡片标题 |
| 正文大 | 16px | 1.6 | 400 | 核心阅读内容、单词展示 |
| 正文 | 14px | 1.6 | 400 | 常规文本、表单、菜单 |
| 正文强调 | 14px | 1.6 | 500 | 正文中的关键信息 |
| 辅助文 | 12px | 1.5 | 400 | 说明文字、时间戳、标签 |

**字重分层原则**：标题使用 600/700 产生视觉重量，正文使用 400，关键信息使用 500（Medium）做微强调，比直接跳 700 更细腻。

**标题建议**：H1-H3 标题使用 `text-wrap: balance` 避免孤行；段落使用 `text-wrap: pretty`。

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
Primary:          #1677ff   主色，按钮、链接、选中态（饱和度 ~80%，符合约束）
Primary Hover:    #4096ff   悬停态
Primary Active:   #0958d9   按下态
Primary Light:    #e6f4ff   浅色背景（标签、选中背景）
```

**约束**：主题色饱和度不超过 80%。本项目仅使用单一主题色（蓝色），语义色仅用于学习反馈场景，不可作为装饰色滥用。禁止使用 AI 风格的紫蓝渐变或霓虹发光。

### 中性色

采用略带蓝调的灰色，避免纯灰色的冰冷感。页面底色可选用暖调 off-white（`#fbfbfa`），比纯白更柔和，营造纸质书页的亲和触感。

```
Base Background:  #f5f7fa   页面底色（Layout 背景）
Base Warm:        #fbfbfa   暖调 off-white（可选：登录页、学习卡片背景）
Container:        #ffffff   容器/卡片背景
Border:           #e5e7eb   边框（略带蓝调，与底色呼应）
Divider:          #f0f0f0   分割线
```

**约束**：禁止使用纯黑 `#000000`。最深色使用 `#1a1a2e`（主文字色）。中性灰色系需保持一致的冷暖倾向——本项目统一采用微蓝基调，禁止混用暖灰与冷灰。

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

学习页面保持居中聚焦，帮助用户进入专注状态：

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

### 词汇/数据页面布局（Bento Grid）

词汇浏览、学习记录等非专注学习页面，采用 Bento Grid 布局替代居中对称布局，创造信息层级的视觉差异：

```
┌─────────────────────────────────────────────┐
│                  Header (56px)              │
├─────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │          │  │          │  │  Stats   │  │
│  │  Search  │  │   Tags   │  │  Card    │  │
│  │          │  │          │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                             │
│  ┌───────────────────────┐  ┌────────────┐  │
│  │                       │  │            │  │
│  │    Word Table /        │  │  Detail    │  │
│  │    Grid                │  │  Panel     │  │
│  │                       │  │            │  │
│  └───────────────────────┘  └────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

Bento 网格使用 CSS Grid 的 `fr` 单位实现非对称列分割（如 `grid-template-columns: 2fr 1fr`），卡片间距统一为 16px（`paddingLG`）。

### 文本宽度约束

正文内容最大宽度限制在 **65ch**（约 65 个字符宽度），保证最佳可读性：

```css
max-width: 65ch;
```

标题使用 `text-wrap: balance` 避免孤行。段落使用 `text-wrap: pretty`。

### 光学对齐

图标与文字并排时，图标可能需要 1-2px 的视觉微调（而非数学居中）。对齐一致的基线比数学居中更重要。

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

动画应**快速、微妙、有目的性**。不打断用户心流，仅用于引导注意力和提供反馈。所有交互动画使用 `transform` 和 `opacity`，禁止动画 `top`/`left`/`width`/`height` 以确保 GPU 加速。

### 缓动体系

| 类型 | 缓动函数 | 用途 |
|------|----------|------|
| 标准缓动 | `cubic-bezier(0.4, 0, 0.2, 1)` | 组件显示/隐藏、过渡、hover |
| 弹性缓动（Spring） | `cubic-bezier(0.16, 1, 0.3, 1)` | 按钮按下回弹、卡片弹出 |
| 弹窗缓动 | `cubic-bezier(0.08, 0.52, 0.52, 1)` | Modal、Drawer 进出 |

> Spring 物理：对于需要"重量感"的交互（按钮、卡片操作），优先使用弹性缓动 `cubic-bezier(0.16, 1, 0.3, 1)`，产生自然的 overshoot 回弹效果。

### 时长

| 类型 | 时长 | 缓动 | 用途 |
|------|------|------|------|
| 微交互 | 150ms | 标准 | 按钮 hover、图标变色 |
| 触觉反馈 | 100ms | Spring | 按钮 `:active` 按下（`translateY(1px) scale(0.98)`） |
| 标准过渡 | 200ms | 标准 | 组件显示/隐藏、卡片 hover 抬起 |
| 页面切换 | 250ms | 标准 | 路由切换淡入 |
| 弹窗 | 200ms | 弹窗 | Modal、Drawer 进出 |
| 进度填充 | 400ms | 标准 | 进度条宽度变化，营造流畅进度感 |
| 列表级联 | 80ms/项 | 标准 | Staggered reveal，列表项逐项淡入 |

### 具体动画

**按钮 hover**：`transform: translateY(-1px)` + `box-shadow` 增强，150ms 标准缓动

**按钮按下（触觉反馈）**：`:active` 时 `transform: translateY(1px) scale(0.98)`，100ms Spring 缓动，模拟物理按压

**卡片 hover**：`transform: translateY(-2px)` + 阴影增强，200ms 标准缓动

**进度条填充**：宽度变化使用 400ms 标准缓动，营造流畅的进度感

**单词卡片翻转**（可选进阶效果）：300ms 标准缓动实现释义显示/隐藏

**评分反馈**：
- 点击"认识"：卡片短暂绿色发光 → 向上滑出，200ms
- 点击"不熟悉"：卡片轻微抖动 → 移入重学队列，200ms
- 点击"不认识"：卡片红色闪烁 → 移入重学队列，200ms

**列表/表格行 hover**：背景色过渡 150ms，轻微抬高

**Staggered 级联揭示**：列表和网格项使用 `animation-delay: calc(var(--index) * 80ms)` 逐项淡入，禁止所有项同时挂载。适用于单词列表、搜索结果、学习记录等场景。

**永续微交互**：以下元素保持持续动画，营造"活"的界面感：
- 学习进度指示器：呼吸脉冲（opacity 在 0.6-1.0 间循环，2s duration）
- 当前单词卡片：微弱的 scale 呼吸（1.0-1.02，3s duration），暗示"当前焦点"
- 加载骨架屏：shimmer 扫光动画

**加载状态**：优先使用 `Skeleton` 占位（匹配布局形状），避免全屏 `Spin`。骨架屏需带 shimmer 扫光动画。

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

## 5. 阴影与深度

### 原则

阴影应带背景色调，而非使用纯黑降低透明度。带色调的阴影更自然，与暖调底色融合，避免"灰脏"感。本项目采用微蓝基调，阴影应带有对应的蓝色微量。

### 阴影层级

| 层级 | 阴影值 | 用途 |
|------|--------|------|
| 悬浮 | `0 2px 8px rgba(26,26,46,0.05)` | 卡片默认 — 带背景色调 |
| 抬起 | `0 4px 16px rgba(26,26,46,0.07)` | 卡片 hover |
| 弹出 | `0 8px 24px rgba(26,26,46,0.09)` | Dropdown、Modal |
| 主按钮 | `0 4px 12px rgba(22,119,255,0.18)` | 主要按钮阴影（主题色） |

> 注：`#1a1a2e` = `colorTextBase`（主文字色），以此为基础调低透明度产生色调阴影。

### 卡片内边框

所有卡片组件需配合 `1px solid` 内边框提供结构定义，避免仅依赖阴影。

```css
border: 1px solid #e5e7eb; /* colorBorder */
```

对于玻璃态/悬浮面板效果，额外叠加内部折射边框：
```css
box-shadow: inset 0 1px 0 rgba(255,255,255,0.6); /* 顶部高光线 */
```

---

## 6. 图标

统一使用 `@ant-design/icons` 的 `Outlined` 风格（线性图标），保持轻盈感。特殊强调场景可使用 `Filled` 风格。

图标尺寸：16px（行内）、20px（按钮内）、24px（独立展示）。

标准笔画粗细保持一致，同一视图中所有图标需为同一风格变体（全 Outlined 或全 Filled），避免混用。

---

## 7. 空白页与状态

| 状态 | 处理方式 |
|------|----------|
| 数据为空 | `Empty` 组件 + 引导文案，图标使用定制插画风格 |
| 加载中 | `Skeleton` 占位（首选），匹配布局形状 + shimmer 扫光动画，避免全屏 `Spin` |
| 错误 | `Result` 组件 + 重试按钮，文案直接说明原因（禁止 "Oops!" 等幼稚表达） |
| 成功 | `Result` 组件 + 自动跳转或手动确认 |

### 表单布局

表单采用 **标签在上、输入框在下** 的垂直布局：

```
Label (14px, 500 weight)
[   Input / Select   ]  ← 36px 高, 8px 圆角
Helper text (12px, tertiary)  ← 可选
Error text (12px, error color)  ← 校验失败时显示
```

表单项间距统一使用 `gap: 16px`（`paddingLG`）。

### 可访问性 — Focus Ring

所有可交互元素必须有可见的 focus 指示器，确保键盘导航可用：

```css
*:focus-visible {
  outline: 2px solid #1677ff;
  outline-offset: 2px;
}
```

禁止移除 `:focus-visible` outline 而不提供替代方案。

---

## 8. 全局 ConfigProvider（已部署）

`src/root.tsx` 已配置全局 `ConfigProvider`，统一注入所有 design token。以下是当前生效的配置：

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

### 内联样式规范

优先使用 Ant Design `theme.useToken()` 获取 token 值，禁止硬编码颜色/尺寸值：

```tsx
// ✅ 正确
const { token } = theme.useToken();
<div style={{ padding: token.paddingXL, color: token.colorTextSecondary }} />

// ❌ 错误
<div style={{ padding: 20, color: '#6b7280' }} />
```

---

## 9. 组件微交互规范

### 卡片

- 默认状态：`1px solid token.colorBorder` + 色调阴影（悬浮层级）
- Hover：`translateY(-2px)` + 阴影升至抬起层级，200ms 标准缓动
- 所有卡片统一 `borderRadius: 12px`（`borderRadiusLG`），内部 padding 不小于 20px（`paddingXL`）
- 卡片仅在有层级需要时使用。纯间隔场景用 `border-top`、`divide-y` 或负空间代替

### 按钮

- Hover：`translateY(-1px)` + 阴影增强，150ms 标准缓动
- Active/Press：`translateY(1px) scale(0.98)`，100ms Spring 缓动，模拟物理按压
- 主按钮（Primary）：实心填充 + 主题色阴影
- 语义按钮：Known=success, Unfamiliar=warning, Unknown=default（非 error——避免误以为操作失败）

### 输入框

- 默认：`1px solid token.colorBorder`，`borderRadius: 8px`
- Focus：边框变为 `token.colorPrimary`，叠加 `box-shadow: 0 0 0 2px rgba(22,119,255,0.1)`
- Error：边框变为 `token.colorError`

### 数据表格

- 行 hover：背景色过渡 150ms + 轻微抬高
- 表头：`fontWeight: 600`，`color: token.colorText`
- 空状态：`Empty` 组件居中，不显示空表格框

### 标签/Tag

- 使用 muted pastel 配色：浅色背景 + 对应深色文字
- Pale Blue: `#e6f4ff` 底 + `#1677ff` 字
- Pale Green: `#edf3ec` 底 + `#22c55e` 字
- Pale Yellow: `#fbf3db` 底 + `#f59e0b` 字
- Pale Red: `#fdebeb` 底 + `#ef4444` 字
- 圆角：`borderRadiusXS`（6px），字号 12px，大写 + 宽字距

---

## 10. 反模式（禁止清单）

以下模式在项目中严格禁止：

### 视觉
- **纯黑 `#000000`** — 最深色统一用 `#1a1a2e`（`colorTextBase`）
- **霓虹发光 / 紫蓝 AI 渐变** — 主题色保持饱和度 ≤ 80%，不使用渐变文字
- **通用 `box-shadow` 黑阴影** — 必须使用色调阴影（见第 5 节）
- **纯白 `#ffffff` 大面积背景** — 学习类页面可选用 `#fbfbfa` 暖调 off-white
- **超过 1 个主题色** — 语义色仅用于学习反馈，非装饰用途

### 版式
- **Linux 风格全大写菜单**（"LEARN", "WORDS"）— 正常大小写即可，全大写降低中文界面可读性
- **正文行宽超过 65ch** — 限制最大阅读宽度
- **H1 纯靠字号放大** — 标题层级通过 weight + color 控制，不仅仅靠 scale

### 交互
- **全屏 Spin 加载** — 优先使用局部 Skeleton + shimmer
- **`:active` 无反馈** — 必须提供 `translateY(1px) scale(0.98)` 触觉反馈
- **移除 `:focus-visible` outline** — 可访问性底线
- **`top`/`left`/`width`/`height` 动画** — 仅使用 `transform` + `opacity`

### 内容
- **Emoji** — 禁止在代码、文案、alt text 中使用
- **"Oops!" / "Elevate" / "Unleash" 等 AI 文案腔** — 使用直接、具体的语言
- **TITLE CASE ON EVERY HEADER** — 使用 Sentence case
