import { image } from "ssqch/image";

// A 1200px PNG of a page's image, for social cards (og:image). Remote images and
// images that fail to process are passed through with the standard card size.
export function createSocialImageFilter() {
	const socialImageCache = new Map();

	return async function socialImage( imagePath ) {
		if ( !imagePath || imagePath.startsWith( "http" ) ) {
			return { url: imagePath || "", width: 1200, height: 630 };
		}

		if ( socialImageCache.has( imagePath ) ) {
			return socialImageCache.get( imagePath );
		}

		try {
			const sourcePath = `src/site${ imagePath.startsWith( "/" ) ? "" : "/" }${ imagePath }`;
			const derivatives = await image( sourcePath, {
				formats: [ "png" ],
				widths: [ 1200 ]
			} );
			const img = derivatives.png[0];
			const result = { url: img.url, width: img.width, height: img.height };

			socialImageCache.set( imagePath, result );

			return result;
		} catch {
			return { url: imagePath, width: 1200, height: 630 };
		}
	};
}
