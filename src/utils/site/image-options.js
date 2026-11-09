// Options for the ssqch/image plugin, which turns every <img> in the output into
// a responsive <picture>.
export const imageOptions = {
	formats: [ "avif", "webp", "auto" ],
	widths: [ 300, 600, 900, 1200, 1500 ],
	defaultAttributes: {
		loading: "lazy",
		decoding: "async",
		sizes: "auto"
	},
	webpQuality: 75,
	avifQuality: 50
};
