import { defineConfig } from "eslint/config"; // eslint-disable-line n/no-unpublished-import
import rg from "eslint-config-reverentgeek"; // eslint-disable-line n/no-unpublished-import

export default defineConfig( [
	{ ignores: [ "dist/", "**/*.cjs" ] },
	{
		extends: [ rg.configs["node-esm"] ]
	}, {
		extends: [ rg.configs["node-esm"] ],
		files: [ "src/utils/**/*.js" ],
		rules: {
			"n/no-unpublished-import": "off"
		}
	}, {
		files: [ "src/assets/**/*.js" ],
		extends: [ rg.configs.browser ]
	} ] );

