#!/usr/bin/env bash
# Production build without a Node toolchain for the CSS/JS: standalone Tailwind
# and esbuild binaries, then SiteSquatch (`ssqch`) for the site with
# ssqch.config.js. Fingerprinting the assets and pruning unused images still use
# Node (scripts/hash-assets.js and scripts/prune-images.js) until ssqch does them
# itself.
#
#   scripts/build-native.sh
#
# SSQCH_BIN   the ssqch binary (default: `ssqch` on PATH)
# TOOLS_DIR   where downloaded tools are kept (default: .cache/tools)
#
# Keep these versions in step with package.json / pnpm-lock.yaml.
set -euo pipefail

TAILWIND_VERSION=4.3.4
ESBUILD_VERSION=0.28.2
PRISM_VERSION=1.30.0

cd "$(dirname "$0")/.."
SSQCH_BIN=${SSQCH_BIN:-ssqch}
TOOLS_DIR=${TOOLS_DIR:-.cache/tools}

case "$(uname -s)-$(uname -m)" in
	Darwin-arm64) tw=macos-arm64 es=darwin-arm64 ;;
	Darwin-x86_64) tw=macos-x64 es=darwin-x64 ;;
	Linux-x86_64) tw=linux-x64 es=linux-x64 ;;
	Linux-aarch64 | Linux-arm64) tw=linux-arm64 es=linux-arm64 ;;
	*) echo "unsupported platform: $(uname -s)-$(uname -m)" >&2; exit 1 ;;
esac

tailwind="$TOOLS_DIR/tailwindcss-$TAILWIND_VERSION"
esbuild="$TOOLS_DIR/esbuild-$ESBUILD_VERSION"
mkdir -p "$TOOLS_DIR"

if [ ! -x "$tailwind" ]; then
	echo "Downloading tailwindcss $TAILWIND_VERSION..."
	curl -fsSL -o "$tailwind.part" "https://github.com/tailwindlabs/tailwindcss/releases/download/v$TAILWIND_VERSION/tailwindcss-$tw"
	chmod +x "$tailwind.part" && mv "$tailwind.part" "$tailwind"
fi

if [ ! -x "$esbuild" ]; then
	echo "Downloading esbuild $ESBUILD_VERSION..."
	tmp=$(mktemp -d)
	curl -fsSL "https://registry.npmjs.org/@esbuild/$es/-/$es-$ESBUILD_VERSION.tgz" | tar xz -C "$tmp"
	mv "$tmp/package/bin/esbuild" "$esbuild" && rm -rf "$tmp"
fi

# The CSS and JS import Prism from node_modules. Use the installed copy if
# there is one (after `pnpm install`), otherwise fetch just that package.
if [ ! -f node_modules/prismjs/package.json ]; then
	echo "Downloading prismjs $PRISM_VERSION..."
	mkdir -p node_modules/prismjs
	curl -fsSL "https://registry.npmjs.org/prismjs/-/prismjs-$PRISM_VERSION.tgz" | tar xz -C node_modules/prismjs --strip-components 1
fi

# Same as scripts/clean.js: empty dist/ but keep the image cache.
mkdir -p dist
find dist -mindepth 1 -maxdepth 1 ! -name img ! -name optimized-images -exec rm -rf {} +
rm -f .asset-manifest.json
mkdir -p dist/assets

"$tailwind" -i src/assets/css/styles.css -o dist/assets/index.css --minify
"$esbuild" src/assets/js/index.js src/assets/js/prism.js --bundle --outdir=dist/assets --minify --log-level=warning
node scripts/hash-assets.js
"$SSQCH_BIN" build --root . --env production
node scripts/prune-images.js
