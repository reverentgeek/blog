---
title: "Create PDFs with Node.js and Puppeteer"
featured_image: /content/images/2020/02/charter-example.jpg
description: "I created a utility to convert ChordPro text files into beautiful PDFs. You can create awesome PDFs, too!"
date: 2020-02-06
tags: posts
slug: create-pdfs-with-node-js-and-puppeteer
layout: layouts/post.njk
---

I love to play music, especially in a band. There's something amazing about the synergy of multiple people harmonizing voices and instruments. However, for a band to be successful, everyone needs to be on the _same page_ or it just sounds like a mess.

Come to think of it, I could make a lot of comparisons between a group of people that play well together in a band and a productive, highly-performing software team. But, I digress. Maybe another time!

One way a band to be on the _same page_ is to follow sheet music or chord charts.

I recently updated a personal project named [Charter](https://github.com/reverentgeek/charter) that uses Node.js to convert ChordPro formatted text files into PDF chord charts. It was a lot of fun!

Now, you may be thinking,

> "I'm not a musician or singer. Why do I care?"

Regardless of your personal need for chord charts, you might find the source code for this project useful. Here are a few things you might learn:

* Create a CLI app using Node.js and Yargs
* Load a text file and parse text
* Use Jest to test Node.js code
* Use handlebars to turn text into HTML
* Use Puppeteer to convert HTML into a PDF

Regarding PDF rendering, I tried lots of solutions including [wkhtmltopdf](https://wkhtmltopdf.org/), [electron-pdf](https://www.npmjs.com/package/electron-pdf), [phantomjs](https://phantomjs.org/), [automating Chrome](https://stackoverflow.com/questions/46077392/additional-options-in-chrome-headless-print-to-pdf) with command-line switches, and finally landed on using the latest version of [Puppeteer](https://developers.google.com/web/tools/puppeteer). Puppeteer supports a [ton of options](https://github.com/puppeteer/puppeteer/blob/v2.1.1/docs/api.md#pagepdfoptions) for generating PDFs. There's a lot of untapped potential here for doing lots of cool things!

## Save Any Web Page to PDF using Node.js

Assuming you already have [Node.js](https://nodejs.org) installed, open your terminal or command line, create a new project folder, and initialize it.

```sh
mkdir pdf-test
cd pdf-test
npm init -y
```

Next, install Puppeteer as a dependency.

```sh
npm install puppeteer
```

Here is an example of how to use Puppeteer to turn the Google home page into a PDF. Create a new file named `index.js` and paste the following code.

```js
"use strict";

const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://google.com");
  await page.pdf({ path: "./google.pdf", format: "Letter" });
  await browser.close();
})();
```

Run the application using the following command.

```sh
node .
```

You can change URL to something else. However, keep in mind that some pages load dynamically with JavaScript, so without setting more options, the resulting PDF could appear incomplete.

## Convert a Local HTML File to PDF

Puppeteer is not limited to loading web pages. You can also load local HTML files. This is how the Charter application creates a chord chart. The Charter app first parses a ChordPro text file, generates an HTML file, and then uses Puppeteer to render the HTML and save as a PDF.

Create a new file named `sample.html` and paste the following HTML.

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    * html,
    body {
      font-family: Verdana, Arial, Helvetica, sans-serif;
    }
  </style>
</head>
<body>
  <h1>Hello World!</h1>
  <p>Yay! My own PDF generator!</p>
</body>
</html>
```

Create a new file named `local.js` and paste the following code.

```js
"use strict";

const path = require("path");
const puppeteer = require("puppeteer");

(async () => {
  const htmlFile = path.resolve("./sample.html");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("file://" + htmlFile);
  await page.pdf({ path: "./sample.pdf", format: "Letter" });
  await browser.close();
})();
```

Next, run the code from the command line.

```sh
node local.js
```

You should now have your very own "Hello World!" PDF in your project folder!

## Create a Chord Chart with Charter

If you have Node.js 12.x or higher installed and want to take the CLI app for a spin, you can use `npx` to run the application directly. Of course, you will need a ChordPro text file to test. Here's an example, or you can find others on the Internet.

```text
{title: Amazing Grace}
{artist: Words by: John Newton, John P. Rees}
{artist: Music by: William W. Walker, Edwin Othello Excell}
{key: G}  
{tempo: 90}
{time: 3/4 }

{comment: Verse 1}
A - [G]mazing [G/D]grace  [D7]how  [Em]sweet [C]the   [G]sound
That [G]saved a [G/D]wretch  [D/C]like    [G/B]me
I [G]once was [G/B]lost but [C]now am  [G]found
[G/B]Was   [Em]blind but [G/D]now    [D7]I    [G]see
```

`npx` will take a little while to download the first time, due to Puppeteer using Chromium.

```sh
npx chord-charter -f amazing-grace.chordpro
```

I hope you find the project useful! Get out there and be awesome!



