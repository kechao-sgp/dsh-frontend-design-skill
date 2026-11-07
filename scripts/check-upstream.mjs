#!/usr/bin/env node
// Check whether the upstream frontend-design skill changed since the copy pinned
// in upstream/. Prints a summary, writes .upstream-report.md, exits 1 on change.
//
//   node scripts/check-upstream.mjs          # check only
//   node scripts/check-upstream.mjs --update  # re-pin the upstream copy
//
// Re-pinning is only half the job: the shipped skill in
// skills/deepseek-frontend-design/ is an independent Chinese rewrite, so a new
// upstream revision means reading the diff and deciding what to port, not
// copying the file over.
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const metaPath = join(root, 'upstream', 'upstream.json')
const copyPath = join(root, 'upstream', 'SKILL.md')
const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
const update = process.argv.includes('--update')

const sha = (text) => createHash('sha256').update(text).digest('hex')

const url = process.env.UPSTREAM_URL ?? meta.url
let remote
try {
  const res = await fetch(url, { headers: { 'user-agent': 'dsh-frontend-design-skill/upstream-check' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`)
  remote = await res.text()
} catch (err) {
  console.error(`上游读取失败：${err.message}`)
  process.exit(2)
}

const remoteSha = sha(remote)
if (remoteSha === meta.sha256) {
  console.log(`上游未变化（${meta.sha256.slice(0, 12)}），${meta.fetchedAt} 起一直如此。`)
  process.exit(0)
}

const local = existsSync(copyPath) ? readFileSync(copyPath, 'utf8') : ''
const localLines = local.split('\n')
const remoteLines = remote.split('\n')
const localSet = new Set(localLines)
const remoteSet = new Set(remoteLines)
const added = remoteLines.filter((l) => !localSet.has(l))
const removed = localLines.filter((l) => !remoteSet.has(l))

const report = [
  `# 上游 frontend-design 技能有更新`,
  '',
  `- 来源：${url}`,
  `- 已固定：\`${meta.sha256}\`（${meta.fetchedAt}）`,
  `- 当前上游：\`${remoteSha}\``,
  `- 行数：${localLines.length} → ${remoteLines.length}`,
  `- 新增行 ${added.length}，删除行 ${removed.length}（按行集合比对，仅作规模参考）`,
  '',
  '## 新增（截断 40 行）',
  '```',
  ...added.slice(0, 40),
  '```',
  '',
  '## 删除（截断 40 行）',
  '```',
  ...removed.slice(0, 40),
  '```',
  '',
  '## 下一步',
  '1. `node scripts/check-upstream.mjs --update` 刷新上游副本与 sha。',
  '2. 逐条判断哪些变化值得移植进 `skills/deepseek-frontend-design/SKILL.md`（中文原创改写，不是复制）。',
  '3. 改完跑 `npm test`，更新 NOTICE.md 的日期。',
].join('\n')

writeFileSync(join(root, '.upstream-report.md'), report + '\n')
console.log(report)
if (update) {
  writeFileSync(copyPath, remote)
  writeFileSync(metaPath, JSON.stringify({ ...meta, sha256: remoteSha, fetchedAt: new Date().toISOString().slice(0, 10) }, null, 2) + '\n')
  console.log('\n已重新固定上游副本。记得回头看 skills/deepseek-frontend-design/SKILL.md 要不要跟。')
  process.exit(0)
}
process.exit(1)
