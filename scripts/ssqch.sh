#!/usr/bin/env bash
# Run SiteSquatch (`ssqch`) against this site, using ssqch.config.js.
#
#   scripts/ssqch.sh build --env production
#   scripts/ssqch.sh serve
#
# Finds the binary in this order:
#   1. $SSQCH_BIN
#   2. `ssqch` on PATH (see "not found" below to install it)
#   3. ../ssqch/target/release/ssqch (a local checkout built with cargo)
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -n "${SSQCH_BIN:-}" ]; then
	bin=$SSQCH_BIN
elif command -v ssqch >/dev/null 2>&1; then
	bin=ssqch
elif [ -x ../ssqch/target/release/ssqch ]; then
	bin=../ssqch/target/release/ssqch
else
	echo "ssqch not found. Install the release netlify.toml pins (SSQCH_VERSION):" >&2
	echo "  curl -fsSL https://github.com/reverentgeek/sitesquatch/releases/download/v<version>/ssqch-installer.sh | sh" >&2
	echo "(Linux x86_64), or build it from a sitesquatch checkout with cargo install --path crates/ssqch --features avif." >&2
	echo "or set SSQCH_BIN to the binary's path." >&2
	exit 1
fi

exec "$bin" "$@" --root .
