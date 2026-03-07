# Repository Guidelines

## Project Structure & Module Organization
This repository builds the ReverentGeek site with Eleventy. Author-facing content lives in `src/site`: blog posts in `src/site/posts`, standalone pages in `src/site/pages`, shared templates in `src/site/_includes`, data files in `src/site/_data`, and static content such as images in `src/site/content/images`. Frontend assets live in `src/assets/css` and `src/assets/js`. Small build and content utilities live in `src/utils` and `scripts`. Generated output goes to `dist/` and should not be edited by hand.

## Build, Test, and Development Commands
Use Node `>=22.19.0` and prefer `pnpm` because the repo is pinned with `pnpm-lock.yaml`.

- `pnpm install`: install dependencies.
- `pnpm run serve`: clean `dist/`, watch CSS and JS, and start Eleventy in development mode.
- `pnpm run build`: produce a production build in `dist/`.
- `pnpm run lint`: run ESLint on JavaScript files.
- `pnpm run lint:markdown`: lint Markdown content under `src/`.
- `pnpm run post create "Post Title"`: scaffold a new post.

## Coding Style & Naming Conventions
JavaScript is ESM and follows the shared `eslint-config-reverentgeek` config from [eslint.config.js](/Users/davidneal/Projects/personal/blog/eslint.config.js). Match the existing style: tabs for indentation, double quotes in JS, and concise utility modules. Keep browser code in `src/assets/**/*.js` and Node-side helpers in `src/utils/**/*.js`. For content, use lowercase kebab-case filenames such as `my-new-post.md`; image galleries use numbered prefixes like `001-example.jpg`.

## Testing Guidelines
There is no automated unit test suite in this repository today. Treat `pnpm run build`, `pnpm run lint`, and `pnpm run lint:markdown` as the minimum verification set for changes. For content or template updates, also smoke-test the affected page with `pnpm run serve`. `pnpm run test:lighthouse` audits the live production site and is useful for release checks, not local-only validation.

## Commit & Pull Request Guidelines
Recent history uses short, imperative commit subjects such as `update dependencies`, `fix social media image metadata for posts`, and `revert back to standard google tag`. Keep commits focused and descriptive. Pull requests should summarize the change, note affected routes or content areas, link related issues, and include screenshots when layout, images, or metadata output changes.

## Content & Asset Notes
When updating galleries, place originals in `src/site/content/images/{folder}/orig`, then use `node src/utils/avatars.js list|convert|html [folder]` to generate derived assets and markup consistently.
