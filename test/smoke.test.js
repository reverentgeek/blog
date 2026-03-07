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
	assert.match( homepage, /<link rel="canonical" href="https:\/\/reverentgeek\.com\/">/i );
	assert.match( homepage, /data-mobile-menu-button/i );
} );

test( "post page smoke test", async () => {
	const postPage = await readDistFile( "edgejs-template-plugin-for-11ty/index.html" );

	assert.match( postPage, /<h1[^>]*>\s*Edge\.js Template Plugin for 11ty\s*<\/h1>/i );
	assert.match( postPage, /eleventy-plugin-edgejs/i );
	assert.match( postPage, /<meta[^>]+property="og:title"[^>]+Edge\.js Template Plugin for 11ty/i );

	// Extract and validate JSON-LD structured data
	const jsonLdMatch = postPage.match( /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/ );
	assert.ok( jsonLdMatch, "JSON-LD script block should be present" );
	const jsonLd = JSON.parse( jsonLdMatch[1] );
	assert.equal( jsonLd["@type"], "Article" );
	assert.equal( jsonLd.headline, "Edge.js Template Plugin for 11ty" );
	assert.ok( jsonLd.description, "description should not be empty" );
	assert.match( jsonLd.datePublished, /^\d{4}-\d{2}-\d{2}$/ );
	assert.equal( jsonLd.author["@type"], "Person" );
	assert.equal( jsonLd.publisher["@type"], "Organization" );
	assert.ok( !jsonLd.dateModified, "dateModified should not be present" );
} );

test( "feed smoke test", async () => {
	const feed = await readDistFile( "feed.xml" );

	assert.match( feed, /<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom">/i );
	assert.match( feed, /<title>ReverentGeek<\/title>/i );
	assert.match( feed, /<link href="https:\/\/reverentgeek\.com\/edgejs-template-plugin-for-11ty\/"\/>/i );
	assert.ok( ( feed.match( /<entry>/g ) || [] ).length <= 30 );
} );
