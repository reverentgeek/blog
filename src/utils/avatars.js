"use strict";

const path = require( "path" );
const fs = require( "fs-extra" );
const gallery = require( "./gallery" );

function padZero( num, targetLength ) {
	const s = String( num );
	return s.padStart( targetLength, "0" );
}

async function updateNames( srcFiles, srcFolder, avatarFolder ) {
	let i = -1;
	const newFiles = [];
	for( const f of srcFiles ) {
		i++;
		const newFile = `${ padZero( i, 3 ) }-${ f }`;
		const dstFile = `${ path.basename( f, path.extname( f ) ) }${ ".jpg" }`;
		const dstNewFile = `${ padZero( i, 3 ) }-${ dstFile }`;
		newFiles.push( newFile );
		console.log( "orig:", f, "->", newFile );
		await fs.rename( path.join( srcFolder, f ), path.join( srcFolder, newFile ) );
		const dstExists = await fs.pathExists( path.join( avatarFolder, dstFile ) );
		if ( dstExists ) {
			console.log( "avatar:", dstFile, "->", dstNewFile );
			await fs.rename( path.join( avatarFolder, dstFile ), path.join( avatarFolder, dstNewFile ) );
		}
	}
	return newFiles;
}

( async () => {
	const avatarFolder = path.join( __dirname, "..", "site", "content", "images", "avatars" );
	// const srcFolder = path.join( avatarFolder, "orig" );
	// const srcFiles = await gallery.getOrderedFiles( srcFolder, true );
	// srcFiles.reverse();
	// updateNames( srcFiles, srcFolder, avatarFolder );
	// console.log( "converting image files..." );
	// for( const image of srcFiles ) {
	// 	await gallery.convertImage( image, srcFolder, avatarFolder, 500 );
	// }
	console.log( "" );
	console.log( "getting html..." );
	const output = await gallery.getColumnHtml( avatarFolder, "/content/images/avatars" );
	console.log( output );
} )();
