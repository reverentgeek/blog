import { defineConfig } from "ssqch";
import { assetsPlugin } from "ssqch/assets";
import { imagePlugin } from "ssqch/image";
import { linksPlugin } from "ssqch/links";
import { llmsPlugin } from "ssqch/llms";
import { minifyPlugin } from "ssqch/minify";
import { robotsPlugin } from "ssqch/robots";
import { rssPlugin } from "ssqch/rss";
import { sitemapPlugin } from "ssqch/sitemap";

import { collections } from "./src/utils/site/collections.js";
import { siteFilters } from "./src/utils/site/filters.js";
import { imageOptions } from "./src/utils/site/image-options.js";
import site from "./src/site/_data/site.json";

// A page from src/site/posts/ (a post), rather than src/site/pages/.
const isPost = page => /[\\/]posts[\\/]/.test( page.inputPath );

// The CSS and JS a build compiles into the output's assets/ folder.
const buildAssets = env => [
	{ run: "postcss src/assets/css/styles.css --output \"$SSQCH_OUTPUT/assets/index.css\" --no-map" },
	{ run: `esbuild src/assets/js/index.js --bundle --outdir="$SSQCH_OUTPUT/assets"${ env === "production" ? " --minify" : "" }` }
];

export default defineConfig( ( { env, serving } ) => ( {
	dirs: {
		input: "src/site",
		output: "dist"
	},
	templateFormats: [ "edge", "md", "txt", "html" ],
	// Delete pages and copies an earlier build wrote that this one didn't (a removed post,
	// the dev-only /dev/ folder in a production build). Other tools' files and dist/img stay.
	leaveNoTrace: true,
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
				tags: "string[]",
				// Listed under "Blog Posts" in llms.txt; the rest are "Optional" (below).
				featured: "boolean?"
			},
			unknown: "warn"
		}
	},

	// A build compiles the CSS (PostCSS and Tailwind, which minifies for production) and the
	// JS (esbuild) into dist/assets/ before rendering, so the assets plugin and the link
	// checker see them. Not while serving: `serve.run` has the watchers, and a hook here would
	// make every rebuild render every page instead of the ones an edit reaches.
	beforeBuild: serving ? [] : buildAssets( env ),

	// A page, stylesheet or script over its size fails a production build (`ssqch footprint`
	// lists the heaviest). Images and documents have none: the 1200px PNG social cards and the
	// cheat sheet PDF are bigger than any sensible limit.
	budgets: { pages: "150 KB", css: "120 KB", javascript: "50 KB", fail: true },

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

	// Image URLs outside <img> (og:image, the JSON-LD logo, the feed) come from ssqch's
	// imageUrl() and feedHtml(), so they point at published copies.
	filters: siteFilters(),
	collections,

	plugins: [
		// Feed filters: getNewestCollectionItemDate, dateToRfc3339, absoluteUrl, feedHtml.
		rssPlugin(),
		// Responsive <picture> markup for every <img>. Derivatives are encoded into
		// .cache/ssqch/img (kept between deploys by netlify-plugin-cache) and linked into
		// dist/img. Production builds delete the ones no page, feed or image() call used.
		imagePlugin( { ...imageOptions, prune: env === "production" } ),
		env === "production" && minifyPlugin(),
		// Production builds rename the CSS and JS (written by PostCSS and esbuild, and pco.js,
		// a passthrough copy) to content-hashed names and rewrite the links to them, including
		// the import in src/site/pages/pco.md's inline module script.
		assetsPlugin( { files: [ "/assets/index.css", "/assets/index.js", "/assets/pco.js" ] } ),
		// Every internal link and #anchor has to resolve; broken ones fail production
		// builds (so a deploy never ships them) and are warnings in `pnpm run serve`.
		// sitemap.xml: every HTML page, with its date as <lastmod>.
		sitemapPlugin( { url: site.url } ),
		// robots.txt: every crawler welcome, and the sitemap's line.
		robotsPlugin(),
		// llms.txt for agents, with a Markdown copy of every page and post (and
		// llms-full.txt): the pages first, then the featured posts and the rest, newest first.
		llmsPlugin( {
			url: site.url,
			title: "ReverentGeek",
			description: "Personal website and blog of David Neal (aka ReverentGeek): illustrator, builder, and DevRel leader, helping folks in tech be more awesome. David is a Senior Developer Advocate at MongoDB and co-author of Developer Relations Activity Patterns. He takes illustration commissions and is open to DevRel collaboration.",
			// The home page's later pages (/1/ to /10/) are the posts again.
			exclude: [ "/[0-9]/", "/[0-9][0-9]/", "/search/**", "/leave-a-review/thanks/", "/stream-starting-soon/" ],
			// Featured posts and pages (`featured: true`, which a new post starts with) are
			// "Blog Posts" and "Main Pages"; the rest (older posts, topic pages, the smaller
			// pages) are "Optional", the links an agent can skip when its context is short.
			section: page => ( page.data.featured ? ( isPost( page ) ? "Blog Posts" : "Main Pages" ) : "Optional" ),
			sort: ( a, b ) => ( isPost( a ) - isPost( b ) ) || ( isPost( a ) ? b.date - a.date : 0 )
		} ),
		linksPlugin()
	]
} ) );
