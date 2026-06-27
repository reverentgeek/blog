// One-time converter: Disqus XML export -> static, read-only comment archive.
//
// Reads the gzipped Disqus export and writes src/site/_data/legacyComments.json,
// keyed by post slug (matching giscus's `pathname` mapping). Deleted, spam, and
// hand-blocked comments are dropped; comment HTML is sanitized against a strict
// tag allowlist and all external links are made rel="nofollow ugc noopener".
//
// Usage: node scripts/convert-disqus.js [path-to-export.xml.gz]
// The generated JSON is the source of truth going forward — re-run only if you
// produce a fresh Disqus export.

import { gunzipSync } from "node:zlib";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), ".." );
const SRC = process.argv[2] || path.join( root, "data", "disqus-export.xml.gz" );
const OUT = path.join( root, "src", "site", "_data", "legacyComments.json" );
const POSTS_DIR = path.join( root, "src", "site", "posts" );
const TIMEZONE = "America/New_York";

// Disqus thread slugs that were renamed since the comments were written.
const SLUG_REMAP = {
	"using-blazon-for-technical-presentations": "blazon-for-technical-presentations-and-training",
	"build-a-command-line-application-using-deno-2.0": "build-a-command-line-application-with-deno-2"
};

// Obvious spam Disqus failed to flag (SEO backlink comment).
const DROP_IDS = new Set( [ "4494248896" ] );

const ALLOWED_TAGS = new Set( [
	"p", "br", "a", "strong", "b", "em", "i", "u",
	"code", "pre", "blockquote", "ul", "ol", "li"
] );

const escapeHtml = s =>
	s.replace( /&/g, "&amp;" ).replace( /</g, "&lt;" ).replace( />/g, "&gt;" )
		.replace( /"/g, "&quot;" );

// Decode the handful of XML entities that appear in author names, so the
// template escapes the plain text exactly once via {{ }}.
const decodeEntities = s =>
	s.replace( /&lt;/g, "<" ).replace( /&gt;/g, ">" ).replace( /&quot;/g, "\"" )
		.replace( /&#0?39;/g, "'" ).replace( /&apos;/g, "'" ).replace( /&amp;/g, "&" );

const dateDisplay = iso =>
	new Date( iso ).toLocaleDateString( "en-US", {
		year: "numeric", month: "long", day: "numeric", timeZone: TIMEZONE
	} );

// Strict allowlist sanitizer for the small, fixed set of historical comments.
function sanitize( html ) {
	// Drop dangerous elements outright, including their contents.
	let out = html.replace( /<(script|style|iframe)[\s\S]*?<\/\1>/gi, "" );
	out = out.replace( /<[^>]+>/g, ( tag ) => {
		const m = tag.match( /^<\s*\/?\s*([a-z0-9]+)/i );
		const name = m ? m[1].toLowerCase() : "";
		if ( !ALLOWED_TAGS.has( name ) ) return ""; // strip tag, keep inner text
		if ( tag[1] === "/" ) return `</${ name }>`; // closing tag, bare
		if ( name === "a" ) {
			const href = ( tag.match( /href\s*=\s*["']([^"']*)["']/i ) || [] )[1] || "";
			if ( !/^https?:\/\//i.test( href ) ) return ""; // unsafe/relative -> drop tag
			return `<a href="${ escapeHtml( href ) }" rel="nofollow ugc noopener" target="_blank">`;
		}
		return `<${ name }>`; // allowed tag, strip all attributes
	} );
	return out.trim();
}

const xml = gunzipSync( readFileSync( SRC ) ).toString( "utf8" );

// thread dsq:id -> slug (last path segment of the canonical link)
const threadSlug = {};
for ( const m of xml.matchAll( /<thread dsq:id="(\d+)">([\s\S]*?)<\/thread>/g ) ) {
	const link = ( m[2].match( /<link>([^<]*)<\/link>/ ) || [] )[1] || "";
	let slug = ( link.replace( /\/+$/, "" ).split( "/" ).pop() || "" ).toLowerCase();
	slug = SLUG_REMAP[slug] || slug;
	threadSlug[m[1]] = slug;
}

const postSlugs = new Set(
	readdirSync( POSTS_DIR ).filter( f => f.endsWith( ".md" ) )
		.map( f => f.replace( /\.md$/, "" ).toLowerCase() )
);

// Parse comments.
const comments = [];
for ( const m of xml.matchAll( /<post dsq:id="(\d+)">([\s\S]*?)<\/post>/g ) ) {
	const id = m[1];
	const b = m[2];
	const get = re => ( b.match( re ) || [] )[1] || "";
	if ( get( /<isDeleted>(\w+)<\/isDeleted>/ ) === "true" ) continue;
	if ( get( /<isSpam>(\w+)<\/isSpam>/ ) === "true" ) continue;
	if ( DROP_IDS.has( id ) ) continue;
	comments.push( {
		id,
		parentId: get( /<parent dsq:id="(\d+)"\s*\/>/ ) || null,
		threadId: get( /<thread dsq:id="(\d+)"\s*\/>/ ),
		author: decodeEntities( get( /<author>[\s\S]*?<name>([^<]*)<\/name>/ ) || "Anonymous" ),
		createdAt: get( /<createdAt>([^<]*)<\/createdAt>/ ),
		html: sanitize( ( b.match( /<message><!\[CDATA\[([\s\S]*?)\]\]><\/message>/ ) || [] )[1] || "" )
	} );
}

// Group by slug, dropping comments whose thread maps to no current post.
const bySlug = {};
const unmatched = {};
for ( const c of comments ) {
	const slug = threadSlug[c.threadId];
	if ( slug && postSlugs.has( slug ) ) ( bySlug[slug] ??= [] ).push( c );
	else ( unmatched[slug || "(no-thread)"] ??= [] ).push( c );
}

// Flatten each thread depth-first (oldest first) so the template can render a
// single list with an indent level instead of recursing.
function flatten( list ) {
	const byId = new Map( list.map( c => [ c.id, c ] ) );
	const children = new Map();
	const roots = [];
	for ( const c of list ) {
		const parent = c.parentId && byId.has( c.parentId ) ? c.parentId : null;
		if ( parent ) ( children.get( parent ) ?? children.set( parent, [] ).get( parent ) ).push( c );
		else roots.push( c );
	}
	const byDate = ( a, b ) => a.createdAt.localeCompare( b.createdAt );
	const ordered = [];
	const walk = ( c, depth ) => {
		ordered.push( {
			author: c.author,
			datetime: c.createdAt,
			date: dateDisplay( c.createdAt ),
			html: c.html,
			depth: Math.min( depth, 4 )
		} );
		( children.get( c.id ) ?? [] ).sort( byDate ).forEach( ch => walk( ch, depth + 1 ) );
	};
	roots.sort( byDate ).forEach( r => walk( r, 0 ) );
	return ordered;
}

const result = {};
for ( const slug of Object.keys( bySlug ).sort() ) result[slug] = flatten( bySlug[slug] );

writeFileSync( OUT, JSON.stringify( result, null, "\t" ) + "\n" );

const total = Object.values( result ).reduce( ( s, a ) => s + a.length, 0 );
const unmatchedTotal = Object.values( unmatched ).reduce( ( s, a ) => s + a.length, 0 );
console.log( `Wrote ${ total } comments across ${ Object.keys( result ).length } posts -> ${ path.relative( root, OUT ) }` );
console.log( `Skipped ${ unmatchedTotal } comments on ${ Object.keys( unmatched ).length } unmatched thread(s):` );
for ( const [ slug, arr ] of Object.entries( unmatched ).sort( ( a, b ) => b[1].length - a[1].length ) ) {
	console.log( `  ${ arr.length }  ${ slug }` );
}
