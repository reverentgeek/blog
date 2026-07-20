import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const manifestPath = resolve( "./.asset-manifest.json" );

// `pnpm run serve` writes unhashed files and never runs scripts/hash-assets.js, so fall
// back to the plain names. `clean` deletes the manifest, so a stale one from an earlier
// production build can never leak hashed URLs into the dev server.
const devPaths = {
	css: "/assets/index.css",
	js: "/assets/index.js",
	prism: "/assets/prism.js"
};

export default function () {
	if ( !existsSync( manifestPath ) ) {
		return devPaths;
	}

	return { ...devPaths, ...JSON.parse( readFileSync( manifestPath, "utf8" ) ) };
}
