# dsh-frontend-design-skill

给 DeepSeek Harness 的前端设计技能：**先出设计计划与 token，再写代码**，附中文排版规则和无视觉自检表。

它只做一件事：安装后在技能目录里注册一个 `deepseek-frontend-design` 技能。没有工具、没有后台进程、不发网络请求、不写项目文件。SKILL.md 在会话需要时才被读取，其余时间不占上下文。

## 装

```sh
dsh plugin --profile web add dsh-frontend-design-skill
```

或从源码装：

```sh
dsh plugin --profile web add github:kechao-sgp/dsh-frontend-design-skill
```

装完重启 `dsh web`。桌面端请在 **设置 → 插件** 里安装。

## 它和 Anthropic 的 frontend-design 有什么不同

原版面向 Claude，默认能截图自查、默认英文语境。这个版本面向 DeepSeek 与中文界面：

1. **强制两段式**：先交 ≤12 行的设计计划（色彩 / 字体 / 版式 / 记忆点），并回答"这份计划套到同类产品上是否也成立"，通过后才写代码。模型直接生成代码的倾向太强，这一步把它拦下来。
2. **无视觉自检**：不依赖截图。给出可实测的对比度算法、字号阶梯、间距倍数、三档响应式、焦点与 reduced-motion 检查，外加一段可粘贴进控制台的审计脚本。
3. **中文排版专章**：字体栈、16px 下限、1.7–1.9 行高、每行 28–40 字、中西文混排空格、标点与数字规则。原版的英文排版规则直接套中文会坏。
4. **2026 版去 AI 味清单**：紫蓝渐变、毛玻璃三件套、居中 hero、全 section fade-up、emoji 图标、01/02/03、`A · B · C` 元信息行等默认值，出现即改（brief 明确要求除外）。

## 跟上游

上游 [anthropics/skills 的 frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) 还在动。仓库里 `upstream/` 存了一份带 sha256 的副本，`.github/workflows/upstream-watch.yml` 每周一比对一次，变了就开 issue 并在里面贴出增删行。

```sh
npm run sync:upstream          # 比对，退出码 1 表示上游变了
npm run sync:upstream:apply    # 刷新上游副本和 sha（不等于是改好中文技能）
```

改中文技能是判断活，不是覆盖：看 `.upstream-report.md` 里的 diff，决定哪几条值得移植，再改 `skills/deepseek-frontend-design/SKILL.md`。

## 用

正常提需求即可，例如"做一个咖啡烘焙工作室的落地页"、"把这个后台的表格页重做一遍"。技能被加载后，回答会先给设计计划再给代码，最后附自检表。

技能名：`deepseek-frontend-design`（可用 `/deepseek-frontend-design` 直接调用，取决于宿主的技能调用方式）。

## 兼容

- dsh `>= 0.2.2-0 < 0.4.0`，Node.js `>= 20`。
- 只用 `ctx.skills.register` 一个 API，注册走 `ctx.effect`，卸载时自动撤销。
- 未运行 ENTRY / FLOW / BOOST 检查，`package.json#dsh.standards` 如实标为 `not-run` / `not-measured`。

## 文件

```
index.js                                  插件入口，注册技能
skills/deepseek-frontend-design/SKILL.md   技能正文
  references/typography-cn.md              中文排版细节
  references/critique.md                   可测量的自检方法
tests/plugin.test.mjs                      完整性检查（npm test）
scripts/check-upstream.mjs                 上游比对（npm run sync:upstream）
upstream/                                  上游副本 + sha256 记录
```

## 许可

Apache-2.0。思路参考 Anthropic 的 [frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design)（Apache-2.0），正文为中文重写，见 NOTICE.md。
