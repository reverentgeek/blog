# Project Improvement Checklist

## High Priority

- [ ] Track Eleventy stable release. The project depends on `@11ty/eleventy` 4.0.0-alpha.6 (a pre-release). Pin to a stable version once Eleventy 4 ships to avoid surprise breakage from alpha churn.
- [x] Remove unused `@11ty/eleventy-navigation` plugin. It has been removed from `.eleventy.js` and `package.json`.
- [x] Remove dead filters: `cssmin` and `getReadingTime`. The unused filters were removed from `src/utils/eleventy/register-filters.js`, and the unused `clean-css` dependency was removed from `package.json`.

## Medium Priority

- [x] Replace `npm-run-all` with `npm-run-all2`. The project now uses the maintained fork in `package.json`.
- [x] Audit PostCSS plugins for Tailwind v4 redundancy. `autoprefixer` and `postcss-nesting` were removed from `postcss.config.js` and `package.json`, and the build still passes.
- [x] Remove vestigial PurgeCSS comments. The old `/* purgecss start ignore */` / `/* purgecss end ignore */` markers were removed from `src/assets/css/styles.css`.
- [x] Clean up Ghost CMS remnants in `site.json`. The unused `ghost_head`, `ghost_foot`, `brand`, and `facebook` fields were removed.
- [x] Deduplicate navigation social links. The desktop and mobile social link blocks now use a shared `components/social-links.edge` partial with data from `site.json`.
- [x] Limit feed entry count. `feed.edge` now emits the 30 most recent posts instead of the full collection.
- [x] Add a `<link rel="canonical">` tag to the default layout. The canonical tag is now emitted from `src/site/_includes/layouts/default.edge`.
- [x] Replace the checkbox-based mobile menu toggle with an accessible button pattern. The mobile nav now uses a real button with `aria-expanded` and `aria-controls`, driven by small JS in `src/assets/js/index.js`.

## Low Priority

- [ ] Add content validation for front matter and required assets. This repo is content-heavy, so missing `feature_image`, bad dates, or malformed front matter are more likely than JavaScript regressions.
- [ ] Review build-time image processing scope. The current build optimized `1038` images in one run; confirm every transformed image is necessary and exclude pages or image sets that do not benefit from responsive transforms.
- [ ] Document the expected author workflow more explicitly. The new `AGENTS.md` covers the basics, but the repo would benefit from a short contributor checklist for adding posts, images, and galleries without breaking metadata or paths.
- [x] Clean up redundant front matter in older posts. Removed `layout:` and `tags:` keys that duplicate `posts.json` defaults from 83 posts.
- [x] Remove or fill empty `feature_image` fields. Removed empty `feature_image:` from 29 posts and 13 pages.
- [x] Fill missing `description` fields. Added descriptions to 1 post and 10 pages that had empty or missing values.
- [ ] Run 404 page image through the image pipeline. `/content/images/404.jpg` in `src/site/404.edge` is a plain `<img>` that bypasses responsive image transforms.
- [ ] Improve lightbox keyboard accessibility. The lightbox in `src/assets/js/index.js` does not trap focus, so keyboard users can tab behind the overlay. Adding a focus trap and restoring focus on close would improve accessibility.
- [ ] Consider lazy-loading Disqus based on user intent. The current IntersectionObserver approach in `post.edge` is good; a "Show comments" button would avoid loading the Disqus script entirely unless the reader wants it.
- [ ] Normalize `icon` path in `site.json`. The `icon` field uses a full absolute URL (`https://reverentgeek.com/favicon.ico`) while every other asset path is site-relative. This could cause mismatches if the site URL changes.
- [ ] Add JSON-LD structured data for blog posts. The default layout uses microdata (`itemprop`) but not JSON-LD, which is preferred by search engines. Adding a `Article` schema block with `datePublished`, `author`, and `description` would improve search result presentation.
- [ ] Consolidate `post.js` and `page.js` scaffolding utilities. These two files in `src/utils/` are nearly identical — they could share a common content-scaffolding function to reduce duplication.
- [ ] Add `Sitemap` directive to `robots.txt`. The current `src/site/robots.edge` does not include `Sitemap: https://reverentgeek.com/sitemap.xml`, which helps search engine crawlers discover it.

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
