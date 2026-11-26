// Tailwind minifies when the build is a production one: `ssqch build` (which runs PostCSS
// from its beforeBuild hook with SSQCH_ENV) or NODE_ENV=production.
const production = ( process.env.SSQCH_ENV ?? process.env.NODE_ENV ) === "production";

export default {
	plugins: {
		"postcss-import": {},
		"@tailwindcss/postcss": { optimize: production }
	}
};
