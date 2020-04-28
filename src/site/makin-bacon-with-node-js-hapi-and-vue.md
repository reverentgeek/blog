---
title: "Makin' Bacon with Node.js, Hapi, and Vue"
feature_image: /content/images/2018/10/makin-bacon-article.png
description: "I recently created a new demo for my Node.js Crash Course talk that I've given at several conferences. This application is a \"bacon ipsum\"…"
date: 2018-07-18
tags: posts
slug: makin-bacon-with-node-js-hapi-and-vue
layout: layouts/post.njk
---

I recently created a new demo for my [Node.js Crash Course](https://speakerdeck.com/reverentgeek/node-dot-js-crash-course-kcdc-2018) talk that I've given at several conferences. This application is a "bacon ipsum" generator using [Node.js](https://nodejs.org/), [Hapi](https://hapijs.com/), and [Vue](https://vuejs.org/). I know I'm not the first to come up with the idea of a "bacon ipsum" generator, but I thought it'd be a fun project to create one in Node.js.

API Requirements:

* Using a list of bacon names and other associated words...
* Return a specified number of paragraphs, maximum of 25
* Paragraphs should consist of between 3 to 6 sentences
* Each sentence should be capitalized
* A sentence should end with random punctuation, weighted towards more frequent use of periods
* A sentence should consist of between 4 to 12 unique words

UI Requirements:

* Customer can choose to generate 1 to 21 "pounds" of bacon
* Customer can easily copy the generated text to their clipboard

[See it in action!](https://node-bacon-generator.herokuapp.com/)

When you click on the "Make the Bacon!" button, the Vue application uses [Axios](https://www.npmjs.com/package/axios) to call the API for bacon. When the API call returns, the Vue app updates its state with the array of paragraphs. This triggers re-rendering the UI to list the paragraphs and show the "Copy to the clipboard!" button.

```javascript
makeTheBacon: function() {
  return axios
    .get( "/api/bacon/" + this.numberOfPounds )
    .then( res => ( this.paragraphs = res.data.paragraphs ) )
},
```

### Vue computed properties

The Vue app uses a computed property, `hazBacon`, to show/hide the "Copy to the clipboard!" button based on there being any paragraphs of bacon text to display.

When copying text to the clipboard, the Vue app uses another computed property, `paragraphText`, to join the array of paragraphs together into a single string.

```javascript
computed: {
  paragraphText: function() {
    return this.paragraphs.join( "\n\n" );
  },
  hazBacon: function() {
    return this.paragraphs.length > 0;
  },
  poundText: function() {
    return this.numberOfPounds == 1 ? "pound" : "pounds";
  }
},
```

### Other dependencies

In addition to Node.js, Hapi, and Vue, here are the dependencies and plugins used by the project. Some of these are my current favorites for building Node.js applications.

* [Vue-Clipboard2](https://www.npmjs.com/package/vue-clipboard2) - Vue component used to copy text to the clipboard
* [Axios](https://www.npmjs.com/package/axios) - HTTP client for browsers or Node.js
* [fs-extra](https://www.npmjs.com/package/fs-extra) - Promise-based file system module
* [Joi](https://www.npmjs.com/package/joi) - Object schema validation plugin for Hapi
* [ESLint](https://www.npmjs.com/package/eslint) - JavaScript linting
* [Nodemon](https://www.npmjs.com/package/nodemon) - Developer tool that automatically restarts the application when any change is made to source code
* [Boom](https://www.npmjs.com/package/boom) - Hapi plugin for returning errors
* [hapi-pino](https://www.npmjs.com/package/hapi-pino) - Pino logging plugin for Hapi
* [Inert](https://www.npmjs.com/package/inert) - Static resource plugin for Hapi
* [Lab](https://www.npmjs.com/package/lab) and [Code](https://www.npmjs.com/package/code) - Test and assertion utilities for Hapi

[![](/content/images/2018/07/check-out-the-source.png)](https://github.com/reverentgeek/node-bacon-generator)

[github.com/reverentgeek/node-bacon-generator](https://github.com/reverentgeek/node-bacon-generator)

### Happy computering!
