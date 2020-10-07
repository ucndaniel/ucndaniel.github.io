
let currentYear = new Date().getFullYear();
window.onload = (event) => {
  let footer = document.querySelector('footer');
  footer.innerHTML = `<p><u>Kontakt</u><br>Formand: <a href="mailto:formand@solbyen.dk"> formand@solbyen.dk</a><br>Webmaster: <a href="mailto:Webmaster@solbyen.dk"> webmaster@solbyen.dk</a></p>
  <p id="copyright">© ${currentYear} Solbyens Ejerlav</p>`
}

function mobileNav() {
  var x = document.getElementById("mobile");
  if (x.style.display === "grid") {
    x.style.display = "none";
  } else {
    x.style.display = "grid";
  }
}


let PNMshown = 0; // 0 = false

let pagenav = document.querySelector(".pageNav"); // pagenav = .pagenav

let pageNavCurrent = document.querySelector("#pageNavCurrent");
if (pageNavCurrent) { // tjekker om pagenavcurrent findes
  pageNavCurrent.classList.add("pageNavCurrent") // tilføjer en class på det som har #pagenavcurrent
}

let pageNavMobileElm = document.querySelector("#pageNavMobile"); 
if (pageNavMobileElm) {
  pageNavMobileElm.classList.add("pageNavMobile");
}
// samme som ovenover

function pageNavMobile() {
  if (PNMshown && pageNavMobileElm != null) { // hvis mobil navigationen er vist, så fjerner den det
    pageNavMobileElm.classList.add("pageNavMobile");
    pageNavMobileElm.classList.remove("pageNavMobileShown");
    pagenav.classList.remove("pageNavTall");
    PNMshown--;
  } else if (!PNMshown && pageNavMobileElm != null) { // viser mobil navigationen på siderne
    pageNavMobileElm.classList.remove("pageNavMobile"); // fjerner den class der gør at indholdet ikke kan ses
    pageNavMobileElm.classList.add("pageNavMobileShown"); // tilføjer den class som gør at indholdet ser rigtigt ud
    pagenav.classList.add("pageNavTall"); // den bestemmer højden
    PNMshown++; // gør den true, (gør den 1 i stedet for 0)
  } else {
    console.log("pageNavMobileElm is " + pageNavMobileElm + "!")
  }
}