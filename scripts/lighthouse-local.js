import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { extname, join, resolve, sep } from "node:path";
import { gzipSync } from "node:zlib";

const distPath = resolve( "./dist" );
const reportPath = "./reports/local-report.html";

const contentTypes = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".xml": "application/xml; charset=utf-8",
	".txt": "text/plain; charset=utf-8",
	".svg": "image/svg+xml",
	".avif": "image/avif",
	".webp": "image/webp",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".ico": "image/x-icon",
	".woff2": "font/woff2",
	".woff": "font/woff"
};

const server = createServer( async ( req, res ) => {
	try {
		let { pathname } = new URL( req.url, "http://localhost" );
		pathname = decodeURIComponent( pathname );
		if ( pathname.endsWith( "/" ) ) {
			pathname += "index.html";
		}

		const filePath = resolve( join( distPath, pathname ) );
		if ( !filePath.startsWith( distPath + sep ) ) {
			res.writeHead( 403 );
			res.end( "Forbidden" );
			return;
		}

		let data = await readFile( filePath );
		const contentType = contentTypes[extname( filePath ).toLowerCase()] ?? "application/octet-stream";
		const headers = { "content-type": contentType };

		// Compress text responses so local results better match production (Netlify serves brotli)
		const isCompressible = /^(text\/|application\/(json|xml))/.test( contentType ) || contentType === "image/svg+xml";
		if ( isCompressible && req.headers["accept-encoding"]?.includes( "gzip" ) ) {
			data = gzipSync( data );
			headers["content-encoding"] = "gzip";
		}

		res.writeHead( 200, headers );
		res.end( data );
	} catch {
		res.writeHead( 404 );
		res.end( "Not found" );
	}
} );

server.listen( 0, "127.0.0.1", () => {
	const { port } = server.address();
	const url = `http://localhost:${ port }/`;
	console.log( `Serving ./dist at ${ url }` );

	mkdirSync( "./reports", { recursive: true } );

	const args = [
		url,
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
		process.exitCode = 1;
		server.close();
	} );

	lighthouse.on( "close", ( code ) => {
		if ( code === 0 ) {
			console.log( `Report saved to ${ reportPath }` );
		}
		process.exitCode = code ?? 0;
		server.close();
	} );
} );
