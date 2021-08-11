"use strict";

const fs = require( "fs-extra" );
const path = require( "path" );
const gm = require( "gm" );
const util = require( "util" );

async function getOrderedFiles( folder ) {
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
	return images.map( i => i.f );
}

async function convertImage( image, srcFolder, galleryFolder ) {
	console.log( "converting:", image );
	const src = path.join( srcFolder, image );
	const dst = path.join( galleryFolder, `${ path.basename( image, path.extname( image ) ) }.jpg` );
	const convert = gm( src ).resize( 1500, 1500 ).noProfile();
	const write = util.promisify( convert.write ).bind( convert );
	await write( dst );
}

async function getColumnHtml( folder, htmlPath = "/content/images/avatars" ) {
	const imageHtml = [];
	const imageFiles = await getOrderedFiles( folder );
	for( const imageFile of imageFiles ) {
		const src = path.join( folder, imageFile );
		const image = gm( src );
		const size = util.promisify( image.size ).bind( image );
		const info = await size();
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

async function getHtml( folder, htmlPath = "/content/images/avatars", captions = {} ) {
	const html = [];
	const imageFiles = await getOrderedFiles( folder );
	// console.log( captions );
	for( const imageFile of imageFiles ) {
		const src = path.join( folder, imageFile );
		const image = gm( src );
		const size = util.promisify( image.size ).bind( image );
		const info = await size();
		const caption = captions[imageFile];
		// console.log( imageFile, caption );
		html.push( `<figure class="kg-card kg-image-card${ caption ? " kg-card-hascaption": "" }"><img src=${ htmlPath }/${ imageFile } width="${ info.width }" height="${ info.height }">${ caption ? "<figcaption>" + caption + "</figcaption>" : "" }</figure>` );
	}
	return html.join( "\n" );
}

module.exports = {
	getColumnHtml,
	getHtml,
	getOrderedFiles,
	convertImage
};
