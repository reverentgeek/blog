"use strict";

const path = require( "path" );
const fs = require( "fs-extra" );
const { program } = require( "commander" );

const gallery = require( "./gallery.cjs" );

program
	.name( "doodle-gallery-utils" )
	.description( "CLI tools for managing the doodle gallery" )
	.version( "1.0.0" );

program
	.command( "convert" )
	.description( "Convert unprocessed doodle files" )
	.action( async () => {
		const filesToConvert = await updateFileNames();
		if ( filesToConvert.length > 0 ) {
			await convertFiles( filesToConvert );
		}
	} );

program
	.command( "html" )
	.description( "Generate html from doodle files" )
	.action( async () => {
		const { dstFolder } = getWorkingFolderPaths();
		const output = await gallery.getFlexHtml( dstFolder, "/content/images/doodles" );
		console.log( output );
	} );

program.parse();

function padZero( num, targetLength ) {
	const s = String( num );
	return s.padStart( targetLength, "0" );
}

function getWorkingFolderPaths() {
	const dstFolder = path.join( __dirname, "..", "site", "content", "images", "doodles" );
	const srcFolder = path.join( dstFolder, "orig" );
	return { dstFolder, srcFolder };
}

async function updateFileNames() {
	const { srcFolder } = getWorkingFolderPaths();
	const srcFiles = await gallery.getOrderedFiles( srcFolder, true );
	const goodFiles = [];
	const filesToRename = [];
	const newFiles = [];

	for( const f of srcFiles ) {
		if ( /^\d{3}-/gm.test( f ) ) {
			goodFiles.push( f );
		} else {
			filesToRename.push( f );
		}
	}

	if ( filesToRename.length === 0 ) {
		// Nothing to do, return empty array
		return newFiles;
	}
	goodFiles.sort().reverse();
	let lastId = goodFiles.length > 0 ? parseInt( goodFiles[0].substring( 0, 3 ), 10 ) : -1;
	for( const f of filesToRename ) {
		lastId++;
		const newFile = `${ padZero( lastId, 3 ) }-${ f }`;
		newFiles.push( newFile );
		console.log( `renaming [${ f }] -> [${ newFile }]` );
		await fs.rename( path.join( srcFolder, f ), path.join( srcFolder, newFile ) );
	}
	return newFiles;
}

async function convertFiles( filesToConvert ) {
	const { dstFolder, srcFolder } = getWorkingFolderPaths();

	for( const image of filesToConvert ) {
		await gallery.convertImage( image, srcFolder, dstFolder, 500 );
	}
}
