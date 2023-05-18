document.addEventListener( 'DOMContentLoaded', function() {
        var splide = new Splide( '.related-items__splide', {
            type    : 'carousel',
            perPage : 1,        
            autoplay: true,
            interval: 2000, 
            perPage: 1,
            rewind: true,
            mediaQuery: 'min',
            breakpoints: {
		    770: {
			destroy: true,
		},
  }
        } );
    
            splide.mount();
        });

