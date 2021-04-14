var modal = document.getElementById("myModal");
var openModal = document.getElementById("openmodal");
var close = document.getElementById("close")[0];

openModal.onclick = function(){
    modal.style.display = "block";
}

close.onclick = function(){
    modal.style.display = "none";
}

window.onclick = function (event){
    if (event.target == modal){
        modal.style.display = "none";
    }
}