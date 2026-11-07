// dsh-frontend-design-skill bundle entry: registers the packaged
// skills/deepseek-frontend-design/SKILL.md on ctx.skills.
//
// Registration is an effect: the disposer returned by ctx.skills.register()
// removes the skill on unload, so disabling the plugin restores the host to its
// previous state. No other service is touched and no network/fs access happens
// beyond reading the packaged SKILL.md once at apply time.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-frontend-design-skill'
export const inject = ['skills']

const packageRoot = dirname(fileURLToPath(import.meta.url))
export const skillRoot = join(packageRoot, 'skills', 'deepseek-frontend-design')

/**
 * Strip the YAML frontmatter block from a SKILL.md and return its description
 * plus the instruction body. A malformed or missing block falls back to using
 * the full text as the body.
 *
 * @param text - raw SKILL.md content.
 * @returns the `description` when present, and the body without frontmatter.
 */
export function splitFrontmatter(text) {
  const open = /^---\r?\n/.exec(text)
  if (!open) return { description: undefined, body: text }
  const rest = text.slice(open[0].length)
  const close = /\r?\n---[ \t]*(?:\r?\n|$)/.exec(rest)
  if (!close) return { description: undefined, body: text }
  const meta = rest.slice(0, close.index)
  const body = rest.slice(close.index + close[0].length).replace(/^(?:[ \t]*\r?\n)+/, '')
  const match = /^description:[ \t]*(.+?)[ \t]*$/m.exec(meta)
  return { description: match?.[1]?.trim(), body }
}

/**
 * Register the design skill.
 * @param ctx - Cordis context with the injected `skills` service.
 */
export function apply(ctx) {
  const skillPath = join(skillRoot, 'SKILL.md')
  const { description, body } = splitFrontmatter(readFileSync(skillPath, 'utf8'))
  ctx.effect(() =>
    ctx.skills.register({
      name: 'deepseek-frontend-design',
      source: 'bundled',
      description:
        description
        ?? 'Design plan, token system and self-check for distinctive, production-grade web UI, with Chinese typography.',
      content: body,
      resourceBase: { kind: 'directory', path: skillRoot },
    }),
  )
}
