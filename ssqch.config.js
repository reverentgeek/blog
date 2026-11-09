import { defineConfig } from "ssqch";
import { imagePlugin } from "ssqch/image";
import { minifyPlugin } from "ssqch/minify";
import { rssPlugin } from "ssqch/rss";

import { collections } from "./src/utils/site/collections.js";
import { siteFilters } from "./src/utils/site/filters.js";
import { imageOptions } from "./src/utils/site/image-options.js";
import { createSocialImageFilter } from "./src/utils/site/social-image.js";

export default defineConfig( ( { env } ) => ( {
	dirs: {
		input: "src/site",
		output: "dist"
	},
	templateFormats: [ "edge", "md", "txt", "html" ],

	watch: [ "./src/assets/" ],
	passthrough: [
		{ "./src/assets/js/pco.js": "assets/pco.js" },
		{ "./src/assets/fonts": "fonts" },
		{ "./src/site/static": "static" },
		"./src/site/favicon.ico"
	],

	filters: siteFilters( { socialImage: createSocialImageFilter() } ),
	collections,

	plugins: [
		// Feed filters: getNewestCollectionItemDate, dateToRfc3339, absoluteUrl, htmlToAbsoluteUrls.
		rssPlugin(),
		// Responsive <picture> markup for every <img>. Derivatives are cached in dist/img/
		// (via netlify-plugin-cache), and scripts/prune-images.js removes stale ones.
		imagePlugin( imageOptions ),
		env === "production" && minifyPlugin()
	]
} ) );
