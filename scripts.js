window.onload = function() {
    var aboutSection = document.getElementById('about');
    var topPos = aboutSection.offsetTop;
    window.scrollTo(0, topPos);
};

function setActiveSection(sectionId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('onclick').includes(sectionId)) {
            btn.classList.add('active');
        }
    });
    document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
};

function checkActiveSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.floating-nav .nav-link');
    let currentSection = '';

    if (window.pageYOffset === 0) {
        currentSection = 'about';
    } else {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (window.pageYOffset >= scrollableHeight) {
            currentSection = 'contact';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                    currentSection = section.getAttribute('id');
                }
            });
        }
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
};

window.addEventListener('scroll', checkActiveSection);
window.addEventListener('load', checkActiveSection);