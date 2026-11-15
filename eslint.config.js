import { defineConfig } from "eslint/config"; // eslint-disable-line n/no-unpublished-import
import rg from "eslint-config-reverentgeek"; // eslint-disable-line n/no-unpublished-import

export default defineConfig( [
	{ ignores: [ "dist/", "**/*.cjs" ] },
	{
		extends: [ rg.configs["node-esm"] ]
	}, {
		extends: [ rg.configs["node-esm"] ],
		// Build-time code: ssqch is a dev dependency, and none of this ships.
		files: [ "ssqch.config.js", "src/site/_data/**/*.js", "src/utils/**/*.js" ],
		rules: {
			"n/no-unpublished-import": "off"
		}
	}, {
		files: [ "src/assets/**/*.js", "src/dev/**/*.js" ],
		extends: [ rg.configs.browser ]
	} ] );

