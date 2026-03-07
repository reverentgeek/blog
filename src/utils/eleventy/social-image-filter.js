export function createSocialImageFilter( Image ) {
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
			const metadata = await Image( sourcePath, {
				formats: [ "png" ],
				widths: [ 1200 ],
				outputDir: "./dist/img",
				urlPath: "/img/"
			} );
			const img = metadata.png[0];
			const result = { url: img.url, width: img.width, height: img.height };

			socialImageCache.set( imagePath, result );

			return result;
		} catch {
			return { url: imagePath, width: 1200, height: 630 };
		}
	};
}
