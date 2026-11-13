// Arrow tuner: a dev-only panel for placing the hand-drawn arrows and margin notes.
// Copied to /dev/ in development builds only (see ssqch.config.js). Load it on any page
// with the bookmarklet `javascript:import("/dev/arrow-tuner.js")`, or paste
// `import("/dev/arrow-tuner.js")` into the browser console.
//
// Pick a piece (click it, or use the list), adjust it, then "Copy CSS" and paste the result
// to Claude. Everything changes through the same CSS properties the stylesheet uses
// (rotate, scale, translate, height, --ink), so the copied values drop straight in.
//
// Keys while the panel is open: arrows nudge 1px (Shift: 10px), [ and ] rotate 1 degree
// (Shift: 15), H and V flip, - and = resize, Tab picks the next piece, Esc closes.

const ARROWS = {
	short: { src: "/dev/arrows/arrows-short.svg", ratio: "529 / 268" },
	curve: { src: "/static/hand-drawn/arrows-curve.svg", ratio: "656 / 555" },
	bolt: { src: "/static/hand-drawn/arrows-bolt.svg", ratio: "906 / 334" },
	dotted: { src: "/dev/arrows/arrows-dotted.svg", ratio: "910 / 448" },
	loop: { src: "/dev/arrows/arrows-loop.svg", ratio: "859 / 561" },
	path: { src: "/dev/arrows/arrows-path.svg", ratio: "998 / 508" },
	"sharp-turn": { src: "/dev/arrows/arrows-sharp-turn.svg", ratio: "344 / 373" },
	squiggly: { src: "/dev/arrows/arrows-squiggly.svg", ratio: "871 / 602" },
	turn: { src: "/static/hand-drawn/arrows-turn.svg", ratio: "623 / 390" },
	wavy: { src: "/dev/arrows/arrows-wavy.svg", ratio: "852 / 529" }
};

if ( document.getElementById( "arrow-tuner" ) ) {
	document.getElementById( "arrow-tuner" ).hidden = false;
} else {
	start();
}

function start() {
	const pieces = [ ...document.querySelectorAll( ".hand-note .ink, h2.has-marker > .ink" ) ]
		.map( ( el ) => {
			const state = readState( el );
			return { el, name: pieceName( el ), state, initial: { ...state }, original: el.getAttribute( "style" ) || "" };
		} );

	const panel = document.createElement( "div" );
	panel.id = "arrow-tuner";
	panel.innerHTML = `
		<style>
			#arrow-tuner { position: fixed; z-index: 99999; right: 12px; bottom: 12px; width: 300px; max-width: calc(100vw - 24px);
				font: 13px/1.4 system-ui, sans-serif; color: #111; background: #fff; border: 1px solid #999; border-radius: 8px;
				box-shadow: 0 6px 24px rgb(0 0 0 / 0.25); }
			#arrow-tuner header { display: flex; justify-content: space-between; align-items: center; padding: 6px 10px;
				background: #1d4ed8; color: #fff; border-radius: 7px 7px 0 0; cursor: move; user-select: none; }
			#arrow-tuner header button { background: none; border: 0; color: #fff; font-size: 16px; cursor: pointer; }
			#arrow-tuner .body { padding: 8px 10px; display: grid; gap: 6px; }
			#arrow-tuner .row { display: flex; gap: 4px; align-items: center; flex-wrap: wrap; }
			#arrow-tuner .row > span { width: 58px; color: #555; }
			#arrow-tuner button, #arrow-tuner select, #arrow-tuner input { font: inherit; padding: 2px 6px; border: 1px solid #bbb;
				border-radius: 4px; background: #f6f6f6; color: #111; }
			#arrow-tuner button[aria-pressed="true"] { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }
			#arrow-tuner select { flex: 1; min-width: 0; }
			#arrow-tuner input { width: 64px; }
			#arrow-tuner output { font-family: ui-monospace, monospace; font-size: 11px; white-space: pre-wrap; background: #f3f4f6;
				padding: 6px; border-radius: 4px; max-height: 120px; overflow: auto; }
			#arrow-tuner .hint { color: #666; font-size: 11px; }
			.arrow-tuner-selected { outline: 2px dashed #e11d48 !important; outline-offset: 2px; }
		</style>
		<header><strong>Arrow tuner</strong><span class="width"></span><button type="button" data-act="close" aria-label="Close">×</button></header>
		<div class="body">
			<div class="row"><span>Piece</span><select data-field="piece"></select></div>
			<div class="row" data-only="arrow"><span>Arrow</span><select data-field="shape"></select></div>
			<div class="row"><span>Rotate</span>
				<button type="button" data-act="rot" data-v="-15">⟲15</button><button type="button" data-act="rot" data-v="-1">⟲1</button>
				<input data-field="rotate" type="number" step="1"><button type="button" data-act="rot" data-v="1">⟳1</button><button type="button" data-act="rot" data-v="15">⟳15</button></div>
			<div class="row"><span>Flip</span><button type="button" data-act="flipH">Horizontal</button><button type="button" data-act="flipV">Vertical</button></div>
			<div class="row"><span>Nudge</span>
				<button type="button" data-act="nudge" data-x="-1" data-y="0">←</button><button type="button" data-act="nudge" data-x="1" data-y="0">→</button>
				<button type="button" data-act="nudge" data-x="0" data-y="-1">↑</button><button type="button" data-act="nudge" data-x="0" data-y="1">↓</button>
				<span class="xy" style="width:auto"></span></div>
			<div class="row"><span>Size</span><button type="button" data-act="size" data-v="-1">−</button>
				<input data-field="height" type="number" step="1"> px <button type="button" data-act="size" data-v="1">+</button></div>
			<div class="row"><button type="button" data-act="reset">Reset piece</button><button type="button" data-act="copy">Copy CSS</button></div>
			<output></output>
			<div class="hint">Click a doodle to pick it. Arrows nudge (Shift ×10), [ ] rotate, H/V flip, − = size, Tab next.</div>
		</div>`;
	document.body.append( panel );

	const $ = sel => panel.querySelector( sel );
	const pieceSelect = $( "[data-field=piece]" );
	const shapeSelect = $( "[data-field=shape]" );
	pieces.forEach( ( p, i ) => pieceSelect.add( new Option( p.name, i ) ) );

	// Some pieces only show at some widths (the blinks arrow is wide screens only), so the
	// list keeps them all and labels the hidden ones. When the window is resized, untouched
	// pieces re-read their CSS, since a media query may have changed it.
	function refreshPieces() {
		pieces.forEach( ( p, i ) => {
			const hidden = isHidden( p.el );
			pieceSelect.options[i].text = hidden ? `${ p.name } (hidden at this width)` : p.name;
			if ( !hidden && !changed( p ) ) {
				p.el.setAttribute( "style", p.original );
				p.state = readState( p.el );
				p.initial = { ...p.state };
			}
		} );
	}
	refreshPieces();
	Object.keys( ARROWS ).forEach( k => shapeSelect.add( new Option( k, k ) ) );

	let current = pieces.find( p => !isHidden( p.el ) ) || pieces[0];

	function select( piece ) {
		current?.el.classList.remove( "arrow-tuner-selected" );
		current = piece;
		if ( !current ) return;
		current.el.classList.add( "arrow-tuner-selected" );
		pieceSelect.value = pieces.indexOf( current );
		render();
	}

	function render() {
		const s = current.state;
		const isArrow = current.el.className.includes( "ink-arrow" );
		panel.querySelectorAll( "[data-only=arrow]" ).forEach( r => r.hidden = !isArrow );
		shapeSelect.value = s.shape || "";
		$( "[data-field=rotate]" ).value = round( s.rotate );
		$( "[data-field=height]" ).value = round( s.height );
		$( "[data-act=flipH]" ).setAttribute( "aria-pressed", s.sx < 0 );
		$( "[data-act=flipV]" ).setAttribute( "aria-pressed", s.sy < 0 );
		$( ".xy" ).textContent = `x ${ round( s.tx ) }, y ${ round( s.ty ) }`;
		$( ".width" ).textContent = `${ innerWidth }px wide`;
		apply( current );
		$( "output" ).textContent = cssFor( pieces.filter( changed ) ) || "No changes yet.";
	}

	function apply( p ) {
		const s = p.state;
		const st = p.el.style;
		st.rotate = `${ s.rotate }deg`;
		st.scale = `${ s.sx } ${ s.sy }`;
		st.translate = `${ s.tx }px ${ s.ty }px`;
		st.height = `${ s.height }px`;
		if ( s.shape ) {
			st.setProperty( "--ink", `url(${ ARROWS[s.shape].src })` );
			st.aspectRatio = ARROWS[s.shape].ratio;
		}
	}

	// A flip on screen, whatever the rotation: mirror the element, then reverse the angle.
	const actions = {
		rot: v => current.state.rotate += v,
		flipH: () => {
			current.state.sx *= -1;
			current.state.rotate *= -1;
		},
		flipV: () => {
			current.state.sy *= -1;
			current.state.rotate *= -1;
		},
		nudge: ( x, y ) => {
			current.state.tx += x;
			current.state.ty += y;
		},
		size: v => current.state.height = Math.max( 4, current.state.height + v ),
		reset: () => {
			current.el.setAttribute( "style", current.original );
			current.state = readState( current.el );
		}
	};

	panel.addEventListener( "click", ( e ) => {
		const b = e.target.closest( "button" );
		if ( !b ) return;
		const act = b.dataset.act;
		const mult = e.shiftKey ? 10 : 1;
		if ( act === "close" ) {
			panel.hidden = true;
			current?.el.classList.remove( "arrow-tuner-selected" );
			return;
		}
		if ( act === "copy" ) {
			// eslint-disable-next-line n/no-unsupported-features/node-builtins -- runs in the browser
			window.navigator.clipboard.writeText( $( "output" ).textContent ).then( () => b.textContent = "Copied!" );
			setTimeout( () => b.textContent = "Copy CSS", 1500 );
			return;
		}
		if ( act === "nudge" ) actions.nudge( +b.dataset.x * mult, +b.dataset.y * mult );
		else if ( act === "rot" || act === "size" ) actions[act]( +b.dataset.v );
		else actions[act]();
		render();
	} );

	pieceSelect.addEventListener( "change", () => select( pieces[pieceSelect.value] ) );
	shapeSelect.addEventListener( "change", () => {
		current.state.shape = shapeSelect.value;
		render();
	} );
	$( "[data-field=rotate]" ).addEventListener( "input", ( e ) => {
		current.state.rotate = +e.target.value || 0;
		render();
	} );
	$( "[data-field=height]" ).addEventListener( "input", ( e ) => {
		current.state.height = Math.max( 4, +e.target.value || 4 );
		render();
	} );

	// Click a doodle to pick it. Capture phase, so links around a doodle don't navigate.
	document.addEventListener( "click", ( e ) => {
		if ( panel.hidden || panel.contains( e.target ) ) return;
		const hit = pieces.find( ( p ) => {
			const r = p.el.getBoundingClientRect();
			return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
		} );
		if ( hit ) {
			e.preventDefault();
			e.stopPropagation();
			select( hit );
		}
	}, true );

	document.addEventListener( "keydown", ( e ) => {
		if ( panel.hidden || !current || e.target.matches( "input, select, textarea" ) ) return;
		const step = e.shiftKey ? 10 : 1;
		const keys = {
			ArrowLeft: () => actions.nudge( -step, 0 ),
			ArrowRight: () => actions.nudge( step, 0 ),
			ArrowUp: () => actions.nudge( 0, -step ),
			ArrowDown: () => actions.nudge( 0, step ),
			"[": () => actions.rot( e.shiftKey ? -15 : -1 ),
			"{": () => actions.rot( -15 ),
			"]": () => actions.rot( e.shiftKey ? 15 : 1 ),
			"}": () => actions.rot( 15 ),
			h: actions.flipH,
			v: actions.flipV,
			"-": () => actions.size( -1 ),
			"=": () => actions.size( 1 ),
			Tab: () => select( pieces[( pieces.indexOf( current ) + ( e.shiftKey ? pieces.length - 1 : 1 ) ) % pieces.length] ),
			Escape: () => {
				panel.hidden = true;
				current.el.classList.remove( "arrow-tuner-selected" );
			}
		};
		const fn = keys[e.key] || keys[e.key.toLowerCase()];
		if ( !fn ) return;
		e.preventDefault();
		fn();
		if ( !panel.hidden ) render();
	} );

	// Drag the panel by its title bar, to get it off whatever you're tuning.
	const header = $( "header" );
	header.addEventListener( "pointerdown", ( e ) => {
		if ( e.target.closest( "button" ) ) return;
		const r = panel.getBoundingClientRect();
		const dx = e.clientX - r.left;
		const dy = e.clientY - r.top;
		header.setPointerCapture( e.pointerId );
		const move = ( ev ) => {
			panel.style.left = `${ Math.max( 0, ev.clientX - dx ) }px`;
			panel.style.top = `${ Math.max( 0, ev.clientY - dy ) }px`;
			panel.style.right = "auto";
			panel.style.bottom = "auto";
		};
		header.addEventListener( "pointermove", move );
		header.addEventListener( "pointerup", () => header.removeEventListener( "pointermove", move ), { once: true } );
	} );

	addEventListener( "resize", () => {
		refreshPieces();
		if ( current ) render();
	} );

	if ( pieces.length ) select( current );
	else $( "output" ).textContent = "No doodles on this page.";

	function changed( p ) {
		const a = p.state;
		const b = p.initial;
		return [ "rotate", "sx", "sy", "tx", "ty", "height", "shape" ].some( k => !Object.is( a[k], b[k] ) );
	}
}

function isHidden( el ) {
	return getComputedStyle( el ).display === "none" || !el.getClientRects().length;
}

function readState( el ) {
	const cs = getComputedStyle( el );
	const rotate = cs.rotate === "none" ? 0 : parseFloat( cs.rotate );
	const [ sx = 1, sy = sx ] = cs.scale === "none" ? [] : cs.scale.split( " " ).map( Number );
	const [ tx = 0, ty = 0 ] = cs.translate === "none" ? [] : cs.translate.split( " " ).map( parseFloat );
	const shapeMatch = cs.getPropertyValue( "--ink" ).match( /arrows-([a-z-]+)\.svg/ );
	return { rotate, sx, sy, tx, ty, height: parseFloat( cs.height ), shape: shapeMatch ? shapeMatch[1] : null };
}

// "drew: arrow", "price row: lettering", "#how-it-works marker", and so on.
function pieceName( el ) {
	const heading = el.closest( "h2" );
	if ( heading ) return `#${ heading.id } marker`;
	const note = [ ...el.closest( ".hand-note" ).classList ].find( c => c.startsWith( "hand-note-" ) ) || "hand-note";
	const part = el.className.includes( "ink-arrow" ) ? "arrow" : "lettering";
	return `${ note.replace( "hand-note-", "" ) }: ${ part }`;
}

function cssFor( list ) {
	if ( !list.length ) return "";
	const lines = [ `/* ${ location.pathname } at ${ innerWidth }px wide */` ];
	for ( const p of list ) {
		const s = p.state;
		const sel = selectorFor( p.el );
		const props = [
			`height: ${ round( s.height ) }px;`,
			`rotate: ${ round( s.rotate ) }deg;`,
			`scale: ${ s.sx } ${ s.sy };`,
			`translate: ${ round( s.tx ) }px ${ round( s.ty ) }px;`
		];
		if ( s.shape && s.shape !== p.initial.shape ) props.unshift( `--ink: url(${ ARROWS[s.shape].src }); aspect-ratio: ${ ARROWS[s.shape].ratio };` );
		lines.push( `${ sel } { ${ props.join( " " ) } }` );
	}
	return lines.join( "\n" );
}

function selectorFor( el ) {
	const heading = el.closest( "h2" );
	if ( heading ) return `#${ heading.id } > .ink`;
	const note = [ ...el.closest( ".hand-note" ).classList ].find( c => c.startsWith( "hand-note-" ) );
	const ink = [ ...el.classList ].find( c => c.startsWith( "ink-" ) );
	return `.${ note } > .${ ink }`;
}

function round( n ) {
	return Math.round( n * 10 ) / 10;
}
