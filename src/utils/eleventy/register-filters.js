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

	config.addFilter( "jsonLdArticle", ( { title, description, image, datePublished, author, publisher, pageUrl } ) => {
		const ld = {
			"@context": "https://schema.org",
			"@type": "Article",
			"headline": title,
			"description": description,
			"image": image,
			"datePublished": datePublished,
			"author": {
				"@type": "Person",
				"name": author.name,
				"url": author.url
			},
			"publisher": {
				"@type": "Organization",
				"name": publisher.name,
				"logo": {
					"@type": "ImageObject",
					"url": publisher.logoUrl
				}
			},
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": pageUrl
			}
		};
		return JSON.stringify( ld, null, 2 );
	} );

	config.addShortcode( "currentYear", async () => {
		return new Date().getFullYear();
	} );
}
