#!/usr/bin/env bash
# Run SiteSquatch (`ssqch`) against this site, using ssqch.config.js.
#
#   scripts/ssqch.sh build --env production
#   scripts/ssqch.sh serve
#
# Finds the binary in this order:
#   1. $SSQCH_BIN
#   2. node_modules/.bin/ssqch (the `ssqch` dev dependency, the version package.json pins)
#   3. `ssqch` on PATH
#   4. ../ssqch/target/release/ssqch (a local checkout built with cargo)
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -n "${SSQCH_BIN:-}" ]; then
	bin=$SSQCH_BIN
elif [ -x node_modules/.bin/ssqch ]; then
	bin=node_modules/.bin/ssqch
elif command -v ssqch >/dev/null 2>&1; then
	bin=ssqch
elif [ -x ../ssqch/target/release/ssqch ]; then
	bin=../ssqch/target/release/ssqch
else
	echo "ssqch not found. Run pnpm install (ssqch is a dev dependency), or set SSQCH_BIN to the binary's path." >&2
	exit 1
fi

exec "$bin" "$@" --root .
