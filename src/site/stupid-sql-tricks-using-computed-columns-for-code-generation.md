---
title: "Stupid SQL Tricks - Using Computed Columns for Code Generation"
feature_image: 
description: "I recently had a need to drop and recreate all the default constraints on some tables so I could convert the data types of from varchar to…"
date: 2011-11-04
tags: posts
slug: stupid-sql-tricks-using-computed-columns-for-code-generation
layout: layouts/post.njk
---

I recently had a need to drop and recreate all the default constraints on some tables so I could convert the data types of from varchar to nvarchar. The constraints were originally created allowing SQL Server to automatically name them. So, they looked something like: `DF__TableName__Colu__2BE6BFCF`. Maybe this doesn't bother you. To me, it's an abomination.

```prettyprint
SET NOCOUNT ON;

DECLARE @sql nvarchar(MAX), @executeScriptsImmediately bit, @id int;

SET @executeScriptsImmediately = 0; -- Set this to 1 to immediately drop and recreate constraints

DECLARE @tbl TABLE ( Id int IDENTITY(1,1), TableName nvarchar(128) NOT NULL, ColumnName nvarchar(128) NOT NULL,
 DefaultName nvarchar(128) NOT NULL, DefaultDefinition nvarchar(MAX),
 NewDefaultName AS ( N'DF_' + TableName + N'_' + ColumnName ),
 DropText AS (N'IF EXISTS ( SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N''[' + DefaultName + N']'') AND type = ''D'' )
BEGIN
 ALTER TABLE [dbo].[' + TableName + N'] DROP CONSTRAINT [' + DefaultName + N']
END'),
 CreateText AS (N'IF NOT EXISTS ( SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N''[DF_' + TableName + N'_' + ColumnName + N']'') AND type = ''D'' )
BEGIN
 ALTER TABLE [dbo].[' + TableName + N'] ADD CONSTRAINT [DF_' + TableName + N'_' + ColumnName + N'] DEFAULT ' + DefaultDefinition + N' FOR [' + ColumnName + N']
END'),
 OrigCreateText AS (N'IF NOT EXISTS ( SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N''[' + DefaultName + N']'') AND type = ''D'' )
BEGIN
 ALTER TABLE [dbo].[' + TableName + N'] ADD CONSTRAINT [' + DefaultName + N'] DEFAULT ' + DefaultDefinition + N' FOR [' + ColumnName + N']
END')
 );

INSERT INTO @tbl ( TableName, ColumnName, DefaultName, DefaultDefinition )
SELECT t.name, c.name, dc.name, dc.definition
FROM sys.columns c
  JOIN sys.tables t ON t.object_id = c.object_id
  JOIN sys.objects d ON d.object_id = c.default_object_id
  JOIN sys.types tp ON tp.system_type_id = c.system_type_id
  JOIN sys.default_constraints dc ON dc.object_id = d.object_id
WHERE d.type = N'd'
-- This filters query to only defaults on varchar data types
--  AND tp.name = N'varchar'
-- This filters query to only defaults that do not match the naming convention
  AND dc.name <> N'DF_' + t.name + N'_' + c.name
ORDER BY t.name, c.name

PRINT N'-------------------------------------------';
PRINT N'-- Backup of original default contraints';
PRINT N'-------------------------------------------';
PRINT N'/*';
SET @id = ( SELECT TOP 1 Id FROM @tbl ORDER BY Id );
WHILE ( @id IS NOT NULL )
BEGIN
 SELECT @sql = OrigCreateText FROM @tbl WHERE Id = @id;
 PRINT @sql;
 SET @id = ( SELECT TOP 1 Id FROM @tbl WHERE Id > @id ORDER BY Id );
END
PRINT N'*/';
PRINT N'';

PRINT N'-------------------------------------------';
PRINT N'-- Drop default contraints';
PRINT N'-------------------------------------------';
SET @id = ( SELECT TOP 1 Id FROM @tbl ORDER BY Id );
WHILE ( @id IS NOT NULL )
BEGIN
 SELECT @sql = DropText FROM @tbl WHERE Id = @id;
 PRINT @sql;
 IF (@executeScriptsImmediately = 1) EXEC sp_executesql @sql;
 SET @id = ( SELECT TOP 1 Id FROM @tbl WHERE Id > @id ORDER BY Id );
END
PRINT N'';

PRINT N'-------------------------------------------';
PRINT N'-- Create new default contraints';
PRINT N'-------------------------------------------';
SET @id = ( SELECT TOP 1 Id FROM @tbl ORDER BY Id );
WHILE ( @id IS NOT NULL )
BEGIN
 SELECT @sql = CreateText FROM @tbl WHERE Id = @id;
 PRINT @sql;
 IF (@executeScriptsImmediately = 1) EXEC sp_executesql @sql;
 SET @id = ( SELECT TOP 1 Id FROM @tbl WHERE Id > @id ORDER BY Id );
END
PRINT N'';
```

[View and download](https://gist.github.com/1336229) this script from GitHub.

Granted, you could accomplish the same thing by moving the "templates" to the SELECT statement that inserts rows into the the table variable. I just felt especially nerdy using computed columns. I like being especially nerdy.
