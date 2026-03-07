export function registerRssFilters( config, pluginRSS ) {
	const {
		getNewestCollectionItemDate,
		dateToRfc3339,
		absoluteUrl,
		convertHtmlToAbsoluteUrls: htmlToAbsoluteUrls
	} = pluginRSS;

	config.addFilter( "getNewestCollectionItemDate", getNewestCollectionItemDate );
	config.addFilter( "dateToRfc3339", dateToRfc3339 );
	config.addFilter( "absoluteUrl", absoluteUrl );
	config.addFilter( "htmlToAbsoluteUrls", htmlToAbsoluteUrls );
}

export function registerSiteFilters( config, { socialImageFilter } ) {
	config.addFilter( "isSiteMapSafe", function ( url ) {
		const isSafe = !url.startsWith( "/_" );
		return isSafe.toString();
	} );

	config.addFilter( "htmlDateString", ( dateObj ) => {
		return new Date( dateObj ).toISOString().split( "T" )[0];
	} );

	config.addFilter( "postDate", ( dateObj ) => {
		return new Date( dateObj ).toLocaleDateString( "en-US", { year: "numeric", month: "long", day: "numeric" } );
	} );

	config.addFilter( "socialImage", socialImageFilter );

	config.addShortcode( "currentYear", async () => {
		return new Date().getFullYear();
	} );
}
