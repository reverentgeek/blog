---
id: 5b7d83816ada047f703ba983
title: "A Developer's Guide to Samsara Telematics"
feature_image: /content/images/samsara/telematics-guide.png
description: "This guide will help you wrangle Samsara's Telematics APIs like a pro."
date: 2024-11-07
slug: samsara
---

Ah, telematics—where code meets the open road. Whether you're here because your boss needs reports or you're just genuinely excited about analyzing vehicle data, this guide will help you wrangle Samsara's telematics APIs like a pro.

We'll cover how to grab near real-time stats from Samsara's [stats feed](https://developers.samsara.com/reference/getvehiclestatsfeed) endpoint and historical data from [historical stats](https://developers.samsara.com/reference/getvehiclestatshistory). By the end of this tutorial, you'll have the tools to impress your team, wow your fleet managers, and have a few more tools under your toolbelt for programming APIs.

So buckle up! Let's get started.

## Why Telematics Matter

First, let's answer the *why*. In the world of fleet management, knowing where your vehicles are and how they're performing isn't just nice to have–it's mission-critical. Telematics is the superhero cape for fleet management. It takes the mystery out of questions like:

- **What's happening now?** Near real-time data like location, fuel levels, and diagnostics.
- **What happened last week?** Historical data for compliance, optimization, or plan for predictive maintenance. Bosses love their spreadsheets!

## Getting Started: The Basics

Before we dive into the code, you'll need:

- [Node.js](https://nodejs.org/) version 20 or higher
- Your [Samsara API token](https://developers.samsara.com/docs/authentication)
- A good code editor, such as [Visual Studio Code](https://code.visualstudio.com/)

> Don't worry if you’re new to Node.js! Although this guide uses JavaScript and Node.js as examples, you can apply the same concepts in this guide to any modern programming language.

### Step 1: Set up your project

To kick things off, open up your terminal or command prompt, go to the folder where you store your software projects, and create a new folder for the tutorial.

```sh
mkdir samsara-telematics-demo
cd samsara-telematics-demo
```

Next, initialize your Node.js project using `npm init`.

```sh
npm init -y
```

Now install the following dependencies using the `npm` command.

```sh
npm install axios dotenv
```

You will use the `axios` module and your API token to make requests to Samsara's APIs. The `dotenv` module reads a local `.env` configuration file where you will store your API token.

### Step 2: Store your Samara API token

Open your project in your editor of choice. Create a new file in the root folder named `.env`. Add the following text to the file, replace `<your-samsara-api-token>` with your API token, and save the file.

```sh
SAMSARA_API_TOKEN=<your-samsara-api-token>
```

> Pro tip: Always store your API tokens and other secrets securely. For Node.js, it's common practice to store them as environment variables. Just be sure if you use a `.env` file you don't accidentally check the file into your source control! Your future self (and your security team) will thank you.

## Build a Real-Time Data Collector

![](/content/images/samsara/real-time-stats.png)

Using Samsara's [stats feed](https://developers.samsara.com/reference/getvehiclestatsfeed) endpoint, let's build a data collector that pulls vehicle stats. We'll implement a polling strategy so you can get the latest data in near real-time.

### Step 1: Set up the polling script

Create a new file in the project named `polling.js` and add the following JavaScript.

```js
import "dotenv/config.js";
import axios from "axios";

// Set up the default base URL, authentication, and headers for all requests
axios.defaults.baseURL = "https://api.samsara.com";
axios.defaults.headers.common[ "Authorization" ] = `Bearer ${ process.env.SAMSARA_API_TOKEN }`;
axios.defaults.headers.common[ "Accept" ] = "application/json";

const POLLING_INTERVAL = 5000; // 5 seconds (5000 milliseconds) is the minimum interval 
                               // recommended for the Samsara API

// simple utility function to log messages
function logInfo( message ) {
  const currentDate = `[${ new Date().toISOString() }] `;
  console.log( currentDate, message );
}

// simple utility function to log errors
function logError( err ) {
  const currentDate = `[${ new Date().toISOString() }] `;
  console.error( currentDate, err.message );
}

async function sleep( delay ) {
  // a simple implementation of a sleep function using
  // a promise and setTimeout
  return new Promise( ( resolve ) => setTimeout( resolve, delay ) );
}
```

This code imports the `axios` and `dotenv` dependencies you need, configures `axios` to use the Samsara API and your API token, and adds a few helper functions you'll use in the rest of the code.

### Step 2: Fetch the latest vehicle stats

Next, copy the following code into the `polling.js` file.

```js
// Fetch the next page of data from the feed
async function vehicleStatsFromFeed( types, endCursor ) {
  const options = { params: { types } };

  // The first time this function is called, endCursor will be empty
  if ( endCursor ) {
    options.params.after = endCursor;
  }
  const res = await axios.get( "/fleet/vehicles/stats/feed", options );
  return res.data;
}
```

This function takes a comma-delimited string of [diagnostic types](https://developers.samsara.com/docs/telematics#diagnostic-types). An example of `types` can be single stat of `"gps"`, `"faultCodes"`, or `"engineRpm"`, or a combination of up to three stats, such as `"gps,faultCodes,engineRpm"`.

### Key Concept: Pagination

You might be asking, "What's this `endCursor`?" Ah, yes! We need to talk about [pagination](https://developers.samsara.com/docs/pagination). Any Samsara API that returns a list of data supports *pagination*. It's a way of breaking up big sets of data into smaller chunks, or *pages*, for better performance and to prevent overloading servers. For example, when you scroll through an endless social media feed, you see pages of content loaded gradually rather than all posts at once.

When you send a request to get vehicle stats, you may only get some of the data at a time. If the response includes `hasNextPage: true`, you can use the `endCursor` value to immediately retrieve the next "page" of data in the set. Repeat until the API returns `hasNextPage: false`.

### Step 3: Poll for new data

Copy the following code into the `polling.js` file.

```js
// Poll the vehicle stats feed for new data
async function pollVehicleStatsFeed( types, callback ) {
  // Keep track of the last cursor to fetch the next page of data
  let endCursor = "";

  // Loop indefinitely until the process is interrupted
  while ( true ) {
    // Fetch the next page of data
    const { data, pagination } = await vehicleStatsFromFeed( types, endCursor );

    // Update the cursor for the next page of data
    endCursor = pagination.endCursor;

    // Process the data
    callback( data );

    // If there are no more pages of data, wait before making the next request
    if ( !pagination.hasNextPage ) {
      await sleep( POLLING_INTERVAL );
    }
  }
}
```

**What’s happening here?**

- The last `endCursor` is stored for the next API call, so you can always get the most recent changes.
- Data is sent in real-time to the `callback` function, so you can process it however you need.
- If there is more data available (`hasNextPage: true`), it immediately fetches the next page. Otherwise, call the API every 5 seconds (`POLLING_INTERVAL = 5000`).

> **Pro tip:** Use polling responsibly. Polling every second might seem cool, but it’ll burn through your [API quota](https://developers.samsara.com/docs/rate-limits) faster than your fleet burns fuel.

### Step 4: Process new data and start polling

Copy the following code into the `polling.js` file.

```js
// Save the vehicle stats to storage
async function logVehicleStats( data ) {
  // Save data to storage, such as a database or append to a rotating log file
  // Or send the data to another API or service to be processed
  logInfo( data );
}

async function main()
{
  try {
    await pollVehicleStatsFeed( "gps,fuelPercents", logVehicleStats );
  } catch ( err ) {
    logError( err );
  }
}

main().then( () => console.log( "Done" ) );
```

**What’s happening here?**

- The `main` function kicks off polling for `gps` and `fuelPercents` stats. You can change this to poll for any supported types, up to three at once.
- The `logVehicleStats` function is used for the `callback` to process any new data received.

### Step 5: Test the polling application

You are now ready to test the polling application! From your terminal or command line, enter the following command.

```sh
node polling.js
```

If all goes well, you should see data (or lack thereof) begin to appear on your screen. To stop the application, press `CTRL+C`.

If you received an error, check to make sure you have the correct API token in the `.env` file, and that you've copied all the code from the previous steps into `polling.js`.

### Step 6: Advanced polling with retries and exponential backoff

In an ideal world, the current solution would get the job done. Unfortunately, things beyond your control can cause service interruption, such as a network outage. Your code needs to be able to survive interruptions and be smart about how to respond.

Update the code near the top of the `polling.js` to add a new `MAX_RETRIES` constant.

```js
const POLLING_INTERVAL = 5000;  // 5 seconds is the minimum interval recommended for the Samsara API
const MAX_RETRIES = 6;          // Maximum number of retries before exiting
```

Next, replace the `pollVehicleStatsFeed` function with the following code.

```js
// Poll the vehicle stats feed for new data
async function pollVehicleStatsFeed( types, callback ) {
  // Keep track of the last cursor to fetch the next page of data
  let endCursor = "";
  let retries = 0; // Keep track of retries
  let lastInterval = POLLING_INTERVAL; // Keep track of the last interval used

  // Loop indefinitely until the process is interrupted
  while ( true ) {
    try {
      // Fetch the next page of data
      const { data, pagination } = await vehicleStatsFromFeed( types, endCursor );
      // Update the cursor for the next page of data
      endCursor = pagination.endCursor;

      // the current request was successful, so reset retries, if needed
      if ( retries > 0 ) {
        retries = 0;
        lastInterval = POLLING_INTERVAL;
      }

      // Process the data
      callback( data );

      // If there are no more pages of data, wait before making the next request
      if ( !pagination.hasNextPage ) {
        await sleep( POLLING_INTERVAL );
      }
    } catch ( err ) {
      logError( err );  // log the error
      retries++;        // increment retries
      if ( retries > MAX_RETRIES ) {
        logError( "Max retries exceeded" );
        // if we've exceeded the max retries, throw the error to escalate
        // the issue or exit the process
        throw err;
      }
      // exponential backoff
      // retry after 10 seconds, 20 seconds, 40 seconds, etc.
      lastInterval = lastInterval * 2;
      await sleep( lastInterval );
    }
  }
}
```

**What’s happening here?**

- When an error occurs, a counter is incremented (`retries`).
- For every sequential retry, the wait time is doubled (`lastInterval = lastInterval * 2`).
- The application aborts if the number of retries exceeds the maximum (`MAX_RETRIES`).
- If the API call succeeds, the retry counter is reset.

## Download Telematics Historical Data

![](/content/images/samsara/historical-data.png)

Historical data is the bread and butter of reporting. Samsara’s [historical stats](https://developers.samsara.com/reference/getvehiclestatshistory) endpoint lets you specify a date range and pull the stats you're interested in.

### Step 1: Set up the download script

Create a new file in the project named `history.js` and add the following JavaScript to the file.

```js
import "dotenv/config.js";
import axios from "axios";

// Set up the default base URL, authentication, and headers for all requests
axios.defaults.baseURL = "https://api.samsara.com";
axios.defaults.headers.common[ "Authorization" ] = `Bearer ${ process.env.SAMSARA_API_TOKEN }`;
axios.defaults.headers.common[ "Accept" ] = "application/json";

function logInfo( message ) {
  const currentDate = `[${ new Date().toISOString() }] `;
  console.log( currentDate, message );
}
```

Similar to the `polling.js` script, this code imports the `axios` and `dotenv` dependencies, configures `axios` to use the Samsara API and your API token, and adds a `logInfo` helper function.

### Step 2: Fetch all historical data

Next, add the following code to `history.js`.

```js
// Fetch a page of data from the history endpoint
async function vehicleStatHistory( startTime, endTime, types, decorations, endCursor ) {
  // required parameters
  const options = { params: { startTime, endTime, types } };

  // Add optional decorations, if provided
  if ( decorations ) {
    options.params.decorations = decorations;
  }

  // The first time this function is called, endCursor will be empty
  if ( endCursor ) {
    options.params.after = endCursor;
  }

  // make the API call
  const res = await axios.get( "/fleet/vehicles/stats/history", options );
  return res.data;
}

// Download all pages of data from the history endpoint
async function downloadVehicleStatHistory( startTime, endTime, types, decorations, callback ) {
  // Keep track of the last cursor to fetch the next page of data
  let endCursor = "";
  let hasNextPage = true;

  // Loop until there are no more pages of data
  while ( hasNextPage ) {
    // Fetch the next page of data
    const { data, pagination } = await vehicleStatHistory( startTime, endTime, types, decorations, endCursor );

    // Update the cursor for the next page of data
    endCursor = pagination.endCursor;

    // Don't forget to update the hasNextPage variable
    // Otherwise, you'll end up in an infinite loop!
    hasNextPage = pagination.hasNextPage;

    // Process the data
    await callback( data );
  }
}
```

**What’s happening here?**

The stats history API uses pagination to break up the potentially large set of data into smaller chunks. The `downloadVehicleStatHistory` function keeps track of each page of data (`hasNextPage` and `endCursor`). The `vehicleStatHistory` function makes the individual calls to retrieve a block of stats history, or *page* of data. The provided `callback` function processes each page of data. The download function exits when the download is complete (`hasNextPage: false`).

### Step 3: Kick off the download and process the data

Next, add the following code to the `history.js`.

```js
// Save the vehicle history stats to storage
async function saveStatHistory( data ) {
  // Save data to storage, such as a database or append to a CSV file
  // Or send the data to another API or service to be processed
  logInfo( `Saving stats for ${ data.length } vehicle(s)...` );
  logInfo( data );
}

async function main()
{
  try {
    // Download vehicle stats history for the month of November 2024
    const startTime = new Date( "2024-11-01" ).toISOString();
    const endTime = new Date( "2024-12-01" ).toISOString();
    const types = "engineStates";
    const decorations = "gps,fuelPercents";

    logInfo( "Downloading vehicle stats history..." );
    await downloadVehicleStatHistory( startTime, endTime, types, decorations, saveStatHistory );
  } catch ( err ) {
    console.log( err );
  }
}

main().then( () => console.log( "Done" ) );
```

The remaining code sets up the callback function, `saveStatHistory`, to process the data, and a `main` function to configure the date range and which stats to download.

For example, if you wish to know the vehicle's location whenever the engine changes state, you may set types=engineStates&decorations=gps.

## Wrapping Up and Next Steps

Congratulations! You’ve now got the skills to:

- Collect near real-time data by polling the [stats feed](https://developers.samsara.com/reference/getvehiclestatsfeed) endpoint.
- Fetch historical data efficiently using the [stats history](https://developers.samsara.com/reference/getvehiclestatshistory) endpoint and pagination.

Here’s your action plan:

1. **Start simple:** Implement polling or historical downloads for one fleet.
2. **Use filters:** The APIs support filtering on tags and vehicles.
3. **Store data:** Implement processing and storing the data retrieved from the endpoints.
4. **Scale smartly:** Add error handling and alerts, more advanced retry logic, and logging.
5. **Get creative:** Visualize the data and optimize your fleet!

Now go forth and build something cool. And remember: when the telematics data looks good, so do you. 🚀

---

Got questions or just want to share what you’ve built? Drop me a line in the comments. Until next time, happy coding!
