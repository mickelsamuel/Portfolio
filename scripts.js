/*************************************************
 * ORGANIZED INITIALIZATION
 *************************************************/
function initSite() {
  initMenuToggle();
  initSmoothScroll();
  initThemeSwitcher();
  highlightNavOnScroll();
  initFormHandling();
  hideLoaderOnLoad();
  initTypingAnimation();
  initParticles(); // site-wide
  initAOS();
  initScrollProgress();
  initBackToTop();
}

/*************************************************
 * RESPONSIVE NAV MENU
 *************************************************/
function initMenuToggle() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
}

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
 * THEME SWITCHER (LIGHT / DARK MODE)
 *************************************************/
function initThemeSwitcher() {
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
}

/*************************************************
 * HIGHLIGHT ACTIVE NAV LINK ON SCROLL
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
 * CONTACT FORM HANDLING (FORMSPREE)
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
}

/*************************************************
 * LOADER
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
 * TYPING ANIMATION
 *************************************************/
function initTypingAnimation() {
  const typingText = document.getElementById('typing');
  if (!typingText) return;

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
}

/*************************************************
 * PARTICLES.JS BACKGROUND (SITE-WIDE)
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
 * AOS INITIALIZATION
 *************************************************/
function initAOS() {
  document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 120,
      delay: 200,
    });
  });
}

/*************************************************
 * SCROLL PROGRESS BAR
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
 * BACK-TO-TOP BUTTON
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
 * CALL MAIN INIT
 *************************************************/
initSite();