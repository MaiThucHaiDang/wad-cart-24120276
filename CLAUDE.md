# CLAUDE.md — wad-cart

## Project
One function: `cartTotal(items, options)` in `src/cart.js`. The spec is README.md.

## Stack
- Node.js 24, plain JavaScript, ES modules (`"type": "module"`)
- Tests: built-in `node:test` and `node:assert/strict`
- No dependencies, no build step

## Commands
- `npm test` — run all tests
- `npm run lint` — syntax check with `node --check`
- `npm run check` — lint, then test. This is the gate.

## Gate
A change is not done until `npm run check` passes. CI runs the same on every push.

## Never
- Never add a dependency or devDependency. Never run `npm install <package>` or `npx`.
- Never edit or delete the starter test "the example from the slides".
- Never weaken or delete a test to make it pass. Fix the code.
- Never use `toFixed` or return a string. The total is a number.
- Never commit or push. The student does that.
- Never touch files the task does not name.

## Style
Match the starter: 2-space indent, single quotes, no semicolons, named exports.
