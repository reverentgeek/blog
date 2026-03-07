export const imageTransformOptions = {
	formats: [ "avif", "webp", "auto" ],
	widths: [ 300, 600, 900, 1200, 1500 ],
	defaultAttributes: {
		loading: "lazy",
		decoding: "async",
		sizes: "auto"
	},
	sharpWebpOptions: {
		quality: 75,
		effort: 4
	},
	sharpAvifOptions: {
		quality: 50,
		effort: 4
	}
};
