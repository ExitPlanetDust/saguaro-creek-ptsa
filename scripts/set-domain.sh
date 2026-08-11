#!/usr/bin/env bash
# Point the website at a (sub)domain, or back at github.io — and redeploy.
#
# Usage:
#   ./scripts/set-domain.sh status                     show current domain config
#   ./scripts/set-domain.sh set ptsa.exitplanetdust.dev    use a custom domain
#   ./scripts/set-domain.sh set saguarocreekptsa.org       (final cutover looks the same)
#   ./scripts/set-domain.sh clear                      back to exitplanetdust.github.io/saguaro-creek-ptsa/
#
# Before "set", create the DNS record at the domain's registrar:
#   subdomain (ptsa.example.com):  CNAME  <sub>  ->  exitplanetdust.github.io
#   apex (example.com):            A      @      ->  185.199.108.153, .154, .155, .156
# On Cloudflare, set the record to "DNS only" (grey cloud), not proxied,
# or GitHub cannot issue the HTTPS certificate.
#
# The deploy workflow detects the domain setting automatically and builds with
# the right path prefix, so this script is all that's needed to switch.
set -euo pipefail

REPO="ExitPlanetDust/saguaro-creek-ptsa"
CMD="${1:-status}"

case "$CMD" in
  status)
    gh api "repos/$REPO/pages" --jq '"domain: \(.cname // "none (github.io)")\nurl:    \(.html_url)\nhttps:  \(.https_enforced)\ncert:   \(.https_certificate.state // "n/a")"'
    ;;
  set)
    DOMAIN="${2:?usage: set-domain.sh set <domain>}"
    gh api -X PUT "repos/$REPO/pages" --input - <<<"{\"cname\":\"$DOMAIN\"}" >/dev/null
    echo "Custom domain set to $DOMAIN — redeploying with the new path prefix…"
    gh workflow run deploy.yml -R "$REPO"
    echo "Done. HTTPS cert can take up to ~1 hour on first setup; check with: $0 status"
    echo "Enforce HTTPS once the cert is 'approved': gh api -X PUT repos/$REPO/pages -F https_enforced=true"
    ;;
  clear)
    gh api -X PUT "repos/$REPO/pages" --input - <<<'{"cname":null}' >/dev/null
    echo "Custom domain removed — redeploying for github.io…"
    gh workflow run deploy.yml -R "$REPO"
    ;;
  *)
    echo "usage: $0 {status|set <domain>|clear}" >&2
    exit 1
    ;;
esac
