---
title: "SQL Server Running on a Mac?!"
feature_image: /content/images/2019/02/doc-brown-shocked.jpg
description: "Dogs and cats living together, mass hysteria!"
date: 2016-11-16
tags: posts
slug: sql-server-running-on-a-mac
layout: layouts/post.njk
---

Dogs and cats living together, mass hysteria!

### \[Update Oct 3, 2017\]

This article has been updated to reflect changes in the latest [General Availability (GA)](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-release-notes) release of SQL Server for Linux.

The 2016 Microsoft Connect(); event included a lot of interesting announcements. The one that really got my attention was [SQL Server for Linux](https://techcrunch.com/2016/11/16/microsofts-sql-server-for-linux-is-now-available-for-testing/). My first question, of course: Can I run this on my Mac?

Yes.

The answer (and an increasingly common answer, I might add) is [Docker](https://www.docker.com/). Here are the steps that worked for me.

## Install and configure Docker

If you don't already have Docker installed, you'll need to [download and install it](https://docs.docker.com/docker-for-mac/).

Next step, you'll need to increase Docker's available memory to 4GB or more.

![Docker Memory](/content/images/2016/11/update-docker-memory.gif)

1. Docker -> Preferences
2. Increase Memory to at least 4GB
3. Click **Apply & Restart**

## Get the Docker image

Open a Terminal window, and download the latest **SQL Server for Linux** Docker image.

```bash
docker pull microsoft/mssql-server-linux:2017-latest
```

Now, launch an instance of the Docker image.

```bash
docker run -d --name name_your_container -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=P@55w0rd' -e 'MSSQL_PID=Developer' -p 1433:1433 microsoft/mssql-server-linux:2017-latest
```

You should now have SQL Server running on your Mac, ready for action!

### A few notes on Docker parameters

* `-d`: this launches the container in daemon mode, so it runs in the background
* `--name name_your_container`: give your Docker container a friendly name, which is useful for stopping and starting containers from the Terminal.
* `-e 'ACCEPT_EULA=Y`: this sets an environment variable in the container named `ACCEPT_EULA` to the value `Y`. This is required to run SQL Server for Linux.
* `-e 'SA_PASSWORD=P@55w0rd'`: this sets an environment variable for the `sa` database password. Set this to your own strong password. Also required.
* `-e 'MSSQL_PID=Developer'`: this sets an environment variable to instruct SQL Server to run as the Developer Edition.
* `-p 1433:1433`: this maps the local port 1433 to the container's port 1433. SQL Server, by default, listens for connections on TCP port 1433.
* `microsoft/mssql-server-linux`: this final parameter tells Docker which image to use

### Tip: Get Kitematic

Kitematic is a nice desktop application for managing Docker containers. The first time you click **Open Kitematic**, it will prompt you to download and install it. You can then use Kitematic to view the output of your containers, manage their settings, etc.

![](/content/images/2016/11/kitematic-1.gif)

![](/content/images/2016/11/kitematic-2.gif)

## It's running, now what?

[sql-cli](https://www.npmjs.com/package/sql-cli) is a useful command-line tool for SQL Server. To use it, you'll need [Node.js](https://nodejs.org). Download and install Node.js, if you don't already have it.

From the Terminal, install `sql-cli` globally, so you can use it anywhere.

```bash
npm install -g sql-cli
```

Next, connect to your SQL Server instance running in Docker.

```bash
mssql -u sa -p P@55w0rd
```

You can now query and execute SQL Server commands from the `mssql>` prompt. Type `.quit` and press **Enter** to exit.

## Getting an existing SQL database into Docker

If you're like me, you have a SQL database you use for development you want to move to your new SQL container running on your Mac. I have good news.

### Option 1: restore a backup

Yes, you can restore a SQL backup file (`.bak`) created on Windows! You can start by creating a backup of your existing database using SQL Server Management Studio running on your Windows PC/Server.

#### 1\. Generate a backup file

1. Right-click on your database
2. Click Tasks -> Back Up...
3. Note where the backup file will be created, modify if necessary
4. Click OK to generate backup file

![](/content/images/2017/10/backup-step-1.png)

![](/content/images/2017/10/backup-step-2.png)

Next, locate the backup file on your Windows machine and copy the file to your Mac. The details of this step I leave to you, dear reader. I hope it's not too painful.

#### 2\. Restore the backup file

You'll need to use Docker commands from the Terminal to copy the backup file into the container, and restore the database.

_Note: Change the paths and names, such as `dogfood` and `container-name` to match the name of your database and Docker container._

Step 1: Copy the `.bak` file into your Docker container.

```bash
docker cp ~/Downloads/sql/dogfood.bak container-name:/tmp/dogfood.bak
```

Step 2: Run SQL RESTORE

```bash
docker exec container-name /opt/mssql-tools/bin/sqlcmd -U sa -P P@55w0rd -Q "RESTORE DATABASE [dogfood] FROM DISK='/tmp/dogfood.bak' WITH MOVE 'dogfood' TO '/var/opt/mssql/data/dogfood.mdf', MOVE 'dogfood_Log' TO '/var/opt/mssql/data/dogfood_Log.ldf' "
```

Step 3: Verify your database is alive

```bash
docker exec container-name /opt/mssql-tools/bin/sqlcmd -U sa -P P@55w0rd -Q "SELECT [name] FROM sys.databases"
```

Ready to rock!

### Option 2: generate scripts

Another option is to use `sql-cli` to run the scripts to recreate a database running in Docker.

#### 1\. Generate scripts

First step is to use SQL Server Management Studio to generate scripts from an existing database.

Right-click on your database, and choose Tasks -> Generate Scripts...

![](/content/images/2016/11/generate-scripts-1-2.gif)

I chose to separate my table and data scripts from my Views, Stored Procedures, User-Defined Functions, etc.

![](/content/images/2016/11/generate-scripts-2.gif)

Next, click on **Advanced**

![](/content/images/2016/11/generate-scripts-3.gif)

I chose to "Check for object existence," "Script DROP and CREATE," and set "Types of data to script" to "Schema and data."

Checking for object existence and DROP/CREATE allows me to re-run the same script against an existing database, if I want to reset it back to its original state.

![](/content/images/2016/11/generate-scripts-4.gif)

Choose a location to save your scripts. When finished, repeat the steps to script out your Views, Stored Procedures, and UDFs, if necessary.

#### 2\. Run the scripts against your SQL Server running in Docker

* Copy the scripts you generated above to your Mac where you can easily get to them from the Terminal.
* Open a Terminal, and change to the folder where you placed the scripts.
* Now, connect to your SQL Server running in Docker using `sql-cli`, and make sure you are on `master`

```bash
mssql> use master
```

* Create a new database

```bash
mssql> CREATE DATABASE devdb
```

> Note: Change `devdb` to match the name of the database you scripted. The generated scripts expect a database with that same name to exist.

* Change to the database we just created (change `devdb` to match your database name)

```bash
mssql> use devdb
```

* Run the generated scripts to create all the tables and populate them with data.

```bash
mssql> .run script.sql
```

* Repeat with the script that contains your other database objects, if necessary.

You now have a copy of your database, running on your Mac, without the need for entire Windows VM!

## Further reading...

* Use the `mssql` [Visual Studio Code extension](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-develop-use-vscode) to connect and manage your database!

* Want to learn more about Docker, such as creating your own containers for your software projects? I highly recommend [Derick Bailey's](https://twitter.com/derickbailey) awesome [Learn Docker Guide](https://sub.watchmecode.net/guides/learn-docker/).

* Microsoft's documentation: [Run the SQL Server Docker image on Linux, Mac, or Windows](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-setup-docker)
