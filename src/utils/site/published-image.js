import { image } from "ssqch/image";

// The build publishes generated copies of images in src/site/content/images/, never the
// originals. The ssqch/image plugin rewrites <img> tags in HTML pages, but it can't see
// image URLs inside a feed's escaped HTML or a JSON-LD block, so these point them at a
// generated copy too (in the source's own format, so every feed reader can show it).

const LOCAL_IMAGE = /^\/content\/images\//;

export function createPublishedImageFilters() {
	const cache = new Map();

	// The URL of a generated copy of a local image, at most `width` pixels wide
	// ("auto" keeps the original width). Remote URLs come back as they are.
	function publishedImage( imagePath, width = 1200 ) {
		if ( !imagePath || !LOCAL_IMAGE.test( imagePath ) ) {
			return Promise.resolve( imagePath );
		}

		const key = `${ imagePath }@${ width }`;
		if ( !cache.has( key ) ) {
			cache.set( key, image( `src/site${ decodeURI( imagePath ) }`, { formats: [ "auto" ], widths: [ width ] } )
				// "auto" comes back keyed by the source's format (png, jpeg...).
				.then( derivatives => Object.values( derivatives )[0][0].url ) );
		}

		return cache.get( key );
	}

	// Some post HTML with every local <img src> pointed at a generated copy, for the feed.
	// Run it before htmlToAbsoluteUrls, which makes the new URLs absolute.
	async function feedImages( html ) {
		if ( !html ) return html;

		const pattern = /(<img\b[^>]*?\ssrc=")(\/content\/images\/[^"]+)(")/g;
		const sources = [ ...new Set( [ ...html.matchAll( pattern ) ].map( match => match[2] ) ) ];
		const urls = new Map( await Promise.all( sources.map( async src => [ src, await publishedImage( src ) ] ) ) );

		return html.replace( pattern, ( tag, before, src, after ) => `${ before }${ urls.get( src ) }${ after }` );
	}

	return { publishedImage, feedImages };
}
