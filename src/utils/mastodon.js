"use strict";
const path = require( "path" );
const fs = require( "fs-extra" );

const doTheThing = async () => {
	const domain = "techhub.social";
	const user = "reverentgeek";
	const url = `https://${ domain }/.well-known/webfinger?resource=acct:${ user }@${ domain }`;
	// console.log( url );
	// // GET https://${MASTODON_DOMAIN}/.well-known/webfinger?resource=acct:${MASTODON_USER}@${MASTODON_DOMAIN}
	const res = await fetch( url );
	// console.log( res );
	const body = await res.text();
	const profile = JSON.parse( body );
	const filePath = path.join( __dirname, "mastodon.json" );
	await fs.writeJson( filePath, profile, { spaces: 2 } );
	console.log( filePath );
};

doTheThing();
