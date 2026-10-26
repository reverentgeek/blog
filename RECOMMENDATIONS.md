# Project Improvement Checklist

## High Priority

- [ ] Track Eleventy stable release. The project depends on `@11ty/eleventy` 4.0.0-alpha.10 (a pre-release); the latest stable is 3.1.7. Pin to a stable version once Eleventy 4 ships to avoid surprise breakage from alpha churn.
- [x] Remove unused `@11ty/eleventy-navigation` plugin. It has been removed from `.eleventy.js` and `package.json`.
- [x] Remove dead filters: `cssmin` and `getReadingTime`. The unused filters were removed from `src/utils/eleventy/register-filters.js`, and the unused `clean-css` dependency was removed from `package.json`.
- [x] Keep non-page files out of the sitemap. `404.html`, `.htaccess`, and `robots.txt` were listed in `sitemap.xml`; they are now excluded with `eleventyExcludeFromCollections`, and a smoke test guards against regressions.

## Medium Priority

- [x] Replace `npm-run-all` with `npm-run-all2`. The project now uses the maintained fork in `package.json`.
- [x] Audit PostCSS plugins for Tailwind v4 redundancy. `autoprefixer` and `postcss-nesting` were removed from `postcss.config.js` and `package.json`, and the build still passes.
- [x] Remove vestigial PurgeCSS comments. The old `/* purgecss start ignore */` / `/* purgecss end ignore */` markers were removed from `src/assets/css/styles.css`.
- [x] Clean up Ghost CMS remnants in `site.json`. The unused `ghost_head`, `ghost_foot`, `brand`, and `facebook` fields were removed.
- [x] Deduplicate navigation social links. The desktop and mobile social link blocks now use a shared `components/social-links.edge` partial with data from `site.json`.
- [x] Limit feed entry count. `feed.edge` now emits the 30 most recent posts instead of the full collection.
- [x] Add a `<link rel="canonical">` tag to the default layout. The canonical tag is now emitted from `src/site/_includes/layouts/default.edge`.
- [x] Replace the checkbox-based mobile menu toggle with an accessible button pattern. The mobile nav now uses a real button with `aria-expanded` and `aria-controls`, driven by small JS in `src/assets/js/index.js`.
- [x] Share `<head>` metadata across layouts. The SEO, Open Graph, Twitter, and JSON-LD markup now lives in `src/site/_includes/partials/head.edge`. Before this, `no-nav.edge` had drifted (no canonical link, different social image handling), and the unused `stream.edge` layout was deleted.
- [x] Resolve the conflicting `/assets/*` cache rules. `_headers` set a 1-hour cache with a stale "not fingerprinted" comment while `netlify.toml` set `immutable`. The `_headers` rule was removed; `netlify.toml` is the single source.
- [x] Serve the feed with the correct content type. `feed.xml` is Atom, so it is now served and linked as `application/atom+xml` instead of `application/rss+xml`.
- [x] Modernize security headers. `Feature-Policy` became `Permissions-Policy`, deprecated `X-Xss-Protection` was removed, and `Referrer-Policy` is now `strict-origin-when-cross-origin`.
- [x] Give every page a unique title and description. Paginated home pages are titled "Posts, Page N" with a matching description, the Tech Humor, Doodles, and 31 Days of Inspiration pages have their own descriptions, and a smoke test checks that no two pages share a `<title>`.
- [x] Remove duplicate content. `/samsara/` and `/bunny/` were word-for-word copies of their blog posts; the pages were deleted and both URLs now 301 redirect to the posts.
- [ ] Add a Content-Security-Policy. Start with `Content-Security-Policy-Report-Only` and check the browser console on each page type (home, post with comments, YouTube and Twitter embeds, gallery, `/pco/`), since gtag.js, giscus, and inline scripts make a strict policy easy to get wrong.

## Low Priority

- [x] Add content validation for front matter and required assets. Smoke tests now check that every post has a `description` and that its `feature_image` file exists. Date formats are not validated yet.
- [ ] Review build-time image processing scope. The current build optimizes `1197` images; confirm every transformed image is necessary and exclude pages or image sets that do not benefit from responsive transforms.
- [ ] Document the expected author workflow more explicitly. `AGENTS.md` now points to `CLAUDE.md`, which covers scaffolding, assets, and avatar galleries, but a short human-facing checklist for adding posts, images, and galleries would still help.
- [x] Clean up redundant front matter in older posts. Removed `layout:` and `tags:` keys that duplicate `posts.json` defaults from 83 posts.
- [x] Remove or fill empty `feature_image` fields. Removed empty `feature_image:` from 29 posts and 13 pages.
- [x] Fill missing `description` fields. Added descriptions to 1 post and 10 pages that had empty or missing values.
- [x] Run 404 page image through the image pipeline. The image transform already processes `/content/images/404.jpg`; the built `404.html` has a responsive `srcset`.
- [x] Improve lightbox keyboard accessibility. The lightbox in `src/assets/js/index.js` is now a modal dialog (`role="dialog"`, `aria-modal`), makes the rest of the page `inert` while open, returns focus to the clicked image on close, and carries the thumbnail's alt text. Its buttons are no longer reachable with Tab while it is hidden.
- [ ] Consider loading giscus comments on request. The current IntersectionObserver approach in `post.edge` is good; a "Show comments" button would avoid loading the giscus script entirely unless the reader wants it.
- [x] Normalize `icon` path in `site.json`. The `icon` field is now the site-relative `/favicon.ico`.
- [x] Add JSON-LD structured data for blog posts. A `Article` JSON-LD block is now emitted in `default.edge` for all posts, with headline, description, image, dates, author, and publisher.
- [x] Consolidate `post.js` and `page.js` scaffolding utilities. Both were replaced by `src/utils/content.js`, which takes the content type as its first argument; `pnpm run post create` and `pnpm run page create` work as before.
- [x] Add `Sitemap` directive to `robots.txt`. `src/site/robots.edge` now includes `Sitemap: https://reverentgeek.com/sitemap.xml`.
- [x] Clean up `<head>` tags. Added `<meta charset="utf-8">` (pages relied on Netlify's HTTP header), set `og:locale` to `en_US`, and removed `shrink-to-fit=no`, unscoped `itemprop` tags, and `rel="publisher"`.
- [x] Remove `.htaccess`. Netlify ignores it, and it was showing up in the sitemap.
- [ ] Remove the stale `@11ty/eleventy@4.0.0-alpha.8` entry from `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`. The project is on alpha.10.

## Notes

- Completed: aligned Node 24 across `.nvmrc`, `package.json`, and `netlify.toml`.
- Completed: fixed Eleventy development environment detection so the broken-links plugin runs in local development.
- Completed: added smoke tests for the homepage, a post page, and `feed.xml`.
- Completed: moved generated image artifacts out of git history, added Netlify cache restore for `dist/img`, and pruned stale derivatives after build.
- Completed: replaced raw post feature images with the responsive Eleventy image pipeline.
- Completed: moved Eleventy-specific filter and image helper logic into `src/utils/eleventy/`.
- Completed: fixed the broken `THAT Conference` link in `src/site/pages/speaking.md`.
- Completed: replaced `npm-run-all` with `npm-run-all2` and removed redundant Tailwind v4 PostCSS plugins.
- Completed: added canonical URLs, capped feed entries, removed Ghost CMS remnants, deduplicated social links, and upgraded the mobile menu toggle to an accessible button pattern.
- Completed (2026-10-26): pointed `AGENTS.md` to `CLAUDE.md` and updated `CLAUDE.md`; fixed the sitemap, feed type, cache, and security headers; shared `<head>` metadata across layouts; fixed duplicate titles and content; improved lightbox accessibility; expanded smoke tests from 3 to 6; merged the scaffolding scripts. All verified on the live site.
