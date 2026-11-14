# TODO

Open work for the blog. The move from Eleventy to SiteSquatch (`ssqch`) is finished; its step-by-step notes are in git history (`git log -p -- TODO.md`).

## Site quality (blog only)

- [x] Fix the 2 Dependabot alerts: `minimatch` (moderate, GHSA-g3hv-75wg-m249) and `katex` (low, GHSA-238p-pmpm-9mq7). Both come in through eslint and markdownlint-cli, whose latest versions still ask for vulnerable ranges, so `pnpm-workspace.yaml` overrides them to `^11.0.1` and `^0.18.2`. Remove those overrides once upstream catches up. Checked 2026-11-13: eslint 10.15 asks for `minimatch ^11.0.5`, but markdownlint-cli 0.50 still asks for `~10.2.6`, so the `minimatch` override stays.
- [ ] Add a Content-Security-Policy. Start with `Content-Security-Policy-Report-Only` and check the browser console on each page type (home, post with comments, YouTube and Twitter embeds, gallery, `/pco/`), since gtag.js, giscus, and inline scripts make a strict policy easy to get wrong.
- [ ] Review build-time image processing scope: confirm every transformed image is necessary, and exclude pages or image sets that don't benefit from responsive transforms.
- [ ] A short human-facing checklist for adding posts, images, and galleries (`CLAUDE.md` covers it for agents).
- [ ] Consider loading giscus comments on request. The IntersectionObserver in `post.edge` is good; a "Show comments" button would skip the giscus script unless the reader wants it.

- [x] Review the Lighthouse report. Rerun on the live homepage (mobile, Lighthouse 13.6, 2026-11-09, three runs; reports in `reports/live-*`, gitignored): Performance 93, 100, 100 (was 86), Largest Contentful Paint 1.9 s typical (was 4.3 s), Best Practices 100, SEO 100. Fixed the one Accessibility issue, the "Browse by topic" button's contrast (`.cta-button` from `blue-500`, 3.76:1, to `blue-600`, 5.26:1), so Accessibility is now 100. Left as they are, on purpose:
  - Render-blocking CSS (about 150-180 ms for the 8 KB stylesheet). Inlining critical CSS would add build complexity for a small gain.
  - Unused JavaScript (about 73 KB), all Google Analytics' `gtag.js`. It doesn't block anything (Total Blocking Time 0 ms); loading it later, a lighter analytics tool, or dropping it is a preference.
  - Image delivery (about 12 KB for one homepage AVIF served a bit larger than shown).

## Waiting on ssqch

Workarounds from the 2026-11-14 review (feed images and the JSON-LD publisher logo pointed at unpublished originals; fixed in `ddd0ab1f`). Each one goes once ssqch ships the feature; the ssqch side is in its `TODO.md`, "Image URLs outside `<img>`".

- [ ] **Needs ssqch:** the link checker reading feeds, `<meta>` URLs and JSON-LD. Then drop the smoke tests for feed images and the publisher logo.
- [ ] **Needs ssqch:** feed-ready HTML from `ssqch/rss`. Then `feed.edge` uses it, and `feedImages` goes.
- [ ] **Needs ssqch:** an `imageUrl()` template function. Then `publishedImage`, `social-image.js` and most of `_data/heroImage.js` go, each with its own cache.
- [ ] **Needs ssqch:** `image()` with `formats: ["auto"]` keyed `auto`. Then `publishedImage` stops reading `Object.values(derivatives)[0]`.
- [ ] **Needs ssqch:** preload hints from the image plugin. Then `partials/header.edge` uses a plain `<img>` (as `CLAUDE.md` asks), and the hand-written preload in `layouts/default.edge` goes.
- [ ] **Needs ssqch:** the image cache outside `dist/`. Then `dist/img` is no longer special: `clean:all` can delete `dist/` freely, and `netlify.toml` caches only `.cache/ssqch`.
- [ ] **Needs ssqch:** fingerprinted imports in inline module scripts. Then `pco.js` joins `assetsPlugin({ files })`, and its own `Cache-Control` rule in `netlify.toml` goes.
- [ ] **Needs ssqch:** serving a production build as it is. Then `scripts/lighthouse-local.js` uses it instead of its own static server.
- [ ] **Needs ssqch:** an `exports` map and types for `ssqch/*` in the npm package. Then `eslint.config.js` loses `allowModules: ["ssqch"]`.
- [ ] Later, **Needs ssqch:** an `ssqch/seo` plugin. Then `partials/head.edge`'s Open Graph and Twitter tags and `jsonLdArticle` could go.

## Website effectiveness

Goals: **#1 illustration commissions** (avatars, stickers, book illustration, logos, social media, event illustration) and **#2 DevRel work** (collaboration, and being attractive to the right opportunity, while staying happily at MongoDB). Speaking, software projects and content support these goals rather than being goals of their own. No email list for now. The reasoning, current-state audit, positioning against generative AI, marketing routine and section-by-section page outlines are in `WEBSITE-PLAN.md`, a local file kept out of the repo (gitignored since 2026-11-13); item numbers below match its "Work items." The 2026-11-12 site review and its phased plan are local too (`WEBSITE-REVIEW-2026-11-12.md`, `WEBSITE-TODO.md`). Listed in the suggested order.

Decided 2026-11-10: slugs `/commissions/` and `/devrel/`; avatars show a "starting at" price and other work is quoted by scope; `/devrel/` says "open to collaboration," not "looking for work"; Lars and Lindsay will agree to be quoted, so build with their quotes now; no *Azure in Action* art is used.

### 1. Measurement first

- [x] **GA4 click events** (plan item 13): a delegated `cta_click` handler in `src/assets/js/index.js` for any `data-cta` element. Tagged so far: `order-avatar`, `commission-inquiry`, `contact-email`, `kofi`, `post-callout-kofi`. New CTAs get a `data-cta` as they're added.
- [ ] Register `cta` as an event-scoped custom dimension in GA4 (Admin → Custom definitions).
- [ ] Write down the baseline: commissions and inquiries per month for the past year. Check again 60–90 days after the switch (step 5).

### 2. The books

- [ ] **Lars Klint two-book case-study post** (plan item 1). A repeat-client story covering *Automate Everything, Notice Nothing* (<https://larsklint.shop/products/automate-everything-notice-nothing>) and *Microsoft Azure in Action* (Manning, 2025, <https://www.manning.com/books/microsoft-azure-in-action>; the cover and a description of the work only, no art). Open with his acknowledgement ("…somehow draws the joke I was trying to make rather than the one I actually made"), then how each project went, the process with sketch-to-final pairs, favorite pieces, links to both books, and a soft CTA to `/commissions/`. Tags `books` and `illustration`.
  - [ ] Photograph or screenshot the printed acknowledgements page.
  - [ ] Gather finished illustrations, sketches, covers and photos of the printed books into `src/site/content/images/<post-slug>/`.
  - [x] Copy Lars' LinkedIn launch post ("158 pages, illustrated throughout by David Neal…"; full text in the plan).
  - [ ] Save the LinkedIn post's URL and a trimmed screenshot for the case study.
  - [ ] Message Lars for permission (a courtesy) and the testimonial questions in the plan.
- [ ] **Feature *Developer Relations Activity Patterns* as illustration work too.** It's currently framed only as a DevRel book in `announcing-devrel-activity-patterns-book.md` and `developer-relations-activity-patterns.md`. Ask co-authors for a quote about the illustrations.
- [x] **Add samples from *The Illustrated Book of Dad Jokes*.** Done 2026-11-13: a top-level `/dad-jokes/` page ("Dad Jokes!") with 12 favorite jokes (`src/site/content/images/dad-jokes/`, 1600 px JPGs from the 3072 px exports), a short version of the book's story, and Amazon buttons (`data-cta="buy-dad-jokes"`). "Dad Jokes!" replaced Speaking in the nav, and `/speaking/`, `/presentations/` and `/bio/` now highlight DevRel. The book strip, footer (Explore), About, `/commissions/`, `llms.txt` and the book post link to it.
- [x] **Use the book's first review.** Lindsay Brunner's five-star Amazon review, "Basically the encyclopedia of DevRel" (2026-11-05; full text in the plan). Add a short "What readers say" excerpt with an Amazon link to `developer-relations-activity-patterns.md`, and use it on `/devrel/`. Message Lindsay as a courtesy. Done 2026-11-10: a "What Readers Are Saying" section in `developer-relations-activity-patterns.md`, and the excerpt on `/devrel/`.

### 3. Illustration commissions

- [x] **Create `/commissions/`** (copy drafted 2026-11-10 in `src/site/pages/commissions.md`; pricing, turnaround, files, usage, revisions, brand matching and the *Azure in Action* detail filled in 2026-11-11. The placeholder `feature_image` was removed 2026-11-11 (social cards use the site default); add a real one later if wanted. No placeholders left as of 2026-11-13; a *DRAP* co-author quote is still wanted, under "Collect testimonials") (plan item 2): hero about the buyer's outcome with a **Start a commission** button and Lars' pull quote; featured books; a "what I draw" card per category linked to its gallery; why work with me (the "Competing with generative AI" proof points); testimonials; a three-step process (tell me what you need → I sketch, you react → get your files); details as benefits (turnaround, revisions, formats, usage rights, the avatar "starting at" price) and an FAQ with "Why not just use AI?"; final CTA. Avatars keep the Shopify buy button; everything else is an email inquiry with a prefilled subject and checklist, including "How did you hear about me?"
  - [x] Build the shared pieces with it: `_data/testimonials.json`, `_data/books.json`, and components for a testimonial, the book strip, the process steps and the gallery CTA, plus page-section styles in `styles.css`. Done: `books.json`, `testimonials.json`, and the `book-strip`, `testimonial` and `support` (callout) components. The process steps stayed plain Markdown lists.
  - [x] Look up the current avatar starting price in Shopify. $30 for black-and-white.
  - [x] A smoke test for the page. Done (`commission and DevRel pages have their calls to action`).
- [x] **Point `/shop/#commission` references** at `/commissions/` (`avatars.html:10`, `shop.md:10`, `shop.md:16`) and slim `shop.md` down to merch plus a pointer (plan item 9). Keep an element with `id="commission"` on the shop page that links on to `/commissions/`, since a redirect can't match a `#fragment`. Done 2026-11-10: the Shopify avatar widget moved to `/commissions/#order-an-avatar`; `shop.md` keeps a short `#commission` section pointing there, and the three WordCamp posts link to `/commissions/`.
- [x] **Portfolio:** add a **Book Illustration** tile first, and point "Commission a custom illustration!" at `/commissions/` instead of `mailto:` (`portfolio.md`). Done 2026-11-10 (the tile uses the *DRAP* cover and links to `/commissions/#books-ive-illustrated` until the case study exists).
- [x] **Gallery CTAs:** add a commission CTA at the top *and* bottom of `avatars.html`, `illustrations.html`, `sketch-notes.html`, `tech-humor.html` and `doodles.html`. Add testimonials near the top of `avatars.html`. Done 2026-11-10 for the CTAs (the `support` component with `variant: 'commissions'`, `placement: 'gallery'`). Greg Svoboda's testimonial is at the top of `avatars.html` (2026-11-11).
- [ ] **Avatar `alt` text:** replace the generic `alt="avatar illustration"` in `avatars.html` over time (187 left on 2026-11-13).

- [x] **StickerMule "invite friends" banner** on `/shop/` didn't load. Replaced 2026-11-11 with a "Shop stickers on StickerMule" button (StickerMule's store widget was tried and dropped: fixed 560 px wide, and it repeated the sticker image). The t-shirts section got a matching "Shop t-shirts on Amazon" button.
- [x] **`/shop/` is "Stickers & T-Shirts"** (2026-11-11), out of the nav: just the StickerMule and Amazon sections, plus a `#commission` anchor that points old links to `/avatars/` and `/commissions/`. It's linked from the footer (Explore), a portfolio tile, and a line under the illustrations, tech humor and doodles galleries. The dad-joke book stays in the book strip, and Ko-fi stays in the footer.
- [x] **`/avatars/` is the avatar page** (2026-11-11): a pitch, Greg's testimonial, how it works, the price table and the Shopify buy button (moved from `/commissions/`), team and event orders, then the gallery. `/commissions/#order-an-avatar` now points there, and so do the homepage caption, portfolio, `/draw/`, the footer and the links page.

### 4. DevRel

- [x] **Create `/devrel/`** (plan item 4): "open to collaboration" framing, with **Let's talk** and **Résumé**; the problem (DevRel is hard to plan and prove); what I do; authority (10+ years in DevRel at MongoDB, Plaid, Slack, Asana and Okta; co-author of *DevRel Activity Patterns*, with the "Basically the encyclopedia of DevRel" excerpt attributed to the book; more than 170 speaking events); the illustrator advantage (e.g., *An Illustrated Guide to OAuth and OpenID Connect*, Lars' quote with his Atlassian title); testimonials (Randall Degges and Stephen Franklin, moved into `testimonials.json`); curated proof from `devrel-portfolio.md`; final CTA. Drafted 2026-11-10 in `src/site/pages/devrel.md`; the `[TESTIMONIAL]` placeholder is gone (2026-11-13). The MVP line says "longtime Microsoft MVP" (the last award was 2025–2026).
- [x] **Speaking page:** keep the URL. Replace "*No speaking engagements currently scheduled.*" with a summary ("more than 170 events, including DevSum, CodeMash, KCDC…") and link it from `/devrel/`. Done 2026-11-10 (176 events since 2011 in the table, many with several talks, keynotes or workshops); the title is now "Speaking Engagements" because "Speaking" is taken by the speaking topic page.
- [ ] **Ask one or two DevRel colleagues** for endorsements that mention outcomes.

### 5. The switch (one release, after `/commissions/` and `/devrel/` exist)

- [x] **One description everywhere:** "Illustrator, builder, and DevRel leader, helping folks in tech be more awesome" (decided 2026-11-10). It's in `site.json` (`description` and `feed.subtitle`, kept without a final period because `index.edge` appends ". Page N of M."), the footer tagline (which reads `site.description`), the `bio.md` and `about.md` descriptions, the first line of `bio.md` (which also drops the outdated Microsoft MVP), and the `llms.txt` intro (which also lists `/commissions/` and `/devrel/`). The About intro and homepage hero get it when they're rewritten. Update the social bios by hand.
- [x] **Homepage hero** (plan item 3, `src/site/index.edge`): say what you do *for people*, with two primary buttons, **Hire me to illustrate** → `/commissions/` and **Work with me on DevRel** → `/devrel/`. Caption the avatar as a product sample ("I drew this. I can draw you, too."). Done 2026-11-10: the hero uses the one-liner, the avatar is captioned "I drew this. I can draw you, too.", and Browse by topic, RSS and About are a quieter line of links.
- [x] **Homepage "Books" strip** between the hero and the post list on page 1, with all three covers (the book strip component). Done 2026-11-10: `components/book-strip.edge` reads `src/site/_data/books.json` and skips books without a `cover`. All four covers are in (Lars' two are in `src/site/content/images/books/`). `/commissions/` uses the same strip with `bare: true` in place of its cover-image placeholder.
- [x] **Navigation** (`site.json`): Home · About · Illustration · DevRel · Portfolio · Shop. Remove Speaking from the nav. Done 2026-11-10. The links are a little closer together between 1024 and 1280 px so six items fit beside the social icons. Changed 2026-11-11 to Home · About · Avatars · Illustrations · DevRel · Portfolio: avatars got their own entry, and Shop left the nav. Since 2026-11-13 it's Avatars · Illustration · DevRel · Writing · Dad Jokes! · About: the logo goes home, and Portfolio is in the footer (the site review's Phase 2, then the Dad Jokes! page).
- [x] **Footer** (`partials/footer.edge`): add Speaking, Bio & headshots and Résumé links. Done 2026-11-10: a "Work with Me" column with Commissions, DevRel, Speaking, Bio & Headshots and Résumé.
- [x] **Restructure `about.md`** (plan item 6): story first, then the "I believe people want to do their best work" philosophy given visual weight, two paths (commissions and DevRel), the books, a real photo next to the avatar, short testimonial excerpts, and the link directory moved to the bottom or `/links/`. Drafted 2026-11-10: the drawn and photographed portraits side by side, the one-liner intro, "I believe people want to do their best work" as a pull line, "Two Ways to Work with Me" (commission and DevRel cards), the book strip, the longer story, short endorsement excerpts (the full versions are on `/devrel/`), and the link directory at the bottom (the Mastodon `rel="me"` link is kept).
- [x] **Links page** (`links.html`): commissions (or `/draw/`) first, then DevRel, blog and books, with the rest under "More." Done 2026-11-10: commissions and DevRel first as solid buttons, then Blog, Books and About, with everything else under a "More links" disclosure. The no-nav layout now includes the icon sprite, so the footer's social icons show on `/links/` (they were blank before).

### 6. Post callouts

- [x] **End-of-post callout by tag** (plan item 7, `layouts/post.edge:37`, `components/support.edge`): `illustration`/`books` → commissions; `devrel`/`speaking`/`conferences`/`leadership`/`community`/`career` → `/devrel/`; everything else → Ko-fi. Pass the tags in as a prop (components have isolated scope), with `data-cta` values `post-callout-commissions` and `post-callout-devrel`. Done 2026-11-10: `calloutFor()` in `src/utils/site/filters.js` picks the variant (posts tagged `devrel` get DevRel first, so the *DRAP* posts do), with smoke tests.
- [x] Tag older drawing posts with `illustration` where it's missing (only 10 of 107 posts have it). Audited 2026-11-10: the drawing posts already have it. Two judgment calls left untagged: "How to be a Superhuman Communicator" and "AI Really *Is* Taking My Job".

### 7. Social and post-purchase

- [x] **No-nav commission landing page for social bios** (plan item 8) using `layouts/no-nav.edge`, at an easy URL like `/draw/`. Update the Instagram, Bluesky and X bios. Drafted 2026-11-10 at `/draw/` (`layouts/links.edge`): an avatar pitch with the $30 price, six sample avatars, Lars' quote, the three avatar steps, and a link to all commissions. Update the bios to point at it.
- [ ] **Post-purchase message** (plan item 11): customize the Shopify order confirmation and status page with what happens next, what to send, turnaround and "tag @reverentgeek when you use it."

### Ongoing

- [ ] **Collect testimonials** (plan item 12): Lars, the *DevRel Activity Patterns* co-authors, five to ten past avatar and logo clients, and DevRel colleagues. Ask every new commission client for a sentence at delivery, and get permission for name and image. Four are in as of 2026-11-13: Greg Svoboda (the first, 2026-11-11), Pieter den Heten, Bernardo Martinez and Anthony Dellavecchia. Clients can send one through `/leave-a-review/` (a Netlify form, linked from `/commissions/` and `/avatars/`). Testimonials live in `src/site/_data/testimonials.json` and render with `components/testimonial.edge`. Add each new one to the JSON file and place it with the component.
- [ ] **Marketing routine** (plan, "Marketing beyond the website"): weekly process posts, announced openings, a story per commission, referrals at delivery, a few direct messages a month to DevRel leads, authors and organizers, and a commissions line in talks.
- [ ] **Revisit an email list later.** RSS-to-email automation (e.g., Buttondown reading `feed.xml`) is the low-effort option if it's ever wanted.
