import { minify } from "html-minifier";
// const htmlmin = require( "html-minifier" );

export function htmlMinTransform( value, outputPath ) {
	if ( outputPath.indexOf( ".html" ) > -1 ) {
		let minified = minify( value, {
			useShortDoctype: true,
			removeComments: true,
			collapseWhitespace: true,
			minifyCSS: true
		} );
		return minified;
	}
	return value;
};
