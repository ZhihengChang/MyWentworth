const likeBtn = document.querySelector(".likebutton");
let likeIcon = document.querySelector("#icon"),
  count = document.querySelector("#count");

let clicked = false;

likeBtn.addEventListener("click", () => {
  if (!clicked) {
    clicked = true;
    likeIcon.innerHTML = `<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>`;
    count.textContent++;
  } else {
    clicked = false;
    likeIcon.innerHTML = `<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>`;
    count.textContent--;
  }
});
