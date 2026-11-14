import { defineConfig } from "ssqch";
import { assetsPlugin } from "ssqch/assets";
import { imagePlugin } from "ssqch/image";
import { linksPlugin } from "ssqch/links";
import { minifyPlugin } from "ssqch/minify";
import { rssPlugin } from "ssqch/rss";
import { sitemapPlugin } from "ssqch/sitemap";

import { collections } from "./src/utils/site/collections.js";
import { siteFilters } from "./src/utils/site/filters.js";
import { imageOptions } from "./src/utils/site/image-options.js";
import { createPublishedImageFilters } from "./src/utils/site/published-image.js";
import { createSocialImageFilter } from "./src/utils/site/social-image.js";
import site from "./src/site/_data/site.json";

export default defineConfig( ( { env } ) => ( {
	dirs: {
		input: "src/site",
		output: "dist"
	},
	templateFormats: [ "edge", "md", "txt", "html" ],
	// Markdown and .html pages are rendered with Edge too, as the layouts are (ssqch 0.5's
	// default for both is Jinja).
	markdownEngine: "edge",
	htmlEngine: "edge",

	// Code fences are highlighted while the site builds (no Prism in the browser). The colors
	// are in src/assets/css/styles.css, so ssqch's own /highlight.css isn't written.
	markdown: { highlight: { css: false } },

	// Every post's front matter is checked on each build: a misspelled key is a warning, and a
	// missing description or a feature image that isn't there fails the build.
	schemas: {
		posts: {
			fields: {
				id: "string?",
				title: "string",
				date: "date",
				slug: "string?",
				description: "string",
				meta_description: "string?",
				feature_image: "file?",
				tags: "string[]"
			},
			unknown: "warn"
		}
	},

	// `ssqch serve` starts the CSS and JS watchers with the server and stops them with it. They
	// write into dist/assets/, and the server picks the files up from there: a stylesheet swaps
	// in place, and a script reloads the page.
	serve: { run: [ "pnpm run serve:css", "pnpm run serve:js" ] },

	// Passthrough sources outside the input folder, so a change to them is copied while
	// serving. Not the rest of src/assets/: the CSS and JS watchers handle those, and a
	// rebuild for each save would rewrite every page.
	watch: [ "./src/assets/js/pco.js", "./src/assets/fonts/", "./src/dev/" ],
	passthrough: [
		{ "./src/assets/js/pco.js": "assets/pco.js" },
		{ "./src/assets/fonts": "fonts" },
		{ "./src/site/static": "static" },
		"./src/site/favicon.ico",
		// The arrow tuner (src/dev/arrow-tuner.js) and the spare arrows it can try. Local
		// builds only, so none of it ships.
		...( env === "production" ? [] : [ { "./src/dev": "dev" } ] )
	],

	filters: siteFilters( { socialImage: createSocialImageFilter(), ...createPublishedImageFilters() } ),
	collections,

	plugins: [
		// Feed filters: getNewestCollectionItemDate, dateToRfc3339, absoluteUrl, htmlToAbsoluteUrls.
		rssPlugin(),
		// Responsive <picture> markup for every <img>. Derivatives are cached in dist/img/
		// (via netlify-plugin-cache), and scripts/prune-images.js removes stale ones.
		imagePlugin( imageOptions ),
		env === "production" && minifyPlugin(),
		// Production builds rename the CSS and JS (written by PostCSS and esbuild) to
		// content-hashed names and rewrite the links to them. pco.js keeps its name,
		// because src/site/pages/pco.md imports it by path.
		assetsPlugin( { files: [ "/assets/index.css", "/assets/index.js" ] } ),
		// Every internal link and #anchor has to resolve; broken ones fail production
		// builds (so a deploy never ships them) and are warnings in `pnpm run serve`.
		// sitemap.xml: every HTML page, with its date as <lastmod>.
		sitemapPlugin( { url: site.url } ),
		linksPlugin()
	]
} ) );
