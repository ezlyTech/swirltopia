console.log('test');

  document.addEventListener( 'DOMContentLoaded', function() {
    var splide = new Splide( '.bannerV2-splide' , {
        arrows: false,
        autoplay: true,
        interval:  3000,
    });

    splide.mount();
  });