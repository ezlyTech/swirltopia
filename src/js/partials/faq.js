
var accordion = document.getElementsByClassName("contentBox");

for(var i=0; i<accordion.length; i++) {
  accordion[i].addEventListener('click', function() {
    // Toggle the 'active' class on the accordion item
    this.classList.toggle('active');
  });
};
