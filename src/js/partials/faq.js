
const accordion = document.getElementsByClassName("contentBox");

for(var i=0; i<accordion.length; i++) {
  accordion[i].addEventListener('click', function() {
    var isActive = this.classList.contains('active');

    for(var j=0; j<accordion.length; j++){
      accordion[j].classList.remove('active');
    }

    if(!isActive){
      this.classList.add('active');
    }
  });
};
