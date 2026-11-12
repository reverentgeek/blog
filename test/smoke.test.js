import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
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

	// One button per goal, and the books strip, on page 1.
	assert.match( homepage, /href="?\/commissions\/"?[^>]*data-cta="?start-commission/ );
	assert.match( homepage, /href="?\/devrel\/"?[^>]*data-cta="?view-devrel/ );
	assert.match( homepage, /class="?book-strip"?/ );
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

async function listBuiltPages() {
	const files = await readdir( distDir, { recursive: true } );
	return files.filter( file => file.endsWith( "index.html" ) && !file.startsWith( "img" ) );
}

// Code fences are highlighted while the site builds, so posts load no highlighting script.
// (Front matter is checked by the `posts` schema in ssqch.config.js on every build.)
test( "code is highlighted at build time", async () => {
	const postPage = await readDistFile( "edgejs-template-plugin-for-11ty/index.html" );

	assert.match( postPage, /<pre class="highlight"><code class="language-edge">/ );
	assert.match( postPage, /<span class="hl-keyword">@if<\/span>/ );
	assert.doesNotMatch( postPage, /prism/i );
} );

test( "sitemap lists only pages", async () => {
	const sitemap = await readDistFile( "sitemap.xml" );
	const urls = [ ...sitemap.matchAll( /<loc>([^<]+)<\/loc>/g ) ].map( match => match[1] );

	assert.ok( urls.length > 0, "sitemap should list URLs" );

	for ( const url of urls ) {
		assert.match( url, /^https:\/\/reverentgeek\.com\/(.*\/)?$/, `unexpected sitemap URL: ${ url }` );
	}
} );

test( "every page has a unique title", async () => {
	const seen = new Map();

	for ( const file of await listBuiltPages() ) {
		const html = await readDistFile( file );
		const head = html.slice( 0, html.indexOf( "</head>" ) );
		const title = head.match( /<title>\s*([^<]*?)\s*<\/title>/ )?.[1];

		assert.ok( title, `${ file } should have a <title>` );
		assert.ok( !seen.has( title ), `${ file } and ${ seen.get( title ) } share the title "${ title }"` );
		seen.set( title, file );
	}
} );

test( "commission and DevRel pages have their calls to action", async () => {
	const commissions = await readDistFile( "commissions/index.html" );
	assert.match( commissions, /data-cta="?start-commission/ );
	assert.match( commissions, /data-cta="?commission-inquiry/ );

	const avatars = await readDistFile( "avatars/index.html" );
	assert.match( avatars, /id="?order"?/ );
	assert.match( avatars, /collection-component-/, "the Shopify avatar buy button should be on the avatars page" );

	const draw = await readDistFile( "draw/index.html" );
	assert.match( draw, /href="?\/avatars\/#order"?[^>]*data-cta="?order-avatar/ );
	assert.doesNotMatch( draw, /data-mobile-menu-button/, "the landing page has no site navigation" );

	const devrel = await readDistFile( "devrel/index.html" );
	assert.match( devrel, /data-cta="?devrel-talk/ );
	assert.match( devrel, /data-cta="?resume/ );
} );

test( "end-of-post callout depends on the post's tags", async () => {
	const callouts = {
		"wordcamp-us-2024-illustrations": "commissions",
		"5-essential-ingredients-for-an-awesome-tech-talk": "devrel",
		"developer-relations-activity-patterns": "devrel",
		"edgejs-template-plugin-for-11ty": "kofi"
	};
	for ( const [ slug, variant ] of Object.entries( callouts ) ) {
		const html = await readDistFile( `${ slug }/index.html` );
		assert.match( html, new RegExp( `data-cta="?post-callout-${ variant }` ), `${ slug } should get the ${ variant } callout` );
	}
} );

// Post dates are calendar dates. Formatting them in local time showed the day before on
// builds west of UTC, so run this with TZ=America/New_York as well as UTC.
test( "post dates match the front matter in any timezone", async () => {
	const post = await readDistFile( "leveling-guitar-patches-with-tauri/index.html" );
	assert.match( post, /June 17, 2026/ );
	assert.doesNotMatch( post, /June 16, 2026/ );
} );

test( "every page has a skip link and a labeled menu button", async () => {
	const homepage = await readDistFile( "index.html" );
	assert.match( homepage, /<a class="?skip-link"? href="?#main"?/ );
	assert.match( homepage, /<main id="?main"?/ );
	assert.match( homepage, /aria-label="?Menu"?/ );
} );
