import { rmSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const distPath = "./dist";
const manifestPath = "./.asset-manifest.json";
const preserveFolders = [ "img", "optimized-images" ]; // Preserve optimized images

console.log( "Cleaning dist folder (preserving optimized images)..." );

try {
	const items = readdirSync( distPath );

	for ( const item of items ) {
		// Skip preserved folders
		if ( preserveFolders.includes( item ) ) {
			console.log( `  Preserving: ${ item }/` );
			continue;
		}

		const itemPath = join( distPath, item );
		const stats = statSync( itemPath );

		if ( stats.isDirectory() ) {
			console.log( `  Removing: ${ item }/` );
			rmSync( itemPath, { recursive: true, force: true } );
		} else {
			console.log( `  Removing: ${ item }` );
			rmSync( itemPath, { force: true } );
		}
	}

	console.log( "Clean complete! ✓" );
} catch ( error ) {
	if ( error.code === "ENOENT" ) {
		console.log( "dist folder does not exist, skipping clean." );
	} else {
		console.error( "Error during clean:", error );
		throw error;
	}
}

// Drop the fingerprint manifest too, so the dev server never serves hashed URLs for
// files the watchers write unhashed.
rmSync( manifestPath, { force: true } );

mkdirSync( "dist/assets", { recursive: true } );
