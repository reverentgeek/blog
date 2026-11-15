import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const reportPath = "./reports/local-report.html";

// `ssqch serve --built` serves dist/ as the production build left it, the way Netlify does:
// no rebuild, no live-reload script, and gzip for text. It writes the ready file (JSON with
// the URL) once it's listening.
const readyDir = mkdtempSync( join( tmpdir(), "rg-lighthouse-" ) );
const readyFile = join( readyDir, "ready.json" );
const server = spawn( "scripts/ssqch.sh", [ "serve", "--built", "--port", "0", "--quiet", "--ready-file", readyFile ], { stdio: [ "ignore", "ignore", "inherit" ] } );

function stop( code ) {
	server.kill();
	rmSync( readyDir, { recursive: true, force: true } );
	process.exitCode = code;
}

let ready;
for ( let i = 0; i < 200 && !ready && server.exitCode === null; i++ ) {
	if ( existsSync( readyFile ) ) {
		ready = JSON.parse( readFileSync( readyFile, "utf8" ) );
	} else {
		await sleep( 50 );
	}
}

if ( !ready ) {
	console.error( "ssqch serve --built didn't start (is dist/ built? pnpm run build)" );
	stop( 1 );
} else {
	console.log( `Serving ./dist at ${ ready.url }` );
	mkdirSync( "./reports", { recursive: true } );

	const args = [
		ready.url,
		"--output", "html",
		"--output-path", reportPath,
		"--chrome-flags=--headless=new",
		...process.argv.slice( 2 )
	];

	// Only pop open the report when run interactively
	if ( process.stdout.isTTY ) {
		args.push( "--view" );
	}

	const lighthouseBin = join( "node_modules", ".bin", process.platform === "win32" ? "lighthouse.cmd" : "lighthouse" );
	const lighthouse = spawn( lighthouseBin, args, { stdio: "inherit" } );

	lighthouse.on( "error", ( error ) => {
		console.error( "Failed to start Lighthouse:", error );
		stop( 1 );
	} );

	lighthouse.on( "close", ( code ) => {
		if ( code === 0 ) {
			console.log( `Report saved to ${ reportPath }` );
		}
		stop( code ?? 0 );
	} );
}
