
document.addEventListener('DOMContentLoaded', function() {
    var splides = document.querySelectorAll('.splide');
    for (var i = 0; i < splides.length; i++) {
      var options = {};
      if (splides[i].classList.contains('herobanner-slider')) {
        console.log('test');
        options.arrows = false;
        options.type = 'fade';
	      options.autoplay = true;
        options.interval = 3500;
        options.wheel = false;
        options.rewind = true;
        options.pauseOnHover = false;
        options.pagination = false;
      }
      var splide = new Splide(splides[i], options);
      splide.mount();
    }
  });
