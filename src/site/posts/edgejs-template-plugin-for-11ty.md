---
id: 048c7300168911f188522f54b403f1f8
title: "Edge.js Template Plugin for 11ty"
feature_image: /content/images/edgejs-template-plugin-for-11ty/edgejs-template-plugin-for-11ty.png
description: "Love JavaScript but tired of learning template-specific syntax? Edge.js brings JS-native templating to 11ty, and I built a plugin to prove it."
date: 2026-03-02
slug: edgejs-template-plugin-for-11ty
templateEngineOverride: md
---

I was recently browsing the [Node Weekly](https://nodeweekly.com/issues/613) newsletter (as one does with a cup of coffee in hand) when a mention of [Edge.js](https://edgejs.dev/docs/introduction) caught my eye.

Oh, it's *yet another* template engine 🫩

Wait, this one was created by the [AdonisJS](https://adonisjs.com/) team. And, it uses JavaScript syntax??

![You know, I'm something of a JavaScript developer myself](/content/images/edgejs-template-plugin-for-11ty/something-of-a-js-dev-myself.png)

I'd been using Nunjucks with my [11ty](https://www.11ty.dev/) blog for years, and while it worked fine, I always felt more than a little friction every time I had to update a template.

"How do I write a loop? Didn't I figure this out before? It's in one of these files, I think...."

"Maybe with Edge.js I wouldn't feel so lost? 🤔 [existential crisis intensifies]"

So naturally, I did what any reasonable person would do: I built an 11ty plugin for it. Then I converted my entire blog to `.edge` templates. Then I tested it against 11ty v3.0+ and the latest v4.0 preview, found some issues, and fixed them too.

It was fun 🤓 And now I'm a fan.

## What Is Edge.js?

**Edge.js** is a bit of a "kitchen sink" template engine for Node.js. It's async-native and designed to feel familiar to anyone who writes JavaScript. No new language to learn. No pipe-based filter syntax. Just JavaScript, with some handy template-specific features layered on top.

Here's a quick taste of what Edge.js looks like.

```edge
@if(user.isAdmin)
  <p>Welcome back, boss.</p>
@elseif(user.name)
  <p>Hey, {{ user.name }}!</p>
@else
  <p>Welcome, stranger.</p>
@end
```

If that looks readable to you, welcome to Edge.js 🤓

### How Does Edge.js Compare?

To be fair, there are lots of solid template engines for Node.js, each with its own strengths.

| Feature | Edge.js | Nunjucks | Liquid | EJS |
| :---- | :---- | :---- | :---- | :---- |
| **Syntax style** | JavaScript-like | Jinja2-like | Shopify/Ruby-like | Raw JavaScript |
| **Async/await** | Native | Yes | Limited | Limited |
| **Reusable blocks** | Components and slots | Macros | Partials | Partials |
| **Filter syntax** | Function calls | Pipe syntax | Pipe syntax | Function calls |
| **Learning curve** | Low (if you know JS) | Moderate | Moderate | Low |

Edge.js hits a sweet spot. It's more declarative than EJS, has more modern JS features than EJS, and can be more intuitive for JavaScript developers than Nunjucks or Liquid. It also has a real component system, something most template engines don't offer at all.

<aside class="callout callout-note" role="note">
  <span class="callout-label">Note</span>
  <div class="callout-content"><p>If you're already happy with your current template engine and it's meeting your needs, there's no urgent reason to switch. But if you've been wishing your templates felt more like the JavaScript you already write, it's worth a look.</p></div>
</aside>

## Why Build an 11ty Plugin?

11ty is famously flexible about template languages. It supports Nunjucks, Liquid, Handlebars, EJS, JavaScript template literals, and more. But Edge.js wasn't on the list. The only way to use it was to build a plugin that teaches 11ty how to process `.edge` files.

That's what [eleventy-plugin-edgejs](https://github.com/reverentgeek/eleventy-plugin-edgejs) does. It registers Edge.js as a template engine for 11ty, so you can:

* **Use `.edge` files** as page and layout templates.
* **Use Edge.js as the engine for Markdown**: your Markdown posts get processed through Edge.js layouts.
* **Call 11ty filters and shortcodes** as regular functions (no pipe syntax needed).
* **Use Edge.js components and partials** from your `_includes` directory.

The plugin automatically bridges your existing 11ty filters and shortcodes into Edge.js, so they become global functions in every template. If you've already built up a library of filters, they'll just work.

## Getting Started with `eleventy-plugin-edgejs`

Let's walk through setting up the plugin from scratch. If you already have an 11ty project, you can skip ahead to installing the plugin.

### Step 1: Install the plugin

```sh
npm install eleventy-plugin-edgejs
```

### Step 2: Register the plugin in your 11ty config

Open your `.eleventy.js` (or `eleventy.config.js`) and register the plugin. One important detail: **register the Edge.js plugin after all your filters and shortcodes.** The plugin captures whatever filters and shortcodes are registered at the time it loads, so you want everything in place first.

```javascript
// .eleventy.js
import edgeJsPlugin from "eleventy-plugin-edgejs";

export default async function (config) {
  // Register your filters and shortcodes first
  config.addFilter("postDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });
  });

  config.addShortcode("currentYear", async () => {
    return new Date().getFullYear();
  });

  // Register Edge.js plugin AFTER filters/shortcodes
  config.addPlugin(edgeJsPlugin);

  return {
    dir: {
      input: "src/site",
      output: "dist"
    },
    templateFormats: ["edge", "md", "txt", "html"],
    htmlTemplateEngine: "edge",
    markdownTemplateEngine: "edge"
  };
}
```

What's happening here:

* **`templateFormats`** includes `"edge"` so 11ty knows to process `.edge` files
* **`htmlTemplateEngine: "edge"`** tells 11ty to use Edge.js for HTML templates
* **`markdownTemplateEngine: "edge"`** means your Markdown posts will use Edge.js layouts

### Step 3: Create a layout

Create a default layout at `src/site/_includes/layouts/default.edge`.

```edge
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>
@if(title)~
{{ title }} – My Site
@else~
My Site
@end~
  </title>
</head>
<body>
  <header>
    <nav>
      @each(item in site.navigation)
        <a href="{{ item.url }}"
          {{{ page.url === item.url ? 'aria-current="page"' : '' }}}>
          {{ item.label }}
        </a>
      @end
    </nav>
  </header>

  <main>
    {{{ content }}}
  </main>

  <footer>
    <p>&copy; {{ currentYear() }}</p>
  </footer>
</body>
</html>
```

A few things to notice:

* **`{{{ content }}}`** uses triple braces for unescaped HTML — this is where your page content gets injected.
* **`{{ currentYear() }}`** calls the 11ty shortcode we registered as a regular function.
* **`@each`** loops feel natural — just like a `for...of` in JavaScript.
* **The `~` after `@if` and `@else`** suppresses extra whitespace in the rendered output, keeping your `<title>` tag clean.

### Step 4: Create a page

Create a simple page at `src/site/index.edge`.

```edge
---
title: Home
layout: layouts/default.edge
---

<h1>Welcome!</h1>
<p>This page is rendered with Edge.js. Today is {{ postDate(Date.now()) }}.</p>
```

That `postDate()` call? That's our 11ty filter, called like a normal function. No pipes. No special syntax. Just call it!

### Step 5: Build and admire

```sh
npx @11ty/eleventy --serve
```

You should see your page rendered with the Edge.js layout, your filter working, and your shortcode generating the current year in the footer.

## Edge.js Features You'll Actually Use

Now that you're up and running, let's look at the features that make Edge.js shine in an 11ty project.

### Components with Slots

This is the big one. Edge.js has a real component system with named slots — something most template engines only dream about.

Create a card component at `src/site/_includes/components/card.edge`.

```edge
<div class="card">
  @if($slots.header)
    <div class="card-header">
      {{{ await $slots.header() }}}
    </div>
  @end
  <div class="card-body">
    {{{ await $slots.main() }}}
  </div>
  @if($slots.footer)
    <div class="card-footer">
      {{{ await $slots.footer() }}}
    </div>
  @end
</div>
```

Now use it anywhere.

```edge
@component('components/card')
  @slot('header')
    <h3>Featured Post</h3>
  @end

  <p>This content goes in the main slot.</p>

  @slot('footer')
    <a href="/read-more">Read more...</a>
  @end
@end
```

This is a game-changer for building reusable UI pieces in a static site. No JavaScript frameworks required.

### Conditionals and Loops

Edge.js conditionals and loops read like the JavaScript you already know.

```edge
@each(post in collections.posts)
  <article>
    <h2><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
    <time>{{ postDate(post.data.date) }}</time>
    @if(post.data.description)
      <p>{{ post.data.description }}</p>
    @end
  </article>
@else
  <p>No posts yet. Better get writing!</p>
@end
```

The `@else` on a loop is a nice touch — it renders when the collection is empty. No more wrapping everything in an `@if(collections.posts.length > 0)` check.

### Variables and State

Need to compute a value in your template? Edge.js gives you `@let` and `@assign`.

```edge
@let(fullName = author.first + ' ' + author.last)
@let(postCount = collections.posts.length)

<p>{{ fullName }} has written {{ postCount }} posts.</p>

@if(postCount > 100)
  @assign(fullName = fullName + ' (Prolific!)')
@end
```

### Includes and Partials

Pulling in shared template fragments is straightforward.

```edge
@include('partials/header')
@include('partials/navigation')

{{-- Only include if a condition is true --}}
@includeIf(showSidebar, 'partials/sidebar')
```

### Comments That Stay Hidden

Edge.js comments don't leak into your HTML output.

```edge
{{-- This never appears in the rendered HTML --}}
<p>But this does.</p>
```

## Compatibility: 11ty v3 and v4

I've tested `eleventy-plugin-edgejs` against **11ty v3.0+** and the latest **v4.0 preview**. Along the way, I found (and fixed) a few compatibility issues — mostly around how 11ty's two-pass rendering system interacts with Edge.js's async template resolution. The current version of the plugin handles all of this, so you should be good to go with either version.

The plugin requires **Node.js 22+** and **11ty 3.0.0 or later**.

### Writing About Edge.js in Edge.js

Here's a fun gotcha I ran into while writing this very post. When `markdownTemplateEngine` is set to `"edge"`, 11ty preprocesses your Markdown files through Edge.js *before* converting them to HTML. That means any `{{ }}` or `@if`/`@each` syntax in your code examples will be interpreted as real Edge.js expressions. Your blog post about Edge.js templates becomes... an Edge.js template. Doh!

<aside class="callout callout-tip" role="note">
  <span class="callout-label">Pro tip</span>
  <div class="callout-content"><p>If you have a Markdown post that includes Edge.js code examples (or any content that shouldn't be processed as a template), add <code>templateEngineOverride: md</code> to your frontmatter. This tells 11ty to skip template preprocessing and treat the file as plain Markdown only. Your layouts still render through Edge.js as normal — it's just the post body that gets left alone.</p></div>
</aside>

```yaml
---
title: "My Post About Edge.js"
templateEngineOverride: md
---
```

## Go Forth and Template

If you're an 11ty user or a JavaScript developer who's struggled with wonky template engines, give Edge.js a shot!

## Resources

* [eleventy-plugin-edgejs on GitHub](https://github.com/reverentgeek/eleventy-plugin-edgejs)
* [eleventy-plugin-edgejs on npm](https://www.npmjs.com/package/eleventy-plugin-edgejs)
* [Edge.js documentation](https://edgejs.dev/docs/introduction)
* [11ty documentation](https://www.11ty.dev/docs/)

I'd love to hear about your experience! Let me know if you give it a try, or if you have questions about making the switch.
