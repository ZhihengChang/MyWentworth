const likeBtn = document.querySelector(".likebutton");
let likeIcon = document.querySelector("#icon"),
  count = document.querySelector("#count");

let clicked = false;

likeBtn.addEventListener("click", () => {
  if (!clicked) {
    clicked = true;
    likeIcon.innerHTML = `<i class="fa fa-heart"></i>`;
    count.textContent++;
  } else {
    clicked = false;
    likeIcon.innerHTML = `<i class="fa fa-heart"></i>`;
    count.textContent--;
  }
});
