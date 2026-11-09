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

The site is built by [SiteSquatch](https://github.com/reverentgeek/sitesquatch) (`ssqch`). `ssqch.config.js` is the site config (`defineConfig` from `ssqch`): directories, passthrough copies, filters (`src/utils/site/filters.js`), collections (`src/utils/site/collections.js`) and the built-in `ssqch/rss`, `ssqch/image` and `ssqch/minify` plugins. It runs on ssqch's embedded JavaScript engine, so `ssqch/*` imports come from the binary, not `node_modules`. `scripts/ssqch.sh` finds the binary (`$SSQCH_BIN`, then `ssqch` on PATH, then `../ssqch/target/release/ssqch`). The production deploy (`.github/workflows/deploy.yml`) installs the prebuilt `ssqch` release named by `SSQCH_VERSION` and runs `scripts/build-native.sh`.

`pnpm test` builds the site, then runs the smoke tests in `test/smoke.test.js`. `pnpm run test:lighthouse` audits the **production** site; use `test:lighthouse:local` for a local build.

## Templating

Templates use **Edge.js** (built into ssqch), not Nunjucks or Liquid. Edge.js syntax: `@if`/`@each`/`@include` directives, `{{ }}` for escaped output, `{{{ }}}` for raw HTML, `{{-- --}}` for comments.

The `<head>` SEO and social metadata lives in `src/site/_includes/partials/head.edge`, shared by every layout. Edit it there, not in individual layouts.

## Assets

Production builds fingerprint CSS and JS (`scripts/hash-assets.js` writes `.asset-manifest.json`). Reference them in templates with `{{ assets.css }}`, `{{ assets.js }}`, and `{{ assets.prism }}`, never hard-coded `/assets/index.css` paths. `pco.js` is the exception: it keeps a stable name because `src/site/pages/pco.md` imports it directly.

## Image Pipeline

All `<img>` tags in templates are automatically processed by the `ssqch/image` plugin (options: `src/utils/site/image-options.js`). Per-image overrides: `ssqch:widths="300,600"` and `ssqch:ignore`. Don't hand-write `<picture>` markup. After build, `scripts/prune-images.js` deletes any derivatives not referenced in HTML/XML output.

For avatar galleries, put originals in `src/site/content/images/{folder}/orig`, then run `node src/utils/avatars.js list|convert|html [folder]` to generate derived images and markup.

## Coding Style

- Content filenames: lowercase kebab-case (`my-new-post.md`); gallery images use numbered prefixes (`001-example.jpg`)
- Commit subjects are short and imperative (`update dependencies`, `fix social media image metadata for posts`)
