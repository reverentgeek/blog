import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname( fileURLToPath( import.meta.url ) );
const distDir = path.join( __dirname, "..", "dist" );

async function readDistFile( relativePath ) {
	return readFile( path.join( distDir, relativePath ), "utf8" );
}

test( "homepage smoke test", async () => {
	const homepage = await readDistFile( "index.html" );

	assert.match( homepage, /<title>Home\s+[–-]\s+ReverentGeek<\/title>/i );
	assert.match( homepage, /<section class="post-list">/i );
	assert.match( homepage, /href="\/feed\.xml"/i );
} );

test( "post page smoke test", async () => {
	const postPage = await readDistFile( "edgejs-template-plugin-for-11ty/index.html" );

	assert.match( postPage, /<h1[^>]*>\s*Edge\.js Template Plugin for 11ty\s*<\/h1>/i );
	assert.match( postPage, /eleventy-plugin-edgejs/i );
	assert.match( postPage, /<meta[^>]+property="og:title"[^>]+Edge\.js Template Plugin for 11ty/i );
} );

test( "feed smoke test", async () => {
	const feed = await readDistFile( "feed.xml" );

	assert.match( feed, /<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom">/i );
	assert.match( feed, /<title>ReverentGeek<\/title>/i );
	assert.match( feed, /<link href="https:\/\/reverentgeek\.com\/edgejs-template-plugin-for-11ty\/"\/>/i );
} );
