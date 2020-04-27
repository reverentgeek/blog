---
title: "SQL Server for Linux: How to Move a Database From One Docker Container to Another"
featured_image: 
description: ""
date: 2017-03-02
tags: posts
slug: sql-server-for-linux-how-to-move-a-database-from-one-docker-container-to-another
layout: layouts/post.njk
---



The bad news is, the Docker version of SQL Server for Linux is a limited trial edition that will eventually expire. At some point, you will have to create a new Docker container.

The good news is, SQL for Linux comes with a [`sqlpackage`](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-migrate-sqlpackage) utility you can use to create a backup of your database.

### How many days do I have left?

The best way to know how many days are left in the trial is to look at the logs in the container. SQL Server reports how many days are left when it starts. Here's a screenshot from [Kitematic](https://kitematic.com/).

![](/content/images/2017/03/sql_linux_container_logs.png)

You can also get a rough estimate using [`sql-cli`](https://github.com/hasankhan/sql-cli) and a SQL query:

```sql
SELECT create_date AS InstallDate, DATEADD( DD, 180, create_date ) AS ExpiryDate, ( 180 - DATEDIFF( DD, create_date, GETDATE() ) ) AS DaysLeft FROM sys.server_principals WHERE name = N'BUILTIN\Administrators'
```

![](/content/images/2017/03/mssql-expire-cli.png)

Obviously, there's a two-day difference, but it's close enough.

### Step 1: Create a .bacpac file

First, we need to create a backup of the database that is in your old Docker container. Open a Terminal or Command Prompt, and run the following command.

**Note:** In the following examples, substitute `container_name` with the name of your Docker container, and `your_db` with the name of your database. Also, change the password to match the your `sa` password.

```
docker exec container_name /opt/mssql/bin/sqlpackage /a:Export /ssn:tcp:localhost /sdn:your_db /su:sa /sp:P@55w0rd /tf:/tmp/your_db.bacpac
```

### Step 2: Copy the .bacpac file to your host

Copy the `.bacpac` file to a folder on your host computer. In this example, it will copy the file to the Desktop. Of course, you may want to store the backup in a diffent folder.

**Windows**

```
docker cp container_name:/tmp/your_db.bacpac %USERPROFILE%\Desktop\your_db.bacpac
```

**Mac or Linux**

```
docker cp container_name:/tmp/your_db.bacpac ~/Desktop/your_db.bacpac
```

### Step 3: Stop the old container

```
docker stop container_name
```

### Step 4: Pull down the latest image and create a new container

**Note:** Change `new_container_name` and password to the desired values.

```
docker pull microsoft/mssql-server-linux

docker run -d --name new_container_name -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=P@55w0rd' -p 1433:1433 microsoft/mssql-server-linux
```

### Step 5: Copy the .bacpac file to the new container

**Windows**

```
docker cp %USERPROFILE%\Desktop\your_db.bacpac container_name:/tmp/your_db.bacpac
```

**Mac or Linux**

```
docker cp ~/Desktop/your_db.bacpac container_name:/tmp/your_db.bacpac
```

### Step 6: Import the .bacpac file

```
docker exec new_container_name /opt/mssql/bin/sqlpackage /a:Import /tsn:tcp:localhost /tdn:your_db /tu:sa /tp:P@55w0rd /sf:/tmp/your_db.bacpac
```

Hope this helps!



