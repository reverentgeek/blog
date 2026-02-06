// Prism.js is now loaded conditionally only on blog post pages

// Lightbox functionality for image galleries
( function () {
	let lightbox = null;
	let lightboxImg = null;
	let lightboxCounter = null;
	let currentImages = [];
	let currentIndex = 0;

	function createLightbox() {
		if ( lightbox ) return;

		lightbox = document.createElement( "div" );
		lightbox.className = "lightbox";
		lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Previous">&#8249;</button>
      <div class="lightbox-content">
        <img src="" alt="">
      </div>
      <button class="lightbox-nav lightbox-next" aria-label="Next">&#8250;</button>
      <div class="lightbox-counter"></div>
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

	function openLightbox( images, index ) {
		createLightbox();
		currentImages = images;
		currentIndex = index;
		showImage();
		lightbox.classList.add( "active" );
		document.body.style.overflow = "hidden";
	}

	function closeLightbox() {
		if ( !lightbox ) return;
		lightbox.classList.remove( "active" );
		document.body.style.overflow = "";
	}

	function showImage() {
		if ( !lightboxImg || currentImages.length === 0 ) return;
		lightboxImg.src = currentImages[currentIndex];
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
						return lastSrc.split( " " )[0]; // Get URL without size descriptor
					}
					return img.src;
				}
				return link.href;
			} );

			links.forEach( ( link, index ) => {
				link.addEventListener( "click", ( e ) => {
					e.preventDefault();
					openLightbox( images, index );
				} );
			} );
		} );
	} );
} )();
