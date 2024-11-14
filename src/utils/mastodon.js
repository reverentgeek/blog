import { join } from "node:path";
import fs from "fs-extra";

const __dirname = import.meta.dirname;

const pullMyWebFinger = async ( domain, user ) => {
	const url = `https://${ domain }/.well-known/webfinger?resource=acct:${ user }@${ domain }`;
	const res = await fetch( url );
	const body = await res.text();
	const profile = JSON.parse( body );
	const filePath = join( __dirname, "mastodon.json" );
	await fs.writeJson( filePath, profile, { spaces: 2 } );
	console.log( profile );
};

pullMyWebFinger( "techhub.social", "reverentgeek" );
