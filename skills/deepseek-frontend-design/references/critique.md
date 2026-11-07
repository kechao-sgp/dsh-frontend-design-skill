# 无视觉能力的自检

没有截图工具时，设计质量靠可计算、可枚举的检查兜底。交付前把这张表填完，每条写实际数值，不写"已检查"。

## 1. 对比度

相对亮度公式（WCAG 2.x）：

```
L = 0.2126·R + 0.7152·G + 0.0722·B   // R/G/B 为线性化后的分量
ratio = (L_light + 0.05) / (L_dark + 0.05)
```

低于 22px 的正文字号按 4.5:1 要求，加粗大字（≥18.66px bold 或 ≥24px）按 3:1。中文笔画细，4.5:1 只是下限，正文尽量做到 7:1 左右。

把这段贴进浏览器控制台，可以一次列出所有文本节点的实际比值：

```js
const lum = (c) => {
  const v = c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map((x) => {
    x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return ((l1 + 0.05) / (l2 + 0.05)).toFixed(2);
};
[...document.querySelectorAll('body *')].forEach((el) => {
  if (!el.textContent.trim() || el.children.length) return;
  const s = getComputedStyle(el);
  const bg = (() => {
    for (let n = el; n; n = n.parentElement) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c;
    }
    return 'rgb(255,255,255)';
  })();
  const r = ratio(s.color, bg);
  if (r < 4.5) console.warn(r, el, s.color, bg);
});
```

注意：半透明遮罩、渐变背景、图片上的文字，计算器算不准。这些地方直接换纯色底，或加实心遮罩，别赌。

## 2. 版式

- 字号集合去重后应 ≥ 4 级且成阶梯，不是随机值（例：14 / 16 / 20 / 32 / 56）。
- 间距集合去重后应落在 4 或 8 的倍数上。`grep -oE '\b[0-9]+px'` 数一遍。
- 正文容器 `max-width` 与字号算出的每行字数在 28–40（中文）或 45–75 字符（英文）。
- 只有一套圆角尺度，或按层级明确分两档；全站 `border-radius` 不要出现 6 个不同值。

## 3. 响应式

在 375 / 768 / 1280 三个宽度下检查：

- `document.documentElement.scrollWidth > window.innerWidth` 为 false，即无横向滚动。
- 长英文单词、URL、表格不被截断：`overflow-wrap: anywhere` 或横向滚动容器。
- 触控目标 ≥ 44×44px。
- 图片有宽高比占位，避免加载时跳版。

## 4. 无障碍

- 每个可交互元素 Tab 可达，`:focus-visible` 有 2px 以上可见轮廓，且不被 `outline: none` 抹掉。
- 表单控件有 `<label>`；纯图标按钮有 `aria-label`。
- 标题层级不跳级（h1 → h2 → h3）。
- 语义结构：`header / nav / main / footer`，列表用列表元素。
- `prefers-reduced-motion: reduce` 时，动效全部降级为无或瞬时。

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```

## 5. 反模板复核

对照 SKILL.md 第 3 节逐条过一遍。如果某条被有意保留，写清原因（"brief 要求紫色品牌色"），而不是沉默放过。

同时问三个问题：

1. 把 logo 和文案换成另一个同类产品，这页还成立吗？成立 → 设计没落地到题材。
2. 页面上最让人记住的一个东西是什么？说不出来 → 记忆点缺失；说出来有两个 → 删掉一个。
3. 有没有一层装饰可以整层删掉而不损失信息？有 → 删。

## 6. 代码层

- CSS 变量覆盖颜色、间距、字体三类 token；组件里不出现裸 hex。
- 没有未使用的选择器和 `!important` 补丁。
- 内联样式只用于动态值（尺寸、位置），不用于配色和排版。
- 单文件交付时，外部请求为 0 或只剩明确声明的字体；否则给出离线降级方案。
