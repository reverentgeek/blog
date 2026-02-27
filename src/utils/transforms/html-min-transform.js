import htmlmin from "html-minifier-terser";

export default function ( eleventyConfig ) {
	eleventyConfig.addTransform( "htmlmin", async function ( content ) {
		if ( ( this.page.outputPath || "" ).endsWith( ".html" ) ) {
			let minified = await htmlmin.minify( content, {
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true
			} );

			return minified;
		}

		// If not an HTML output, return content as-is
		return content;
	} );
};
