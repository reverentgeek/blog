import sharp from "sharp";

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;

const escapeXml = value => String( value ).replace( /[<>&'"]/g, ( ch ) => {
	switch ( ch ) {
		case "<": return "&lt;";
		case ">": return "&gt;";
		case "&": return "&amp;";
		case "'": return "&#39;";
		default: return "&quot;";
	}
} );

// Pick a font size that keeps a single line of text within the available width.
const fitFontSize = ( text, maxWidth, maxFontSize ) => {
	const length = Math.max( text.length, 1 );
	// Rough average glyph width for a bold sans-serif is ~0.6em.
	const fitted = maxWidth / ( length * 0.6 );
	return Math.max( 32, Math.min( maxFontSize, Math.floor( fitted ) ) );
};

// Build the outline of a cog/gear: rectangular teeth around a circle.
const gearOutline = ( { cx, cy, tipRadius, rootRadius, teeth } ) => {
	const step = ( Math.PI * 2 ) / teeth;
	const point = ( angle, radius ) =>
		`${ ( cx + Math.cos( angle ) * radius ).toFixed( 2 ) },${ ( cy + Math.sin( angle ) * radius ).toFixed( 2 ) }`;
	let d = "";
	for ( let i = 0; i < teeth; i++ ) {
		const start = i * step;
		const mid = start + step / 2;
		const next = start + step;
		const cmd = i === 0 ? "M" : "L";
		d += `${ cmd } ${ point( start, tipRadius ) } L ${ point( mid, tipRadius ) } L ${ point( mid, rootRadius ) } L ${ point( next, rootRadius ) } `;
	}
	return `${ d }Z`;
};

// A circle expressed as a path subpath, so it can punch a hole via fill-rule="evenodd".
const circlePath = ( { cx, cy, radius } ) =>
	`M ${ ( cx + radius ).toFixed( 2 ) },${ cy } A ${ radius },${ radius } 0 1 0 ${ ( cx - radius ).toFixed( 2 ) },${ cy } A ${ radius },${ radius } 0 1 0 ${ ( cx + radius ).toFixed( 2 ) },${ cy } Z`;

const buildSvg = ( { title, subtitle, width, height } ) => {
	const margin = 220;
	const titleSize = fitFontSize( title, width - margin * 2, 120 );
	const subtitleSize = subtitle ? fitFontSize( subtitle, width - margin * 2, 44 ) : 0;

	// Cog sits in the upper third; text is stacked below so they never overlap.
	const cx = width / 2;
	const cogCy = Math.round( height * 0.32 );
	const tipRadius = Math.round( Math.min( width, height ) * 0.14 );
	const rootRadius = Math.round( tipRadius * 0.8 );
	const holeRadius = Math.round( tipRadius * 0.36 );
	const cog = `${ gearOutline( { cx, cy: cogCy, tipRadius, rootRadius, teeth: 12 } ) } ${ circlePath( { cx, cy: cogCy, radius: holeRadius } ) }`;

	const titleY = Math.round( height * 0.64 );
	const subtitleY = titleY + 78;

	const subtitleText = subtitle
		? `<text x="${ cx }" y="${ subtitleY }" font-family="Helvetica, Arial, sans-serif" font-size="${ subtitleSize }" fill="#94a3b8" text-anchor="middle">${ escapeXml( subtitle ) }</text>`
		: "";

	return `
<svg width="${ width }" height="${ height }" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1f2937"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="icon" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
  </defs>
  <rect width="${ width }" height="${ height }" fill="url(#bg)"/>
  <path d="${ cog }" fill="url(#icon)" fill-rule="evenodd"/>
  <text x="${ cx }" y="${ titleY }" font-family="Helvetica, Arial, sans-serif" font-size="${ titleSize }" font-weight="700" fill="#f8fafc" text-anchor="middle">${ escapeXml( title ) }</text>
  ${ subtitleText }
  <text x="${ cx }" y="${ height - 120 }" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="#64748b" text-anchor="middle" letter-spacing="2">PLACEHOLDER — feature image coming soon</text>
</svg>`;
};

/**
 * Generate a placeholder feature image and write it to disk.
 *
 * @param {object} options
 * @param {string} options.title - Headline rendered on the image.
 * @param {string} [options.subtitle] - Optional secondary line.
 * @param {string} options.outputPath - Destination file path (.jpg/.jpeg or .png).
 * @param {number} [options.width] - Image width in pixels.
 * @param {number} [options.height] - Image height in pixels.
 * @returns {Promise<string>} The output path.
 */
export const makePlaceholder = async ( {
	title,
	subtitle = "",
	outputPath,
	width = DEFAULT_WIDTH,
	height = DEFAULT_HEIGHT
} ) => {
	if ( !title ) {
		throw new Error( "makePlaceholder requires a title" );
	}
	if ( !outputPath ) {
		throw new Error( "makePlaceholder requires an outputPath" );
	}
	const svg = buildSvg( { title, subtitle, width, height } );
	const image = sharp( Buffer.from( svg ) );
	if ( /\.jpe?g$/i.test( outputPath ) ) {
		await image.jpeg( { quality: 90 } ).toFile( outputPath );
	} else {
		await image.png().toFile( outputPath );
	}
	return outputPath;
};
