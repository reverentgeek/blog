# TODO

Leftovers from moving the build from Eleventy to SiteSquatch (`ssqch`), in the order they can happen. Items marked **Needs ssqch:** wait on a change in the sitesquatch repository, listed in its `TODO.md`. When one lands there, tick it in both lists.

ssqch no longer has any Eleventy compatibility: no Eleventy names, APIs, module aliases or `.eleventy.js`. The blog uses ssqch's own config and names. Blog *content* about Eleventy (the posts, their URLs, `llms.txt` entries, and the smoke tests that check those posts) stays as it is.

## Step 1: a native `ssqch.config.js` (done)

Done alongside "Remove Eleventy" in the sitesquatch TODO. The build output is the same as before, apart from sitemap `lastmod` dates for the templates that were edited (`index.edge`, `topics/topic.edge`); `pnpm test` and `pnpm run lint` pass.

- [x] `ssqch.config.js` uses `defineConfig` with `ssqch/image`, `ssqch/rss` and `ssqch/minify`. `.eleventy.js` and `src/utils/transforms/html-min-transform.js` are gone (minifying is `minifyPlugin()`), and the helpers moved to `src/utils/site/` (`filters.js`, `collections.js`, `image-options.js`, `social-image.js`), exporting objects instead of registering on a config.
- [x] Front matter is `computed` and `excludeFromCollections`; image attributes are `ssqch:widths` and `ssqch:ignore` (including `pages/shop.md`). There were no `*.11tydata.*` files.
- [x] No `ELEVENTY_ENV`: `build:site` passes `--env production`, and `serve` defaults to development.
- [x] `heroImage.js` and the social image filter use `image()` from `ssqch/image`. The sharp options and `transform` are gone. ssqch ignored them before too, so the Display P3 photos look the same as in the previous ssqch builds: slightly washed out until Step 3. Converting those 40 source files to sRGB once would fix that sooner.
- [x] Removed `@11ty/eleventy`, `@11ty/eleventy-img`, `@11ty/eleventy-plugin-rss`, `eleventy-plugin-edgejs`, `eleventy-plugin-broken-links` and `html-minifier-terser`, and their `pnpm-workspace.yaml` entries. `netlify-plugin-cache` stays.
- [x] ESLint allows the `ssqch` modules (`allowModules` in `eslint.config.js`), since they're built into the binary.
- [x] Eleventy wording removed from `package.json`, template comments and `scripts/hash-assets.js`; `README.md`, `CLAUDE.md` and `RECOMMENDATIONS.md` updated.
- [x] The deploy builds `-p ssqch --features avif`, and `scripts/build-native.sh` runs `hash-assets.js` and `prune-images.js` around the site build (checked locally, smoke tests pass).
- [x] The deploy is pinned: it installs the prebuilt sitesquatch release in `SSQCH_VERSION` (`0.2.1`) instead of compiling a pinned commit.
- [ ] Try live reload in `pnpm run serve` (template and CSS edits). The server starts and serves pages with the native config.

## Step 2: back to Netlify builds

**Needs ssqch:** "Netlify first" in the sitesquatch TODO: a Linux x86_64 release binary and an install script. Netlify has Node, so `pnpm run build` works there as it does locally, fingerprinting and image pruning included. Nothing else from ssqch is needed.

- [x] `netlify.toml`'s build command installs the pinned ssqch release (`SSQCH_VERSION`), runs `pnpm run build`, then `node --test test/smoke.test.js`, so a failing smoke test stops the deploy.
- [x] Cache `dist/img` and `.cache/ssqch` with `netlify-plugin-cache`.
- [ ] Check the cold-cache build time (about 3,200 image derivatives with AVIF) against Netlify's build timeout. The sitesquatch TODO has a matching item.
- [ ] Turn Netlify's builds back on, then delete `.github/workflows/deploy.yml` and the `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` repository secrets (and `SSQCH_TOKEN`, which the deploy no longer uses, if it was ever set).
- [ ] Delete `scripts/build-native.sh` (only the GitHub deploy uses it). That also settles two old items: there's one CSS pipeline (PostCSS and esbuild from `package.json`), and no Tailwind version pin to keep in sync with `package.json`.
- [x] Update `CLAUDE.md` for the Netlify build, and `scripts/ssqch.sh`'s "not found" hint to point at the install script.

## Step 3: ssqch features as they land

- [ ] **Needs ssqch:** color profile conversion. Check the 40 Display P3 JPEGs under `src/site/content/images` (including `rg-banner-2023.jpg`, the WordCamp Asia 2025 illustrations and the MVP heart photos), and the PNGs.
- [ ] **Needs ssqch:** built-in asset fingerprinting. Then remove `scripts/hash-assets.js`, `.asset-manifest.json`, `src/site/_data/assets.js` and the `build:hash` script, and update the "Assets" section of `CLAUDE.md`.
- [ ] **Needs ssqch:** built-in link checker. Turn it on for production builds. Use `lychee` (locally or in CI) for external links if those matter.
- [ ] Compare AVIF quality. ssqch encodes with ravif at speed 8; the old Eleventy build used libaom at effort 4. Total sizes are about the same, but quality hasn't been compared. Tune `avifSpeed` / `avifQuality` if needed, keeping Netlify's build time in mind.

## Output differences from the old Eleventy build

Nothing has to match the old build anymore. The sitesquatch TODO fixes the ones that are wrong (Markdown leaving `"` unescaped, the minifier not shortening attribute values). Kept on purpose:

- Animated GIFs stay animated; Eleventy kept only the first frame.
- SVGs are served as SVGs instead of rasterized AVIF/WebP (`/portfolio/`).
- `feed.xml` keeps `<br />` and `<img ... />` as written.
