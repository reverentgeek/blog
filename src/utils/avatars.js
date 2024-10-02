import path from "node:path";
import fs from "fs-extra";
import { program } from "commander";
import * as gallery from "./gallery.js";
const __dirname = import.meta.dirname;

program
	.name( "avatar-gallery-utils" )
	.description( "CLI tools for managing the avatar gallery" )
	.version( "1.0.0" );

program
	.command( "list" )
	.description( "List unprocessed image files" )
	.argument( "<folder>", "folder to process" )
	.action( async ( folder ) => {
		const filesToConvert = await getUnprocessedFiles( folder );
		if ( filesToConvert.length > 0 ) {
			for( const f of filesToConvert ) {
				console.log( f );
			}
		} else {
			console.log( "No files to convert" );
		}
	} );

program
	.command( "convert" )
	.description( "Convert unprocessed image files" )
	.argument( "<folder>", "folder to process" )
	.option( "-f, --force", "force conversion of all files" )
	.action( async ( folder, options ) => {
		const filesToConvert = await updateFileNames( folder, options.force );
		if ( filesToConvert.length > 0 ) {
			await convertFiles( folder, filesToConvert );
		}
	} );

program
	.command( "html" )
	.argument( "<folder>", "folder to process" )
	.description( "Generate html from avatar files" )
	.action( async ( folder ) => {
		const contentType = folder.endsWith( "s" ) ? folder.substring( 0, folder.length - 1 ) : folder;
		const { avatarFolder } = getWorkingFolderPaths( folder );
		const output = await gallery.getFlexHtml( avatarFolder, `/content/images/${ folder }`, contentType );
		console.log( output );
	} );

program.parse();

function padZero( num, targetLength ) {
	const s = String( num );
	return s.padStart( targetLength, "0" );
}

function getWorkingFolderPaths( folder ) {
	const avatarFolder = path.join( __dirname, "..", "site", "content", "images", folder );
	const srcFolder = path.join( avatarFolder, "orig" );
	return { avatarFolder, srcFolder };
}

async function getUnprocessedFiles( folder ) {
	const { srcFolder } = getWorkingFolderPaths( folder );
	const srcFiles = await gallery.getOrderedFiles( srcFolder, true );
	const filesToRename = [];

	for( const f of srcFiles ) {
		if ( /^\d{3}-/gm.test( f ) === false ) {
			filesToRename.push( f );
		}
	}
	return filesToRename;
}

async function updateFileNames( folder, force ) {
	const { srcFolder } = getWorkingFolderPaths( folder );
	const srcFiles = await gallery.getOrderedFiles( srcFolder, true );
	const goodFiles = [];
	const filesToRename = [];
	const newFiles = [];

	for( const f of srcFiles ) {
		if ( /^\d{3}-/gm.test( f ) ) {
			goodFiles.push( f );
			if ( force ) {
				newFiles.push( f );
			}
		} else {
			filesToRename.push( f );
		}
	}

	if ( !force && filesToRename.length === 0 ) {
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

async function convertFiles( folder, filesToConvert ) {
	const { avatarFolder, srcFolder } = getWorkingFolderPaths( folder );

	for( const image of filesToConvert ) {
		await gallery.convertImage( image, srcFolder, avatarFolder, 500 );
	}
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

async function oldStuff() {
	const avatarFolder = path.join( __dirname, "..", "site", "content", "images", "avatars" );
	const srcFolder = path.join( avatarFolder, "orig" );
	const srcFiles = await gallery.getOrderedFiles( srcFolder, true );
	srcFiles.reverse();
	updateNames( srcFiles, srcFolder, avatarFolder );
	console.log( "converting image files..." );
	for( const image of srcFiles ) {
		await gallery.convertImage( image, srcFolder, avatarFolder, 500 );
	}
	console.log( "" );
	console.log( "getting html..." );
	const output = await gallery.getColumnHtml( avatarFolder, "/content/images/avatars" );
	console.log( output );
}
