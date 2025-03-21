/****************************************************************************
 * scripts.js
 * ----------
 * Contains all custom JavaScript for your portfolio:
 *   - Menu toggle for responsive mobile nav
 *   - Smooth scrolling behavior
 *   - Theme switcher (light/dark mode)
 *   - Highlighting nav links based on scroll position
 *   - Contact form validation + submission
 *   - Loader (hide on page load)
 *   - Typing animation
 *   - Particles.js initialization
 *   - AOS (on-scroll animations)
 *   - Scroll progress bar
 *   - Back-to-top button
 ****************************************************************************/

/*************************************************
 * 1) SITE-WIDE INITIALIZATION
 *************************************************/
function initSite() {
  initMenuToggle();
  initSmoothScroll();
  initThemeSwitcher();
  highlightNavOnScroll();
  initFormHandling();
  hideLoaderOnLoad();
  initTypingAnimation();
  initParticles();
  initAOS();
  initScrollProgress();
  initBackToTop();
}

/*************************************************
 * 2) RESPONSIVE NAV MENU TOGGLE
 *************************************************/
function initMenuToggle() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Toggles the mobile navigation sidebar
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
}

/*************************************************
 * 3) SMOOTH SCROLLING FOR INTERNAL LINKS
 *************************************************/
function initSmoothScroll() {
  const navLinksElements = document.querySelectorAll('.nav-link');
  const navLinks = document.querySelector('.nav-links');
  const menuToggle = document.querySelector('.menu-toggle');

  navLinksElements.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Get the target section ID
      const targetId = e.currentTarget.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      // Calculate offset position (minus fixed header height)
      const offsetPosition = targetElement.offsetTop - 60;

      // Smoothly scroll to the target position
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Close mobile nav after link click
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
}

/*************************************************
 * 4) THEME SWITCHER (LIGHT / DARK MODE)
 *************************************************/
function initThemeSwitcher() {
  const lightModeButton = document.getElementById('light-mode');
  const darkModeButton = document.getElementById('dark-mode');

  // Switch to Light Mode
  lightModeButton.addEventListener('click', () => {
    document.body.classList.remove('dark-mode');
    lightModeButton.classList.add('active');
    darkModeButton.classList.remove('active');
  });

  // Switch to Dark Mode
  darkModeButton.addEventListener('click', () => {
    document.body.classList.add('dark-mode');
    darkModeButton.classList.add('active');
    lightModeButton.classList.remove('active');
  });
}

/*************************************************
 * 5) HIGHLIGHT ACTIVE NAV LINK ON SCROLL
 *************************************************/
function highlightNavOnScroll() {
  const navLinksElements = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    // Identify which section is currently in view
    document.querySelectorAll('section').forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 100) {
        currentSection = section.getAttribute('id');
      }
    });

    // Update nav link style based on currentSection
    navLinksElements.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === currentSection) {
        link.classList.add('active');
      }
    });
  });
}

/*************************************************
 * 6) CONTACT FORM HANDLING (FORMSPREE)
 *************************************************/
function initFormHandling() {
  const form = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    let valid = true;

    // Validate Name
    if (!name) {
      valid = false;
      form.name.classList.add('error');
    } else {
      form.name.classList.remove('error');
    }

    // Validate Email
    if (!email || !validateEmail(email)) {
      valid = false;
      form.email.classList.add('error');
    } else {
      form.email.classList.remove('error');
    }

    // Validate Message
    if (!message) {
      valid = false;
      form.message.classList.add('error');
    } else {
      form.message.classList.remove('error');
    }

    // If all fields are valid, send form to Formspree
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

  // Simple email validation (regex)
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }
}

/*************************************************
 * 7) HIDE LOADER ON WINDOW LOAD
 *************************************************/
function hideLoaderOnLoad() {
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'none';
    }
  });
}

/*************************************************
 * 8) TYPING ANIMATION FOR HERO TEXT
 *************************************************/
function initTypingAnimation() {
  const typingText = document.getElementById('typing');
  if (!typingText) return;

  // List of words to rotate in the typing animation
  const words = [
    'Software Developer',
    'Tech Enthusiast',
    'Problem Solver',
    'Innovator'
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      // Type forward
      typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;

      // If word fully typed, switch to deleting after a brief pause
      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 1000);
      } else {
        setTimeout(type, 100);
      }
    } else {
      // Delete backward
      typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;

      // If deletion completes, move to next word
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
      } else {
        setTimeout(type, 50);
      }
    }
  }

  // Start the typing animation
  type();
}

/*************************************************
 * 9) PARTICLES.JS INITIALIZATION
 *************************************************/
function initParticles() {
  try {
    // Load configuration from "particles-config.json"
    particlesJS.load('particles-js', 'particles-config.json', function() {
      console.log('Particles.js loaded site-wide');
    });
  } catch (e) {
    console.log('Particles.js error:', e);
  }
}

/*************************************************
 * 10) AOS (ANIMATE ON SCROLL) INITIALIZATION
 *************************************************/
function initAOS() {
  document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
      duration: 1000,  // Animation duration
      once: true,      // Only animate on first scroll
      offset: 120,     // Offset (in px) from original trigger point
      delay: 200       // Global delay in ms
    });
  });
}

/*************************************************
 * 11) SCROLL PROGRESS BAR
 *************************************************/
function initScrollProgress() {
  const scrollProgress = document.querySelector('.scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    scrollProgress.style.width = `${scrolled}%`;
  });
}

/*************************************************
 * 12) BACK-TO-TOP BUTTON
 *************************************************/
function initBackToTop() {
  const backToTopButton = document.getElementById('back-to-top');

  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.style.display = 'block';
    } else {
      backToTopButton.style.display = 'none';
    }
  });

  // Smooth scroll to top when clicked
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/*************************************************
 * 13) INITIALIZE THE SITE ON SCRIPT LOAD
 *************************************************/
initSite();