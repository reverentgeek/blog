import { createHash } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import { join, parse } from "node:path";

const assetDir = "./dist/assets";
const manifestPath = "./.asset-manifest.json";

// Built entry points to fingerprint, keyed by the name templates use ({{ assets.css }}).
// `assets/pco.js` is deliberately excluded: it is an Eleventy passthrough copy that
// src/site/pages/pco.md imports by a hard-coded path, so its name has to stay stable.
const entries = {
	css: "index.css",
	js: "index.js",
	prism: "prism.js"
};

const hashOf = contents => createHash( "sha256" ).update( contents ).digest( "hex" ).slice( 0, 8 );

console.log( "Fingerprinting assets..." );

// Read everything before renaming anything. A partial rename would leave the manifest
// unwritten, and templates would silently fall back to dev paths that no longer exist
// on disk, publishing a site with no CSS.
const sources = [];

for ( const [ key, fileName ] of Object.entries( entries ) ) {
	const source = join( assetDir, fileName );

	try {
		sources.push( { key, fileName, source, contents: await readFile( source ) } );
	} catch ( error ) {
		if ( error.code === "ENOENT" ) {
			throw new Error( `Missing ${ source } — run build:css and build:js before build:hash.`, { cause: error } );
		}

		throw error;
	}
}

const manifest = {};

for ( const { key, fileName, source, contents } of sources ) {
	const { name, ext } = parse( fileName );
	const hashedName = `${ name }.${ hashOf( contents ) }${ ext }`;

	await rename( source, join( assetDir, hashedName ) );
	manifest[key] = `/assets/${ hashedName }`;

	console.log( `  ${ fileName } → ${ hashedName }` );
}

await writeFile( manifestPath, `${ JSON.stringify( manifest, null, "\t" ) }\n` );

console.log( "Fingerprinting complete! ✓" );
