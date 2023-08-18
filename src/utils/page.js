"use strict";

const { program } = require( "commander" );
const fs = require( "fs-extra" );
const slugger = require( "slug" );
const path = require( "path" );
const uuid = require( "uuid" );

const pagesPath = path.join( __dirname, "..", "site", "pages" );
const blogImagePath = path.join( __dirname, "..", "site", "content", "images" );

const zeroPad = ( number ) => {
	const l = number.toString().length;
	if ( l < 2 ) {
		return "0" + number.toString();
	}
	return number + "";
};

const formatDate = dt => {
	return `${ dt.getFullYear() }-${ zeroPad( dt.getMonth() + 1 ) }-${ zeroPad( dt.getDate() ) }`;
};

const createPage = async ( title ) => {
	try {
		const slug = slugger( title ).toLowerCase();
		if ( !slug ) {
			throw new Error( `title [${ title }] is not sluggable!` );
		}
		const pageFile = `${ slug }.md`;
		const pagePath = path.join( pagesPath, pageFile );
		const imgPath = path.join( blogImagePath, slug );
		const exists = await fs.pathExists( pagePath );
		if ( !exists ) {
			const frontMatter = `---
id: ${ uuid.v1().replace( /-/g, "" ) }
title: "${ title }"
feature_image: /content/images/${ slug }/${ slug }.jpg
description:
date: ${ formatDate( new Date() ) }
slug: ${ slug }
---
`;
			await fs.writeFile( pagePath, frontMatter, { encoding: "UTF-8" } );
		}
		console.log( "image path:", imgPath );
		await fs.ensureDir( imgPath );
	} catch( err ) {
		console.log( "Error creating new page" );
		console.log( err );
	}
};

program.command( "create <title>" ).action( createPage );

( async () => {
	await program.parseAsync( process.argv );
} )();

