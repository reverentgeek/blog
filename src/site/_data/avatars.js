// The avatar gallery on /avatars/: the favorites first, with their own alt text, then every
// other numbered image in content/images/avatars/, newest (highest number) first. A new avatar
// shows up on the page when its file is added; `node src/utils/avatars.js convert` makes it.
import { files } from "ssqch";

const folder = "src/site/content/images/avatars";

// Shown first, in this order. `width` sets a tile's width (the image plugin makes that size)
// when the original is bigger than the others.
const featured = [
	// The original is 1,200 pixels wide; the tile, like the others, is 500.
	{ file: "000-featured-1933-icons.jpg", width: 500, alt: "Color avatar of a bearded man in glasses, surrounded by icons for his favorite tech" },
	{ file: "201-1979-heather.jpg", alt: "Color avatar of a woman with bright pink hair and glasses" },
	{ file: "185-1951.jpg", alt: "Black-and-white avatar of a smiling man" },
	{ file: "158-1820.jpg", alt: "Color avatar of a woman with long purple braids and red glasses" },
	{ file: "017-IMG_5234.jpg", alt: "Team avatar of three men in front of their company logo" },
	{ file: "195-janet-k.jpg", alt: "Color avatar of a man with locs and glasses" },
	{ file: "106-nvcexploder.jpg", alt: "Black-and-white avatar of a man with glasses and a long beard" },
	{ file: "194-kate-q.jpg", alt: "Color avatar of a woman with gray hair and red glasses" },
	{ file: "008-IMG_1164.jpg", alt: "Avatar of a smiling man in glasses surrounded by sketchnote doodles" },
	{ file: "198-linkedin-2024.jpg", alt: "Black-and-white avatars of a whole team" },
	{ file: "151-ladymey-mey-beisaron.jpg", alt: "Black-and-white avatar of a woman in red headphones, with red lips" },
	{ file: "136-1770.jpg", alt: "Color avatar of a woman with braids surrounded by her favorite things" },
	{ file: "164-1837.jpg", alt: "Color avatar of a couple, side by side" },
	{ file: "143-1793-icons.jpg", alt: "Color avatar of a woman with her hair in a bun, surrounded by science icons" },
	{ file: "120-1734-icons.jpg", alt: "Color avatar of a gray-haired man in glasses surrounded by his favorite tools and hobbies" },
	{ file: "189-rafael-f.jpg", alt: "Color avatar of a man with long wavy red hair and a long red beard" },
	{ file: "180-1942.jpg", alt: "Color avatar of a man in glasses and a red baseball cap" },
	{ file: "056-1501.jpg", alt: "Color avatar of a grinning man with a reddish-brown beard" },
	{ file: "128-1743.jpg", alt: "Color head-and-shoulders avatar of a man with a big curly afro in a blue shirt" },
	{ file: "196-1969.jpg", alt: "Color head-and-shoulders avatar of a man with a gray goatee in an olive shirt" },
	{ file: "089-template-j.jpg", alt: "Color head-and-shoulders avatar of a man in a cap and yellow sunglasses" },
	{ file: "065-IMG_6474.jpg", alt: "Color head-and-shoulders avatar of a person in a fluffy pink hat and costume" },
	{ file: "081-guahanweb.jpg", alt: "Black-and-white avatar of a bearded man making a funny face" },
	{ file: "181-1948.jpg", alt: "Color avatar of a dog with its tongue out" }
];

const images = files( `${ folder }/[0-9][0-9][0-9]-*.{jpg,jpeg,png}`, { dimensions: true } );
const byName = new Map( images.map( image => [ image.name, image ] ) );
const shown = new Set( featured.map( f => f.file ) );

export default {
	featured: featured.map( ( { file, alt, width } ) => {
		const image = byName.get( file );
		if ( !image ) throw new Error( `avatars.js: featured avatar ${ file } isn't in ${ folder }` );
		if ( !width ) return { ...image, alt };
		return { ...image, alt, width, height: Math.round( image.height * width / image.width ) };
	} ),
	more: images.filter( image => !shown.has( image.name ) ).reverse()
};
