"use strict";

const path = require( "path" );
const gallery = require( "./gallery" );

( async () => {
	const avatarFolder = path.join( __dirname, "..", "site", "content", "images", "avatars" );
	const srcFolder = path.join( avatarFolder, "orig" );
	const srcFiles = await gallery.getOrderedFiles( srcFolder );
	for( const image of srcFiles ) {
		await gallery.convertImage( image, srcFolder, avatarFolder );
	}
	const output = await gallery.getColumnHtml( avatarFolder, "/content/images/avatars" );
	console.log( output );
} )();