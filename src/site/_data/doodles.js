// The doodle gallery on /doodles/: every image in content/images/doodles/. A doodle that isn't in
// `order` comes first, newest (highest number) first, so a new one shows up on its own; move it by
// adding it to the list.
import { files } from "ssqch";

const folder = "src/site/content/images/doodles";

// The rest, in this order.
const order = [
	"ice-cold-sarcasm.jpeg",
	"028-espresso-worth-a-shot.jpg",
	"027-when-troubles-come-your-way.jpg",
	"026-be-kind.jpg",
	"025-get-out-there-and-be-awesome.jpg",
	"024-hippo-zippo.jpg",
	"023-primitive-man.jpg",
	"022-rustacean-permission.jpg",
	"012-lars-talk-full-res.jpg",
	"011-you-dont-need-permission-2022.jpg",
	"010-fix-your-thoughts.jpg",
	"009-live-laugh-code.jpg",
	"008-drama-llama.jpg",
	"007-be-the-reason-someone-smiles.jpg",
	"006-tech-can-be-fun.jpg",
	"005-guitar-not-listening.jpg",
	"004-whoop.jpg",
	"003-never-a-better-time-2b-dev.jpg",
	"002-guitars-yoda.jpg",
	"001-clippy-meeting.jpg",
	"000-sneaky-alligator.jpg",
	"021-shut-up-and-take-my-money.jpg",
	"020-pun-snark-troll-11.jpg",
	"019-procrastinate-like-a-boss.jpg",
	"018-perspective.jpg",
	"017-now-come-at-me.jpg",
	"016-glasses-cleaning-struggle-is-real.jpg",
	"015-get-out-there-and-be-awesome.jpg",
	"014-frosted-mini-beets.jpg",
	"013-food-pyramid.jpg"
];

const images = files( `${ folder }/*.{jpg,jpeg,png}`, { dimensions: true } );
const byName = new Map( images.map( image => [ image.name, image ] ) );
const listed = new Set( order );

export default [
	...images.filter( image => !listed.has( image.name ) ).reverse(),
	...order.map( ( name ) => {
		const image = byName.get( name );
		if ( !image ) throw new Error( `doodles.js: ${ name } is in the order but isn't in ${ folder }` );
		return image;
	} )
];
