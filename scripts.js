// Toggle responsive navigation menu
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth scrolling for navigation links
const navLinksElements = document.querySelectorAll('.nav-link');

navLinksElements.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        const targetPosition = targetElement.offsetTop - 60; // Adjusted for fixed header
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

// Toggle dark mode
const darkModeToggle = document.getElementById('dark-mode-toggle');

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Handle contact form submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    fetch(form.action, {
        method: form.method,
        body: formData,
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('form-message').textContent = data;
        form.reset();
    })
    .catch(error => {
        document.getElementById('form-message').textContent = 'Failed to send message. Please try again.';
    });
});