# Execute-lane live check fixture

This branch exists for `scripts/live-execution-attestation-check.mjs` in
permission-protocol/app. The check opens a draft pull request from this
branch into `sandbox` through the execute lane (`github_create_pr:create_draft`),
after a human signs the hold. Close that draft pull request once the check
has finished; nothing here is meant to merge.
