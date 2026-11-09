import { defineConfig } from "eslint/config"; // eslint-disable-line n/no-unpublished-import
import rg from "eslint-config-reverentgeek"; // eslint-disable-line n/no-unpublished-import

// Modules built into the ssqch binary, so there's nothing in node_modules to resolve.
const ssqchModules = [ "ssqch" ];

export default defineConfig( [
	{ ignores: [ "dist/", "**/*.cjs" ] },
	{
		extends: [ rg.configs["node-esm"] ]
	}, {
		files: [ "ssqch.config.js", "src/site/_data/**/*.js", "src/utils/site/**/*.js" ],
		rules: {
			"n/no-missing-import": [ "error", { allowModules: ssqchModules } ]
		}
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

