
function parseSection( line ) {
	const text = line.replace( "{", "" ).replace( "}", "" );
	const parts = text.split( ":" );
	return parts.length > 1 ? { type: parts[0].toLowerCase().trim(), text: parts.slice( 1 ).join( ":" ).trim() } : { type: parts[0].toLowerCase().trim(), text: "" };
}

// Section environments, by their long and short directive names, and the heading a
// section gets when its directive has no label ({start_of_verse} vs. {start_of_verse: Verse 2}).
const SECTION_STARTS = {
	start_of_verse: "Verse",
	sov: "Verse",
	start_of_chorus: "Chorus",
	soc: "Chorus",
	start_of_bridge: "Bridge",
	sob: "Bridge"
};

function isTitle( sectionType ) {
	return sectionType === "title";
}

function isSubtitle( sectionType ) {
	return sectionType === "subtitle";
}

function isArtist( sectionType ) {
	return sectionType === "artist" || sectionType === "composer" || sectionType === "lyricist";
}

function isKey( sectionType ) {
	return sectionType === "key";
}

function isTime( sectionType ) {
	return sectionType === "time";
}

function isTempo( sectionType ) {
	return sectionType === "tempo";
}

function isSectionStart( sectionType ) {
	return Object.hasOwn( SECTION_STARTS, sectionType );
}

function isIgnoredSection( sectionType ) {
	return [ "end_of_chorus", "eoc", "end_of_verse", "eov", "end_of_bridge", "eob" ].includes( sectionType );
}

function isComment( sectionType ) {
	return sectionType.startsWith( "comment" );
}

function isFooter( sectionType ) {
	return sectionType === "footer";
}

export function parse( chordProText ) {
	const lines = chordProText.split( "\n" );
	const parsed = {
		title: "",
		subtitle: "",
		artist: [],
		key: "",
		tempo: "",
		time: "",
		sections: [],
		footer: []
	};
	// A {comment: ...} right after a {start_of_*} names that section, instead of opening an
	// empty one before it.
	let openedByEnvironment = false;
	const openSection = ( name, fromEnvironment ) => {
		const current = parsed.sections.at( -1 );
		if ( current && openedByEnvironment && current.lines.length === 0 ) {
			current.name = name || current.name;
		} else {
			parsed.sections.push( { name, lines: [] } );
		}
		openedByEnvironment = fromEnvironment;
	};
	for ( let i = 0; i < lines.length; i++ ) {
		if ( lines[i].trim().startsWith( "{" ) ) {
			const section = parseSection( lines[i] );
			switch ( true ) {
				case isTitle( section.type ):
					parsed.title = section.text;
					break;
				case isSubtitle( section.type ):
					parsed.subtitle = section.text;
					break;
				case isArtist( section.type ):
					parsed.artist.push( section.text );
					break;
				case isKey( section.type ):
					parsed.key = section.text;
					break;
				case isTime( section.type ):
					parsed.time = section.text;
					break;
				case isTempo( section.type ):
					parsed.tempo = section.text;
					break;
				case isFooter( section.type ):
					parsed.footer.push( section.text );
					break;
				case isIgnoredSection( section.type ):
					break;
				case isSectionStart( section.type ):
					openSection( section.text || SECTION_STARTS[section.type], true );
					break;
				case isComment( section.type ):
					openSection( section.text, false );
					break;
				default:
					parsed[section.type] = section.text;
					break;
			}
		} else if ( lines[i].trim().length > 0 ) {
			if ( lines[i].trim().startsWith( "CCLI" ) ) {
				while ( i < lines.length ) {
					if ( lines[i].trim().length > 0 ) {
						parsed.footer.push( lines[i].trim() );
					}
					i++;
				}
				return parsed;
			}
			// Lyrics before any section heading go in a section without a name.
			if ( parsed.sections.length === 0 ) {
				openSection( "", false );
			}
			openedByEnvironment = false;
			parsed.sections.at( -1 ).lines.push( lines[i] );
		}
	}
	return parsed;
}

export const renderChartForPlanningCenter = ( song ) => {
	const chart = [];
	const MAX_LINES_PER_PAGE = 50;
	const HEADER_LINES = 3;
	let pageLineCount = 0;

	song.sections.forEach( ( section ) => {
		const sectionLineCount = ( section.lines.length * 2 ) + HEADER_LINES;
		const nextPageLineCount = pageLineCount + sectionLineCount;
		// A section that doesn't fit starts the next page, and counts toward that page.
		if ( pageLineCount > 0 && nextPageLineCount > MAX_LINES_PER_PAGE ) {
			chart.push( "PAGE_BREAK" );
			pageLineCount = sectionLineCount;
		} else {
			pageLineCount = nextPageLineCount;
		}
		chart.push( "" );
		chart.push( section.name.toUpperCase() );
		chart.push( "" );
		section.lines.forEach( ( line ) => {
			chart.push( line );
		} );
	} );

	return chart.join( "\n" );
};

function debounce( func, delay ) {
	let timeout;

	return function () {
		const context = this;
		const args = arguments;

		clearTimeout( timeout );

		timeout = setTimeout( function () {
			func.apply( context, args );
		}, delay );
	};
}

function convert() {
	const cpro = document.getElementById( "chordpro_source" );
	const parsedChart = parse( cpro.value );
	const chart = renderChartForPlanningCenter( parsedChart );
	const pco = document.getElementById( "pco_source" );
	pco.value = chart;
}

export function setup() {
	const cpro = document.getElementById( "chordpro_source" );

	cpro.addEventListener( "paste", function () {
		// Small delay to ensure the pasted content is in the textarea
		setTimeout( function () {
			convert();
		}, 10 );
	} );

	cpro.addEventListener( "input", debounce( convert, 300 ) );

	const pco = document.getElementById( "pco_source" );
	const copyButton = document.getElementById( "copyCPOButton" );
	// const convertButton = document.getElementById( "convertCPOButton" );
	// convertButton.addEventListener( "click", convert );
	copyButton.addEventListener( "click", () => {
		navigator.clipboard.writeText( pco.value );  // eslint-disable-line
		copyButton.innerHTML = "Copied!";
		setTimeout( () => {
			copyButton.innerHTML = "Copy";
		}, 2000 );
	} );
}
