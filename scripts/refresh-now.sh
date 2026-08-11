#!/usr/bin/env bash
# Pull the latest Google Sheets/Calendar data and publish it RIGHT NOW,
# then report when the live site actually has it. Use for testing and for
# important updates that shouldn't wait for the hourly sync.
#
# Usage: ./scripts/refresh-now.sh
#
# Note: Google republishes an edited sheet's CSV ~5 minutes after the edit.
# If this script reports "no data changes" right after you edited a sheet,
# wait five minutes and run it again.
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
  echo "  (Just edited a sheet? Google's published CSV lags ~5 min; retry then.)"
  exit 0
fi

echo "→ Data changed — deploying… ($(wait_for deploy.yml))"
URL=$(gh api "repos/$REPO/pages" --jq '.cname // empty')
[[ -n "$URL" ]] && echo "✓ Live now: https://$URL/ (hard-refresh your browser: Cmd+Shift+R)"
