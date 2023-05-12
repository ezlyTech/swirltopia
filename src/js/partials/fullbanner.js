document.addEventListener('DOMContentLoaded', function() {
    var splides = document.querySelectorAll('.splide');
    for (var i = 0; i < splides.length; i++) {
      var options = {};
      if (splides[i].classList.contains('herobanner-slider')) {
        options.arrows = false;
        options.type = 'fade';
	      options.autoplay = true;
        options.interval = 3000;
        options.wheel = false;
        options.rewind = true;
        options.pauseOnHover = false;
        options.pagination = false;
      }
      var splide = new Splide(splides[i], options);
      splide.mount();
    }
  });
