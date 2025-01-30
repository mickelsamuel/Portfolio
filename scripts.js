/*************************************************
 * RESPONSIVE NAV MENU
 *************************************************/
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  menuToggle.classList.toggle('active');
});

// SMOOTH SCROLL FOR NAV LINKS
const navLinksElements = document.querySelectorAll('.nav-link');
navLinksElements.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    const offsetPosition = targetElement.offsetTop - 60;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    // Close mobile nav
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
  });
});

/*************************************************
 * THEME SWITCHER (LIGHT / DARK MODE)
 *************************************************/
const lightModeButton = document.getElementById('light-mode');
const darkModeButton = document.getElementById('dark-mode');

lightModeButton.addEventListener('click', () => {
  document.body.classList.remove('dark-mode');
  lightModeButton.classList.add('active');
  darkModeButton.classList.remove('active');
});

darkModeButton.addEventListener('click', () => {
  document.body.classList.add('dark-mode');
  darkModeButton.classList.add('active');
  lightModeButton.classList.remove('active');
});

/*************************************************
 * HIGHLIGHT ACTIVE NAV LINK ON SCROLL
 *************************************************/
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

/*************************************************
 * CONTACT FORM HANDLING (FORMSPREE)
 *************************************************/
const form = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

form.addEventListener('submit', async (e) => {
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
    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: 'application/json' },
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
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
}

/*************************************************
 * LOADER
 *************************************************/
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  loader.style.display = 'none';
});

/*************************************************
 * TYPING ANIMATION
 *************************************************/
const typingText = document.getElementById('typing');
const words = [
  'Software Developer',
  'Tech Enthusiast',
  'Problem Solver',
  'Innovator',
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const currentWord = words[wordIndex];
  if (!isDeleting) {
    typingText.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(type, 1000);
    } else {
      setTimeout(type, 100);
    }
  } else {
    typingText.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 500);
    } else {
      setTimeout(type, 50);
    }
  }
}
type();

/*************************************************
 * PARTICLES.JS BACKGROUND (EMBEDDED CONFIG)
 *************************************************/
try {
  particlesJS('particles-js', {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: '#007BFF',
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: '#007BFF',
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 6,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'repulse',
        },
        onclick: {
          enable: true,
          mode: 'push',
        },
        resize: true,
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
      },
    },
    retina_detect: true,
  });
} catch (e) {
  console.log('Particles.js error:', e);
}

/*************************************************
 * AOS INITIALIZATION
 *************************************************/
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 120,
    delay: 200,
  });
});

/*************************************************
 * SCROLL PROGRESS BAR
 *************************************************/
const scrollProgress = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / scrollHeight) * 100;
  scrollProgress.style.width = `${scrolled}%`;
});

/*************************************************
 * BACK-TO-TOP BUTTON
 *************************************************/
const backToTopButton = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});