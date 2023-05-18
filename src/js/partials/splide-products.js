document.addEventListener('DOMContentLoaded', function() {
    var splides = document.querySelectorAll('.splide');
    for (var i = 0; i < splides.length; i++) {
        var options = {};
        if (splides[i].classList.contains('product-slider')) {
            options.arrows = false;
            options.type = 'loop';
            options.classes = {
                pagination: 'splide__pagination product-pagination',
                page: 'splide__pagination__page product-pagination-page',
            };
        }
      var splide = new Splide(splides[i], options);
      splide.mount();
    }
  });
