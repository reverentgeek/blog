---
id: 84b716c0821c11ed82cc8fdee474061f
title: "Configure Eleventy to Host a Custom Mastodon Alias"
feature_image: /content/images/configure-eleventy-to-host-a-custom-mastodon-alias/configure-eleventy-to-host-a-custom-mastodon-alias.jpg
description:
date: 2022-12-22
tags: posts
slug: configure-eleventy-to-host-a-custom-mastodon-alias
layout: layouts/post.njk
---

Because my 11ty site uses Nunjucks for templates, I created a file named `webfinger.njk` and added the following text.

```json
---
permalink: '.well-known/webfinger'
eleventyExcludeFromCollections: true
dynamicPermalink: false
---
{
  "subject": "acct:reverentgeek@techhub.social",
  "aliases": [
    "https://techhub.social/@reverentgeek",
    "https://techhub.social/users/reverentgeek"
  ],
  "links": [
    {
      "rel": "http://webfinger.net/rel/profile-page",
      "type": "text/html",
      "href": "https://techhub.social/@reverentgeek"
    },
    {
      "rel": "self",
      "type": "application/activity+json",
      "href": "https://techhub.social/users/reverentgeek"
    },
    {
      "rel": "http://ostatus.org/schema/1.0/subscribe",
      "template": "https://techhub.social/authorize_interaction?uri={uri}"
    }
  ]
}
```
