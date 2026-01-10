import fs from "fs-extra";
import { Jimp as jmp } from "jimp";
import probe from "probe-image-size";
import { join, basename, extname } from "node:path";

export async function getOrderedFiles( folder, sortByDate = false ) {
	const imageFiles = await fs.readdir( folder );
	const images = [];
	for ( const imageFile of imageFiles ) {
		const img = imageFile.toLowerCase();
		if ( img.endsWith( ".png" ) || img.endsWith( ".jpg" ) || img.endsWith( ".jpeg" ) ) {
			const src = join( folder, imageFile );
			const stats = await fs.stat( src );
			images.push( { f: imageFile, t: stats.birthtime } );
		}
	}
	if ( sortByDate ) {
		images.sort( ( a, b ) => {
			if ( a.t < b.t ) {
				return 1;
			}
			if ( a.t > b.t ) {
				return -1;
			}
			return 0;
		} );
	} else {
		images.sort( ( a, b ) => {
			const n1 = a.f.toLowerCase();
			const n2 = b.f.toLowerCase();
			if ( n1 > n2 ) {
				return -1;
			}
			if ( n1 < n2 ) {
				return 1;
			}
			return 0;
		} );
	}

	return images.map( i => i.f );
}

export async function convertImage( image, srcFolder, galleryFolder, size = 1500, extension = ".jpg" ) {
	console.log( "converting:", image );
	const src = join( srcFolder, image );
	const dst = join( galleryFolder, `${ basename( image, extname( image ) ) }${ extension }` );
	const img = await jmp.read( src );
	if ( image.endsWith( ".png" ) ) {
		img.background = 0xFFFFFFFF;
	}
	await img.resize( { w: size } );
	await img.write( dst );
	// const convert = gm( src ).resize( size, size ).noProfile();
	// const write = util.promisify( convert.write ).bind( convert );
	// await write( dst );
}

export async function getColumnHtml( folder, htmlPath = "/content/images/avatars" ) {
	const imageHtml = [];
	const imageFiles = await getOrderedFiles( folder );
	for ( const imageFile of imageFiles ) {
		const src = join( folder, imageFile );
		const s = await fs.createReadStream( src );
		const info = await probe( s );
		imageHtml.push( `<div class="kg-gallery-image"><img src="${ htmlPath }/${ imageFile }" width="${ info.width }" height="${ info.height }"></div>` );
	}
	const html = [];
	html.push( "<figure class=\"kg-card kg-gallery-card kg-width-wide\"><div class=\"kg-gallery-container\"><div class=\"kg-gallery-row\">" );
	for ( let i = 0; i < imageHtml.length; i++ ) {
		if ( i % 3 === 0 ) {
			html.push( "</div><div class=\"kg-gallery-row\">" );
		}
		html.push( imageHtml[i] );
	}
	html.push( "</div></div></figure>" );
	return html.join( "\r\n" );
}

export async function getFlexHtml( folder, htmlPath = "/content/images/avatars", contentType = "avatar", limit = 0 ) {
	let index = 0;
	const imageHtml = [];
	const imageFiles = await getOrderedFiles( folder );
	for ( const imageFile of imageFiles ) {
		if ( !/^\d{3}-/.test( imageFile ) ) {
			continue;
		}
		index++;
		const src = join( folder, imageFile );
		const s = await fs.createReadStream( src );
		const info = await probe( s );
		imageHtml.push( `<a href="${ htmlPath }/${ imageFile }"><img class="${ contentType }-image" alt="${ contentType } illustration" width="${ info.width }" height="${ info.height }" src="${ htmlPath }/${ imageFile }"></a>` );
		if ( limit > 0 && index >= limit ) {
			break;
		}
	}
	return imageHtml.join( "\r\n" );
}

export async function getHtml( folder, htmlPath = "/content/images/avatars", captions = {} ) {
	const html = [];
	const imageFiles = await getOrderedFiles( folder );
	// console.log( captions );
	for ( const imageFile of imageFiles ) {
		const src = join( folder, imageFile );
		const s = await fs.createReadStream( src );
		const info = await probe( s );
		const caption = captions[imageFile];
		// console.log( imageFile, caption );
		html.push( `<figure class="kg-card kg-image-card${ caption ? " kg-card-hascaption" : "" }"><img src=${ htmlPath }/${ imageFile } width="${ info.width }" height="${ info.height }">${ caption ? "<figcaption>" + caption + "</figcaption>" : "" }</figure>` );
	}
	return html.join( "\n" );
}

