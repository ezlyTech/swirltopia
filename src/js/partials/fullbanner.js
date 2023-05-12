document.addEventListener('DOMContentLoaded', function() {
    var splides = document.querySelectorAll('.splide');
    for (var i = 0; i < splides.length; i++) {
      var options = {};
      if (splides[i].classList.contains('herobanner-slider')) {
        options.arrows = false;
        options.type = 'loop';
	    options.autoplay = true;
        options.interval = 1000;
      }
      var splide = new Splide(splides[i], options);
      splide.mount();
    }
  });
