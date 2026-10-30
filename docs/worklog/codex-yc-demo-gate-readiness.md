# Repair the YC demo gate

Date: 2026-10-30
Branch: codex/yc-demo-gate-readiness

## Objective
Allow the real demo PR to move from required named-signer approval to independently verified GitHub checks without a parser failure or manual rerun.

## Changes
- F01: pin deploy-gate ec9549dd67d09b85c67b247d8d418a7093dd4c4d, containing the upstream #72 expression-parser fix. Wait up to ten minutes for the exact head's App decision, then use the trusted Action to verify the receipt. Fail closed on denial, unknown state, API failure and timeout. PR mode never redeems a deployment authorization.
- F02: add the required status permission-protocol/approval, pinned to App 3065051. Existing required Action, strict status policy, deletion protection, non-fast-forward protection and empty bypass list preserved. Applied and confirmed through GitHub ruleset API on 2026-10-30.
- F09: assign issues and PRs through the supported issues/assignees endpoint using the event's correct number; remove the issue-only third-party action.
- Record preflight and the reviewed ruleset configuration.

## Validation
- `node --test tests/demo-workflows.test.mjs`: 4 tests passed with isolated shell/API stubs, including pending→success and fail-closed cases.
- `node --test test/recovery.test.mjs test/permission-gate.test.mjs` in the pinned deploy-gate checkout: 8 tests passed. Parser-length regression, trusted-code digest/normalization and recovery validation passed.
- `git diff --check`: passed.
- Auto-merge disabled on this repository. Existing smoke PR #136 changes only its smoke text file; workflow repairs do not overlap it.
- Live Action execution and a fresh signed PR remain to be verified after release. Local stubs are not live proof.

## Risk
The App status wait is scheduling only. The unchanged trusted Action remains the receipt verifier; a green status alone is not accepted as cryptographic proof. No secrets were retrieved, changed or printed. Do not merge the later disposable demo PR.
