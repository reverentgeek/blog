---
id: e1895450b4c611ebad1bd5bfcfd6e38e
title: "Three Ways to Share Node.js Modules Across Multiple Projects"
feature_image: /content/images/3-ways-to-share-nodejs-modules-across-multiple-projects/3-ways-to-share-nodejs-modules-across-multiple-projects.jpg
description:
date: 2021-05-14
tags: posts
slug: three-ways-to-share-nodejs-modules-across-multiple-projects
layout: layouts/post.njk
---

A friend recently asked me about splitting some of their Node.js application into a shared library to be used across multiple projects. There are at least three solutions, and they all have tradeoffs between convenience and portability.

## Move Your Code Into A Separate Project

The first step across all the following options is to move your code into a separate Node.js project. This project will have its own `packages.json` file.

## Option 1: Link to a Local Project Folder

Once you've moved your shared code into a separate project, link the project as a dependency using [npm link](https://docs.npmjs.com/cli/v7/commands/npm-link).

```sh
npm link [../relative-path-to/library]
```

> Note: The shared library can be maintained in a separate repository or the same repository as your other projects (a.k.a, *monorepo*).

**Pros:** Any changes you make to the library project will be immediately available in the other local projects that depend on it. This option is the most convenient method for local development.

**Cons:** Other developers who work on these projects will have to go through specific steps to set it up. This option is the most *inconvenient* method for collaborating with other developers, especially if you are not using a monorepo.

## Option 2: Install From a Git Repository

Once you've moved your shared code into a separate project, push the library code into a Git repository. Then, install the library as a dependency using [npm install](https://docs.npmjs.com/cli/v7/commands/npm-install).

```sh
npm install <git-host>:<git-user>/<repo-name>
# or
npm install <git repo url>

```

To get a new version of your library into your other projects, push updates to the library repository. Then, run [npm update](https://docs.npmjs.com/cli/v7/commands/npm-update) within each project to pull down those changes.

> Note: You may want to think through using a specific commit, branch, or tag to control when other projects receive updates.

**Pros:** You may use private repositories with npm to keep your code safe. And, it is relatively easy for other developers to use your module, as long as they have access to your Git repositories.

**Cons:** There are more steps involved to share changes with your other projects.

## Option 3: Publish to npm

[Publishing a library to npm](https://docs.npmjs.com/cli/v7/commands/npm-publish) is not as scary as it sounds. The first step is to make sure your `package.json` has the basic required information.

```js
{
  "name": "my-awesome-library",
  "version": "1.0.0",
  "description": "Use this to become more awesome",
  "main": "index.js",
  "author": "Bacon McBaconFace <username@mydomain.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://mygithost.com/username/my-awesome-library.git"
  }
}
```

> Note: It's a good idea to include `README.md` and `LICENSE` files in your repository.

Next, publish your package to the registry.

```sh
npm publish
```

If you're not already signed in, you will receive a prompt to sign in or create an account.

Finally, install your new package as a dependency using npm.

```sh
npm install my-awesome-library
```

To get a new version of your library into your other projects:

1. Make changes to the code
1. Update the version number in `package.json` file
1. Push the updates to the git repository
1. Publish the latest package using `npm publish`
1. Run `npm update` within each project

**Pros:** Arguably the easiest method for collaborating with other developers since it's the same dependency pattern familiar to Node.js folks. It also increases the opportunity developers will discover your project and use it for themselves.

**Cons:** The most steps involved to get changes to your library into your other projects.

Did I miss anything? What tips and tricks do you have for sharing modules across multiple projects?
