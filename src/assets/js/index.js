// Analytics: a click on any element with `data-cta` sends a GA4 `cta_click` event. The
// value names the action (e.g. "order-avatar"), and `page_path` says where it was clicked.
// gtag sends events with sendBeacon, so they survive navigating away. Clicks inside the
// Shopify buy button can't be seen (it's a cross-origin iframe); Shopify reports orders.
( function () {
	document.addEventListener( "click", ( e ) => {
		const el = e.target.closest( "[data-cta]" );
		if ( !el || typeof window.gtag !== "function" ) return;
		window.gtag( "event", "cta_click", {
			cta: el.dataset.cta,
			link_url: el.href || "",
			page_path: window.location.pathname
		} );
	} );
} )();

// Mobile navigation toggle
( function () {
	document.addEventListener( "DOMContentLoaded", () => {
		const button = document.querySelector( "[data-mobile-menu-button]" );
		const menu = document.querySelector( "[data-mobile-menu]" );

		if ( !button || !menu ) return;

		function closeMenu() {
			button.setAttribute( "aria-expanded", "false" );
			menu.classList.add( "hidden" );
		}

		button.addEventListener( "click", () => {
			const isExpanded = button.getAttribute( "aria-expanded" ) === "true";
			button.setAttribute( "aria-expanded", isExpanded ? "false" : "true" );
			menu.classList.toggle( "hidden", isExpanded );
		} );

		menu.querySelectorAll( "a" ).forEach( ( link ) => {
			link.addEventListener( "click", closeMenu );
		} );

		// Escape closes the open menu and puts focus back on the button.
		document.addEventListener( "keydown", ( e ) => {
			if ( e.key !== "Escape" || button.getAttribute( "aria-expanded" ) !== "true" ) return;
			closeMenu();
			button.focus();
		} );
	} );
} )();

// Lightbox functionality for image galleries
( function () {
	let lightbox = null;
	let lightboxImg = null;
	let lightboxCounter = null;
	let currentImages = [];
	let currentIndex = 0;
	let lastTrigger = null;
	let inertSiblings = [];

	function createLightbox() {
		if ( lightbox ) return;

		lightbox = document.createElement( "div" );
		lightbox.className = "lightbox";
		lightbox.setAttribute( "role", "dialog" );
		lightbox.setAttribute( "aria-modal", "true" );
		lightbox.setAttribute( "aria-label", "Image viewer" );
		// Hidden with opacity, so keep the buttons out of the tab order until opened
		lightbox.inert = true;
		lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Previous">&#8249;</button>
      <div class="lightbox-content">
        <img src="" alt="">
      </div>
      <button class="lightbox-nav lightbox-next" aria-label="Next">&#8250;</button>
      <div class="lightbox-counter" aria-live="polite"></div>
    `;
		document.body.appendChild( lightbox );

		lightboxImg = lightbox.querySelector( ".lightbox-content img" );
		lightboxCounter = lightbox.querySelector( ".lightbox-counter" );

		// Event listeners
		lightbox.querySelector( ".lightbox-close" ).addEventListener( "click", closeLightbox );
		lightbox.querySelector( ".lightbox-prev" ).addEventListener( "click", showPrev );
		lightbox.querySelector( ".lightbox-next" ).addEventListener( "click", showNext );

		lightbox.addEventListener( "click", ( e ) => {
			if ( e.target === lightbox ) closeLightbox();
		} );

		document.addEventListener( "keydown", handleKeydown );
	}

	function handleKeydown( e ) {
		if ( !lightbox || !lightbox.classList.contains( "active" ) ) return;

		if ( e.key === "Escape" ) closeLightbox();
		if ( e.key === "ArrowLeft" ) showPrev();
		if ( e.key === "ArrowRight" ) showNext();
	}

	function openLightbox( images, index, trigger ) {
		createLightbox();
		currentImages = images;
		currentIndex = index;
		lastTrigger = trigger;
		showImage();

		// Make the rest of the page inert so focus stays inside the lightbox
		inertSiblings = Array.from( document.body.children ).filter( el => el !== lightbox && !el.inert );
		inertSiblings.forEach( ( el ) => {
			el.inert = true;
		} );

		lightbox.inert = false;
		lightbox.classList.add( "active" );
		document.body.style.overflow = "hidden";
		lightbox.querySelector( ".lightbox-close" ).focus();
	}

	function closeLightbox() {
		if ( !lightbox || !lightbox.classList.contains( "active" ) ) return;
		lightbox.classList.remove( "active" );
		lightbox.inert = true;
		document.body.style.overflow = "";

		inertSiblings.forEach( ( el ) => {
			el.inert = false;
		} );
		inertSiblings = [];

		if ( lastTrigger ) lastTrigger.focus();
	}

	function showImage() {
		if ( !lightboxImg || currentImages.length === 0 ) return;
		const { src, alt } = currentImages[currentIndex];
		lightboxImg.src = src;
		lightboxImg.alt = alt;
		lightboxCounter.textContent = `${ currentIndex + 1 } / ${ currentImages.length }`;
	}

	function showPrev() {
		currentIndex = ( currentIndex - 1 + currentImages.length ) % currentImages.length;
		showImage();
	}

	function showNext() {
		currentIndex = ( currentIndex + 1 ) % currentImages.length;
		showImage();
	}

	// Initialize on DOM ready
	document.addEventListener( "DOMContentLoaded", () => {
		const galleries = document.querySelectorAll( ".gallery-grid, .gallery-single" );

		galleries.forEach( ( gallery ) => {
			// Links inside a caption (a client's website, say) aren't gallery images.
			const links = Array.from( gallery.querySelectorAll( "a" ) ).filter( link => !link.closest( "figcaption" ) );
			// Get the actual image src from <img> tags (which have optimized paths)
			// or fall back to href if no img found
			const images = Array.from( links ).map( ( link ) => {
				const img = link.querySelector( "img" );
				if ( img ) {
					// For responsive images, get the largest source from srcset or use src
					if ( img.srcset ) {
						const srcsetParts = img.srcset.split( "," ).map( s => s.trim() );
						const lastSrc = srcsetParts[srcsetParts.length - 1];
						return { src: lastSrc.split( " " )[0], alt: img.alt }; // URL without size descriptor
					}
					return { src: img.src, alt: img.alt };
				}
				return { src: link.href, alt: "" };
			} );

			links.forEach( ( link, index ) => {
				link.addEventListener( "click", ( e ) => {
					e.preventDefault();
					openLightbox( images, index, link );
				} );
			} );
		} );
	} );
} )();

// Post search on /topics/: loads /search.json the first time someone types, then shows
// posts whose title, description, or topics contain every word typed.
( function () {
	document.addEventListener( "DOMContentLoaded", () => {
		const box = document.querySelector( "[data-post-search]" );
		if ( !box ) return;

		const input = box.querySelector( "input" );
		const status = box.querySelector( "[role=status]" );
		const results = box.querySelector( "[data-post-search-results]" );
		const MAX_RESULTS = 20;
		let index = null;
		let loading = null;

		function loadIndex() {
			loading ??= fetch( "/search.json" )
				.then( res => res.json() )
				.then( ( entries ) => {
					index = entries.map( entry => ( {
						...entry,
						haystack: [ entry.t, entry.d, ...entry.k ].join( " " ).toLowerCase()
					} ) );
				} );
			return loading;
		}

		function formatDate( isoDate ) {
			return new Date( `${ isoDate }T00:00:00Z` ).toLocaleDateString( "en-US", {
				year: "numeric", month: "long", day: "numeric", timeZone: "UTC"
			} );
		}

		function render() {
			const words = input.value.toLowerCase().split( /\s+/ ).filter( Boolean );
			results.replaceChildren();
			if ( !words.length ) {
				status.textContent = "";
				return;
			}
			const matches = index.filter( entry => words.every( word => entry.haystack.includes( word ) ) );
			status.textContent = matches.length
				? `${ matches.length } ${ matches.length === 1 ? "post" : "posts" } found${ matches.length > MAX_RESULTS ? `, showing the newest ${ MAX_RESULTS }` : "" }.`
				: "No posts found. Try a different word, or browse the topics below.";
			for ( const entry of matches.slice( 0, MAX_RESULTS ) ) {
				const item = document.createElement( "li" );
				const link = document.createElement( "a" );
				link.href = entry.u;
				link.textContent = entry.t;
				const date = document.createElement( "span" );
				date.className = "post-search-date";
				date.textContent = formatDate( entry.y );
				const description = document.createElement( "p" );
				description.textContent = entry.d;
				item.append( link, date, description );
				results.append( item );
			}
		}

		input.addEventListener( "input", () => {
			if ( index ) {
				render();
				return;
			}
			status.textContent = "Loading…";
			loadIndex()
				.then( render )
				.catch( () => {
					loading = null;
					status.textContent = "Search isn't available right now. Try the topics or the archive.";
				} );
		} );

		box.hidden = false;
	} );
} )();
