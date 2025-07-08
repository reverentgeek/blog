import cleanCSS from "clean-css";
import pluginRSS from "@11ty/eleventy-plugin-rss";
import lazyImages from "eleventy-plugin-lazyimages";
import navigationPlugin from "@11ty/eleventy-navigation";
import brokenLinksPlugin from "eleventy-plugin-broken-links";

import htmlMinTransform from "./src/utils/transforms/html-min-transform.js";

export default async function( config ) {
	const isDev = process.env?.NODE_ENV === "development";
	config.addNunjucksFilter( "isSiteMapSafe", function( url ) {
		const isSafe = !url.startsWith( "/_" );
		return isSafe.toString();
	} );

	config.setDataDeepMerge( true );

	config.addWatchTarget( "./src/assets/" );
	config.addPassthroughCopy( { "./src/assets/js/pco.js" : "assets/pco.js" } );
	config.addPassthroughCopy( "./src/site/content/images/**" );
	config.addPassthroughCopy( "./src/site/favicon.ico" );

	// Minify HTML
	if ( process.env.ELEVENTY_ENV === "production" ) {
		htmlMinTransform( config );
	}

	// Assist RSS feed template
	config.addPlugin( pluginRSS );

	// Apply performance attributes to images
	config.addPlugin( lazyImages, {
		cacheFile: ".lazyimages.json",
		transformImgPath: ( imgPath ) => {
			if ( imgPath.startsWith( "/" ) && !imgPath.startsWith( "//" ) ) {
				return `./src/site${ imgPath }`;
			}

			return imgPath;
		}
	} );

	config.addPlugin( navigationPlugin );

	if ( isDev ) {
		config.addPlugin( brokenLinksPlugin );
	}

	// Inline CSS
	config.addFilter( "cssmin", code => {
		return new cleanCSS( {} ).minify( code ).styles;
	} );

	config.addFilter( "getReadingTime", text => {
		const wordsPerMinute = 200;
		const numberOfWords = text.split( /\s/g ).length;
		return Math.ceil( numberOfWords / wordsPerMinute );
	} );

	// Date formatting filter
	config.addFilter( "htmlDateString", dateObj => {
		return new Date( dateObj ).toISOString().split( "T" )[0];
	} );

	// Date formatting filter
	config.addFilter( "postDate", dateObj => {
		return new Date( dateObj ).toLocaleDateString( "en-US", { year: "numeric", month: "long", day: "numeric" } );
	} );

	config.addShortcode( "currentYear", async () => {
		return new Date().getFullYear();
	} );

	// Don't ignore the same files ignored in the git repo
	config.setUseGitIgnore( false );

	config.configureErrorReporting( { allowMissingExtensions: true } );

	return {
		dir: {
			input: "src/site",
			output: "dist",
		},
		passthroughFileCopy: true,
		templateFormats: [ "njk", "md", "txt", "html" ],
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
	};
}
