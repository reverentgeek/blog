# ReverentGeek Blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/34284d7b-11e9-4ae0-81a6-eac37da2b351/deploy-status)](https://app.netlify.com/sites/reverentgeek/deploys)

Built with [Eleventy](https://www.11ty.io). Deployed to [Netlify](https://www.netlify.com/).

## Creating a New Post

```sh
npm run post create "Title of Super-Awesome Post"
```

## Updating a Photo Gallery

Copy the original image(s) to `src/site/content/images/{folder}/orig`.

```sh
node src/utils/avatars.js convert [folder]
node src/utils/avatars.js html [folder]
```

## Copyright & License

Copyright (c) 2010-2022 David Neal - Released under the [MIT license](LICENSE).
