import { join } from "node:path";
import { writeFile } from "node:fs/promises";

const __dirname = import.meta.dirname;

const pullMyWebFinger = async ( domain, user ) => {
	const url = `https://${ domain }/.well-known/webfinger?resource=acct:${ user }@${ domain }`;
	const res = await fetch( url );
	const body = await res.text();
	const profile = JSON.parse( body );
	const filePath = join( __dirname, "mastodon.json" );
	await writeFile( filePath, JSON.stringify( profile, null, 2 ) );
	console.log( profile );
};

pullMyWebFinger( "techhub.social", "reverentgeek" );
