import { program } from "commander";
import { join } from "node:path";
import { createContent } from "./create-content.js";

const __dirname = import.meta.dirname;

// Usage: node src/utils/content.js <post|page> create <title>
const folders = {
	post: "posts",
	page: "pages"
};

const [ kind, ...args ] = process.argv.slice( 2 );

if ( !folders[kind] ) {
	throw new Error( `Unknown content type [${ kind }]. Use one of: ${ Object.keys( folders ).join( ", " ) }` );
}

const contentDir = join( __dirname, "..", "site", folders[kind] );
const imagesDir = join( __dirname, "..", "site", "content", "images" );

program.command( "create <title>" ).action( ( title ) => {
	return createContent( { kind, contentDir, imagesDir, title } );
} );

( async () => {
	await program.parseAsync( args, { from: "user" } );
} )();
