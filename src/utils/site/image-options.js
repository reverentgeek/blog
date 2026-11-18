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
	// sharp's numbers since ssqch 0.8: 0.7's AVIF quality 60 at speed 4, which,
	// measured against libaom on the blog's images (TODO.md), has about 40% less
	// distortion than the default speed 8 at quality 50, for 2% more bytes and about
	// 2.4x the encode time (cached builds don't pay it). The image names, and so the
	// cache, are the same as 0.7's.
	avifQuality: 48,
	avifEffort: 3
};
