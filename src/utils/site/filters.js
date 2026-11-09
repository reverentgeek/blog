import { adjacentPosts, topicLabel, topicsOnly } from "./collections.js";

// Functions templates can call: {{ postDate(page.date) }}.
export function siteFilters( { socialImage } ) {
	return {
		isSiteMapSafe( url ) {
			const isSafe = !url.startsWith( "/_" );
			return isSafe.toString();
		},

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

		currentYear() {
			return new Date().getFullYear();
		}
	};
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
