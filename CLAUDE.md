# CLAUDE.md

## Behavioral Rules

- Do not automatically commit changes to the repository.
- Always run `pnpm run lint` after adding or updating JavaScript files, and fix any errors.

## Commands

Standard scripts are in `package.json`. The non-obvious ones:

| Task                | Command                             |
| ------------------- | ----------------------------------- |
| Scaffold a new post | `pnpm run post create "Post Title"` |
| Scaffold a new page | `pnpm run page create "Page Title"` |

## Build

The site is built by [SiteSquatch](https://github.com/reverentgeek/sitesquatch) (`ssqch`). `ssqch.config.js` is the site config (`defineConfig` from `ssqch`): directories, passthrough copies, filters (`src/utils/site/filters.js`), collections (`src/utils/site/collections.js`) and the built-in `ssqch/rss`, `ssqch/image` and `ssqch/minify` plugins. It runs on Node (22.18 or newer), and `ssqch/*` imports come from the `ssqch` package in `node_modules`. `ssqch` is a dev dependency, pinned to an exact version in `package.json`; bump it on purpose (`pnpm add -D ssqch@<version>`, and the version in `pnpm-workspace.yaml`'s `minimumReleaseAgeExclude` for a release less than a day old) after a local `pnpm test` passes. `scripts/ssqch.sh` finds it (`$SSQCH_BIN`, then `node_modules/.bin/ssqch`, then `ssqch` on PATH); to build with a local checkout of ssqch, set `SSQCH_BIN` to its `packages/ssqch/bin/ssqch.ts`. Netlify builds and deploys the site on every push to `main` (`netlify.toml`): its `pnpm install` brings `ssqch`, then it runs `pnpm run build` and the smoke tests, and caches `.cache/ssqch` between builds.

`pnpm test` builds the site, then runs the smoke tests in `test/smoke.test.js`. `pnpm run test:lighthouse` audits the **production** site; use `test:lighthouse:local` for a local build.

## Templating

Templates use **Edge.js** (built into ssqch), not Nunjucks or Liquid. Edge.js syntax: `@if`/`@each`/`@include` directives, `{{ }}` for escaped output, `{{{ }}}` for raw HTML, `{{-- --}}` for comments.

Code fences are highlighted when the site builds (`markdown: { highlight: { css: false } }` in `ssqch.config.js`); the colors are the `--hl-*` properties on `pre.highlight` in `src/assets/css/styles.css`. There's no Prism. Every post's front matter is checked by the `posts` schema in `ssqch.config.js`: a missing `description` or a `feature_image` file that isn't there fails the build, and an unknown key is a warning. `sitemap.xml` comes from `sitemapPlugin()`.

The `<head>` SEO and social metadata lives in `src/site/_includes/partials/head.edge`, shared by every layout. Edit it there, not in individual layouts.

## Assets

Production builds fingerprint CSS and JS: the `ssqch/assets` plugin (in `ssqch.config.js`) renames `dist/assets/index.css`, `index.js` and `pco.js` (a passthrough copy) to content-hashed names and rewrites every `href` and `src` that points at them, and the `import` in `src/site/pages/pco.md`'s inline module script. In templates, link the plain paths (`/assets/index.css`); `ssqch serve` leaves them plain.

## Image Pipeline

All `<img>` tags in templates are automatically processed by the `ssqch/image` plugin (options: `src/utils/site/image-options.js`). Per-image overrides: `ssqch:widths="300,600"`, `ssqch:ignore`, and `ssqch:preload` for the homepage banner (it adds the `<link rel="preload">` to `<head>`). Don't hand-write `<picture>` markup. For an image URL outside an `<img>` (`og:image`, JSON-LD, the feed), use ssqch's `imageUrl(path, { width, format })` or, for the feed's content, `feedHtml()`, never the source path: originals in `src/site/content/images/` aren't published, and the link checker fails the build on one. Images are encoded into `.cache/ssqch/img` and linked into `dist/img`, so `dist/` can be deleted freely. Production builds delete derivatives that no page, feed or `image()` call used (`prune` on the plugin), and `leaveNoTrace` deletes pages and copies an earlier build wrote that this one didn't.

For avatar galleries, put originals in `src/site/content/images/{folder}/orig`, then run `node src/utils/avatars.js list|convert|html [folder]` to generate derived images and markup.

## Coding Style

- Content filenames: lowercase kebab-case (`my-new-post.md`); gallery images use numbered prefixes (`001-example.jpg`)
- Commit subjects are short and imperative (`update dependencies`, `fix social media image metadata for posts`)
