"use strict";

// module.exports = {
// 	plugins: [
// 		require( "tailwindcss" ),
// 		require( "autoprefixer" )
// 	]
// };

module.exports = {
	plugins: {
		"postcss-import": {},
		"tailwindcss/nesting": {},
		tailwindcss: {},
		autoprefixer: {},
	}
};
