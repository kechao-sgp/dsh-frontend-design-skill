// Checks the packaged skill is complete and loadable: frontmatter parses, the
// registration carries the skill body, and every references/*.md linked from
// SKILL.md exists. Run with `npm test`.
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { apply, skillRoot, splitFrontmatter } from '../index.js'

const skillFile = join(skillRoot, 'SKILL.md')
const raw = readFileSync(skillFile, 'utf8')
const { description, body } = splitFrontmatter(raw)

test('SKILL.md has a name matching its directory and a bounded description', () => {
  const name = /^name:[ \t]*(.+?)[ \t]*$/m.exec(raw)?.[1]
  assert.equal(name, 'deepseek-frontend-design')
  assert.equal(name, skillRoot.split('/').pop())
  assert.ok(description, 'frontmatter description is required')
  assert.ok(description.length <= 500, `description too long: ${description.length}`)
})

test('SKILL.md body keeps the two-pass workflow and the anti-template list', () => {
  assert.ok(body.length > 500, 'skill body looks empty')
  for (const heading of ['设计计划', '反模板清单', '自检']) {
    assert.ok(body.includes(heading), `missing section: ${heading}`)
  }
  assert.ok(!body.includes('undefined'), 'unexpected placeholder in body')
})

test('every reference linked from SKILL.md exists', () => {
  const linked = [...body.matchAll(/references\/([\w.-]+\.md)/g)].map((m) => m[1])
  assert.ok(linked.length >= 2, 'expected at least two reference links')
  for (const file of new Set(linked)) {
    assert.ok(existsSync(join(skillRoot, 'references', file)), `missing reference: ${file}`)
  }
  const present = readdirSync(join(skillRoot, 'references')).filter((f) => f.endsWith('.md'))
  for (const file of present) assert.ok(linked.includes(file), `unlinked reference: ${file}`)
})

test('apply() registers one bundled skill whose resourceBase is the skill directory', () => {
  const registered = []
  const disposed = []
  const ctx = {
    effect(fn) {
      const disposer = fn()
      if (typeof disposer === 'function') disposed.push(disposer)
    },
    skills: {
      register(definition) {
        registered.push(definition)
        return () => {}
      },
    },
  }

  apply(ctx)

  assert.equal(registered.length, 1)
  const [skill] = registered
  assert.equal(skill.name, 'deepseek-frontend-design')
  assert.equal(skill.source, 'bundled')
  assert.equal(skill.resourceBase.kind, 'directory')
  assert.equal(skill.resourceBase.path, skillRoot)
  assert.equal(skill.description, description)
  assert.equal(skill.content, body)
})

test('the pinned upstream copy matches the hash recorded next to it', async () => {
  const { createHash } = await import('node:crypto')
  const meta = JSON.parse(readFileSync(join(skillRoot, '..', '..', 'upstream', 'upstream.json'), 'utf8'))
  const copy = readFileSync(join(skillRoot, '..', '..', 'upstream', 'SKILL.md'))
  assert.equal(createHash('sha256').update(copy).digest('hex'), meta.sha256, 'run: npm run sync:upstream:apply')
})
