import Image from "@11ty/eleventy-img";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERO_SIZES = "(min-width: 1024px) 700px, 100vw";
const HERO_FORMATS = [ "avif", "webp", "png" ];
const HERO_WIDTHS = [ 300, 600, 900, 1200, 1500 ];
const HERO_ALT = "Site banner image with a collage of illustrations and doodles. The center image is the ReverentGeek logo with a speech bubble that reads, you don't need permission to be awesome.";

const SHARP_WEBP_OPTIONS = {
	quality: 75,
	effort: 4
};

const SHARP_AVIF_OPTIONS = {
	quality: 50,
	effort: 4
};

function buildSrcSet( metadata, format ) {
	return metadata?.[format]?.map( entry => entry.srcset ).join( ", " ) ?? "";
}

const DATA_DIR = path.dirname( fileURLToPath( import.meta.url ) );
const SITE_DATA_PATH = path.join( DATA_DIR, "site.json" );

function getSiteData() {
	const raw = fs.readFileSync( SITE_DATA_PATH, "utf-8" );
	return JSON.parse( raw );
}

function resolveSourcePath( relativePath = "" ) {
	return path.join( "src/site", relativePath.replace( /^\/+/, "" ) );
}

export default async function heroImageData() {
	const site = getSiteData();
	const coverImageSource = site.cover_image;
	if ( !coverImageSource ) {
		return {};
	}

	const metadata = await Image( resolveSourcePath( coverImageSource ), {
		formats: HERO_FORMATS,
		widths: HERO_WIDTHS,
		outputDir: "./dist/img",
		urlPath: "/img/",
		sharpWebpOptions: SHARP_WEBP_OPTIONS,
		sharpAvifOptions: SHARP_AVIF_OPTIONS
	} );

	const fallbackFormat = metadata.png?.length ? "png" : Object.keys( metadata )[0];
	const fallbackEntries = metadata[fallbackFormat];
	const fallbackImage = fallbackEntries[fallbackEntries.length - 1];
	const preloadCandidate = metadata.avif.find( entry => entry.width === 900 ) ?? metadata.avif.at( -1 );
	const shareCandidate = fallbackEntries.find( entry => entry.width === 1200 ) ?? fallbackImage;

	return {
		alt: HERO_ALT,
		sizes: HERO_SIZES,
		fallback: fallbackImage,
		srcset: {
			avif: buildSrcSet( metadata, "avif" ),
			webp: buildSrcSet( metadata, "webp" ),
			fallback: buildSrcSet( metadata, fallbackFormat )
		},
		preload: {
			href: preloadCandidate.url,
			imagesrcset: buildSrcSet( metadata, "avif" ),
			type: preloadCandidate.sourceType
		},
		social: {
			url: shareCandidate.url,
			width: shareCandidate.width,
			height: shareCandidate.height,
			type: shareCandidate.sourceType
		}
	};
}
