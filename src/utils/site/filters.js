import { adjacentPosts, topicLabel, topicsOnly } from "./collections.js";

// Functions templates can call: {{ postDate(page.date) }}.
export function siteFilters( { socialImage } ) {
	return {
		htmlDateString( dateObj ) {
			return new Date( dateObj ).toISOString().split( "T" )[0];
		},

		postDate( dateObj ) {
			return new Date( dateObj ).toLocaleDateString( "en-US", { year: "numeric", month: "long", day: "numeric" } );
		},

		socialImage,

		// Drops the organizational tags (posts, page) so only real topics render.
		topicsOnly,

		topicLabel,

		adjacentPosts,

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
