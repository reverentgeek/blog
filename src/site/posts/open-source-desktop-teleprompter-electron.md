---
id: 3db77ec0c44411ee940b47015652ade6
title: "My Open-Source Desktop Teleprompter Built with Electron"
feature_image: /content/images/open-source-desktop-teleprompter-electron/desktop-teleprompter.jpg
description: I wasn't happy with the teleprompter apps I found, so I built my own! Maybe you'd like to use it, too!
date: 2024-02-24
slug: open-source-desktop-teleprompter-electron
---

For several years, I've created videos and delivered presentations from [my home studio](/my-video-streaming-setup/). I invested in a teleprompter rig to use my iPad to view notes or a script while maintaining eye contact with the camera.

## Use a teleprompter for better video calls

I use the teleprompter as an extended monitor to mirror whatever is running on my laptop screen. This is perfect for Zoom, Google Meet, Microsoft Teams, or whatever video conferencing software I need to use. I can see who I am talking to while looking directly into the camera. This is so much more engaging for meetings and interviews!

I use [Duet Display](https://www.duetdisplay.com/) to mirror my desktop screen to the iPad. I can also configure Duet Display to flip the orientation of the video so that whatever appears on the teleprompter is readable.

![Teleprompter setup](/content/images/open-source-desktop-teleprompter-electron/teleprompter.jpg)

## I want a different kind of teleprompter app

I tried lots of teleprompter apps. Some were good. But, one of the things I didn't like is if you're using an app, it takes up the entire display, and I could not see anything but my own script.

* When recording an interview, I want to see the person I'm interviewing _and_ see my notes and list of questions.
* When creating a voiceover for a recording, I want to see the recording _and_ my script.
* When giving a presentation, I want to see my video output _and_ my notes.

I never want to look away from the camera when I'm engaged in any of these things.

## Electron to the rescue

[Electron](https://www.electronjs.org/) is an open-source framework for building cross-platform desktop apps using web technologies (HTML, CSS, and JavaScript). If you've ever used Visual Studio Code, the desktop Slack app, or the desktop GitHub app, those are all built with Electron!

One of Electron's great features is controlling an application's window, such as the frame, transparency, and menus. I created a frameless, transparent window and then set the background color opacity to see through the content in the window. This app is a perfect solution for overlaying a script or notes on top of whatever app I'm mirroring to my teleprompter display!

![Teleprompter setup](/content/images/open-source-desktop-teleprompter-electron/public-speaking-slide.jpg)

## Convert Markdown to HTML

I'm a fan of [Markdown](https://www.markdownguide.org/getting-started/). I've used Markdown for blogs and other content I've created for years. I knew I wanted my teleprompter app to support Markdown, so I used [Showdown](https://showdownjs.com/) to convert any content written in Markdown to display as HTML in the UI.

## Presentation clicker support

Borrowing an idea from a web-based presentation app I used many years ago, I added support for navigating forward and backward in the script using a presentation clicker and the arrow keys on the keyboard. This feature is based on the placement of H2 tags in the script.

## Use the source, Luke

If you're interested in using the application or seeing how any of it was built, [get the source code](https://github.com/reverentgeek/electron-teleprompter) and try the app yourself! Please contribute ideas and code! I'd love to know how this app could better fit your needs.
