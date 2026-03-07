import cleanCSS from "clean-css";
import pluginRSS from "@11ty/eleventy-plugin-rss";
import Image, { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import navigationPlugin from "@11ty/eleventy-navigation";
import brokenLinksPlugin from "eleventy-plugin-broken-links";
import edgeJsPlugin from "eleventy-plugin-edgejs";

import htmlMinTransform from "./src/utils/transforms/html-min-transform.js";

export default async function ( config ) {
	const environment = process.env.ELEVENTY_ENV || process.env.NODE_ENV || "production";
	const isDev = environment === "development";
	config.addFilter( "isSiteMapSafe", function ( url ) {
		const isSafe = !url.startsWith( "/_" );
		return isSafe.toString();
	} );

	config.setDataDeepMerge( true );

	config.addWatchTarget( "./src/assets/" );
	config.addPassthroughCopy( { "./src/assets/js/pco.js": "assets/pco.js" } );
	config.addPassthroughCopy( { "./src/assets/fonts": "fonts" } );
	// config.addPassthroughCopy( "./src/site/content/images/**" );
	config.addPassthroughCopy( "./src/site/favicon.ico" );

	// Minify HTML
	if ( environment === "production" ) {
		htmlMinTransform( config );
	}

	// Assist RSS feed template
	config.addPlugin( pluginRSS );

	// Re-register RSS plugin filters as universal filters (the plugin uses addNunjucksFilter)
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

	// Optimize images with better compression
	// Images are cached in dist/img/ - commit this directory to avoid reprocessing on deploy
	config.addPlugin( eleventyImageTransformPlugin, {
		// Generate modern formats
		formats: [ "avif", "webp", "auto" ],

		// Generate multiple sizes for responsive images
		widths: [ 300, 600, 900, 1200, 1500 ],

		// Default attributes for better performance
		defaultAttributes: {
			loading: "lazy",
			decoding: "async",
			sizes: "auto"
		},

		// Optimize WebP compression (balance quality vs size)
		sharpWebpOptions: {
			quality: 75,
			effort: 4 // Higher effort = better compression (0-6)
		},

		// Optimize AVIF compression (aggressive for LCP)
		sharpAvifOptions: {
			quality: 50,
			effort: 4 // Lower quality is fine for AVIF due to its efficiency
		}
	} );

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

	// Generate a social-optimized image and return its URL, width, and height
	const socialImageCache = new Map();
	config.addFilter( "socialImage", async ( imagePath ) => {
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
	} );

	// Register Edge.js plugin after all filters/shortcodes
	config.addPlugin( edgeJsPlugin );

	// Don't ignore the same files ignored in the git repo
	config.setUseGitIgnore( false );

	config.configureErrorReporting( { allowMissingExtensions: true } );

	return {
		dir: {
			input: "src/site",
			output: "dist"
		},
		passthroughFileCopy: true,
		templateFormats: [ "edge", "md", "txt", "html" ],
		htmlTemplateEngine: "edge",
		markdownTemplateEngine: "edge"
	};
}
