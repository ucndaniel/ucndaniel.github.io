// Mobile navigation toggle
function toggleNav() {
    const navbar = document.getElementById('navbar');
    const toggle = document.querySelector('.mobile-toggle');
    navbar.classList.toggle('open');
    toggle.classList.toggle('open');
}

// Close mobile nav when clicking a link
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('#navbar a');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            const navbar = document.getElementById('navbar');
            const toggle = document.querySelector('.mobile-toggle');
            if (navbar.classList.contains('open')) {
                navbar.classList.remove('open');
                toggle.classList.remove('open');
            }
        });
    });
});

// Image toggle for about page
function makeMeCool() {
    document.getElementById('image').src = '../images/standarddan.jpg';
}

function makeMeNormal() {
    document.getElementById('image').src = '../images/cooldan.jpg';
}
