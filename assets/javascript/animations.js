// Animate JS
// https://animejs.com/

anime({
    targets: '.cls-1', 
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 1500,
    delay: function(el, i) { return i * 250 },
    direction: 'alternate',
    loop: false
  });

  anime({
    targets: '.spaceShipGoBrrBrr',
    translateX: 1700,
    duration: 20000,
    direction: 'normal',
    delay: 5000,
    loop: true,
    easing: 'linear'
  });