import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const workflow = readFileSync('.github/workflows/deploy-gate.yml', 'utf8');
const script = workflow.split('        run: |')[1].split('\n      #')[0].split('\n').map(line => line.replace(/^          /, '')).join('\n');
const bash = process.platform === 'win32' ? 'C:/Program Files/Git/bin/bash.exe' : 'bash';

function run(states, apiFailure = false) {
  const dir = mkdtempSync(join(tmpdir(), 'pp-demo-wait-'));
  try {
    mkdirSync(join(dir, 'bin'));
    writeFileSync(join(dir, 'wait.sh'), script);
    writeFileSync(join(dir, 'states'), states.join('\n') + '\n');
    writeFileSync(join(dir, 'bin/gh'), `#!/usr/bin/env bash
set -euo pipefail
echo "$*" >> "$CASE_DIR/calls"
if [ "$API_FAILURE" = true ]; then exit 1; fi
count=$(cat "$CASE_DIR/count" 2>/dev/null || echo 0)
count=$((count + 1)); echo "$count" > "$CASE_DIR/count"
state=$(sed -n "\${count}p" "$CASE_DIR/states")
echo "\${state:-pending}"
`, { mode: 0o755 });
    writeFileSync(join(dir, 'bin/sleep'), '#!/usr/bin/env bash\nexit 0\n', { mode: 0o755 });
    return spawnSync(bash, ['-c', 'export PATH="$CASE_DIR/bin:$PATH"; bash "$CASE_DIR/wait.sh"'], {
      encoding: 'utf8', env: { ...process.env, CASE_DIR: dir.replaceAll('\\', '/').replace(/^([A-Za-z]):/, (_, drive) => '/' + drive.toLowerCase()), API_FAILURE: String(apiFailure),
        GH_TOKEN: 'stub-only', PP_REPOSITORY: 'example/demo', PP_HEAD_SHA: 'a'.repeat(40) },
    });
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

test('waits for the exact head, then lets the separate receipt verifier run', () => {
  const result = run(['pending', 'success']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Waiting for the named signer on aaaaaaa/);
  assert.match(script, /commits\/\$\{PP_HEAD_SHA\}\/status/);
  assert.match(workflow, /permission-protocol\/deploy-gate@ec9549dd67d09b85c67b247d8d418a7093dd4c4d/);
  assert.match(workflow, /redeem: 'false'/);
  assert.match(workflow, /fail-mode: closed/);
});

test('denied, error, unknown, absent and unreadable decisions fail closed', () => {
  for (const state of ['failure', 'error', 'unexpected', 'pending']) assert.notEqual(run([state]).status, 0, state);
  assert.notEqual(run([], true).status, 0);
});

test('ruleset adds the pinned App without dropping the existing required Action', () => {
  const ruleset = JSON.parse(readFileSync('docs/github-ruleset-main.json'));
  assert.deepEqual(ruleset.bypass_actors, []);
  const params = ruleset.rules.find(rule => rule.type === 'required_status_checks').parameters;
  assert.equal(params.strict_required_status_checks_policy, true);
  assert.deepEqual(params.required_status_checks, [
    { context: 'Permission Protocol Deploy Gate', integration_id: 15368 },
    { context: 'permission-protocol/approval', integration_id: 3065051 },
  ]);
});

test('assignment uses the issue or PR number and the supported GitHub endpoint', () => {
  const assign = readFileSync('.github/workflows/auto-assign.yml', 'utf8');
  assert.match(assign, /github.event.issue.number \|\| github.event.pull_request.number/);
  assert.match(assign, /issues\/\$\{ITEM_NUMBER\}\/assignees/);
  assert.ok(!assign.includes('auto-assign-issue'));
});
