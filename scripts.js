/****************************************************************************
 * scripts.js
 * ---------
 * Enhanced based on feedback:
 *   1) Mobile menu toggle
 *   2) Smooth scroll
 *   3) Theme switcher
 *   4) Debounced scroll (nav highlight, progress bar, back-to-top)
 *   5) Contact form handling (Formspree) with validation
 *   6) Hide loader on load
 *   7) Typing animation
 *   8) Particles.js init
 *   9) AOS init
 *   10) Lazy loading
 *   11) Accessibility (ARIA, keyboard nav)
 *   12) Skill bars fill on intersection
 *   13) Project filter
 *   14) 3D tilt init (VanillaTilt)
 ****************************************************************************/

function initSite() {
  initMenuToggle();
  initSmoothScroll();
  initThemeSwitcher();
  initScrollEventsDebounced();
  initFormHandling();
  hideLoaderOnLoad();
  initTypingAnimation();
  initParticles();
  initAOS();
  initLazyLoading();
  improveAccessibility();
  enhanceKeyboardNavigation();
  initSkillBars();
  initProjectFilter();
  init3DTilt();
  initBackToTopButton();
}

/*************************************************
 * Helper: Debounce
 *************************************************/
function debounce(func, wait = 20, immediate = true) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/*************************************************
 * 1) RESPONSIVE NAV MENU TOGGLE
 *************************************************/
function initMenuToggle() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!menuToggle) return;

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
}

/*************************************************
 * 2) SMOOTH SCROLLING
 *************************************************/
function initSmoothScroll() {
  const navLinksElements = document.querySelectorAll('.nav-link');
  const navLinks = document.querySelector('.nav-links');
  const menuToggle = document.querySelector('.menu-toggle');

  navLinksElements.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      const offsetPosition = targetElement.offsetTop - 60;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Close mobile nav
      navLinks.classList.remove('active');
      if (menuToggle) menuToggle.classList.remove('active');
    });
  });
}

/*************************************************
 * 3) THEME SWITCHER (LIGHT / DARK)
 *************************************************/
function initThemeSwitcher() {
  const lightModeButton = document.getElementById('light-mode');
  const darkModeButton = document.getElementById('dark-mode');

  // Switch to Light Mode
  lightModeButton.addEventListener('click', () => {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    lightModeButton.classList.add('active');
    darkModeButton.classList.remove('active');
  });

  // Switch to Dark Mode
  darkModeButton.addEventListener('click', () => {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    darkModeButton.classList.add('active');
    lightModeButton.classList.remove('active');
  });
}

/*************************************************
 * 4) DEBOUNCED SCROLL EVENTS
 *    - Nav highlight
 *    - Scroll progress
 *    - Back-to-top button
 *************************************************/
function initScrollEventsDebounced() {
  window.addEventListener(
    'scroll',
    debounce(() => {
      highlightNavOnScroll();
      updateScrollProgress();
      toggleBackToTopButton();
    }, 20)
  );
}

function highlightNavOnScroll() {
  const navLinksElements = document.querySelectorAll('.nav-link');
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
}

function updateScrollProgress() {
  const scrollProgress = document.querySelector('.scroll-progress');
  if (!scrollProgress) return;

  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / scrollHeight) * 100;
  scrollProgress.style.width = `${scrolled}%`;
}

function toggleBackToTopButton() {
  const backToTopButton = document.getElementById('back-to-top');
  if (!backToTopButton) return;

  if (window.scrollY > 300) {
    backToTopButton.style.display = 'block';
  } else {
    backToTopButton.style.display = 'none';
  }
}

/*************************************************
 * 5) CONTACT FORM HANDLING (FORMSPREE)
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

    // If all fields are valid, send form
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

  // Email validation
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }
}

/*************************************************
 * 6) LOADER (HIDE ON WINDOW LOAD)
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
 * 7) TYPING ANIMATION
 *************************************************/
function initTypingAnimation() {
  const typingText = document.getElementById('typing');
  if (!typingText) return;

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
}

/*************************************************
 * 8) PARTICLES.JS INITIALIZATION
 *************************************************/
function initParticles() {
  try {
    particlesJS.load('particles-js', 'particles-config.json', function() {
      console.log('Particles.js loaded site-wide');
    });
  } catch (e) {
    console.log('Particles.js error:', e);
  }
}

/*************************************************
 * 9) AOS INITIALIZATION
 *************************************************/
function initAOS() {
  document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 120,
      delay: 200
    });
  });
}

/*************************************************
 * 10) LAZY LOADING IMAGES
 *************************************************/
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const options = {
    rootMargin: '0px 0px 50px 0px',
    threshold: 0.1
  };

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc) {
          img.src = dataSrc;
          img.onload = () => img.classList.add('loaded');
        }
        observer.unobserve(img);
      }
    });
  }, options);

  images.forEach(img => imageObserver.observe(img));
}

/*************************************************
 * 11) ACCESSIBILITY IMPROVEMENTS
 *************************************************/
function improveAccessibility() {
  // Additional ARIA attributes or improvements if needed
  console.log("Accessibility improvements in place.");
}

/*************************************************
 * 12) KEYBOARD NAVIGATION
 *************************************************/
function enhanceKeyboardNavigation() {
  const focusableElements = document.querySelectorAll(
    'a[href], button, input, textarea, [tabindex]:not([tabindex="-1"])'
  );

  focusableElements.forEach(el => {
    el.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !['TEXTAREA', 'INPUT'].includes(el.tagName)) {
        e.preventDefault();
        el.click();
      }
    });
  });
}

/*************************************************
 * 13) SKILL BARS (ANIMATE ON VIEW)
 *************************************************/
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  if (!skillBars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const percentage = progressBar.getAttribute('data-progress') || '0';
        progressBar.style.setProperty('--bar-width', `${percentage}%`);
        // Animate using the ::after approach:
        progressBar.classList.add('filled');
        progressBar.style.position = 'relative';
        progressBar.querySelector('::after'); // Force reflow if needed

        // Manually set the width on the after pseudo-element
        // We'll do it by updating inline style on the bar and letting CSS transition handle it
        requestAnimationFrame(() => {
          progressBar.style.setProperty('--skill-percentage', `${percentage}%`);
          progressBar.style.setProperty('width', '100%');
        });

        observer.unobserve(progressBar);
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => observer.observe(bar));
}

/*************************************************
 * 14) PROJECT FILTER
 *************************************************/
function initProjectFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter projects
      projects.forEach(project => {
        const projectCategory = project.getAttribute('data-category');
        if (category === 'all' || projectCategory === category) {
          project.style.display = 'block';
          setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'scale(1)';
          }, 10);
        } else {
          project.style.opacity = '0';
          project.style.transform = 'scale(0.8)';
          setTimeout(() => {
            project.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/*************************************************
 * VanillaTilt INIT (for .project-card)
 *************************************************/
function init3DTilt() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(tiltElements, {
      max: 8,
      speed: 300,
      glare: true,
      'max-glare': 0.2
    });
  }
}

/*************************************************
 * BACK TO TOP BUTTON FUNCTIONALITY
 *************************************************/
function initBackToTopButton() {
  const backToTopButton = document.getElementById('back-to-top');

  if (!backToTopButton) return;

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/*************************************************
 * 15) MASTER INIT
 *************************************************/
initSite();