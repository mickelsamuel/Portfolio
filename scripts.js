/****************************************************************************
 * scripts.js
 * ---------
 * All custom JavaScript for your updated portfolio:
 *   - Mobile Menu Toggle
 *   - Smooth scrolling
 *   - Theme switcher (dark/light)
 *   - Highlight nav links on scroll
 *   - Form handling (Formspree)
 *   - Loader
 *   - Typing animation
 *   - Particles.js init
 *   - AOS init
 *   - Scroll progress bar
 *   - Back-to-top button
 *   - Parallax effect on hero image
 ****************************************************************************/

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
  initParallaxHero();
}

/*************************************************
 * 1) RESPONSIVE NAV MENU TOGGLE
 *************************************************/
function initMenuToggle() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

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
 * 4) HIGHLIGHT NAV LINK ON SCROLL
 *************************************************/
function highlightNavOnScroll() {
  const navLinksElements = document.querySelectorAll('.nav-link');

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
 * 10) SCROLL PROGRESS BAR
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
 * 11) BACK-TO-TOP BUTTON
 *************************************************/
function initBackToTop() {
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
}

/*************************************************
 * 12) PARALLAX EFFECT ON HERO IMAGE
 *************************************************/
function initParallaxHero() {
  const imageWrapper = document.querySelector('.image-wrapper');
  if (!imageWrapper) return;

  window.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth - e.pageX) / 30;
    const y = (window.innerHeight - e.pageY) / 30;
    imageWrapper.style.transform = `translate(${x}px, ${y}px)`;
  });
}

/*************************************************
 * 13) INITIALIZE THE SITE
 *************************************************/
initSite();