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
	},
	// Normalize to sRGB so wide-gamut ICC profiles (e.g. Apple Display P3 from
	// iPhone photos) don't end up baked into AVIF outputs — Chrome's AVIF
	// decoder rejects files with those profiles even though they're valid.
	// withIccProfile is required because eleventy-img calls keepIccProfile()
	// after the transform, which would otherwise preserve the input's profile.
	transform: sharp => sharp
		.pipelineColourspace( "srgb" )
		.toColourspace( "srgb" )
		.withIccProfile( "srgb" )
};
