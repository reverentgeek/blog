---
id: 42292e109ebc11efbfcacd7b86b62036
title: "Build a Command-Line Application With Deno 2.0"
feature_image: /content/images/build-a-cli-app-with-deno/build-a-cli-app-with-deno.jpg
description: Learn to build a command-line application using Deno version 2.0!
date: 2024-11-09
slug: build-a-command-line-application-with-deno-2
---

Command-line interfaces (CLI) are often used for automating tasks, such as building reports, synchronizing data between systems, migrating data, deploying applications, and so on and on. Over the years, I have built countless CLI apps to save time. If I ever find myself doing something more than once, I try to find a way to automate it!

Deno 2.0 is an excellent solution for writing CLI apps. It supports TypeScript and JavaScript, it's cross-platform (runs on Windows, macOS, and Linux), has dozens of powerful tools in its [standard library](https://jsr.io/@std), and can also tap into [most Node.js modules](https://docs.deno.com/examples/npm/). The only limit is your imagination!

In this tutorial, you will learn how to:

- Create a command-line interface with Deno 2.0
- Parse command-line arguments
- Print help and version information
- Prompt for additional information
- Compile your app into a standalone executable

## Set Up Your CLI Project

First, let's make sure you have the tools you need!

- [Install Deno](https://docs.deno.com/runtime/getting_started/installation/)
- A good text editor, such as [Visual Studio Code](https://code.visualstudio.com/)

Open your computer's terminal (or command prompt). Change the current directory to the folder where you normally save projects.

> **Note:** If you don't already have a folder where you store software projects, I like creating a folder at the root of my home directory named `projects`. More than likely, when you open your computer's terminal/console app, you are automatically placed in your "user home" folder. Use `mkdir projects` (or `md projects` if you're on Windows) to create the folder. Then, use `cd projects` to change to that new folder.

Verify you have Deno 2.0 (or higher) installed using the following command.

```sh
deno --version
```

You should see something like:

```sh
deno 2.0.5 (stable, release, aarch64-apple-darwin)
v8 12.9.202.13-rusty
typescript 5.6.2
```

If you receive an error, or if your version of Deno is 1.x, follow the [installation](https://docs.deno.com/runtime/getting_started/installation/).

Next, enter the following commands to initialize a new Deno project.

```sh
deno init deno-cli-demo
cd deno-cli-demo
```

We're going to use Deno's [@std/cli](https://jsr.io/@std/cli) standard library, so add that to the project using the following command.

```sh
deno add jsr:@std/cli
```

## Create Your First CLI App

Open up your new project using your preferred editor. Create a new file named `hello.ts` and add the following code.

```js
const now = new Date();
const message = "The current time is: " + now.toTimeString();

console.log("Welcome to Deno 🦕 Land!");
console.log(message);
```

From your terminal, enter the following command to run the script.

```sh
deno run hello.ts
```

You've built your first Deno CLI application! Feel free to play around with writing other things to the console.

## Using Command-Line Arguments

Arguments? No, we're not talking about getting into a heated debate with your terminal. Although that can certainly happen. Computers can be rather obstinate.

_Command-line arguments_ are options and values you might provide the CLI when you run the app. When you enter `deno run hello.ts`, `deno` is the CLI, and `run hello.ts` are two _arguments_ you provide to the CLI.

Create a new file named `add.ts` and add the following code.

```js
import { parseArgs } from "@std/cli/parse-args";

const args = parseArgs(Deno.args);
console.log("Arguments:", args);
const a = args._[0];
const b = args._[1];
console.log(`${a} + ${b} = ` + (a + b));
```

The idea is to take two numbers and add them together. Try it out!

```sh
deno run add.ts 1 2
```

Experiment with additional arguments. Or none at all. The `parseArgs` function can also handle arguments traditionally called _switches_ and _flags_. Try the following and observe the output.

```sh
deno run add.ts 3 4 --what=up -t -y no
```

## Advanced Command-Line Arguments

We've only just scratched the surface of what you can do with command-line arguments. Let's try a more advanced example!

Create a new file named `sum.ts` and add the following code.

```js
import { parseArgs, ParseOptions } from "@std/cli/parse-args";
import meta from "./deno.json" with { type: "json" };

function printUsage() {
    console.log("");
    console.log("Usage: sum <number1> <number2> ... <numberN>");
    console.log("Options:");
    console.log("  -h, --help        Show this help message");
    console.log("  -v, --version     Show the version number");
}

const options: ParseOptions = {
    boolean: ["help", "version"],
    alias: { "help": "h", "version": "v" },
};
const args = parseArgs(Deno.args, options);

if (args.help || (args._.length === 0 && !args.version)) {
    printUsage();
    Deno.exit(0);
} else if (args.version) {
    // Pro tip: add a version to your deno.json file
    console.log(meta.version ? meta.version : "1.0.0");
    Deno.exit(0);
}

// validate all arguments are numbers
const numbers: number[] = args._.filter((arg) => typeof arg === "number");
if (numbers.length !== args._.length) {
    console.error("ERROR: All arguments must be numbers");
    printUsage();
    Deno.exit(1);
}
// sum up the number arguments
const sum = numbers.reduce((sum, val) => sum + val);

// print the numbers and the total
console.log(`${numbers.join(" + ")} = ${sum}`);
```

Whoa, there's a lot going on here 😬 Let's try it out first, and then we'll cover some of the highlights. Try the following commands and see how the output changes.

```sh
deno run sum.ts 1 2 3 4 5
deno run sum.ts --help
deno run sum.ts --version
deno run sum.ts -h
deno run sum.ts 1 2 three
```

Now, if you go back and look through the code in `sum.ts`, you can probably figure out some of the logic involved in handling the different arguments. The main thing I want to point out is this block of code.

```js
const options: ParseOptions = {
    boolean: ["help", "version"],
    alias: { "help": "h", "version": "v" },
};
const args = parseArgs(Deno.args, options);
```

The `parseArgs` function supports quite a few _options_ to support a wide variety of arguments.

- `boolean: ["help", "version"]`: defines the `--help` and `--version` flags.
- `alias: { "help": "h", "version": "v" }`: defines alternate `-h` and `-v` flags.

As you may have guessed, `Deno.exit(0);` causes Deno to immediately stop the current script.

## More Input Required (Prompts)

Imagine you're creating a CLI app to automate a report. Your app might connect to a system that requires authentication, such as a database or API.

> Never embed secrets (sensitive information such as user names, passwords, API keys, connection strings, etc.) in your code. You don't want your secrets ending up in the hands of the wrong people!

In this case, the CLI should prompt for the sensitive information when it runs. Let's create another example to demonstrate how this is done.

First, add a new dependency using the following command.

```sh
deno add jsr:@std/dotenv
```

Create a new file named `taskRunner.ts` and add the following code.

```js
import { Spinner } from "@std/cli/unstable-spinner";

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function simulateTask(ms: number, message: string) {
    const spinner = new Spinner({ message, color: "yellow" });
    const start = performance.now();
    spinner.start();
    await sleep(ms);
    spinner.stop();
    const finish = performance.now();
    const duration = Math.round((finish - start) / 100) / 10;
    console.log(`${message} (${duration.toFixed(1)}s).`);
}
```

This is a module that exports a function named `simulateTask` that we'll use from the CLI app. The `simulateTask` function includes a few tricks, such as keeping track of how long the task runs and displaying a cool spinning animation while the task is running 🤓

Create a new file named `updater.ts` and add the following code.

```js
import "@std/dotenv/load";
import { parseArgs, ParseOptions } from "@std/cli/parse-args";
import { promptSecret } from "@std/cli/prompt-secret";

import meta from "./deno.json" with { type: "json" };
import { simulateTask } from "./taskRunner.ts";

function printUsage() {
    console.log("Usage: ");
    console.log("  updater --input <input file> --output <output file>");
    console.log("Options:");
    console.log("  -h, --help        Show this help message");
    console.log("  -v, --version     Show the version number");
    console.log("  -i, --input       Input file");
    console.log("  -o, --output      Output file");
}

const options: ParseOptions = {
    boolean: ["help", "version"],
    string: ["input", "output"],
    default: { "input": "data.csv", "output": "report.pdf" },
    alias: { "help": "h", "version": "v", "input": "i", "output": "o" },
};
const args = parseArgs(Deno.args, options);

if (args.help) {
    printUsage();
    Deno.exit(0);
} else if (args.version) {
    // Pro tip: add a version to your deno.json file
    console.log(meta.version ? meta.version : "1.0.0");
    Deno.exit(0);
}

// validate the input and output arguments
if (!args.input || !args.output) {
    console.log("You must specify both an input and output file");
    printUsage();
    Deno.exit(1);
}

// attempt to get the username and password from environment variables
let user = Deno.env.get("MY_APP_USER");
let password = Deno.env.get("MY_APP_PASSWORD");

if (user === undefined) {
    const userPrompt = prompt("Please enter the username:");
    user = userPrompt ?? "";
}
if (password === undefined) {
    const passPrompt = promptSecret("Please enter the password:");
    password = passPrompt ?? "";
}

// simulating a few long-running tasks
await simulateTask(1000, `Reading input file [${args.input}]`);
await simulateTask(1500, `Connecting with user [${user}]`);
await simulateTask(5000, `Reading data from external system`);
await simulateTask(3200, `Writing output file [${args.output}]`);

console.log("Done!");
```

Some of this code may look familiar to the previous `sum.ts` CLI example. Try running the app and see what happens!

```sh
deno run updater.ts --help
```

Did you get a strange message like `⚠️  Deno requests read access to...`? What's going on here?

### Deno security and permissions

Deno is [secure by default](https://docs.deno.com/runtime/fundamentals/security/). It won't be able to read/write files, access your local environment variables, connect to your network, and a number of other potentially risky operations unless you explicitly give it permission.

Now run it using the following command. Don't worry. It's not doing anything; it's just _simulating_ what a real app might look like.

```sh
deno run --allow-read --allow-env updater.ts
```

Wasn't that cool??

![Updater Demo](/content/images/build-a-cli-app-with-deno/updater-demo.gif)

### Deno tasks

However, including those permissions is a lot to type every time you want to run the CLI app. Let's add a task to make it easier. Open up your `deno.json` file and update the `"tasks"` with the following.

```json
"tasks": {
    "updater": "deno run --allow-read --allow-env updater.ts"
},
```

Now you can use the following command.

```sh
deno task updater --input data.csv --output report.pdf
```

### Prompts and environment variables

Let's revisit the code in `updater.ts`. Specifically, this block of code.

```js
// attempt to get the username and password from environment variables
let user = Deno.env.get("MY_APP_USER");
let password = Deno.env.get("MY_APP_PASSWORD");

if (user === undefined) {
    const userPrompt = prompt("Please enter the username:");
    user = userPrompt ?? "";
}
if (password === undefined) {
    const passPrompt = promptSecret("Please enter the password:");
    password = passPrompt ?? "";
}
```

It's common practice to store app configuration as environment variables. Deno can access environment variables (with permission) using `Deno.env.get()`. If `MY_APP_USER` or `MY_APP_PASSWORD` are not set as environment variables, the app will use `prompt()` or `promptSecret()` to ask for those values. As you've already seen, `promptSecret()` hides the characters you type.

Remember the dependency we added for `jsr:@std/dotenv`? This standard library reads a file named `.env` and adds any values as environment variables.

Create a new file in the project named `.env` and add the following text.

```sh
MY_APP_USER=loluser
MY_APP_PASSWORD=p@ssw0rd1
```

Now run the `updater` task again. It should run without prompting you for a username or password.

## Compile Your CLI App to an Executable

Want to share your CLI app with others or run the app on another computer? You can compile a Deno-powered CLI app into a standalone executable! Standalone means it can run without installing Deno or any of the libraries. Everything is bundled 📦

> **Pro tip:** Use a task scheduler to run the executable periodically.

```sh
deno compile --allow-read --allow-env updater.ts
```

You should now have an executable version!

```sh
./updater --help
```

Among other things, you can create executables [for other platforms](https://docs.deno.com/runtime/reference/cli/compiler/#cross-compilation).

## Wrapping Up and Additional CLI Tools for Deno

Thank you for joining me on this journey of learning Deno! If you have any questions or suggestions, please drop them in the comments.

- Get the [source code](https://github.com/reverentgeek/deno-cli-demo) for the examples
- Connect with me: [X/Twitter](https://x.com/reverentgeek) | [BlueSky](https://staging.bsky.app/profile/reverentgeek.com) | [Threads](https://www.threads.net/@reverentgeek) | [YouTube](https://www.youtube.com/ReverentGeek) | [LinkedIn](https://www.linkedin.com/in/davidneal)

Here are more CLI tools for Deno you might explore!

- [ask](https://jsr.io/@sallai/ask): additional command-line prompts for Deno.
- [chalk](https://jsr.io/@nothing628/chalk): custom text styles and color for the command-line.
- [cliffy](https://cliffy.io/): advanced command-line tools for Deno.
