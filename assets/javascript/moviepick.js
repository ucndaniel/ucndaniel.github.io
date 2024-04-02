function spinthewheel() {
  let spinThatWheel = document.getElementById("wheel");
  let noTouching = document.getElementById("spinBtn");
  spinThatWheel.classList.toggle("spin");
  noTouching.classList.add("spinBtn");

  setTimeout(() => {
    var items = [
      '../assets/images/movies/palmsprings.jpg', 
      '../assets/images/movies/prisoners.jpg', 
      '../assets/images/movies/thesuicidesquad.jpg', 
      '../assets/images/movies/superbad.jpg', 
      '../assets/images/movies/exmachina.jpg', 
      '../assets/images/movies/marrowbone.jpg', 
      '../assets/images/movies/americanpsycho.png', 
      '../assets/images/movies/annihilation.png', 
      '../assets/images/movies/arrival.png', 
      '../assets/images/movies/blackphone.png', 
      '../assets/images/movies/bullettrain.png', 
      '../assets/images/movies/deathatafuneral.png', 
      '../assets/images/movies/dune.png', 
      '../assets/images/movies/eeoao.png', 
      '../assets/images/movies/eternalsunshine.png', 
      '../assets/images/movies/grandbudapesthotel.png', 
      '../assets/images/movies/lastnightinsoho.png', 
      '../assets/images/movies/littlemisssunshine.png', 
      '../assets/images/movies/maverick.png', 
      '../assets/images/movies/ridersofjustice.png', 
      '../assets/images/movies/themenu.png', 
      '../assets/images/movies/theniceguys.png', 
      '../assets/images/movies/thenorthman.png', 
      '../assets/images/movies/zodiac.png'
    ];
    var item = items[Math.floor(Math.random()*items.length)];
    document.getElementById("wheel").src = item;

    spinThatWheel.classList.remove("spin");
    noTouching.classList.remove("spinBtn");
  }, 1800);
}

function createRainImage(imageSrc) {
  const img = document.createElement('img');
  img.src = imageSrc;
  img.classList.add('floating-img');
  // Position images randomly horizontally across the entire width of the viewport
  img.style.left = Math.random() * window.innerWidth + 'px';

  // Randomize animation duration for variety in the "rainfall"
  img.style.animationDuration = 3 + Math.random() * 4 + 's'; // Raindrop speed, adjust as needed

  document.body.appendChild(img);

  // Remove the image after it has finished "falling" to keep the DOM clean
  img.addEventListener('animationend', () => {
      img.parentNode.removeChild(img);
  });
}

function startRainingImages() {
  const images = [
      '../assets/images/movies/pop.png',
      '../assets/images/movies/movie.png',
      // Add more images as desired
  ];

  // Create a new image every 300 milliseconds for a continuous effect
  setInterval(() => {
    const imageSrc = images[Math.floor(Math.random() * images.length)];
    createRainImage(imageSrc);
}, 400); // Adjust the interval for more or less frequent "rain"
}

// Initiate raining images when the window loads
window.onload = startRainingImages;