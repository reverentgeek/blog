import htmlmin from "html-minifier-terser";

export default function ( eleventyConfig ) {
	eleventyConfig.addTransform( "htmlmin", function ( content ) {
		if ( ( this.page.outputPath || "" ).endsWith( ".html" ) ) {
			let minified = htmlmin.minify( content, {
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
