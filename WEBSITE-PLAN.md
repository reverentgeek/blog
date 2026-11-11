# Website Effectiveness Plan

A plan for making reverentgeek.com better at its two jobs: **bringing in illustration commissions** and **attracting DevRel work**. The checklist lives in [`TODO.md`](TODO.md#website-effectiveness); this file has the reasoning, the current state and the detail behind each item.

Written 2026-11-10.

## Where this came from

The ideas are adapted from Jennie Lakenan's *Coach Website Blueprint*, a free five-day video course on structuring a coaching website with a version of the StoryBrand framework. Transcripts, key frames and summaries of the course are in `~/Projects/demos/video-processor/output/` (start with `README.md`).

The course is written for coaches selling a free consultation call, so not everything fits. What carries over is the structure: each page has one job, the copy speaks to the visitor's goals before the author's résumé, social proof and a simple process remove doubt, and the same message is repeated from different angles across pages. What doesn't carry over is the sales-call funnel and pressure-heavy "negative stakes" copy. The course itself says to "season to taste."

## Goals

1. **Illustration commissions:** avatars, stickers, book illustration, logos, social media graphics, live event illustration and other custom work.
2. **DevRel work:** attract full- or part-time Developer Relations roles and contracts. This is the primary career.

Supporting, not a goal of its own:

- **Content** (blog posts, videos, drawings). It's what brings people to the site, and it should lead them to goal 1 or 2.
- **Speaking.** Not a goal right now, but the talk history is strong evidence for the DevRel goal.
- **Software projects.** Supporting evidence for DevRel, not a separate goal.

### Deliberately not doing (for now)

- **An email list.** In the course, the list exists to nurture people who aren't ready to buy, because coaching takes weeks of trust-building. An avatar commission is usually a quick decision, and a list needs a commitment to regular emails that isn't there today. RSS stays. If it's ever wanted, a service like Buttondown can email new posts automatically from `feed.xml`, which gives a list with no extra writing.
- **Pressure copy.** Use the empathy in the course's "negative stakes" sections, not the fear. It would clash with the site's voice.
- **Turning the blog into a funnel.** Posts are the product. CTAs go at natural stopping points, never in the way of reading.

## Principles from the course, translated

| Course principle | What it means here |
| --- | --- |
| Every page has **one primary call to action** (and maybe one quieter secondary one). | `/commissions/` asks for a commission. `/devrel/` asks for a conversation. The homepage sends each audience to its own page instead of picking one. |
| Lead with the **visitor's aspiration**, not your biography. | Commission copy starts with what the buyer gets (a distinctive avatar, a book that looks great). DevRel copy starts with what an organization gets. |
| Specific subtext so visitors **know instantly they're in the right place**. | "I draw avatars, stickers, logos and book illustrations for developers, authors and tech companies" beats "family man, geek, musician…". |
| **Show your face.** Photos and video build trust. | The illustrated avatar *is* the face, and it's also a product sample. Add a real photo on About and `/devrel/`. Consider a short video on `/commissions/`. |
| **Empathy + authority**: show you understand them, then why you're qualified. | Commissions: you know developers and conferences from the inside. DevRel: 10+ years, five companies, a book on DevRel. |
| **Testimonials**, repeated across pages. Repetition is fine. | Lars Klint (already in print, in his acknowledgements) and DevRel Activity Patterns co-authors for commissions. Randall Degges and Stephen Franklin for DevRel. Reuse them anywhere relevant. |
| **Three-step process**: three is memorable, and it removes "what happens next?" doubt. | Commissions: *Tell me what you need → I sketch, you give feedback → you get final files.* |
| **Benefits over features.** | "Files ready for GitHub, Slack, slides and stickers" beats "PNG and SVG, 2000 px." |
| **Real examples** make the prompts concrete. | The three books are the headline examples. |
| **Final CTA** that restates the transformation and repeats the button. | Every commission and DevRel page ends with the button again. |
| **Focused landing page** with no navigation for social, talk and ad traffic. | A no-nav commission landing page for social bios, using `layouts/no-nav.edge`. |
| **Thank-you page**: set expectations right after the "yes." | After a commission purchase, say what happens next and when (Shopify order confirmation, or a page the inquiry form returns to). |
| Same core message **from different angles** on every page. | A consistent tagline and description everywhere (see "Consistency" below). |

## Current state (2026-11-10)

| Where | What's there | Gap |
| --- | --- | --- |
| Homepage hero (`src/site/index.edge:26`) | "Hi, I'm David Neal. I'm a family man, geek, musician, illustrator, international speaker, software developer, and author…" with buttons **Browse by topic** / **Subscribe via RSS** / **More about me**. | A list about you, and no button serves either goal. |
| Navigation (`src/site/_data/site.json`) | Home, About, Speaking, Portfolio, Buy My Stuff! | Speaking is in the nav but isn't a goal. There's no DevRel entry, and commissions are hidden under "Buy My Stuff!" |
| Site description (`site.json:4` vs `site.json:6`) | "Ramblings on bacon, drawing, and technology" vs. the feed's "Ramblings on faith, tech, music, and drawing." | Inconsistent, and neither mentions illustration-for-hire or DevRel. |
| About (`src/site/pages/about.md`) | Intro, then a long link directory, then "Who Am I? The Longer Answer", then two endorsements at the very bottom. | The story starts halfway down, the strongest proof is last, and there's no CTA. |
| Shop (`src/site/pages/shop.md`) | Commissions, dad-joke book, stickers, t-shirts and Ko-fi on one page. The commission section is one sentence followed by a Shopify collection widget. | No benefits, process, examples, testimonials or turnaround. Commissions compete with merch. |
| Portfolio (`src/site/pages/portfolio.md`) | Buttons for **Order an avatar!** and **Commission a custom illustration!** (mailto), plus a tile grid. | No book illustration category. |
| Avatars gallery (`src/site/pages/avatars.html`) | 200+ avatars (out of thousands drawn), one CTA sentence at the top, and `alt="avatar illustration"` on every image. | No CTA at the bottom, no testimonials, generic alt text. |
| DevRel portfolio (`src/site/pages/devrel-portfolio.md`) | Links to posts, talks, keynotes, code samples and other work. | A reference list with no framing or CTA. |
| Speaking (`src/site/pages/speaking.md`) | Opens with "*No speaking engagements currently scheduled.*", then a long table of past talks. | A weak first line, and the impressive history isn't summarized. |
| Post footer (`_includes/layouts/post.edge:37`, `components/support.edge`) | Every post ends with the Ko-fi "Buy me a coffee" callout. | Most visitors land on posts, and none of them see an ask related to either goal. |
| Links page (`src/site/pages/links.html`) | 20 equally weighted links. | The top goal isn't first. |
| Books | *DevRel Activity Patterns* appears in two posts (`announcing-devrel-activity-patterns-book.md`, `developer-relations-activity-patterns.md`). Neither of Lars Klint's books (*Automate Everything, Notice Nothing* and *Microsoft Azure in Action*) is on the site. | The three strongest proof points are nearly invisible. |
| Testimonials | Two DevRel endorsements on About. | None for illustration, even though Lars thanks you in print (see "The big idea"). |
| Analytics | GA4 (`G-DVT1KMSK18`) page views only. | No way to tell whether a change brings in more commissions or inquiries. |

## The big idea: the books

The three books are the best evidence on the site:

- ***Developer Relations Activity Patterns*** (<https://www.amazon.com/Developer-Relations-Activity-Patterns-Management/dp/B0FJWPD3CQ>): co-author, plus the cover and chapter illustrations. It's proof for **both** goals: DevRel expertise (strategy, execution and measurement, literally the book's subject) and book illustration.
- ***Automate Everything, Notice Nothing*** by Lars Klint (<https://larsklint.shop/products/automate-everything-notice-nothing>): 158 pages, "illustrated throughout," for an outside client, and the author is happy with the result. In Lars' words, it's "six years of automating a farm in rural Victoria, told almost entirely through the things that went wrong." Its theme: "monitoring tells you something is wrong, but only automation does anything about it." Lars is a Principal Developer Advocate at Atlassian, so his praise counts with DevRel employers as well as commission buyers.
- ***Microsoft Azure in Action*** by Lars Klint (Manning, October 2025, foreword by Scott Guthrie; <https://www.manning.com/books/microsoft-azure-in-action>): contributed illustrations to a book from a well-known technical publisher. The Manning name reassures both audiences: tech authors and publishers looking for an illustrator, and DevRel employers who value someone who can explain technical concepts visually.

Lars coming back for a second book is the strongest commission evidence there is: **a repeat client**. Together, the two books make one case study, "I've illustrated two of Lars Klint's books," which no visitor would currently know about.

### The testimonial you already have

Lars thanks you in the acknowledgements of *Automate Everything, Notice Nothing*:

> **David Neal**, who has now illustrated two of my books and who somehow draws the joke I was trying to make rather than the one I actually made.

It's close to an ideal testimonial for a commission page:

- **It's specific.** It describes what you do, not just "great work."
- **It answers the buyer's biggest worry,** "Will the artist understand what I mean?", with "draws the joke I was trying to make."
- **It proves a repeat client:** "now illustrated two of my books."
- **It's credible,** because it's published in the book itself rather than written for a sales page.

Lars said it again publicly in his LinkedIn launch post for the book (about three weeks before 2026-11-10, so around 2026-10-20):

> It's a real book now. Paper, spine, the lot.
>
> Automate Everything, Notice Nothing — six years of automating a farm in rural Victoria, told almost entirely through the things that went wrong. The pump that ran all night and flooded a paddock. The access point I mounted with double-sided tape that lasted three weeks. The UPS runtime maths I got publicly, comprehensively wrong until someone in the comments explained watts versus watt-hours to me.
>
> The thread running through all of it: monitoring tells you something is wrong, but only automation does anything about it. I had a tank level sensor working perfectly for two years. It changed nothing. That gap between knowing and doing is where most systems fail — not in the technology, in the human standing next to it.
>
> 158 pages, illustrated throughout by David Neal, who somehow draws the joke I was trying to make rather than the one I actually made.

The LinkedIn version adds two things the acknowledgement doesn't have:

- **Scope:** "158 pages, illustrated throughout." This was a whole-book commission, not a few spot drawings.
- **Who's saying it:** Lars' LinkedIn headline is *Principal Developer Advocate @Atlassian*. Praise from a DevRel leader at a well-known company counts on `/devrel/`, in the "illustrator advantage" section, as well as on `/commissions/`.

**How to use the two versions:**

- **Pull quote** (`/commissions/` hero, case-study post): *"…illustrated throughout by David Neal, who somehow draws the joke I was trying to make rather than the one I actually made."* Attribute it to *Lars Klint, Principal Developer Advocate at Atlassian and author of Automate Everything, Notice Nothing*.
- **Proof:** in the case-study post, show both the printed acknowledgements page and the LinkedIn post (a screenshot or an embed). Link the post's URL so readers can see it's real. Trim the screenshot to the text, without his video frame, unless he's happy to have that shown.
- **Permission:** both are public, but ask Lars as a courtesy before using them in marketing; he'll likely be pleased.

### The DevRel book's first review

A five-star Amazon review of *Developer Relations Activity Patterns* (paperback), by Lindsay Brunner, November 5, 2026, titled **"Basically the encyclopedia of DevRel"**:

> "Developer relations" covers a ridiculous amount of ground at a SaaS company. This book walks through pretty much all of it: the tactics, how to actually implement them at your organization, and what success looks like once you do.
>
> I pull it out regularly when I'm explaining a proposed strategy to a client. Here's what I'm recommending, here's why, and here's an entire book of experienced practitioners explaining how it works. Very useful when your job involves getting people to understand what they're agreeing to fund.
>
> I've recommended that clients buy their own copies. It's basically the encyclopedia of DevRel, and mine gets used.

Why it's valuable for the DevRel goal:

- **The title is a ready-made pull quote:** "Basically the encyclopedia of DevRel."
- **It speaks directly to employers' concerns:** strategy, implementation and "what success looks like," plus "getting people to understand what they're agreeing to fund," which is the problem of proving DevRel's value to leadership. That's the problem the `/devrel/` page says you solve.
- **It's from a practitioner who uses it with clients,** not a casual reader: "mine gets used."
- **It's independent:** an unsolicited public review.

**Attribution:** it reviews a multi-author book, so present it as praise for *the book you co-authored*, not as an endorsement of you personally. Place it next to "co-author of *Developer Relations Activity Patterns*" (e.g., "Called 'basically the encyclopedia of DevRel' by a DevRel consultant"). Link to the book's Amazon page. Short excerpts with the reviewer's name are normal, but a quick note to Lindsay asking whether she minds being quoted is a nice touch, and could start a useful connection. It doesn't mention the illustrations, so it doesn't belong on `/commissions/`.

### Permissions

Lars self-published *Automate Everything, Notice Nothing*, so his permission covers the acknowledgement, the LinkedIn post, the cover and the illustrations. Assume Lars and Lindsay both say yes and build with their quotes now; send the requests in parallel. No art from *Microsoft Azure in Action* will be used (the cover and a description of the work only), so there's nothing to clear with Manning.

Your other distinctive strength is being **both** a developer advocate and an illustrator, someone who explains technical ideas visually. The Okta post *An Illustrated Guide to OAuth and OpenID Connect* is a good example. That combination is rare, and both "Work With Me" pages should say so.

## Competing with generative AI

Commissions and inquiries have been down to a handful a month for about a year. Part of that is generative AI: anyone can make a passable image in seconds, and buyers who don't know what makes illustration work think it's good enough. The site can't out-cheap a free tool, so it shouldn't try. It should sell what a prompt can't produce, and prove it with evidence instead of complaining about AI.

**What AI can't do, and how the site proves it:**

| What you offer | Proof to put on the site |
| --- | --- |
| **You understand the idea.** You draw what the client means, not what they typed. | Lars' quote is literally this: "draws the joke I was trying to make rather than the one I actually made." Lead with it. |
| **A collaborator.** Questions, sketches, feedback rounds and a person who cares whether it works. | The three-step process, and sketch-to-final pairs in the case study and on `/commissions/`. |
| **Consistency across a series.** The same characters, style and voice over 158 pages, a sticker set or a conference's whole visual identity. | *Automate Everything, Notice Nothing* as a whole-book commission, the WordCamp event sets, and the 200+ avatars in one recognizable style. |
| **Technical accuracy.** A developer who understands OAuth, Azure or a CI pipeline draws diagrams and jokes that are right. | *An Illustrated Guide to OAuth and OpenID Connect*, *Microsoft Azure in Action*, tech humor. |
| **Art you can own.** Original, human-made work. In the US, images generated by AI without meaningful human authorship can't be registered for copyright (the Copyright Office's 2025 report, and *Thaler v. Perlmutter*). That matters most for logos, mascots and book covers. | A line in the FAQ ("Original, hand-drawn work with the usage rights spelled out"). Keep it factual, not legal advice. |
| **A recognizable style.** People hire you to look like *you*, and the result doesn't look like everyone else's AI image. | The galleries, and process and timelapse clips showing the art being drawn. |

**How to say it:** confident and positive, in the site's voice. "Hand-drawn by a developer who gets the joke" says it without sounding defensive. One short "Why not just use AI?" FAQ answer on `/commissions/` is enough; don't make it the page's theme.

**Show the work being made.** Process content is the most direct proof that a human drew it, and it doubles as marketing: sketch-to-final pairs, short timelapse clips (you already stream illustration; see `illustration-streaming.md`), and photos of printed books, stickers and shirts in people's hands.

## Marketing beyond the website

With a handful of inquiries a month, the site's conversion rate is only part of the problem. Few of the right people are arriving in the first place. The website's job is to close: when someone hears about you, the site convinces them. Getting them there is a separate job, and it mostly comes from your network and from showing work in public.

**Who buys, and where they are:**

- **DevRel and developer marketing teams:** stickers, swag, mascots, booth art and social graphics. This is your own field, and your DevRel network is the best sales channel you have. These buyers have budgets and buy again.
- **Conference and meetup organizers:** event illustration, sketch notes and speaker avatars (the WordCamp sets prove it).
- **Tech authors, course creators and publishers:** book and course illustration. Lars is the proof; other self-publishing technical authors are the audience.
- **Developers, speakers, streamers and podcasters:** avatars. Quick, well-defined and listed with a "starting at" price.

**A small, sustainable routine** (pick what fits; none of it requires an email list):

1. **Post process, not just finished art.** Once a week: a sketch-to-final, a timelapse or a "what the client asked for vs. what I drew" story. Link to `/draw/` or `/commissions/`.
2. **Announce openings.** "I have room for three avatar commissions this month" gives people a reason to act now. It's scarcity that's true, not pressure.
3. **Turn every project into a story.** A short post or social thread per commission (with the client's OK), ending with the soft CTA. The Lars case study is the template.
4. **Ask for referrals and reshares at delivery.** "Tag @reverentgeek" plus "know anyone else who needs an illustrator?"
5. **Reach out directly, a few people a month.** DevRel leads you know who are planning swag or a conference, authors who just announced a book, and organizers of events you've spoken at. One warm message with a relevant sample beats any amount of SEO.
6. **Use the speaking and DevRel audience.** A slide or a closing line in talks ("I drew everything in this deck; I take commissions") and a link in the speaker bio.

Track the inquiries each of these brings in (ask "how did you hear about me?" in the inquiry template), so you can drop what doesn't work.

## New site structure

```text
Home ─┬─ "Hire me to illustrate"  →  /commissions/   CTA: start a commission
      ├─ "Hire me for DevRel"     →  /devrel/        CTA: let's talk (email) + résumé
      ├─ About                    →  links to both
      ├─ Books strip              →  case-study posts / book pages
      └─ Posts → end-of-post CTA by topic
                   ├─ illustration / doodles / books → /commissions/
                   ├─ devrel / speaking / tech       → /devrel/
                   └─ everything else                → Ko-fi (as now)

Social bios → /draw/ (no-nav commission landing page) → order / inquiry → "what happens next"
```

Navigation becomes **Home · About · Avatars · Illustrations · DevRel · Portfolio** (updated 2026-11-11: avatars, the best-selling and best-defined product, get their own page and nav entry, and Shop becomes a small "Stickers & T-Shirts" page linked from the galleries, portfolio and footer). Speaking moves to the footer and to `/devrel/`. Labels are up for discussion; the point is one nav entry per goal.

---

## Work items

### 1. Lars Klint books case study (blog post)

**Why first:** it's the most visible missing piece, it's content in its own right (search, social sharing), and the commissions page, homepage strip and portfolio tile all link to it.

**Angle:** a repeat client. One post covering both books is stronger than two separate ones, because "he came back for a second book" is the story. *Automate Everything, Notice Nothing* leads since it's the newer book and holds the acknowledgement. *Microsoft Azure in Action* is the first collaboration, with the Manning credibility.

**Working title ideas:** "Drawing the Joke Lars Meant: Illustrating Two Books for Lars Klint", "I've Illustrated Two of Lars Klint's Books", or "Illustrating *Automate Everything, Notice Nothing*". Scaffold with `pnpm run post create "…"`. Tags: `books`, `illustration` (plus any existing tag that fits).

**Outline:**

1. **Hook:** open with the acknowledgement quote, then a line on who Lars is and the two books. One or two finished illustrations up top.
2. **How it started: *Microsoft Azure in Action*** (Manning, 2025). What illustrations you contributed, what they explain, and how illustrating for a technical publisher works.
3. **Round two: *Automate Everything, Notice Nothing*.** What the book is about: six years of automating a farm in rural Victoria, told through what went wrong (the pump that flooded a paddock, the access point held up with double-sided tape, the watts-versus-watt-hours UPS math). Then what Lars wanted the illustrations to do (tone, humor, explaining ideas, breaking up text), and how a second project with the same author went differently. A book built on things going wrong is a natural fit for comic illustration, so say so.
4. **The process:** concepts and sketches, through feedback rounds, to finals. Show sketch-to-final pairs if you have them. This section reassures future clients more than any other, because it shows what working with you is like. "Drawing the joke he meant" is a natural thread: how you work out what the author is really going for.
5. **Favorite pieces:** three to five illustrations from the two books, each with a line about the idea behind it.
6. **What Lars said:** the acknowledgement (a photo of the printed page if possible), plus his social posts and any direct testimonial.
7. **Get the books:** links to both product pages.
8. **Soft CTA:** "Writing a book, course or docs that need illustrations? Let's talk." Link to `/commissions/`.

**Materials needed:**

- [x] The acknowledgement text from *Automate Everything, Notice Nothing* (quoted under "The testimonial you already have").
- [ ] A photo or screenshot of the printed acknowledgements page.
- [ ] Finished illustrations from both books, plus sketches and work-in-progress shots if available. Put them in `src/site/content/images/<post-slug>/`; the image pipeline handles sizes and formats. Check your agreement with Manning about reproducing the *Azure in Action* illustrations, since publishers often hold those rights.
- [ ] Photos of the printed books, if available. Physical copies read as "real."
- [ ] Cover images for both books.
- [x] Lars' LinkedIn launch post (quoted under "The testimonial you already have").
- [ ] The LinkedIn post's URL, so the case study can link to it, and a trimmed screenshot.
- [ ] Any other posts from Lars about the illustrations (X, Bluesky, Mastodon), if there are any.
- [ ] Lars' OK to quote him (including the acknowledgement) and use the covers.
- [ ] A few sentences on how each project came about and what was fun or tricky.

**Getting more from Lars.** The acknowledgement already covers "understands what I mean" and "repeat client." A direct testimonial could add what the acknowledgement doesn't: the experience of working together and the results. Use the before/after shape the course recommends: *"Before working with David, I [needed / was worried about]… Working together was… The result…"* Questions to send him:

1. What did you want the illustrations to do for the book?
2. What was working with David like? (Communication, feedback rounds, turnaround.)
3. How have readers reacted to the illustrations?
4. Who would you recommend David to?
5. May I use your name, photo and book cover alongside the quote?

### 2. `/commissions/` page (the "Work With Me" page for illustration)

**One job:** get a qualified commission inquiry or purchase.

**Section by section** (the course's structure, adapted):

1. **Hero**
   - Headline about the buyer's aspiration. Directions to try: "Illustrations that make your work unmistakably yours" / "Avatars, stickers and book illustrations with personality."
   - Subtext naming what you draw and for whom: developers, authors, conferences, tech companies.
   - Primary button: **Start a commission**, which scrolls to the options or opens the inquiry. Secondary, quieter: **See my work** (portfolio).
   - Visual: your own illustrated avatar, a collage, or a book cover.
   - **Pull quote:** Lars' acknowledgement, "…somehow draws the joke I was trying to make rather than the one I actually made." It answers the buyer's biggest worry before they scroll.
2. **Featured work: books.** All three covers side by side (*Automate Everything, Notice Nothing*, *Microsoft Azure in Action*, *Developer Relations Activity Patterns*), a short line each, "Illustrated two books for Lars Klint" called out as a repeat client, and links to the case-study posts.
3. **What I draw.** A card for each category, with a sample image, one benefit line and a link to its gallery:
   - Avatars → `/avatars/`
   - Stickers and t-shirts → `/illustrations/`
   - Book and course illustration → the case-study posts
   - Logos and brand marks → `/illustrations/`
   - Social media graphics
   - Live event illustration and sketch notes → `/sketch-notes/`, and the WordCamp posts (`wordcamp-us-2024-illustrations.md`, `wordcamp-eu-2024-illustrations.md`, `wordcamp-asia-2025-illustrations.md`)
   - Tech humor and editorial cartoons → `/tech-humor/`
4. **Why work with me (empathy + authority).** You're a developer and developer advocate who draws, so you understand the audience, the jokes and the technical ideas. Mention years of drawing, the books, conferences and well-known clients if you can name them.
5. **Testimonials.** Lars first, then co-authors and avatar customers. Use the testimonial plan in item 12.
6. **How it works (three steps).** Something like:
   1. **Tell me what you need.** Order an avatar directly, or send the details for anything custom.
   2. **I sketch, you react.** You see concepts, and we refine them together.
   3. **Get your files.** In formats ready for wherever you'll use them.
7. **Details, written as benefits:** typical turnaround, number of revision rounds, file formats ("ready for GitHub, Slack, slides and print") and usage rights. **Avatars show a "starting at" price**, since they're well defined. Everything else depends on scope, so it says "tell me about your project and I'll send a quote." A short FAQ works well here, including "Why not just use AI?" (see "Competing with generative AI").
8. **Final CTA.** Restate the outcome and repeat the button.

**How people buy:**

- **Avatars:** keep the Shopify buy button (the collection widget in `shop.md`), on this page or one click away.
- **Everything else:** inquiry by email for now (`mailto:` with a subject like "Commission inquiry" and a body template listing what to include: what it's for, timeline, budget range and references). Add "How did you hear about me?" to the template, to see which marketing works. A Netlify form is a later upgrade that would allow a real "thanks, here's what happens next" page.

**Page mechanics:** create with `pnpm run page create "Commissions"`. Point the old anchor `/shop/#commission` here (`avatars.html` links to it). Keep the rest of `shop.md` for merch.

### 3. Homepage (`src/site/index.edge`)

- **Rewrite the hero around the two goals.** Keep "Hi, I'm David Neal" if you like, but follow it with one or two lines that say what you do *for people*, then two primary buttons:
  - **Hire me to illustrate** → `/commissions/`
  - **Hire me for DevRel** → `/devrel/`
  - Keep "Browse by topic" as a quieter link, or drop it.
- **Use the avatar as a product sample.** A small caption like "I drew this. I can draw you, too." turns the existing image into a commission pitch.
- **Add a "Books" strip** between the hero and the post list on page 1: three covers, a line each and links. It's instant social proof for both audiences.
- Leave the post list as it is.

### 4. `/devrel/` page (the "Work With Me" page for employers)

**One job:** start a conversation about a DevRel role or contract.

1. **Hero:** what you bring an organization, e.g., developer programs that build trust and can be measured, explained clearly (often with drawings). CTA: **Let's talk** (email) and **Résumé**.
2. **The problem you solve:** DevRel is hard to plan, staff and prove the value of. Keep the tone empathetic, not fearful. This is the book's subject, so it doubles as authority.
3. **What I do:** a short list of outcomes, adapted from the "On the developer experience side" and "On the leadership side" lists in `about.md`.
4. **Authority:** 10+ years in DevRel (MongoDB, Plaid, Slack, Asana, Okta); co-author of *Developer Relations Activity Patterns*, with the cover and the "Basically the encyclopedia of DevRel" review excerpt (see "The DevRel book's first review"); a longtime Microsoft MVP (through 2026); more than 170 speaking events, many with several talks or workshops (summarize, e.g., "DevSum, CodeMash, KCDC, NDC, All Things Open…"); 20+ years building software.
5. **The illustrator advantage:** visual explanations of technical concepts (e.g., *An Illustrated Guide to OAuth and OpenID Connect*), sketch notes, talk illustrations, and illustrations for technical books (*Microsoft Azure in Action*, *Automate Everything, Notice Nothing*). Lars Klint's quote fits here too, attributed with his Atlassian DevRel title: a peer in the field vouching for the skill.
6. **Testimonials:** move or copy the Randall Degges and Stephen Franklin endorsements from `about.md`. Ask current and former colleagues for one or two more, especially ones that mention results. Keep these personal endorsements separate from the book review, which praises the book rather than you.
7. **Proof:** a curated selection from `devrel-portfolio.md` (best posts, talks, code, the book). Link to the full portfolio for the rest.
8. **Final CTA:** repeat **Let's talk** and **Résumé**.

**Availability (decided):** you're happy at MongoDB and not looking to change roles, but you want to be very attractive to the right opportunity. So the page says you're **open to collaboration**: advising, workshops, talks, writing, illustration for DevRel teams, and conversations with people building developer programs. It never says "looking for work" or "available full-time." The page's real job is to make the case so well that a hiring manager reaches out anyway, so the authority, proof and testimonials sections carry it. A CTA like **Let's talk** or "Want to collaborate?" fits this. Keep naming MongoDB as the current role; it's credibility.

### 5. Navigation, footer and consistency

- **Nav** (`site.json` → `navigation`): Home · About · Illustration (`/commissions/`) · DevRel (`/devrel/`) · Portfolio · Shop. Remove Speaking.
- **Footer** (`partials/footer.edge`): add "Speaking", "Bio & headshots" and "Résumé" under Connect or a new "Work" heading, so organizers can still find them.
- **One description everywhere.** Pick a single site description and use it in `site.json` (`description` and `feed.subtitle`), the footer tagline, `bio.md`, `about.md` and social bios. It should mention both illustration and DevRel and keep the personality, e.g., "Drawings, developer relations, and the occasional bacon."
- **Keep `/speaking/` live.** Conference sites link to it. Replace the "No speaking engagements currently scheduled" opener with a summary line ("I've spoken at more than 170 events, including…"), and link it from `/devrel/`.

### 6. About page (`src/site/pages/about.md`)

The About page should answer "who are you?" and "who have you helped?", then send visitors to one of the two goals.

- **Open with the story and a mission, not a link list.** Keep the warm intro, then go straight to what you do now: illustrator, developer advocate, author.
- **Lead with a philosophy statement.** You already have one: "I believe people want to do their best work." The course recommends giving it its own visual weight.
- **Two clear paths:** a short paragraph and button each for "Commission an illustration" and "DevRel work."
- **Mention the books** with covers.
- **Move the link directory** to the bottom or to `/links/`.
- **Testimonials:** keep a short excerpt here and put the full versions on `/devrel/`.
- **Add a real photo** next to the avatar. The course leans hard on "show your face."

### 7. Post-level CTAs (`layouts/post.edge`, `components/support.edge`)

Most visitors arrive on a post, so this is where the site's two goals reach the most people.

- **Make the end-of-post callout depend on the post's tags:**
  - `illustration`, `books` → "Like my drawings? I take commissions." → `/commissions/`
  - `devrel`, `speaking`, `conferences`, `leadership`, `community`, `career` → "I help teams build developer programs." → `/devrel/`
  - (The tag counts as of 2026-11-10: speaking 20, community 17, conferences 14, career 12, illustration 10, leadership 4, books 4, devrel 3. Some older drawing posts may need an `illustration` tag added.)
  - Everything else → the Ko-fi callout, as now.
- **Implementation note:** components have isolated scope (see the comment in `support.edge`), so pass the post's tags in as a prop. Add the new variants to the same component, or add a sibling component, so the callout styles stay shared. Run `pnpm run lint` after any JS changes.

### 8. Focused commission landing page for social media

The course's opt-in page idea, without the email capture.

- A short page using `layouts/no-nav.edge`: headline, three to six sample avatars or illustrations, one testimonial, the three steps, and one button. Something like `/draw/` or `/avatar/` that's easy to say and type.
- Put this URL in the Instagram, Bluesky and X bios, and use it for any paid promotion.

### 9. Portfolio, galleries and shop

- **`portfolio.md`:** add a **Book Illustration** tile (linking to the case-study posts) as the *first* tile. Point "Commission a custom illustration!" at `/commissions/` instead of `mailto:`.
- **`avatars.html`:** add a CTA at the **bottom** as well as the top, and point both at `/commissions/` (or the avatar buy button). Add one or two testimonials near the top. Improve the `alt` text over time; every image says "avatar illustration" today.
- **`illustrations.html`, `sketch-notes.html`, `tech-humor.html`, `doodles.html`:** add the same short commission CTA at the top and bottom.
- **`shop.md`:** keep merch (dad-joke book, stickers, t-shirts, Ko-fi). Replace the commission section with a short pointer to `/commissions/`, or keep the avatar buy button here as well.

### 10. Links page (`src/site/pages/links.html`)

The link-in-bio page gets social traffic, so the order matters:

1. Illustration commissions (or the landing page from item 8)
2. DevRel / hire me
3. Blog
4. Books
5. Everything else, perhaps collapsed under "More."

Drop or merge stale entries.

### 11. "What happens next" after a commission

The course's thank-you page lesson: right after someone says yes is the best moment to build trust and set expectations.

- **Shopify order confirmation** (customize in Shopify admin → Settings → Notifications and the order status page): when you'll be in touch, what to send (photo references, preferences), the expected turnaround and how revisions work.
- **Ask them to share.** "Tag @reverentgeek when you use it!" brings in social proof and testimonials.
- If commissions move to a Netlify form later, add a real `/commissions/thanks/` page that says the same things.

### 12. Testimonial collection (ongoing)

Testimonials are the biggest gap on the illustration side.

- **Lars Klint:** the acknowledgement is already in hand; ask permission to use it, and optionally for a direct testimonial (item 1).
- ***DevRel Activity Patterns* co-authors:** a quote about the illustrations, and separately one about you as a DevRel collaborator. Use each where it fits.
- **Past avatar and logo clients:** email five to ten past customers with two or three short questions (what they used it for, how people reacted, whether they'd recommend you). Collect permission to use their name and the image.
- **DevRel colleagues:** one or two more endorsements that mention specific outcomes.
- **Going forward:** ask every commission client for a sentence when you deliver the files.
- **Shape:** short (one to three sentences), with name, role and image where possible, following the before → during → result pattern from the course's template.

### 13. Measurement

Without it, there's no way to tell whether any of this works.

- **Done (2026-11-10):** a delegated handler in `src/assets/js/index.js` sends a GA4 `cta_click` event, with `cta` and `page_path` parameters, for any click on an element with `data-cta`. Existing links are tagged: `order-avatar`, `commission-inquiry`, `contact-email`, `kofi` and `post-callout-kofi`. In GA4, register `cta` as an event-scoped custom dimension (Admin → Custom definitions) so it shows in reports. Clicks inside the Shopify buy button are in a cross-origin iframe and can't be tracked; Shopify's own reports cover orders.
- **Naming:** `data-cta` names the action, not the place (the page path gives the place). New values as pages arrive: `start-commission`, `devrel-talk`, `resume`, `post-callout-commissions`, `post-callout-devrel`.
- **Add GA4 events** for clicks on: commission CTAs (including the Shopify buy button), commission inquiry `mailto:` links, `/devrel/` "Let's talk" and résumé links, and the end-of-post callout variants. A small delegated click handler in `src/assets/js/index.js` using `data-cta="…"` attributes keeps the markup clean.
- **Write down a baseline now:** the reality today is a handful of commissions and inquiries a month for about a year. Record the exact counts per month, so 60–90 days after launch there's something to compare. Also: commissions per month, inquiries per month, DevRel inquiries. Check again 60–90 days after launch.
- Note the trade-off already recorded in `TODO.md` (Lighthouse review): GA4 is the only unused JavaScript on the page. These events give it a reason to stay.

## Suggested order

Revised 2026-11-10. The Lars post isn't blocked anymore (permission is assumed), but the nav still waits until both new pages exist.

1. **Measurement (item 13).** Done first so a baseline builds before anything else changes.
2. **The Lars case-study post (item 1)**, as soon as the illustrations and photos are gathered. Send the permission and testimonial requests at the same time.
3. **`/commissions/` (item 2)** with the shared components and data it introduces (testimonials, the book strip, the process steps, the gallery CTA), plus the portfolio, gallery and shop pointers (item 9). It can go live before the nav changes.
4. **`/devrel/` (item 4)** and the Speaking summary.
5. **The switch, in one release:** homepage, nav, footer, one description and About (items 3, 5, 6) and the links page (item 10).
6. **Post callouts by tag (item 7)**, plus the `illustration` tag audit.
7. **The `/draw/` landing page, social bios and post-purchase message (items 8, 11).**
8. **Ongoing:** testimonials (item 12) and the marketing routine ("Marketing beyond the website").

## Decisions

Made 2026-11-10:

- **Slugs:** `/commissions/` and `/devrel/`.
- **Prices:** avatars show "starting at." Everything else is inquiry-only, quoted by scope.
- **DevRel availability:** "open to collaboration," not looking for a new full-time role (see item 4).
- **Permissions:** assume Lars and Lindsay agree; no *Azure in Action* art is used.

Still open:

- The single site description line.
- Nav labels ("Illustration" and "DevRel" are the working labels).
- Whether Ko-fi stays as the default post callout or only appears on posts that don't match a goal.
- Email list: revisit later. RSS-to-email automation is the low-effort option if wanted.
