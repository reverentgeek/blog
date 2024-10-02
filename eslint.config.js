import rg from "eslint-config-reverentgeek";

export default [
	...rg.configs[ "node-esm" ],
	{
		ignores: [ "dist/", "**/*.cjs" ]
	},
	{
		rules: {
			"n/no-unpublished-import": [ "error", {
				allowModules: [ "eslint-config-reverentgeek" ],
				ignores: [ "dist/", "src/utils/*.js" ]
			} ]
		}
	}
];
