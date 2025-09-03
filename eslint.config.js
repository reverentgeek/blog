/* eslint-disable-next-line n/no-unpublished-import */
import rg from "eslint-config-reverentgeek";

export default [
	{
		ignores: [ "dist/", "**/*.cjs" ]
	},
	rg.configs["node-esm"],
	{
		files: [ "src/utils/**/*.js" ],
		rules: {
			"n/no-unpublished-import": "off"
		}
	},
	// Add browser rules for JS files in /src/assets/js
	{
		files: [ "src/assets/**/*.js" ],
		...rg.configs.browser
	}
];
