"use strict";

const path = require( "path" );
const gallery = require( "./gallery.cjs" );

( async () => {
	const avatarFolder = path.join( __dirname, "..", "site", "content", "images", "salto" );
	const srcFolder = path.join( avatarFolder, "orig" );
	const srcFiles = await gallery.getOrderedFiles( srcFolder );
	for( const image of srcFiles ) {
		await gallery.convertImage( image, srcFolder, avatarFolder, 256, ".png" );
	}
} )();
