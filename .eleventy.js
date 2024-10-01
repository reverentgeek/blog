import "dotenv/config";

import cleanCSS from "clean-css";
import pluginRSS from "@11ty/eleventy-plugin-rss";
import lazyImages from "eleventy-plugin-lazyimages";
import navigationPlugin from "@11ty/eleventy-navigation";

import htmlMinTransform from "./src/utils/transforms/html-min-transform.cjs";

export default async function( config ) {

	config.addNunjucksFilter( "isSiteMapSafe", function( url ) {
		const isSafe = !url.startsWith( "/_" );
		return isSafe.toString();
	} );

	config.setDataDeepMerge( true );

	config.addWatchTarget( "./src/assets/" );
	config.addPassthroughCopy( "./src/site/content/images/**" );
	config.addPassthroughCopy( "./src/site/favicon.ico" );

	// Minify HTML
	if ( process.env.ELEVENTY_ENV === "production" ) {
		config.addTransform( "htmlmin", htmlMinTransform );
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

	// config.setBrowserSyncConfig( {
	// 	notify: true,
	// 	snippetOptions: {
	// 		rule: {
	// 			match: /<\/head>/i,
	// 			fn: function ( snippet, match ) {
	// 				return snippet + match;
	// 			},
	// 		},
	// 	},
	// 	// Set local server 404 fallback
	// 	callbacks: {
	// 		ready: function ( err, browserSync ) {
	// 			const content_404 = fs.readFileSync( "dist/404.html" );

	// 			browserSync.addMiddleware( "*", ( req, res ) => {
	// 				// Provides the 404 content without redirect.
	// 				res.write( content_404 );
	// 				res.end();
	// 			} );
	// 		},
	// 	},
	// } );

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
