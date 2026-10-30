# YC demo preflight

Use this repository for disposable `demo/` PRs. Never merge the recording PR.

1. Require `permission-protocol/approval` from App 3065051 on main. Preserve the required Deploy Gate Action and all existing restrictions. The reviewed configuration is `github-ruleset-main.json`.
2. Use the immutable parser-corrected Action revision in the workflow. A PR check waits up to ten minutes for the App decision, then independently verifies the receipt. This PR mode does not redeem a deployment authorization.
3. Start from current main, change a sensitive sample file under `src/lib/auth/`, and create a clearly labeled disposable PR. Mark it ready for the test only; drafts are skipped.
4. Show the required App check pending and GitHub merge blocked. Open its PP review link and review the full commit and signer scope.
5. The named signer confirms and completes their passkey prompt. Show the new receipt, run browser verification, then return to GitHub and wait for both required checks to finish.
6. A green authorization check is permission for the recorded commit. It does not prove a merge, execution or deployment occurred.
7. Close the PR without merging, delete only its temporary branch, and revoke the unused receipt through its normal signed workflow or let its recorded expiry elapse.

Local workflow checks: `node --test tests/demo-workflows.test.mjs`.
