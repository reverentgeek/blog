---
id: a561e7d0294311f0965e39a7bd19db91
title: "HopCounter: Build a Retro Page View Counter with Bunny Edge Scripting"
feature_image: /content/images/hopcounter-bunny-edge-scripting/hopcounter-bunny-edge-scripting.jpg
description: "Learn to build a retro page view counter using Bunny.net Edge Scripting!"
date: 2025-05-04
slug: bunny
---

If you've ever wanted to relive the glory days of the internet—back when guestbooks, under-construction GIFs, and visit counters reigned supreme—this one's for you.

In this tutorial, we're building **HopCounter**: a bunny-themed, edge-powered page view counter that runs globally, updates instantly, and doesn't need a single origin server. It's a nostalgic nod to the web's past, rebuilt for the modern CDN.

And we're doing it all with **Bunny.net Edge Scripting**—no GitHub Actions, no complex deploy pipelines. Just you, a browser, and some delightful JavaScript in the Bunny admin console.

## Why Build a View Counter at the Edge?

You might be thinking, "Okay, but why?" Fair question. Besides satisfying your inner 90s kid, here are real reasons you might want to build this:

- **Landing page analytics** without third-party scripts or trackers
- **Lightweight telemetry** for static sites and microsites
- **Fun dynamic content** to add interactivity on JAMstack sites
- **Rate-limited content previews** ("This page has been viewed 10 times today.”)

Traditional counters rely on backend services or analytics platforms. Edge Scripting lets you **skip the backend entirely**, run logic closer to users, and maintain control over what happens when someone visits your page.

## Requirements

Before we start hopping, you'll need the following:

- A [Bunny.net](https://bunny.net/) account (sign up for a [FREE trial](https://dash.bunny.net/auth/register))
- A page where you want to show the counter
- Access to a key-value store, external API, or in-memory edge-compatible service (we'll simulate this)

> TIP: **Edge Database Lite** is [coming soon](https://bunny.net/blog/edge-scripting-just-evolved-faster-safer-and-even-more-powerful/)!

We'll use JavaScript to build a `GET /view?id={slug}` endpoint that:

- Increments a counter for the given `id`
- Returns the updated count in JSON

Let's hop in!

## Step 1: Create a new script in the Bunny dashboard

The first step is to add a new script to your Bunny account. You will deploy the script directly from your Bunny dashboard, but you can also deploy scripts using a [GitHub repository](https://docs.bunny.net/docs/edge-scripting-github-integration) or [GitHub Actions](https://docs.bunny.net/docs/edge-scripting-github-action)!

1. Log in to your [Bunny Dashboard](https://dash.bunny.net/)
2. Navigate to **Edge Platform → Scripting**
3. Click **Add Script**

![Bunny Scripting: add script](/content/images/hopcounter-bunny-edge-scripting/bunny-edge-scripting-01.png)

4. Click **Deploy with Bunny.net**

![Bunny Scripting: deploy with Bunny.net](/content/images/hopcounter-bunny-edge-scripting/bunny-edge-scripting-02.png)

5. For **Script Name** enter "HopCounter"
6. Make sure the script **Type** is set to **Standalone**
7. Under **Script Template** choose **Return simple JSON** (although any template will work)
8. Click **Add Script**

![Bunny Scripting: configure script](/content/images/hopcounter-bunny-edge-scripting/bunny-edge-scripting-03.png)

## Step 2: Replace the default script

Here's a super basic example that simulates incrementing a view counter. It uses an in-memory counter for demonstration.

```javascript
import * as BunnySDK from "https://esm.sh/@bunny.net/edgescript-sdk@0.11.2";

// This object simulates a data store 
// It resets on every cold start and every time you publish a deployment!
const counters = new Map<string, number>();

/**
 * Returns an HTTP response.
 * @param {Request} request - The Fetch API Request object.
 * @return {Response} The HTTP response or string.
 */
BunnySDK.net.http.serve(async (request: Request): Response | Promise<Response> => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response("Missing `id` query parameter", { status: 400 });
  }

  const current = counters.get(id) ?? 0;
  const updated = current + 1;
  counters.set(id, updated);
  const data = JSON.stringify({id, count: updated});

  return new Response(data, {
    headers: {
      "content-type": "application/json"
    }
  });
});
```

## Step 3: Test it in the preview pane

The Bunny dashboard includes a **preview pane** for testing your script. You can:

- Update the URL parameters such as `?id=test`
- Click the run button and see the JSON response
- View logs in real time

![Bunny Scripting: preview pane](/content/images/hopcounter-bunny-edge-scripting/bunny-edge-scripting-05.png)

This makes it easy to debug, tweak, and iterate without leaving your browser.

## Step 4: Add it to your website

Let's display the counter on your webpage with some basic JavaScript:

```html
<div id="counter">Loading view count...</div>
<script>
  fetch("https://<your-hopcounter-url>.bunnycdn.run/view?id=homepage")
    .then(res => res.json())
    .then(data => {
  const padded = String(data.count).padStart(5, "0");
  document.getElementById("counter").textContent = `You're visitor #${padded} 🐇`;
 });
</script>
```

Replace `<your-hopcounter-url>` with your unique script name. You can find this at the top of the Code Editor. You can reuse this snippet for any page by changing the `id=homepage` parameter. Each slug (e.g. "homepage", "about", "contact") gets its own counter.

![Bunny Scripting: script URL](/content/images/hopcounter-bunny-edge-scripting/bunny-edge-scripting-04.png)

## Bonus enhancements for extra credit

Once you've got the basics running, here's how to level it up:

- **Add persistent storage**: To persist data across restarts and deployments, you'll want to connect this to a real data store, such as [Turso](https://docs.bunny.net/docs/access-edge-database-with-turso), Redis, Couchbase, or any number of cloud database providers. Many offer a free tier option with plenty of storage for a view counter and more! You can set [environment variables](https://docs.bunny.net/docs/edge-scripting-environment-variables-and-secrets) for your database credentials and connection string and import the database client library into your script using [esm.sh](https://esm.sh/).
- **Style it retro**: Use pixel fonts, counters that look like odometers, an animated GIF, or make it blink like it's 1999!
- **Add daily/weekly limits**: Store counts with timestamps for limited-access content.
- **Track per-user visits**: Use headers or tokens to enforce custom logic.

## Edge Scripting real-world use cases

HopCounter is just a cute wrapper around a much bigger idea: running lightweight, dynamic logic at the edge without needing a server. If you can build a page view counter, you can build lots of useful features! Here are just a few ideas to keep you hopping!

| Concept               | Real Use Case Example                                |
|-----------------------|------------------------------------------------------|
| Edge-based counters   | Blog views, download stats, or video play counts     |
| Upvote APIs           |  |
| Feature flags         |  |
| Event tracking        | Button clicks, form submissions, or popup dismisses  |
| Limited-time promos   |  |
| Per-user limits       | Rate-limiting anonymous visits (e.g., 3 previews/day)|
| Email sign-ups        |  |
| A/B testing           |  |
| Anonymous analytics   | GDPR-safe behavior tracking without cookies          |

Because your logic runs at the edge, you can **respond instantly and at scale**—no latency from centralized APIs or bloated trackers. All from the Bunny dashboard, deployed globally in seconds.

## Ready to build your own?

Whether you're building a retro fan site, a fast-loading marketing page, or love the smell of HTML in the morning—Edge Scripting gives you the power to customize behavior without the backend baggage.

Explore what you can build next with Bunny.net Edge Scripting.

- [Learn more in the Bunny docs](https://docs.bunny.net/docs/edge-scripting-overview)
- [Edge scripting just evolved: faster, safer, and even more powerful](https://bunny.net/blog/edge-scripting-just-evolved-faster-safer-and-even-more-powerful/)

Happy hopping!

<div id="counter">Loading view count...</div>
<script>
 fetch("https://hopcounter-8px97.bunny.run/?id=hopcounter-bunny-edge-scripting")
 .then(res => res.json())
 .then(data => {
 const padded = String(data.count).padStart(5, "0");
 document.getElementById("counter").textContent = `You're visitor #${padded} 🐇`;
 });
</script>
