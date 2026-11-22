// Answers an agent that asks for Markdown (`Accept: text/markdown`) with the page's
// Markdown copy, which llmsPlugin() writes beside each page. The code is SiteSquatch's
// "Serving Markdown" page (sitesquatch.dev/docs/serving-markdown/), in this repository's style.

/** Whether `accept` asks for text/markdown by name, at least as much as for HTML (by q-values). */
function prefersMarkdown( accept ) {
	const q = new Map();
	for ( const part of accept.split( "," ) ) {
		const [ type, ...params ] = part.split( ";" ).map( p => p.trim().toLowerCase() );
		const given = params.find( p => p.startsWith( "q=" ) );
		if ( type ) q.set( type, given === undefined ? 1 : Number( given.slice( 2 ) ) || 0 );
	}
	const markdown = q.get( "text/markdown" ) ?? 0;
	return markdown > 0 && markdown >= ( q.get( "text/html" ) ?? q.get( "text/*" ) ?? q.get( "*/*" ) ?? 0 );
}

/** A page's Markdown copy, as llmsPlugin() writes it: `/guide/intro/` (or `/guide/intro`) is `/guide/intro/index.md`, `/about.html` is `/about.md`; a file of another kind has none. */
function copyOf( pathname ) {
	if ( pathname.endsWith( "/" ) ) return `${ pathname }index.md`;
	if ( /\.html?$/.test( pathname ) ) return pathname.replace( /\.html?$/, ".md" );
	return /\.[a-z0-9]+$/i.test( pathname ) ? undefined : `${ pathname }/index.md`;
}

export default async ( request ) => {
	if ( !prefersMarkdown( request.headers.get( "accept" ) ?? "" ) ) return;
	const url = new URL( request.url );
	const copy = copyOf( url.pathname );
	if ( !copy ) return;
	const found = await fetch( new URL( copy, url ) );
	if ( !found.ok ) return;
	return new Response( found.body, { headers: { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept", Link: `<${ url.origin }${ url.pathname }>; rel="canonical"` } } );
};

export const config = { path: "/*", excludedPath: [ "/*.md" ], header: { accept: "text/markdown" } };
