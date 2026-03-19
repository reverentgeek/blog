import pluginRSS from "@11ty/eleventy-plugin-rss";
import Image, { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import brokenLinksPlugin from "eleventy-plugin-broken-links";
import edgeJsPlugin from "eleventy-plugin-edgejs";

import { imageTransformOptions } from "./src/utils/eleventy/image-transform-options.js";
import { registerRssFilters, registerSiteFilters } from "./src/utils/eleventy/register-filters.js";
import { createSocialImageFilter } from "./src/utils/eleventy/social-image-filter.js";
import htmlMinTransform from "./src/utils/transforms/html-min-transform.js";

export default async function ( config ) {
	const environment = process.env.ELEVENTY_ENV || process.env.NODE_ENV || "production";
	const isDev = environment === "development";
	const socialImageFilter = createSocialImageFilter( Image );

	registerSiteFilters( config, { socialImageFilter } );

	config.setDataDeepMerge( true );

	config.addWatchTarget( "./src/assets/" );
	config.addPassthroughCopy( { "./src/assets/js/pco.js": "assets/pco.js" } );
	config.addPassthroughCopy( { "./src/assets/fonts": "fonts" } );
	config.addPassthroughCopy( { "./src/site/static": "static" } );
	config.addPassthroughCopy( "./src/site/favicon.ico" );

	// Minify HTML
	if ( environment === "production" ) {
		htmlMinTransform( config );
	}

	// Assist RSS feed template
	config.addPlugin( pluginRSS );

	// Re-register RSS plugin filters as universal filters (the plugin uses addNunjucksFilter)
	registerRssFilters( config, pluginRSS );

	// Optimize images with better compression
	// Images cached in dist/img/ via netlify-plugin-cache; stale derivatives pruned post-build
	config.addPlugin( eleventyImageTransformPlugin, imageTransformOptions );

	if ( isDev ) {
		config.addPlugin( brokenLinksPlugin );
	}

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
