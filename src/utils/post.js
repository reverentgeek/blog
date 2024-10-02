import { program } from "commander";
import fs from "fs-extra";
import slugger from "slug";
import { join } from "node:path";
import { v1 } from "uuid";

const __dirname = import.meta.dirname;
const postsPath = join( __dirname, "..", "site", "posts" );
const blogImagePath = join( __dirname, "..", "site", "content", "images" );

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

const createPost = async ( title ) => {
	try {
		const slug = slugger( title ).toLowerCase();
		if ( !slug ) {
			throw new Error( `title [${ title }] is not sluggable!` );
		}
		const postFile = `${ slug }.md`;
		const postPath = join( postsPath, postFile );
		const imgPath = join( blogImagePath, slug );
		const exists = await fs.pathExists( postPath );
		if ( !exists ) {
			const frontMatter = `---
id: ${ v1().replace( /-/g, "" ) }
title: "${ title }"
feature_image: /content/images/${ slug }/${ slug }.jpg
description:
date: ${ formatDate( new Date() ) }
slug: ${ slug }
---
`;
			await fs.writeFile( postPath, frontMatter, { encoding: "UTF-8" } );
		}
		console.log( "image path:", imgPath );
		await fs.ensureDir( imgPath );
	} catch( err ) {
		console.log( "Error creating new post" );
		console.log( err );
	}
};

program.command( "create <title>" ).action( createPost );

( async () => {
	await program.parseAsync( process.argv );
} )();

