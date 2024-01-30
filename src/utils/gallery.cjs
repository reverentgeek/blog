"use strict";

const fs = require( "fs-extra" );
const path = require( "path" );
const jmp = require( "jimp" );
const probe = require( "probe-image-size" );

async function getOrderedFiles( folder, sortByDate = false ) {
	const imageFiles = await fs.readdir( folder );
	const images = [];
	for( const imageFile of imageFiles ) {
		const img = imageFile.toLowerCase();
		if ( img.endsWith( ".png" ) || img.endsWith( ".jpg" ) || img.endsWith( ".jpeg" ) ) {
			const src = path.join( folder, imageFile );
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
			if ( a.t < b.t ) {
				return -1;
			}
			return 0;
		} );
	}

	return images.map( i => i.f );
}

async function convertImage( image, srcFolder, galleryFolder, size = 1500, extension = ".jpg" ) {
	console.log( "converting:", image );
	const src = path.join( srcFolder, image );
	const dst = path.join( galleryFolder, `${ path.basename( image, path.extname( image ) ) }${ extension }` );
	const img = await jmp.read( src );
	await img.resize( size, jmp.AUTO );
	await img.write( dst );
	// const convert = gm( src ).resize( size, size ).noProfile();
	// const write = util.promisify( convert.write ).bind( convert );
	// await write( dst );
}

async function getColumnHtml( folder, htmlPath = "/content/images/avatars" ) {
	const imageHtml = [];
	const imageFiles = await getOrderedFiles( folder );
	for( const imageFile of imageFiles ) {
		const src = path.join( folder, imageFile );
		const s = await fs.createReadStream( src );
		const info = await probe( s );
		imageHtml.push( `<div class="kg-gallery-image"><img src="${ htmlPath }/${ imageFile }" width="${ info.width }" height="${ info.height }"></div>` );
	}
	const html = [];
	html.push( "<figure class=\"kg-card kg-gallery-card kg-width-wide\"><div class=\"kg-gallery-container\"><div class=\"kg-gallery-row\">" );
	for( let i = 0; i < imageHtml.length; i++ ) {
		if ( i % 3 === 0 ) {
			html.push( "</div><div class=\"kg-gallery-row\">" );
		}
		html.push( imageHtml[i] );
	}
	html.push( "</div></div></figure>" );
	return html.join( "\r\n" );
}

async function getFlexHtml( folder, htmlPath = "/content/images/avatars", contentType = "avatar" ) {
	const imageHtml = [];
	const imageFiles = await getOrderedFiles( folder );
	for( const imageFile of imageFiles ) {
		const src = path.join( folder, imageFile );
		const s = await fs.createReadStream( src );
		const info = await probe( s );
		imageHtml.push( `<a href="${ htmlPath }/${ imageFile }"><img class="${ contentType }-image" alt="${ contentType } illustration" width="${ info.width }" height="${ info.height }" src="${ htmlPath }/${ imageFile }"></a>` );
	}
	return imageHtml.join( "\r\n" );
}

async function getHtml( folder, htmlPath = "/content/images/avatars", captions = {} ) {
	const html = [];
	const imageFiles = await getOrderedFiles( folder );
	// console.log( captions );
	for( const imageFile of imageFiles ) {
		const src = path.join( folder, imageFile );
		const s = await fs.createReadStream( src );
		const info = await probe( s );
		const caption = captions[imageFile];
		// console.log( imageFile, caption );
		html.push( `<figure class="kg-card kg-image-card${ caption ? " kg-card-hascaption": "" }"><img src=${ htmlPath }/${ imageFile } width="${ info.width }" height="${ info.height }">${ caption ? "<figcaption>" + caption + "</figcaption>" : "" }</figure>` );
	}
	return html.join( "\n" );
}

module.exports = {
	getColumnHtml,
	getFlexHtml,
	getHtml,
	getOrderedFiles,
	convertImage
};
