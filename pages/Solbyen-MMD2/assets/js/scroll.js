
let scrollBtn = document.querySelector("#scrollBtn");
scrollBtn.classList.add("scrollBtn");
scrollBtn.innerHTML = "Til Toppen"
// viser knappen når man kommer 100px ned af siden, ellers vises den ikke
window.onscroll = function scrollFunction() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    scrollBtn.classList.add("scrollBtnShown");
  } else {
    scrollBtn.classList.remove("scrollBtnShown");
  }
}

// klik på knappen for at gå til 0
function topFunction() {
  document.body.scrollTop = 0; // Safari
  document.documentElement.scrollTop = 0; // Chrome, Firefox, IE & Opera
  //unfoc elm to rem outli aft click
  document.activeElement.blur();
}