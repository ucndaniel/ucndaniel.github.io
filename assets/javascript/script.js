// // funktion til burgermenu
// function navbar() {
//     let navbar = document.getElementById("navbar");
//     if (navbar.style.display === "flex") {
//     navbar.style.display = "none";
//         } else {
//     navbar.style.display = "flex";
//     navbar.style.flexDirection = "column";
//     navbar.style.marginTop = "30px";
//         }
//       }

// funktion til read more

function myFunction() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("more");
  var btnText = document.getElementById("myBtn");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Læs mere...";
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Læs mindre...";
    moreText.style.display = "inline";
  }
}


// funktion til billedeskift
function makeMeCool() 
{
        document.getElementById("image").src = "../assets/images/profile-2.png";
        
    }

    function makeMeNormal() 
{
        document.getElementById("image").src = "../assets/images/cool.png"; 
    }



// // Animate JS
// // https://animejs.com/

// anime({
//     targets: '.cls-1', 
//     strokeDashoffset: [anime.setDashoffset, 0],
//     easing: 'easeInOutSine',
//     duration: 1500,
//     delay: function(el, i) { return i * 250 },
//     direction: 'alternate',
//     loop: false
//   });

//   anime({
//     targets: '.spaceShipGoBrrBrr',
//     translateX: 1700,
//     duration: 20000,
//     direction: 'normal',
//     delay: 5000,
//     loop: true,
//     easing: 'linear'
//   });
//navbar
  function navbar() {
    let navbar = document.getElementById("navbar");
    if (navbar.style.display === "grid") {
    navbar.style.display = "none";
        } else {
    navbar.style.display = "grid";
        }
      }

function spinthewheel() {
  let spinThatWheel = document.getElementById("wheel");
  let noTouching = document.getElementById("spinBtn");
  spinThatWheel.classList.toggle("spin");
  noTouching.classList.add("spinBtn");

  
  setTimeout(() => {
  var items = Array('../assets/images/movies/palmsprings.jpg', '../assets/images/movies/prisoners.jpg', '../assets/images/movies/thesuicidesquad.jpg', '../assets/images/movies/superbad.jpg', '../assets/images/movies/exmachina.jpg', '../assets/images/movies/marrowbone.jpg');
  var item = items[Math.floor(Math.random()*items.length)];
  document.getElementById("wheel").src = item;

  spinThatWheel.classList.remove("spin");
  noTouching.classList.remove("spinBtn");
  }, 1800);
}


// GEMT TIL SENERE

//  const TypeWriter = function(txtElement, words) {
//    this.txtElement = txtElement;
//    this.words = words;
//    this.txt = '';
//    this.wordIndex = 0;
//    this.type();
//   }

//  //Type Method
//   TypeWriter.prototype.type = function() {
// // // Current index of word
//     const current = this.wordIndex % this.words.length;
//  // Get full text of current word
//     const fullTxt = this.words[current]; 
//     this.txt = fullTxt.substring(-1, this.txt.length + 1);

//  // Insert txt into element
//     this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;
//  // Initial Type Speed
//     let typeSpeed = 200;

//    setTimeout(() => this.type(), typeSpeed);
//   }
  
//   // Init On DOM Load
//    document.addEventListener('DOMContentLoaded', init);
  
//  // Init App
//     function init() {
//      const txtElement = document.querySelector('.typing');
//       const words = JSON.parse(txtElement.getAttribute('data-words'));
//       // Init TypeWriter
//       new TypeWriter(txtElement, words);
//     }
// GEMT TIL SENERE

// const content = {
//     "controls": true,
//     "autoplay": false,
//     "preload": "auto",
//     "muted": false
// }
// var videoPlayer = videojs("video1", content);

// // var videoPlayer = videojs("video1", content);

// // // make a square video
// // videoPlayer.aspectRatio('1:1');

// videojs('video1').ready(function () {
//     this.on('timeupdate', onVideoTimeupdate);
// });
// var player = videojs('video1', {
//     responsive: true
//   });

// let loopStart = 0;
// let loopEnd = 3;
// let loopEnabled = false;
// let pauseTime = 3;

// function onVideoTimeupdate() {
//     if (loopEnabled) {
//         if (this.currentTime() < loopStart || this.currentTime() >= loopEnd) {
//             this.currentTime(loopStart);
//         }
//     }
//     if (this.currentTime() > pauseTime) {
//         this.pause();
//     }
// }
// video.hotspots.init();

