document.querySelector('.burger').addEventListener('click', function () {
    console.log('Burger clicked');  // Check if click is detected
    this.classList.toggle('active');  // Toggle the active class for burger
    const navLinks = document.querySelector('.nav-links');
    
    if (navLinks) {
        navLinks.classList.toggle('active');  // Toggle menu visibility
        console.log('Nav links visibility toggled');
    } else {
        console.log('Nav links not found!');
    }
});
