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



// funktion til billedeskift
function makeMeCool() 
{
        document.getElementById("image").src = "../assets/images/standarddan.jpg";  
    }

    function makeMeNormal() 
{
        document.getElementById("image").src = "../assets/images/cooldan.jpg"; 
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