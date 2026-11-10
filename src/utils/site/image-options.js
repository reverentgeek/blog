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
	// Measured against libaom on the blog's images (TODO.md): speed 4 at quality 60
	// has about 40% less distortion than the default speed 8 at quality 50, for 2%
	// more bytes and about 2.4x the encode time (cached builds don't pay it).
	avifQuality: 60,
	avifSpeed: 4
};
