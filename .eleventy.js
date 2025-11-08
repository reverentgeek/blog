import cleanCSS from "clean-css";
import pluginRSS from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import navigationPlugin from "@11ty/eleventy-navigation";
import brokenLinksPlugin from "eleventy-plugin-broken-links";

import htmlMinTransform from "./src/utils/transforms/html-min-transform.js";

export default async function ( config ) {
	const isDev = process.env?.NODE_ENV === "development";
	config.addNunjucksFilter( "isSiteMapSafe", function ( url ) {
		const isSafe = !url.startsWith( "/_" );
		return isSafe.toString();
	} );

	config.setDataDeepMerge( true );

	config.addWatchTarget( "./src/assets/" );
	config.addPassthroughCopy( { "./src/assets/js/pco.js": "assets/pco.js" } );
	// config.addPassthroughCopy( "./src/site/content/images/**" );
	config.addPassthroughCopy( "./src/site/favicon.ico" );

	// Minify HTML
	if ( process.env.ELEVENTY_ENV === "production" ) {
		htmlMinTransform( config );
	}

	// Assist RSS feed template
	config.addPlugin( pluginRSS );

	// Optimize images with better compression
	// Only run during development or when OPTIMIZE_IMAGES=true is set
	// This prevents slow builds during deployment since images should be pre-optimized locally
	if ( process.env.ELEVENTY_ENV === "development" || process.env.OPTIMIZE_IMAGES === "true" ) {
		config.addPlugin( eleventyImageTransformPlugin, {
			// Generate modern formats
			formats: [ "avif", "webp", "auto" ],

			// Generate multiple sizes for responsive images
			widths: [ 300, 600, 900, 1200, 1500 ],

			// Store optimized images in src so they can be committed
			// They'll be copied to dist during build via passthrough
			outputDir: "./src/site/optimized-images/",
			urlPath: "/optimized-images/",

			// Default attributes for better performance
			defaultAttributes: {
				loading: "lazy",
				decoding: "async",
				sizes: "auto"
			},

			// Optimize WebP compression (balance quality vs size)
			sharpWebpOptions: {
				quality: 80,
				effort: 4 // Higher effort = better compression (0-6)
			},

			// Optimize AVIF compression (smaller files, better quality)
			sharpAvifOptions: {
				quality: 80,
				effort: 4
			}
		} );
	}

	// Always passthrough optimized images (whether generated locally or committed)
	config.addPassthroughCopy( "./src/site/optimized-images/**" );

	config.addPlugin( navigationPlugin );

	if ( isDev ) {
		config.addPlugin( brokenLinksPlugin );
	}

	// Inline CSS
	config.addFilter( "cssmin", ( code ) => {
		return new cleanCSS( {} ).minify( code ).styles;
	} );

	config.addFilter( "getReadingTime", ( text ) => {
		const wordsPerMinute = 200;
		const numberOfWords = text.split( /\s/g ).length;
		return Math.ceil( numberOfWords / wordsPerMinute );
	} );

	// Date formatting filter
	config.addFilter( "htmlDateString", ( dateObj ) => {
		return new Date( dateObj ).toISOString().split( "T" )[0];
	} );

	// Date formatting filter
	config.addFilter( "postDate", ( dateObj ) => {
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
			output: "dist"
		},
		passthroughFileCopy: true,
		templateFormats: [ "njk", "md", "txt", "html" ],
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk"
	};
}
