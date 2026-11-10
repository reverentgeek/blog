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
- [x] The deploy is pinned: it installs the prebuilt sitesquatch release in `SSQCH_VERSION` (`0.2.5`) instead of compiling a pinned commit.
- [x] Try live reload in `pnpm run serve`: post and CSS edits rebuild and reload (checked 2026-11-08).

## Step 2: back to Netlify builds

**Needs ssqch:** "Netlify first" in the sitesquatch TODO: a Linux x86_64 release binary and an install script. Netlify has Node, so `pnpm run build` works there as it does locally, fingerprinting and image pruning included. Nothing else from ssqch is needed.

- [x] `netlify.toml`'s build command installs the pinned ssqch release (`SSQCH_VERSION`), runs `pnpm run build`, then `node --test test/smoke.test.js`, so a failing smoke test stops the deploy.
- [x] Cache `dist/img` and `.cache/ssqch` with `netlify-plugin-cache`.
- [x] Check the cold-cache build time against Netlify's build timeout: the first Netlify build (2026-11-08, deploy `6af12456`) took 259 s and published fine.
- [x] Netlify's builds are back on, and `.github/workflows/deploy.yml` is deleted.
- [x] Delete the `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` repository secrets (and `SSQCH_TOKEN`, if it was ever set), and revoke the personal access token behind `NETLIFY_AUTH_TOKEN` in Netlify.
- [x] Delete `scripts/build-native.sh` (only the GitHub deploy used it). That also settles two old items: there's one CSS pipeline (PostCSS and esbuild from `package.json`), and no Tailwind version pin to keep in sync with `package.json`.
- [x] Update `CLAUDE.md` for the Netlify build, and `scripts/ssqch.sh`'s "not found" hint to point at the install script.

## Step 3: ssqch features as they land

- [x] **Needs ssqch:** color profile conversion, in ssqch 0.2.2. Display P3 and other non-sRGB images are converted to sRGB (39 of the build's 737 source images).
- [x] The 4 HDR iPhone photos in `src/site/content/images/heavy-duty-roller-case-for-helix-stadium-xl/` are converted to sRGB (`sips -m ".../sRGB Profile.icc" -s formatOptions 90`), since ssqch can't convert their HDR profiles. Do the same for future HDR photos; ssqch warns about them.
- [x] **Needs ssqch:** built-in asset fingerprinting, in ssqch 0.2.3 (`ssqch/assets`). `ssqch.config.js` lists `/assets/index.css`, `index.js` and `prism.js`; the layouts link plain paths; `scripts/hash-assets.js`, `src/site/_data/assets.js` and the `build:hash` script are gone.
- [x] **Needs ssqch:** built-in link checker, in ssqch 0.2.5 (`linksPlugin()` in `ssqch.config.js`). The 413 broken gallery links (full-size originals under `/content/images/`) are fixed by 0.2.5 pointing links to local images at a generated copy: 17,423 links checked, 0 broken. Production builds now fail on a broken link.
- [x] Compare AVIF quality. Measured 2026-11-09 on 14 of the blog's images at 900 px (photos, sketch notes, avatars), with SSIM against the source (distortion = 1 - SSIM, lower is better):

  | Encoder | Speed | Quality | Size | Distortion |
  | --- | --- | --- | --- | --- |
  | ravif (now) | 8 | 50 | 409 KB | 0.0148 |
  | ravif | 4 | 50 | 357 KB | 0.0128 |
  | ravif | 4 | 60 | 417 KB | 0.0087 |
  | ravif | 4 | 70 | 488 KB | 0.0064 |
  | libaom (the old build's encoder) | 4 | 50 | 368 KB | 0.0081 |

  The current AVIFs are about the size of libaom's at quality 50 but have about 1.8x the distortion. `avifSpeed: 4, avifQuality: 60` roughly matches libaom's quality for 2% more bytes, at about 2.4x the AVIF encode time. Only cold builds pay that (the image cache keeps the rest), but changing the settings re-encodes every AVIF once, and the first cold Netlify build took 259 s. Switched to `avifSpeed: 4, avifQuality: 60` in `src/utils/site/image-options.js`: a full local re-encode and build took 51 s. Watch the first Netlify build's time after it deploys.

- [x] Headings get `id`s from ssqch's Markdown (unreleased; GitHub-style, like `#testing-with-postman`). Nothing to change: the build's only difference is the new `id`s, and the link checker still finds 0 broken links. The hand-written `<a name>` and `<a id>` anchors keep working.
- [x] ssqch 0.4 drops the `url()` filter that `rssPlugin()` added (it returned its argument). `feed.edge` and `sitemap.edge` pass `post.url` and `page.url` to `absoluteUrl()` directly, which builds the same output with 0.3 too. Checked with `ssqch diff` against the 0.3.3 build: the only differences are the new heading `id`s.
- [x] ssqch 0.4 has a voice (a deadpan park ranger; the sitesquatch TODO has the list). The footer now says `Built with SiteSquatch. Allegedly.` Nothing else here changes: no script reads ssqch's output text, and the config doesn't set `clean` (now also `leaveNoTrace`). Checked 2026-11-10 with the unreleased build: `pnpm test` passes, and `ssqch diff` against a 0.3.3 build shows only the new heading `id`s.
- [x] `sitemap.xml` comes from `sitemapPlugin( { url: site.url } )` (ssqch 0.4): the same 150 URLs and dates as `sitemap.edge`, which is gone, with the `isSiteMapSafe` filter. `htmlDateString` stays (the head's JSON-LD uses it). `redirects.edge` stays.
- [x] A `posts` schema in `ssqch.config.js` (ssqch 0.4): all 140 posts pass. It replaced the "posts have a description and an existing feature image" smoke test.
- [x] Build-time highlighting (`markdown: { highlight: { css: false } }`, ssqch 0.4): Prism is gone (`prism.js`, the `prismjs` package, its esbuild entry and `assetsPlugin` entry), and `styles.css` colors the `hl-*` classes in Prism's Okaidia palette, so code looks as it did. A smoke test checks a post's `edge` fence is highlighted and loads no Prism.

## Site quality (blog only)

- [x] Fix the 2 Dependabot alerts: `minimatch` (moderate, GHSA-g3hv-75wg-m249) and `katex` (low, GHSA-238p-pmpm-9mq7). Both come in through eslint and markdownlint-cli, whose latest versions still ask for vulnerable ranges, so `pnpm-workspace.yaml` overrides them to `^11.0.1` and `^0.18.2`. Remove those overrides once upstream catches up.

- [x] Review the Lighthouse report. Rerun on the live homepage (mobile, Lighthouse 13.6, 2026-11-09, three runs; reports in `reports/live-*`, gitignored): Performance 93, 100, 100 (was 86), Largest Contentful Paint 1.9 s typical (was 4.3 s), Best Practices 100, SEO 100. Fixed the one Accessibility issue, the "Browse by topic" button's contrast (`.cta-button` from `blue-500`, 3.76:1, to `blue-600`, 5.26:1), so Accessibility is now 100. Left as they are, on purpose:
  - Render-blocking CSS (about 150-180 ms for the 8 KB stylesheet). Inlining critical CSS would add build complexity for a small gain.
  - Unused JavaScript (about 73 KB), all Google Analytics' `gtag.js`. It doesn't block anything (Total Blocking Time 0 ms); loading it later, a lighter analytics tool, or dropping it is a preference.
  - Image delivery (about 12 KB for one homepage AVIF served a bit larger than shown).

## Output differences from the old Eleventy build

Nothing has to match the old build anymore. The sitesquatch TODO fixes the ones that are wrong (Markdown leaving `"` unescaped, the minifier not shortening attribute values). Kept on purpose:

- Animated GIFs stay animated; Eleventy kept only the first frame.
- SVGs are served as SVGs instead of rasterized AVIF/WebP (`/portfolio/`).
- `feed.xml` keeps `<br />` and `<img ... />` as written.
