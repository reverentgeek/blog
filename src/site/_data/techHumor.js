// The tech humor gallery on /tech-humor/: the pinned favorites first, then every other image in
// content/images/tech-humor/, newest (highest number) first, so a new one shows up on its own.
import { files } from "ssqch";

const folder = "src/site/content/images/tech-humor";

// Shown first, in this order.
const pinned = [ "013-forward-slash-back-slash.jpg", "001-js-pumpkin.jpg", "000-hope-for-the-best-expect-js.jpg" ];

const images = files( `${ folder }/*.{jpg,jpeg,png}`, { dimensions: true } );
const byName = new Map( images.map( image => [ image.name, image ] ) );
const first = new Set( pinned );

export default [
	...pinned.map( ( name ) => {
		const image = byName.get( name );
		if ( !image ) throw new Error( `techHumor.js: pinned ${ name } isn't in ${ folder }` );
		return image;
	} ),
	...images.filter( image => !first.has( image.name ) ).reverse()
];
