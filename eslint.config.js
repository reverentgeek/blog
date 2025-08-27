import rg from "eslint-config-reverentgeek"; // eslint-disable-line

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
