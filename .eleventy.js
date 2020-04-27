"use strict";
require( "dotenv" ).config();

const cleanCSS = require( "clean-css" );
const fs = require( "fs" );
const pluginRSS = require( "@11ty/eleventy-plugin-rss" );
const lazyImages = require( "eleventy-plugin-lazyimages" );

const htmlMinTransform = require( "./src/utils/transforms/html-min-transform.js" );

module.exports = function( config ) {

	config.setDataDeepMerge( true );

	config.addWatchTarget( "./src/assets/" );
	config.addPassthroughCopy( "./src/site/content/images/**" );

	// Minify HTML
	if ( process.env.ELEVENTY_ENV === "production" ) {
		config.addTransform( "htmlmin", htmlMinTransform );
	}

	// Assist RSS feed template
	config.addPlugin( pluginRSS );

	// Apply performance attributes to images
	config.addPlugin( lazyImages, {
		cacheFile: "",
		transformImgPath: ( imgPath ) => {
			if ( imgPath.startsWith( "/" ) && !imgPath.startsWith( "//" ) ) {
				return `./src/site${ imgPath }`;
			}

			return imgPath;
		}
	} );

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

	// Don't ignore the same files ignored in the git repo
	config.setUseGitIgnore( false );

	config.setBrowserSyncConfig( {
		notify: true,
		snippetOptions: {
			rule: {
				match: /<\/head>/i,
				fn: function ( snippet, match ) {
					return snippet + match;
				},
			},
		},
		// Set local server 404 fallback
		callbacks: {
			ready: function ( err, browserSync ) {
				const content_404 = fs.readFileSync( "dist/404.html" );

				browserSync.addMiddleware( "*", ( req, res ) => {
					// Provides the 404 content without redirect.
					res.write( content_404 );
					res.end();
				} );
			},
		},
	} );

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
};
