// Toggle responsive navigation menu
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
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

darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

// Highlight active navigation link
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinksElements.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Handle contact form submission
const form = document.getElementById('contact-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    let valid = true;

    if (!name) {
        valid = false;
        form.name.classList.add('error');
    } else {
        form.name.classList.remove('error');
    }

    if (!email || !validateEmail(email)) {
        valid = false;
        form.email.classList.add('error');
    } else {
        form.email.classList.remove('error');
    }

    if (!message) {
        valid = false;
        form.message.classList.add('error');
    } else {
        form.message.classList.remove('error');
    }

    if (valid) {
        const formData = new FormData(form);

        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                document.getElementById('form-message').textContent = 'Message sent successfully!';
                form.reset();
            } else {
                return response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        document.getElementById('form-message').textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        document.getElementById('form-message').textContent = 'Oops! There was a problem sending your message.';
                    }
                });
            }
        })
        .catch(error => {
            document.getElementById('form-message').textContent = 'Oops! There was a problem sending your message.';
        });
    }
});

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
}

// Remove loader after page load
window.addEventListener('load', () => {
    document.getElementById('loader').style.display = 'none';
});