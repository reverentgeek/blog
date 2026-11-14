import test from "node:test";
import assert from "node:assert/strict";

import { parse, renderChartForPlanningCenter } from "../src/assets/js/pco.js";

function song( ...sizes ) {
	return {
		sections: sizes.map( ( size, n ) => ( {
			name: `Section ${ n + 1 }`,
			lines: Array.from( { length: size }, ( _, i ) => `[C]Line ${ i + 1 }` )
		} ) )
	};
}

function pageCount( chart ) {
	return chart.split( "PAGE_BREAK" ).length;
}

test( "lyrics before any heading go in an unnamed section", () => {
	const parsed = parse( "{title: Example}\n[C]Hello world" );

	assert.equal( parsed.title, "Example" );
	assert.deepEqual( parsed.sections, [ { name: "", lines: [ "[C]Hello world" ] } ] );
} );

test( "start_of_* directives open sections", () => {
	const parsed = parse( [
		"{start_of_verse}", "[C]Hello world", "{end_of_verse}",
		"{soc: Chorus 1}", "[G]Sing it", "{eoc}",
		"{start_of_bridge}", "{comment: Bridge 2}", "[F]Over here", "{end_of_bridge}"
	].join( "\n" ) );

	assert.deepEqual( parsed.sections.map( section => [ section.name, section.lines ] ), [
		[ "Verse", [ "[C]Hello world" ] ],
		[ "Chorus 1", [ "[G]Sing it" ] ],
		[ "Bridge 2", [ "[F]Over here" ] ]
	] );
} );

test( "comment headings still start sections", () => {
	const parsed = parse( "{comment: Verse 1}\n[C]One\n{comment: Instrumental}\n{comment: Verse 2}\n[G]Two" );

	assert.deepEqual( parsed.sections.map( section => section.name ), [ "Verse 1", "Instrumental", "Verse 2" ] );
} );

test( "a section moved to a new page counts toward that page", () => {
	// 43, 23 and 33 lines, with a 50-line page: one section per page.
	assert.equal( pageCount( renderChartForPlanningCenter( song( 20, 10, 15 ) ) ), 3 );
	// 23 + 23 fit together, and 33 goes on the next page.
	assert.equal( pageCount( renderChartForPlanningCenter( song( 10, 10, 15 ) ) ), 2 );
} );

test( "a long first section doesn't start with a page break", () => {
	assert.ok( !renderChartForPlanningCenter( song( 30 ) ).startsWith( "PAGE_BREAK" ) );
} );
