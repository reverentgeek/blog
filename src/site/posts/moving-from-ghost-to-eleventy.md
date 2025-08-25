---
id: a105d0708a2411ea836c5346ccce7899
title: "Moving From Ghost to Eleventy"
feature_image: /content/images/moving-from-ghost-to-eleventy/moving-from-ghost-to-eleventy.jpg
description: "My blog has been on Ghost for many years. It has been a solid platform, and I highly recommend it. However, I've been itching to try something new for a while..."
date: 2020-04-29
tags: posts
slug: moving-from-ghost-to-eleventy
layout: layouts/post.njk
---

My blog has been on a self-hosted deployment of [Ghost](https://ghost.org/) for many years. It has been a solid platform, and I highly recommend it.

However, I've been itching to try something new with my blog for a while. The more I've learned about [JAMstack](https://jamstack.org/), the more I've wanted to start moving my sites and applications to that architecture.

> Static is the New Dynamic!

[Static site generators](https://www.staticgen.com/), such as [Gatsby](https://www.gatsbyjs.org/) and [Hugo](https://gohugo.io/), are becoming more popular. Combined with a modern CDN like [Netlify](https://www.netlify.com/), "static" sites can be extremely fast and cost-effective.

## Cranking this Blog to Eleventy

Over the last few years, I've taken several stabs at using Gatsby. I really like the idea of using React and GraphQL, but there was just something about the whole Gatsby system that didn't sit right with me. At the time, I found the architecture and plugins confusing, and there didn't seem to be a clear path to success. To be fair, it's been more than a year since I last looked at Gatsby. I hope the onboarding experience has improved.

I've [done some work with Hugo](https://developer.okta.com/blog/2019/10/08/secure-and-scalable-an-introduction-to-jamstack). I enjoyed the experience. If I had made the decision at that time to move my blog, I probably would have gone with Hugo. It's extremely fast and flexible.

While doing research for my talk, [JAMstack: Web Apps at Ludicrous Speed](https://www.youtube.com/watch?v=WkCHNh5zpm0), I came across a static site generator named [Eleventy](https://www.11ty.dev/). For whatever reason, this one "clicked" for me. It has all the speed and flexibility I could ever need. There are quite a few options for templates and content, such as HTML, markdown, EJS, Nunjucks, Handlebars, Mustache, and Pug, among others.

### Using Ghost as a "Headless" CMS

One modern approach to managing a website is to decouple the content management system (CMS) from the deployment and hosting of that content. In this scenario, the CMS is called a "headless" CMS. A headless CMS is used to create and edit content but is not responsible for hosting, rendering, or serving that content to folks visiting your site.

> A Headless CMS is the best of both worlds. You can manage your content using a great CMS and deploy your site with a static site generator so it can be fast, secure, and easily scalable.

Ghost has an API that supports using it as a headless CMS. Ghost has even created an [Eleventy Starter Ghost](https://github.com/TryGhost/eleventy-starter-ghost) project. My Ghost-to-Eleventy journey started with this project.

Personally, I'm comfortable with writing content directly in Visual Studio Code using markdown and committing changes to a repository using Git. There's not much reason for me to continue paying to host an instance of Ghost when I can publish my blog directly from my Git repository. Moving to a content system "closer to the metal" is one of the reasons why I wanted to move to a static site generator in the first place.

### Migrating Ghost Content

There are a couple of ways you can get content out of a Ghost site. One option is to export all of your content at once as a JSON file. To do this, go to your Ghost dashboard and under *Settings* click *Labs*. Under *Migration Options* click **Export**.

A second option is to use the [Ghost API](https://ghost.org/docs/api/v3/) to access content programmatically. The [`content-api`](https://www.npmjs.com/package/@tryghost/content-api) module for Node.js makes it [pretty easy](https://ghost.org/docs/api/v3/javascript/content/) to get at your site's content. To use it, you will need to generate a *Content API Key* from within your Ghost dashboard under the *Integrations* section.

I chose to build a [Ghost export utility](https://github.com/reverentgeek/ghost-to-eleventy-exporter) using Node.js and the Ghost `content-api` client. This utility not only exports all the site data, posts, and pages, it also downloads all the images associated with that content, which is something the built-in Ghost export and Ghost API will not do for you. The content is exported as HTML and markdown files, ready to be consumed with Eleventy!

```markdown
---
id: 5e3c593e71e5d67de8259700
title: "Create PDFs with Node.js and Puppeteer"
feature_image: /content/images/2020/02/charter-example.jpg
description: "I love to play music, especially in a band. There's something amazing about the synergy of multiple people harmonizing voices and…"
date: 2020-02-06
tags: posts
slug: create-pdfs-with-node-js-and-puppeteer
layout: layouts/post.njk
---

I love to play music, especially in a band. There's something amazing about the synergy of multiple people harmonizing voices and instruments. However, for a band to be successful, everyone needs to be on the _same page_ or it just sounds like a mess.
```

### Styling with Tailwind CSS

Using the "Eleventy Starter Ghost" project as a starting point for rendering content, I was ready to start personalizing it to fit my needs. I decided to use this opportunity to learn another new technology on my radar, [Tailwind CSS](https://tailwindcss.com/).

Tailwind CSS is quite a bit different from most CSS frameworks. Instead of being a library full of components and use-case-specific classes, Tailwind is a comprehensive collection of very granular utility classes that can be applied to just about any HTML element. It's less prescriptive. You use these utilities to *compose* an element's style.

The following HTML is for a nice rounded blue button.

```html
<a class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
  href="/my-awesome-post/">Read more...</a>
```

Weird, huh? But really powerful! The Tailwind CSS documentation is fantastic. I also found this [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet) to be very useful.

## Hosting on Netlify

[Netlify](https://www.netlify.com/) is an amazing service. They make it *super* easy to deploy a site from a Git repository. I can push an update to my repository and it is built and deployed in about a minute. On a *global* CDN. This is, by far, the fastest ReverentGeek blog yet!

Netlify makes other things painless, too, such as...

* Add custom domains.
* Deploy previews of a Git repository's development/staging branches.
* Enable free HTTPS with Let's Encrypt, with automatic certificate generation and renewal.
* Add custom forms or API using [Netlify Functions](https://www.netlify.com/products/functions/).
* Their own headless CMS, [Netlify CMS](https://www.netlifycms.org/).

I'm not getting paid for this endorsement -- I really am a big fan!

## Learn More About JAMstack

Here are a couple of articles on JAMstack-related topics and a video of my talk on JAMstack.

* [Stop Writing Server-Based Web Apps](https://developer.okta.com/blog/2020/03/06/stop-writing-server-based-web-apps)
* [Build a Serverless Function with Netlify](https://scotch.io/tutorials/build-a-secure-serverless-function-with-netlify)
* [JAMstack: Web Apps at Ludicrous Speed](https://www.youtube.com/watch?v=WkCHNh5zpm0)

## Use the Source!

Source code for this blog is available on [GitHub](https://github.com/reverentgeek/blog).
