"use strict";

const path = require( "path" );
const gallery = require( "./gallery" );
const fs = require( "fs-extra" );

( async () => {
	const galleryFolder = path.join( __dirname, "..", "site", "content", "images", "sketch-notes" );
	const srcFolder = path.join( galleryFolder, "orig" );
	const captions = await fs.readJSON( path.join( srcFolder, "captions.json" ) );
	const srcFiles = await gallery.getOrderedFiles( srcFolder );
	for( const image of srcFiles ) {
		await gallery.convertImage( image, srcFolder, galleryFolder );
	}
	const output = await gallery.getHtml( galleryFolder, "/content/images/sketch-notes", captions );
	console.log( output );
} )();
