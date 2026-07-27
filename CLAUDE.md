# CLAUDE.md

## Behavioral Rules

- Do not automatically commit changes to the repository.
- Always run `pnpm run lint` after adding or updating JavaScript files, and fix any errors.

## Commands

Standard scripts are in `package.json`. The non-obvious ones:

| Task                         | Command                                            |
| ---------------------------- | -------------------------------------------------- |
| Scaffold a new post          | `pnpm run post create "Post Title"`                |
| Run a single test file       | `pnpm run build && node --test test/smoke.test.js` |

Smoke tests need a build first. `pnpm run test:lighthouse` audits the **production** site; use `test:lighthouse:local` for a local build.

## Templating

Templates use **Edge.js** (via `eleventy-plugin-edgejs`), not Nunjucks or Liquid. Edge.js syntax: `@if`/`@each`/`@include` directives, `{{ }}` for escaped output, `{{{ }}}` for raw HTML, `{{-- --}}` for comments.

## Image Pipeline

All `<img>` tags in templates are automatically processed by `@11ty/eleventy-img` (config: `src/utils/eleventy/image-transform-options.js`) — don't hand-write `<picture>` markup. After build, `scripts/prune-images.js` deletes any derivatives not referenced in HTML/XML output.

## Coding Style

- ESM (`"type": "module"`) throughout; tabs for indentation, double quotes in JS
- Browser JS lives in `src/assets/js/`; Node-side helpers in `src/utils/`
- Content filenames: lowercase kebab-case (`my-new-post.md`); gallery images use numbered prefixes (`001-example.jpg`)
