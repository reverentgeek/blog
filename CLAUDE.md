# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Behavioral Rules

- Do not automatically commit changes to the repository.
- Always run `pnpm run lint` after adding or updating JavaScript files, and fix any errors.

## Build & Development Commands

This is an Eleventy 4 static site. Use `pnpm` (pinned in `packageManager`) and Node >= 24.

| Task                         | Command                                              |
| ---------------------------- | ---------------------------------------------------- |
| Install dependencies         | `pnpm install`                                       |
| Dev server (watch mode)      | `pnpm run serve`                                     |
| Production build             | `pnpm run build`                                     |
| Lint JS                      | `pnpm run lint`                                      |
| Lint Markdown                | `pnpm run lint:markdown`                             |
| Smoke tests (builds first)   | `pnpm run test:smoke`                                |
| Run a single test file       | `pnpm run build && node --test test/smoke.test.js`   |
| Scaffold a new post          | `pnpm run post create "Post Title"`                  |
| Lighthouse audit (prod site) | `pnpm run test:lighthouse`                           |

The build pipeline runs sequentially: clean → PostCSS → esbuild → Eleventy → prune stale images. The dev server (`serve`) runs CSS, JS, and Eleventy watchers in parallel.

## Architecture

### Templating

Templates use **Edge.js** (via `eleventy-plugin-edgejs`), not Nunjucks or Liquid. Edge.js syntax: `@if`/`@each`/`@include` directives, `{{ }}` for escaped output, `{{{ }}}` for raw HTML, `{{-- --}}` for comments.

### Content Model

- **Posts** (`src/site/posts/*.md`): Directory data in `posts.json` sets `layout: layouts/post.edge`, `tags: posts`, and permalink `/{{ page.fileSlug }}/`. Front matter provides `id`, `title`, `feature_image`, `description`, `date`, `slug`.
- **Pages** (`src/site/pages/*.md` and `*.html`): Same pattern via `pages.json` with `layout: layouts/page.edge` and `tags: page`.
- **Global data** (`src/site/_data/`): `site.json` for site-wide config; `heroImage.js` generates responsive hero image metadata at build time.

### Layout Hierarchy

`layouts/default.edge` is the base layout (SEO meta, Open Graph, analytics, header/footer). Post and page layouts extend it. Partials live in `_includes/partials/`, reusable components in `_includes/components/`.

### Image Pipeline

All `<img>` tags in templates are automatically processed by `@11ty/eleventy-img` transform plugin (configured in `src/utils/eleventy/image-transform-options.js`). Output formats: AVIF, WebP, and original fallback at widths 300–1500px. Processed images write to `dist/img/` and are cached between Netlify deploys via `netlify-plugin-cache`. After build, `scripts/prune-images.js` removes any derivatives not referenced in HTML/XML output.

### CSS & JS

- **CSS**: `src/assets/css/styles.css` → PostCSS (import, nesting, Tailwind v4, autoprefixer) → `dist/assets/index.css`
- **JS**: `src/assets/js/index.js` (lightbox) and `src/assets/js/prism.js` (syntax highlighting with custom Edge.js language) → esbuild → `dist/assets/`
- Browser JS lives in `src/assets/js/`; Node-side helpers in `src/utils/`

### Custom Eleventy Config

Filters and helpers are modularized under `src/utils/eleventy/`:
- `register-filters.js` — date formatting, reading time, CSS minification, sitemap safety, RSS re-exports
- `social-image-filter.js` — generates 1200px PNG for Open Graph images with in-memory cache
- `image-transform-options.js` — shared config for the image transform plugin

HTML minification (`src/utils/transforms/html-min-transform.js`) runs only in production.

## Coding Style

- ESM (`"type": "module"`) throughout; tabs for indentation, double quotes in JS
- ESLint config: `eslint-config-reverentgeek` with `node-esm` rules for most files, `browser` rules for `src/assets/`
- Content filenames: lowercase kebab-case (`my-new-post.md`); gallery images use numbered prefixes (`001-example.jpg`)

## Deployment

Hosted on Netlify. Config in `netlify.toml`. Build command: `pnpm run build`, publish dir: `dist/`. Image cache preserved between deploys.
