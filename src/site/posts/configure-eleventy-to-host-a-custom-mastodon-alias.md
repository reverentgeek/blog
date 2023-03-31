---
id: 84b716c0821c11ed82cc8fdee474061f
title: "Configure Eleventy to Host a Custom Mastodon Alias"
feature_image: /content/images/configure-eleventy-to-host-a-custom-mastodon-alias/configure-eleventy-to-host-a-custom-mastodon-alias.jpg
description: You can find me on Mastodon using @reverentgeek@reverentgeek.com! Here's how I did it using 11ty and Netlify!
date: 2023-01-02
tags: posts
slug: configure-eleventy-to-host-a-custom-mastodon-alias
layout: layouts/post.njk
---

You can find me on Mastodon using `@reverentgeek@reverentgeek.com`! Here's how I did it using 11ty and Netlify!

I recently came across Scott Hanselman's excellent post, [Use your own user @ domain for Mastodon](https://www.hanselman.com/blog/use-your-own-user-domain-for-mastodon-discoverability-with-the-webfinger-protocol-without-hosting-a-server). Scott does a great job explaining the WebFinger protocol and how it's used to discover public information about accounts. Go read his tutorial to learn more about why it works.

_This_ post explains how I took what I learned in Scott's tutorial for ASP.NET and applied it to my static site built with [Eleventy](https://www.11ty.dev/) (also known as "11ty") and deployed it to [Netlify](https://www.netlify.com/). This allows me to use my domain as an alias `@reverentgeek@reverentgeek.com` without hosting a Mastodon server.

## Create a WebFinger Endpoint

This 11ty site uses Nunjucks for templates. I created a file named `webfinger.njk` and added the following text.

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

The `permalink: '.well-known/webfinger'` in the template header (also known as front matter) instructs 11ty to render the template as a file named `.well-known/webfinger`. The JSON content rendered by the template is the same JSON returned by my Mastodon server when querying its WebFinger endpoint. How did I get that information? With Node.js, of course! I created a new file in my 11ty project named `src/utils/mastodon.js` and wrote the following code.

```js
const pullMyWebFinger = async ( domain, user ) => {
  const url = `https://${ domain }/.well-known/webfinger?resource=acct:${ user }@${ domain }`;
  const res = await fetch( url );
  const body = await res.text();
  const profile = JSON.parse( body );
  console.log( profile );
};

pullMyWebFinger( "techhub.social", "reverentgeek" );
```

To run this yourself, you'll want to change the `domain` and `user` arguments passed to the `pullMyWebFinger` function to match yours. Run the script from your command line using Node.js.

```sh
node src/utils/mastodon.js
```

> Note: This example uses the new `fetch` command that is in the latest versions of Node.js. If your version of Node.js doesn't support `fetch`, I recommend using [axios](https://www.npmjs.com/package/axios).

## Return WebFinger Content as JSON

When deployed, the `.well-known/webfinger` file will be returned as plain text. Some Mastodon clients may be forgiving and automatically convert the data to JSON. However, it would be best to serve the file as JSON.

Use a [custom `_headers` file](https://docs.netlify.com/routing/headers/) to configure Netlify to override HTTP header information for specific files. In my 11ty site, I have a template named `headers.njk` to generate a `_headers` file.

```md
---
permalink: '_headers'
---

/.well-known/webfinger
  content-type: application/jrd+json; charset=UTF-8
```

When Netlify serves `/.well-known/webfinger`, it will include the correct `content-type` header.

## Get the Source

The entire source code for this blog is on [GitHub](https://github.com/reverentgeek/blog).

Let me know if this helps or if you have any questions! Happy 11ty-ing!
