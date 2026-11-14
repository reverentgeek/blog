import { adjacentPosts, relatedPosts, topicLabel, topicsOnly } from "./collections.js";

const SECTION_MARKERS = new Set( [ "badge", "books", "clipboard", "envelope", "lightbulb", "microphone", "paper-airplane", "pencil", "road-fork", "tag", "toolbox" ] );

// Functions templates can call: {{ postDate(page.date) }}.
export function siteFilters( { socialImage, publishedImage, feedImages } ) {
	return {
		htmlDateString( dateObj ) {
			return new Date( dateObj ).toISOString().split( "T" )[0];
		},

		// Post dates are calendar dates (`date: 2026-06-17`), parsed as UTC midnight. Format
		// them in UTC too, or a build west of UTC shows the day before.
		postDate( dateObj ) {
			return new Date( dateObj ).toLocaleDateString( "en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" } );
		},

		socialImage,

		// Generated copies of local images, for URLs the image plugin can't rewrite
		// (src/utils/site/published-image.js).
		publishedImage,
		feedImages,

		// The aria-current attribute for a nav item: "page" on the item's own URL, "true" on
		// a page in its section (`section` URL prefixes, or any post when `posts` is set).
		navCurrent( item, url, tags ) {
			if ( url === item.url ) return "aria-current=\"page\"";
			const inSection = ( item.section || [] ).some( prefix => url?.startsWith( prefix ) );
			const isPost = item.posts && Array.isArray( tags ) && tags.includes( "posts" );
			return inSection || isPost ? "aria-current=\"true\"" : "";
		},

		// Hand-drawn section markers. A page's front matter maps h2 ids to markers
		// (`markers: { how-it-works: pencil }`), and the marker goes before the heading text.
		// The art is in src/site/static/hand-drawn/, and each name has an `.ink-*` class in
		// styles.css. An unknown name fails the build instead of rendering an empty box.
		sectionMarkers( html, markers ) {
			if ( !markers ) return html;
			for ( const [ id, name ] of Object.entries( markers ) ) {
				if ( !SECTION_MARKERS.has( name ) ) throw new Error( `Unknown section marker "${ name }" for #${ id }` );
				if ( !html.includes( `<h2 id="${ id }">` ) ) throw new Error( `Section marker "${ name }": no <h2 id="${ id }"> on this page` );
			}
			return html.replace( /<h2 id="([^"]+)">/g, ( tag, id ) => markers[id]
				? `<h2 id="${ id }" class="has-marker"><span class="ink ink-${ markers[id] }" aria-hidden="true"></span>`
				: tag );
		},

		// Drops the organizational tags (posts, page) so only real topics render.
		topicsOnly,

		topicLabel,

		adjacentPosts,

		relatedPosts,

		// The /search.json index: one compact entry per post, newest first, for the
		// search box on /topics/. Titles, descriptions, and topic names only.
		searchIndex( posts ) {
			const entries = [ ...( posts || [] ) ]
				.sort( ( a, b ) => new Date( b.date ) - new Date( a.date ) )
				.map( post => ( {
					t: post.data.title,
					u: post.url,
					d: post.data.description || "",
					k: topicsOnly( post.data.tags ).map( topicLabel ),
					y: new Date( post.date ).toISOString().slice( 0, 10 )
				} ) );
			return JSON.stringify( entries );
		},

		readingTime,

		jsonLdArticle,

		calloutFor,

		currentYear() {
			return new Date().getFullYear();
		}
	};
}

// Which end-of-post callout a post gets, from its tags: drawing posts point to
// /commissions/, DevRel posts to /devrel/, and everything else to Ko-fi.
// An explicit `devrel` tag wins (the DevRel book posts are also tagged `books`), then
// illustration, then the broader DevRel topics.
const COMMISSION_TAGS = [ "illustration", "books" ];
const DEVREL_TAGS = [ "devrel", "speaking", "conferences", "leadership", "community", "career" ];

export function calloutFor( tags ) {
	const list = Array.isArray( tags ) ? tags : [];
	if ( list.includes( "devrel" ) ) return "devrel";
	if ( list.some( tag => COMMISSION_TAGS.includes( tag ) ) ) return "commissions";
	if ( list.some( tag => DEVREL_TAGS.includes( tag ) ) ) return "devrel";
	return "kofi";
}

// Rounded minutes, based on rendered post HTML at ~200 words per minute.
function readingTime( html ) {
	const words = String( html || "" )
		.replace( /<[^>]+>/g, " " )
		.split( /\s+/ )
		.filter( Boolean ).length;
	return Math.max( 1, Math.round( words / 200 ) );
}

function jsonLdArticle( { title, description, image, datePublished, author, publisher, pageUrl } ) {
	const ld = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: title,
		description: description,
		image: image,
		datePublished: datePublished,
		author: {
			"@type": "Person",
			name: author.name,
			url: author.url
		},
		publisher: {
			"@type": "Organization",
			name: publisher.name,
			logo: {
				"@type": "ImageObject",
				url: publisher.logoUrl
			}
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": pageUrl
		}
	};
	return JSON.stringify( ld, null, 2 );
}
