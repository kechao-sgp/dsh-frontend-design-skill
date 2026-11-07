---
name: deepseek-frontend-design
description: Build distinctive, production-grade web UI instead of template defaults — a design plan and token system before code, a no-vision self-check after. Use when the user asks for a page, landing page, dashboard, marketing site, component, or a redesign of an existing frontend. Includes Chinese typography rules. 用户要求做网页、落地页、后台、组件或改造现有界面时使用。
license: Apache-2.0
---

# 前端设计（DeepSeek 版）

## 立场

把每个任务当成设计工作室的委托：客户已经否掉了模板化的提案，付钱买的是一个只属于他的视觉方向。风险花在一个地方，其余保持安静和精确。brief 的原话优先级高于本技能的任何偏好。

## 0. 定题

- brief 没说清做什么、给谁用、最重要的一个任务时：自己给一个具体提案（一句话），然后继续做。不要连问三轮。
- 视觉语汇从题材里取：行业、材料、年代、术语、真实内容。先有内容，再有样式。给 8–11 岁女孩的玩具，和给金融分析师的看板，长得就该完全不同。

## 1. 先出设计计划（写代码之前，≤12 行）

| 项 | 内容 |
| --- | --- |
| 色彩 | 4–6 个命名 hex：底 / 面 / 主文 / 次文 / 强调 / 语义 |
| 字体 | 1–2 个家族，各自角色，字号阶梯（例：14 / 16 / 20 / 32 / 56）|
| 版式 | 一句概念 + 桌面、移动两张 ASCII 线框 + 对齐方式 |
| 记忆点 | 整页只许一个（一句话）|

计划写完先自审：把这份计划原样套到任意一个同类产品上是否也成立？成立，说明它就是默认值——改掉，并写一句改了什么。确认之后才写代码。

## 2. 写代码

- 默认交付能直接打开的单文件 HTML；已有项目就沿用现有栈、目录和命名约定。
- token 放 CSS 变量；不新增依赖；字体优先系统字体，最多一个 webfont 且 `font-display: swap`。
- 从 375px 做起，375 / 768 / 1280 三档都要能用。
- 结构装置（编号、分隔线、标签）只承载真实信息；内容不是序列就不要 01 / 02 / 03。
- 动效留一到两个有意义的时刻。用户动作的反馈（展开、确认、切页）优先于自动播放的入场。
- CSS 选择器保持单层、低特异性，避免 `.section` 与 `.cta` 互相抵消 padding/margin。

## 3. 反模板清单

以下默认值除非 brief 明确要求，出现即改：

1. 紫蓝渐变主视觉、紫色 accent。
2. 毛玻璃 + 大圆角 + 灰色柔和阴影，三件套齐上。
3. 居中 hero：大标题 + 副标题 + 两个并排按钮。
4. 每个 section 都 fade-up 入场。
5. emoji 当图标；全大写英文 eyebrow 标签。
6. 内容不是序列却用 01 / 02 / 03 编号。
7. Inter / Roboto / 系统默认字体当标题。
8. 每张卡片都 hover 上浮加发光。
9. AI 味文案：赋能、无缝、一站式、释放潜能、重新定义、让 X 更 Y。
10. `A · B · C` 元信息行，和 `WORD — 短语` 式标签。

## 4. 中文排版（默认场景）

- 正文 ≥ 16px，行高 1.7–1.9，每行 28–40 个汉字（约 640–720px）。
- 正文栈示例：`"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif`。标题可上衬线（`"Songti SC", "Noto Serif SC", serif`），但先确认不是廉价的默认宋体感。
- 层级靠字号、字重、颜色。不要用 letter-spacing 拉开中文，不要用全大写做层级。
- 中西文之间留 1/4 空格；数字与单位之间同理。
- 引号用「」或“”，省略号用……，破折号用——。不要直引号，不要三个点。
- 数据列 `font-variant-numeric: tabular-nums`；金额和数字右对齐。
- 界面文案不要首行缩进；标签与正文用颜色、字重分开，不要加括号注释。

细节与代码片段见 `references/typography-cn.md`。

## 5. 交付与自检

交付三样：可运行结果、3–6 行设计说明、自检表。不要写长篇的"我做了什么"。

自检表必须实测，不能只声明：

- 对比度：正文 ≥ 4.5:1，大字 ≥ 3:1，写出实际算出的比值。
- 字体：≤ 2 个家族，正文 ≥ 16px，阶梯 ≥ 4 级。
- 间距：4 或 8 的倍数，没有随手值。
- 375 / 768 / 1280 三档无横向滚动、无截断。
- Tab 走一遍：每个交互元素有可见焦点。
- `prefers-reduced-motion: reduce` 下没有动画。
- 反模板清单逐条确认，或说明 brief 要求保留哪一条及为什么。

测量方法与可粘贴的检查脚本见 `references/critique.md`。
