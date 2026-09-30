import { readFileSync } from 'node:fs'

const files = ['src/cart.js', 'test/cart.test.js', 'scripts/lint.js']
const errors = []

// Luật 1: package.json không có dependency
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
for (const key of ['dependencies', 'devDependencies']) {
  const count = Object.keys(pkg[key] ?? {}).length
  if (count > 0) errors.push(`package.json: ${key} must be empty (found ${count})`)
}

const allowedPrefixes = ['node:', './', '../']
const importRegex = /from\s+['"]([^'"]+)['"]/g

for (const file of files) {
  const content = readFileSync(file, 'utf8')
  const lines = content.split(/\r?\n/)

  // Luật 2: chỉ import 'node:...' hoặc './' '../'
  for (const m of content.matchAll(importRegex)) {
    const spec = m[1]
    if (!allowedPrefixes.some((prefix) => spec.startsWith(prefix))) {
      const lineNo = content.slice(0, m.index).split('\n').length
      errors.push(`${file}:${lineNo}: disallowed import '${spec}'`)
    }
  }

  // Luật 3: không có toFixed trong src/cart.js
  if (file === 'src/cart.js' && content.includes('toFixed')) {
    lines.forEach((line, i) => {
      if (line.includes('toFixed')) errors.push(`${file}:${i + 1}: toFixed is not allowed`)
    })
  }

  // Luật 4: từng dòng không có tab, không có khoảng trắng cuối dòng
  lines.forEach((line, i) => {
    if (line.includes('\t')) errors.push(`${file}:${i + 1}: tab character`)
    if (/[ \t]+$/.test(line)) errors.push(`${file}:${i + 1}: trailing whitespace`)
  })

  // Luật 5: file kết thúc bằng '\n'
  if (!content.endsWith('\n')) errors.push(`${file}: missing newline at end of file`)
}

if (errors.length > 0) {
  for (const error of errors) console.error(error)
  process.exit(1)
}
console.log(`lint ok: ${files.length} files`)
