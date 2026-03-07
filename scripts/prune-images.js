import { readdirSync, readFileSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const distPath = "./dist";
const imgPath = join( distPath, "img" );

// Collect all filenames referenced in HTML and XML output
const referenced = new Set();
const refPattern = /\/img\/([^"'\s<>)]+)/g;

function scanDir( dir ) {
	for ( const entry of readdirSync( dir, { withFileTypes: true } ) ) {
		const fullPath = join( dir, entry.name );
		if ( entry.isDirectory() && entry.name !== "img" ) {
			scanDir( fullPath );
		} else if ( /\.(html|xml)$/.test( entry.name ) ) {
			const content = readFileSync( fullPath, "utf-8" );
			let match;
			while ( ( match = refPattern.exec( content ) ) !== null ) {
				referenced.add( match[1] );
			}
		}
	}
}

scanDir( distPath );

// Remove unreferenced images
const allImages = readdirSync( imgPath );
let removed = 0;

for ( const file of allImages ) {
	if ( !referenced.has( file ) ) {
		unlinkSync( join( imgPath, file ) );
		removed++;
	}
}

console.log( `Pruned ${ removed } stale image(s) from dist/img/ (${ allImages.length - removed } kept)` );
