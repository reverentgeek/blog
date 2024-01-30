"use strict";
const path = require( "path" );
const fs = require( "fs-extra" );

const pullMyWebFinger = async ( domain, user ) => {
	const url = `https://${ domain }/.well-known/webfinger?resource=acct:${ user }@${ domain }`;
	const res = await fetch( url );
	const body = await res.text();
	const profile = JSON.parse( body );
	const filePath = path.join( __dirname, "mastodon.json" );
	await fs.writeJson( filePath, profile, { spaces: 2 } );
	console.log( profile );
};

pullMyWebFinger( "techhub.social", "reverentgeek" );
