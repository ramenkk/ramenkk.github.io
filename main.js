// main.js

document.addEventListener("DOMContentLoaded", function() {
    const burger = document.querySelector('.burger');
    const navContainer = document.querySelector('.nav-container');
    
    // Toggle the 'show' class on nav-container when burger icon is clicked
    burger.addEventListener('click', function() {
        navContainer.classList.toggle('show');
    });
});
    