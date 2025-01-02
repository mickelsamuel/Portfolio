// -------------------------------------
// RESPONSIVE NAV MENU
// -------------------------------------
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  menuToggle.classList.toggle('active');
});

// -------------------------------------
// SMOOTH SCROLL FOR NAV LINKS
// -------------------------------------
const navLinksElements = document.querySelectorAll('.nav-link');

navLinksElements.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    // Adjust for the fixed header
    const offsetPosition = targetElement.offsetTop - 60;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    // Close mobile nav if open
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
  });
});

// -------------------------------------
// DARK MODE TOGGLE
// -------------------------------------
const darkModeToggle = document.getElementById('dark-mode-toggle');

darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
});

// -------------------------------------
// HIGHLIGHT ACTIVE NAV LINK ON SCROLL
// -------------------------------------
window.addEventListener('scroll', () => {
  let currentSection = '';

  document.querySelectorAll('section').forEach((section) => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 100) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinksElements.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === currentSection) {
      link.classList.add('active');
    }
  });
});

// -------------------------------------
// CONTACT FORM HANDLING (FORMSPREE)
// -------------------------------------
const form = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  let valid = true;

  // Basic validation
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
    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formMessage.textContent = 'Message sent successfully!';
        form.reset();
      } else {
        const data = await response.json();
        if (Object.hasOwn(data, 'errors')) {
          formMessage.textContent = data.errors
            .map((error) => error.message)
            .join(', ');
        } else {
          formMessage.textContent =
            'Oops! There was a problem sending your message.';
        }
      }
    } catch (error) {
      formMessage.textContent =
        'Oops! There was a problem sending your message.';
    }
  }
});

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
}

// -------------------------------------
// LOADER
// -------------------------------------
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  loader.style.display = 'none';
});