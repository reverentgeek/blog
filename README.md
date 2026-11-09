# ReverentGeek Blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/34284d7b-11e9-4ae0-81a6-eac37da2b351/deploy-status)](https://app.netlify.com/sites/reverentgeek/deploys)

Built with [SiteSquatch](https://github.com/reverentgeek/sitesquatch) (`ssqch`), configured by `ssqch.config.js`. Deployed to [Netlify](https://www.netlify.com/).

## Building

Install `ssqch` (`cargo install --path crates/ssqch --features avif` from a sitesquatch checkout), or build it in `../ssqch`, or set `SSQCH_BIN` to its path. Then:

```sh
pnpm install
pnpm run build   # production build to dist/
pnpm run serve   # dev server with live reload on http://localhost:8080
pnpm test        # build, then smoke tests
```

## Creating a New Post or Page

```sh
# Blog post
pnpm post create "Title of Super-Awesome Post"

# New page
pnpm page create "Title of Super-Awesome Page"
```

## Updating a Photo Gallery

Copy the original image(s) to `src/site/content/images/{folder}/orig`.

```sh
node src/utils/avatars.js list [folder]
node src/utils/avatars.js convert [folder]
node src/utils/avatars.js html [folder]
```

## Copyright & License

Copyright (c) 2010-2026 David Neal - Released under the [MIT license](LICENSE).
