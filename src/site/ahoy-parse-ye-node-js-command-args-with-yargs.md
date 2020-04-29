---
id: 5b7d83816ada047f703ba963
title: "Ahoy! Parse ye Node.js command args with yargs!"
feature_image: 
description: "Recently I was working on a code sample in Node.js and thought to meself, \"T'wouldn't it be grand to support me some command-line args for…"
date: 2015-04-20
tags: posts
slug: ahoy-parse-ye-node-js-command-args-with-yargs
layout: layouts/post.njk
---

Recently I was working on a code sample in Node.js and thought to meself, "T'wouldn't it be grand to support me some command-line args for this here..." or... something to that effect. So, with a quick Google off the port bow, I came across [yargs](https://www.npmjs.com/package/yargs).

> Yargs be a node.js library fer hearties tryin' ter parse optstrings. With yargs, ye be havin' a map that leads straight to yer treasure! Treasure of course, being a simple option hash.

Yargs makes it easy to support command-line arguments for Node.js application. Check out the [LeanKit search](https://github.com/LeanKit/api-samples/tree/master/node-search) sample application I created that uses yargs.

## Here be a quick example for ye

Imagine we plan to create our own version of [curl](http://en.wikipedia.org/wiki/CURL) named "jurl", implemented in Node.js specifically for REST and JSON. Our first pass at the arguments we want to support might look like this:

```javascript
var options = require( "yargs" )
 .usage( "Usage: $0 <url> [-u \"username\"] [-p \"password\"] [--post] [--data \"{key:value}\"]" )
 .command( "url", "URL to request", { alias: "url" } )
 .required( 1, "URL is required" )
 .option( "u", { alias: "user", demand: false, describe: "Username", type: "string" } )
 .option( "p", { alias: "password", demand: false, describe: "Password", type: "string" } )
 .option( "d", { alias: "data", describe: "Data to send as JSON", type: "string" } )
 .option( "get", { describe: "Use HTTP GET", type: "boolean" } )
 .option( "post", { describe: "Use HTTP POST", type: "boolean" } )
 .option( "put", { describe: "Use HTTP PUT", type: "boolean" } )
 .option( "del", { describe: "Use HTTP DELETE", type: "boolean" } )
 .help( "?" )
 .alias( "?", "help" )
 .example( "$0 https://example.com/api/posts", "Get a list of posts" )
 .example( "$0 https://example.com/api/posts --post --data \"{ 'title': 'Avast ye!', 'body': 'Thar be a post hyar!'}\"", "Create a new post" )
 .epilog( "Copyright 2015 ReverentGeek" )
 .argv;

// Get the URL from the first parameter
var url = options._[ 0 ];

// Make "get" the default if no verb is specified
if ( !options.get && !options.post && !options.put && !options.del ) {
 options.get = true;
}

console.log( "url:", url );
console.log( "options:", options );
```

Take a look at the command-line help yargs creates for ye.

```
$ node jurl --help
Usage: jurl <url> [-u "username"] [-p "password"] [--post] [--data
"{key:value}"]

Commands:
  url    URL to request

Options:
  -u, --user      Username                                              [string]
  -p, --password  Password                                              [string]
  -d, --data      Data to send as JSON                                  [string]
  --get           Use HTTP GET                                         [boolean]
  --post          Use HTTP POST                                        [boolean]
  --put           Use HTTP PUT                                         [boolean]
  --del           Use HTTP DELETE                                      [boolean]
  -?, --help      Show help

Examples:
  jurl https://example.com/api/posts          Get a list of posts
  jurl https://example.com/api/posts          Create a new post
  --post --data "{ 'title': 'Avast
  ye!', 'body': 'Thar be a post hyar!'}"

Copyright 2015 ReverentGeek
```

Running the given sample prints the following to the console.

```
$ node jurl http://example.com/api/posts
url: http://example.com/api/posts
options: { _: [ 'http://example.com/api/posts' ],
  get: true,
  post: false,
  put: false,
  del: false,
  '$0': 'jurl',
  u: undefined,
  p: undefined,
  d: undefined,
  '?': undefined }
```

Hoist the mizzen, sail forth and blast ye command ARRRRGS to smithereens!
