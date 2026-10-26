// Prism.js is now loaded conditionally only on blog post pages

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
			const links = gallery.querySelectorAll( "a" );
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
