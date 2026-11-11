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

## Website effectiveness

Goals: **#1 illustration commissions** (avatars, stickers, book illustration, logos, social media, event illustration) and **#2 DevRel work** (full- or part-time roles and contracts). Speaking, software projects and content support these goals rather than being goals of their own. No email list for now. The reasoning, current-state audit and section-by-section page outlines are in [`WEBSITE-PLAN.md`](WEBSITE-PLAN.md); item numbers below match its "Work items." Listed in the suggested order.

### First: the books

- [ ] **Lars Klint two-book case-study post** (plan item 1). A repeat-client story covering *Automate Everything, Notice Nothing* (<https://larsklint.shop/products/automate-everything-notice-nothing>) and *Microsoft Azure in Action* (Manning, 2025, <https://www.manning.com/books/microsoft-azure-in-action>). Open with his acknowledgement ("…somehow draws the joke I was trying to make rather than the one I actually made"), then how each project went, the process with sketch-to-final pairs, favorite pieces, links to both books, and a soft CTA to `/commissions/`. Tags `books` and `illustration`.
  - [ ] Photograph or screenshot the printed acknowledgements page.
  - [ ] Gather finished illustrations, sketches, covers and photos of the printed books into `src/site/content/images/<post-slug>/`.
  - [ ] Check the Manning agreement about reproducing the *Azure in Action* illustrations.
  - [x] Copy Lars' LinkedIn launch post ("158 pages, illustrated throughout by David Neal…"; full text in the plan).
  - [ ] Save the LinkedIn post's URL and a trimmed screenshot for the case study.
  - [ ] Ask Lars for permission to quote the acknowledgement and use the covers, and optionally for a direct testimonial (the questions are in the plan).
- [ ] **Feature *Developer Relations Activity Patterns* as illustration work too.** It's currently framed only as a DevRel book in `announcing-devrel-activity-patterns-book.md` and `developer-relations-activity-patterns.md`. Ask co-authors for a quote about the illustrations.
- [ ] **Use the book's first review.** Lindsay Brunner's five-star Amazon review, "Basically the encyclopedia of DevRel" (2026-11-05; full text in the plan under "The DevRel book's first review"). Add a short "What readers say" excerpt with an Amazon link to `developer-relations-activity-patterns.md`, and use it on `/devrel/`. Optionally message Lindsay to ask whether she minds being quoted.

### Illustration commissions

- [ ] **Create `/commissions/`** (plan item 2): hero about the buyer's outcome with a **Start a commission** button; featured books; a "what I draw" card per category linked to its gallery; why work with me; testimonials; a three-step process (tell me what you need → I sketch, you react → get your files); details as benefits (turnaround, revisions, formats, usage rights, maybe "starting at" prices); final CTA. Avatars keep the Shopify buy button; everything else is an email inquiry with a prefilled subject and checklist.
- [ ] **Redirect `/shop/#commission` references** to `/commissions/` (`avatars.html:10`, `shop.md:10`, `shop.md:16`) and slim `shop.md` down to merch plus a pointer (plan item 9).
- [ ] **Portfolio:** add a **Book Illustration** tile first, and point "Commission a custom illustration!" at `/commissions/` instead of `mailto:` (`portfolio.md`).
- [ ] **Gallery CTAs:** add a commission CTA at the top *and* bottom of `avatars.html`, `illustrations.html`, `sketch-notes.html`, `tech-humor.html` and `doodles.html`. Add testimonials near the top of `avatars.html`.
- [ ] **Avatar `alt` text:** replace the generic `alt="avatar illustration"` in `avatars.html` over time.
- [ ] **No-nav commission landing page for social bios** (plan item 8) using `layouts/no-nav.edge`, at an easy URL like `/draw/`. Update the Instagram, Bluesky and X bios.
- [ ] **Post-purchase message** (plan item 11): customize the Shopify order confirmation and status page with what happens next, what to send, turnaround and "tag @reverentgeek when you use it."

### Homepage, navigation and consistency

- [ ] **Homepage hero** (plan item 3, `src/site/index.edge`): say what you do *for people*, with two primary buttons, **Hire me to illustrate** → `/commissions/` and **Hire me for DevRel** → `/devrel/`. Caption the avatar as a product sample ("I drew this. I can draw you, too.").
- [ ] **Homepage "Books" strip** between the hero and the post list on page 1, with all three covers.
- [ ] **Navigation** (`site.json`): Home · About · Illustration · DevRel · Portfolio · Shop. Remove Speaking from the nav.
- [ ] **Footer** (`partials/footer.edge`): add Speaking, Bio & headshots and Résumé links.
- [ ] **One description everywhere:** `site.json` `description` and `feed.subtitle` currently disagree. Pick one line that mentions illustration and DevRel, and use it in the footer tagline, `bio.md`, `about.md` and social bios.
- [ ] **Links page** (`links.html`): commissions (or `/draw/`) first, then DevRel, blog and books, with the rest under "More."

### DevRel career

- [ ] **Create `/devrel/`** (plan item 4): hero with **Let's talk** and **Résumé**; the problem (DevRel is hard to plan and prove); what I do; authority (10+ years in DevRel at MongoDB, Plaid, Slack, Asana and Okta; co-author of *DevRel Activity Patterns*, with the "Basically the encyclopedia of DevRel" Amazon review excerpt, attributed to the book rather than to you; 170+ talks); the illustrator advantage (e.g., *An Illustrated Guide to OAuth and OpenID Connect*); testimonials; curated proof from `devrel-portfolio.md`; final CTA.
- [ ] **Decide how openly to signal availability** on `/devrel/` and About (the current employer is named on About).
- [ ] **Restructure `about.md`** (plan item 6): story first, then the "I believe people want to do their best work" philosophy given visual weight, two paths (commissions and DevRel), the books, a real photo next to the avatar, and the link directory moved to the bottom or `/links/`.
- [ ] **Speaking page:** keep the URL. Replace "*No speaking engagements currently scheduled.*" with a summary ("170+ talks, including DevSum, CodeMash, KCDC…") and link it from `/devrel/`.
- [ ] **Ask one or two DevRel colleagues** for endorsements that mention outcomes.

### Posts and measurement

- [ ] **GA4 click events** (plan item 13) for commission CTAs, the Shopify buy button, inquiry `mailto:` links, `/devrel/` "Let's talk" and résumé, and post callout variants. Use a delegated handler in `src/assets/js/index.js` keyed on `data-cta` attributes, then `pnpm run lint`. Ship this before or with the CTA changes, and record a baseline (commissions and inquiries per month) to check again 60–90 days later.
- [ ] **End-of-post callout by tag** (plan item 7, `layouts/post.edge:37`, `components/support.edge`): `illustration`/`books` → commissions; `devrel`/`speaking`/`conferences`/`leadership`/`community`/`career` → `/devrel/`; everything else → Ko-fi. Pass the tags in as a prop (components have isolated scope). Tag older drawing posts with `illustration` where it's missing.

### Ongoing

- [ ] **Collect testimonials** (plan item 12): Lars, the *DevRel Activity Patterns* co-authors, five to ten past avatar and logo clients, and DevRel colleagues. Ask every new commission client for a sentence at delivery, and get permission for name and image.
- [ ] **Revisit an email list later.** RSS-to-email automation (e.g., Buttondown reading `feed.xml`) is the low-effort option if it's ever wanted.

## Output differences from the old Eleventy build

Nothing has to match the old build anymore. The sitesquatch TODO fixes the ones that are wrong (Markdown leaving `"` unescaped, the minifier not shortening attribute values). Kept on purpose:

- Animated GIFs stay animated; Eleventy kept only the first frame.
- SVGs are served as SVGs instead of rasterized AVIF/WebP (`/portfolio/`).
- `feed.xml` keeps `<br />` and `<img ... />` as written.
