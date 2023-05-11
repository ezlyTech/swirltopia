console.log('test');
document.addEventListener('DOMContentLoaded', function() {
    var splide = new Splide('.bannerV2-splide', {
      type: 'fade',
      rewind: true,
      autoplay: true, // Add autoplay option
      interval: 5000, // Set autoplay interval to 5 seconds
      arrows: false, // Remove arrows
    });
  
    splide.mount();
  });
  