import { execFile } from "node:child_process";
import { join } from "node:path";
import fs from "fs-extra";
import slugger from "slug";
import { getId } from "./get-id.js";

const zeroPad = ( number ) => {
	const l = number.toString().length;
	if ( l < 2 ) {
		return "0" + number.toString();
	}
	return number + "";
};

const formatDate = ( dt ) => {
	return `${ dt.getFullYear() }-${ zeroPad( dt.getMonth() + 1 ) }-${ zeroPad( dt.getDate() ) }`;
};

const openInOS = ( folderPath ) => {
	const openers = {
		darwin: "open",
		win32: "explorer",
		linux: "xdg-open"
	};
	const cmd = openers[process.platform];
	if ( !cmd ) {
		return;
	}
	execFile( cmd, [ folderPath ], ( err ) => {
		if ( err ) {
			console.log( "Could not open folder:", err.message );
		}
	} );
};

export const createContent = async ( { kind, contentDir, imagesDir, title } ) => {
	try {
		const slug = slugger( title ).toLowerCase();
		if ( !slug ) {
			throw new Error( `title [${ title }] is not sluggable!` );
		}
		const filePath = join( contentDir, `${ slug }.md` );
		const imgPath = join( imagesDir, slug );
		const exists = await fs.pathExists( filePath );
		if ( !exists ) {
			const frontMatter = `---
id: ${ getId() }
title: "${ title }"
feature_image: /content/images/${ slug }/${ slug }.jpg
description:
meta_description:
date: ${ formatDate( new Date() ) }
slug: ${ slug }
---
`;
			await fs.writeFile( filePath, frontMatter, { encoding: "UTF-8" } );
		}
		console.log( "image path:", imgPath );
		await fs.ensureDir( imgPath );
		openInOS( imgPath );
	} catch ( err ) {
		console.log( `Error creating new ${ kind }` );
		console.log( err );
	}
};
