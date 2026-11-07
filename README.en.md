# dsh-frontend-design-skill

A frontend-design skill for DeepSeek Harness: **a design plan and token system before any code**, plus Chinese typography rules and a no-vision self-check.

It does one thing: after install it registers a single `deepseek-frontend-design` skill in the skills catalog. No tools, no background process, no network calls, no project files written. The SKILL.md is read only when a turn needs it.

## Install

```sh
dsh plugin --profile web add dsh-frontend-design-skill
```

From source:

```sh
dsh plugin --profile web add github:kechao1990/dsh-frontend-design-skill
```

Restart `dsh web` afterwards. On DSH Desktop, install it from **Settings → Plugins**.

## How it differs from Anthropic's frontend-design

The original assumes a Claude-class model with screenshot review and English-first context. This one targets DeepSeek and Chinese UI:

1. **Two mandatory passes.** A design plan of at most 12 lines (color, type, layout, one memorable element) plus a written self-review — "would this plan work for any other product in the same category?" — before code is written. It exists to stop premature code generation.
2. **No-vision self-check.** No screenshots required: measured contrast ratios, a type scale, a spacing grid, three breakpoints, focus visibility, reduced motion, and a paste-into-console audit snippet.
3. **Chinese typography.** Font stacks, a 16px floor, 1.7–1.9 line height, 28–40 characters per line, CJK/Latin spacing, punctuation and numeral rules. English typesetting rules break on Chinese text.
4. **A 2026 anti-slop list.** Purple gradients, glassmorphism kits, centered heroes, per-section fade-ups, emoji icons, 01/02/03 numbering, `A · B · C` meta rows — replaced unless the brief asks for them.

## Compatibility

- dsh `>= 0.2.2-0 < 0.4.0`, Node.js `>= 20`.
- Uses only `ctx.skills.register`, wrapped in `ctx.effect` so unload removes it.
- ENTRY / FLOW / BOOST checks were not run; `package.json#dsh.standards` says `not-run` / `not-measured`.

## License

Apache-2.0. Approach informed by Anthropic's [frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) (Apache-2.0); the text is a Chinese rewrite. See NOTICE.md.
