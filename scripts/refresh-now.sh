#!/usr/bin/env bash
# Pull the latest Google Sheets/Calendar data and publish it RIGHT NOW,
# then report when the live site actually has it. Use for testing and for
# important updates that shouldn't wait for the hourly sync.
#
# Usage: ./scripts/refresh-now.sh
#
# The sheet URLs use Google's live export endpoint, so edits are visible to
# the robot immediately — no republish lag.
set -euo pipefail

REPO="ExitPlanetDust/saguaro-creek-ptsa"

wait_for() { # wait_for <workflow-file> — waits for its newest run to finish
  local wf="$1" status
  sleep 8
  while status=$(gh run list -R "$REPO" --workflow="$wf" --limit 1 --json status -q '.[0].status'); [[ "$status" != "completed" ]]; do
    sleep 8
  done
  gh run list -R "$REPO" --workflow="$wf" --limit 1 --json conclusion -q '.[0].conclusion'
}

echo "→ Triggering data refresh…"
BEFORE=$(gh api "repos/$REPO/commits/main" --jq .sha)
gh workflow run refresh-data.yml -R "$REPO"
echo "→ Fetching from Google… ($(wait_for refresh-data.yml))"

AFTER=$(gh api "repos/$REPO/commits/main" --jq .sha)
if [[ "$AFTER" == "$BEFORE" ]]; then
  echo "✓ Refresh ran: no data changes found — site already up to date."
  exit 0
fi

echo "→ Data changed — deploying… ($(wait_for deploy.yml))"
URL=$(gh api "repos/$REPO/pages" --jq '.cname // empty')
[[ -n "$URL" ]] && echo "✓ Live now: https://$URL/ (hard-refresh your browser: Cmd+Shift+R)"
