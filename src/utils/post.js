import { program } from "commander";
import { join } from "node:path";
import { createContent } from "./create-content.js";

const __dirname = import.meta.dirname;

const contentDir = join( __dirname, "..", "site", "posts" );
const imagesDir = join( __dirname, "..", "site", "content", "images" );

program.command( "create <title>" ).action( ( title ) => {
	return createContent( { kind: "post", contentDir, imagesDir, title } );
} );

( async () => {
	await program.parseAsync( process.argv );
} )();
