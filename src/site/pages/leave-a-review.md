---
id: 8c01dca0df8611f1a0a8270adb680c3b
title: "Leave a Review"
feature_image:
description: "Did I draw an avatar for you, illustrate your book, or speak at your event? I'd love to hear how it went."
meta_description: "Leave a review for David Neal (ReverentGeek) about an avatar, illustration, book, talk, or workshop."
date: 2026-11-13
slug: leave-a-review
---

Did I draw an avatar for you, illustrate your book, or speak at your event? I'd love to hear how it went! A few kind words help other folks decide to take the leap. (Honest feedback is welcome too. I can take it.)

<!-- Netlify Forms: submissions show up under Forms > review in the Netlify dashboard. -->
<form class="review-form" name="review" method="POST" action="/leave-a-review/thanks/" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="review">
  <p class="sr-only"><label>Leave this empty if you're a human: <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
  <p>
    <label class="review-label" for="review-name">Your name</label>
    <input class="review-input" id="review-name" name="name" type="text" autocomplete="name" required>
  </p>
  <p>
    <label class="review-label" for="review-role">Title and company <span class="review-optional">(optional)</span></label>
    <input class="review-input" id="review-role" name="role" type="text" autocomplete="organization-title" placeholder="Developer Advocate at Example Co.">
  </p>
  <p>
    <label class="review-label" for="review-work">What did we work on?</label>
    <select class="review-input" id="review-work" name="work" required>
      <option value="">Pick one</option>
      <option>An avatar</option>
      <option>An illustration, logo, or stickers</option>
      <option>A book or course</option>
      <option>A talk or workshop</option>
      <option>Something else</option>
    </select>
  </p>
  <p>
    <label class="review-label" for="review-text">Your review</label>
    <textarea class="review-input" id="review-text" name="review" rows="6" required></textarea>
  </p>
  <p>
    <label class="review-label" for="review-link">Your website or social profile <span class="review-optional">(optional)</span></label>
    <input class="review-input" id="review-link" name="link" type="url" autocomplete="url" placeholder="https://">
  </p>
  <p>
    <label class="review-label" for="review-email">Your email <span class="review-optional">(optional, never shown)</span></label>
    <input class="review-input" id="review-email" name="email" type="email" autocomplete="email">
  </p>
  <p class="review-note">By sending this, you're OK with me sharing your review on this site with your name and title.</p>
  <p><button class="cta-button" type="submit" data-cta="send-review">Send my review</button></p>
</form>
