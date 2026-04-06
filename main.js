document.getElementById('year').textContent = new Date().getFullYear();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
}

const theme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
document.querySelector('.icon-sun').style.display = theme === 'light' ? 'none' : 'block';
document.querySelector('.icon-moon').style.display = theme === 'light' ? 'block' : 'none';

const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const newTheme = isLight ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.querySelector('.icon-sun').style.display = newTheme === 'light' ? 'none' : 'block';
    document.querySelector('.icon-moon').style.display = newTheme === 'light' ? 'block' : 'none';
});

const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = mobileMenu.querySelectorAll('a');
const scrollIndicator = document.querySelector('.scroll-indicator');
const backToTop = document.querySelector('.back-to-top');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    scrollIndicator.classList.toggle('hidden', scrollY > 100);
    backToTop.classList.toggle('visible', scrollY > 500);

    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (scrollY >= top) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    mobileLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const newsletterForm = document.getElementById('newsletter-form');
const newsletterSuccess = document.getElementById('newsletter-success');
const newsletterError = document.getElementById('newsletter-error');

newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('.newsletter-btn');
    btn.disabled = true;
    btn.textContent = 'Subscribing...';

    try {
        const res = await fetch(newsletterForm.action, {
            method: 'POST',
            body: new FormData(newsletterForm),
            headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
            newsletterForm.style.display = 'none';
            newsletterSuccess.classList.add('show');
            newsletterError.classList.remove('show');
        } else {
            throw new Error('Failed');
        }
    } catch {
        newsletterError.classList.add('show');
        newsletterError.textContent = 'Something went wrong. Please try again.';
        btn.disabled = false;
        btn.textContent = 'Subscribe';
    }
});

const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
        const res = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
            contactForm.reset();
            contactSuccess.classList.add('show');
            btn.style.display = 'none';
        } else {
            throw new Error('Failed');
        }
    } catch {
        btn.disabled = false;
        btn.textContent = 'Send Message';
        alert('Something went wrong. Please try again or email us directly.');
    }
});

const cookieBanner = document.getElementById('cookie-banner');
const cookieAccept = document.getElementById('cookie-accept');
const cookieDecline = document.getElementById('cookie-decline');

if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1500);
}

cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieBanner.classList.remove('show');
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://plausible.io/js/script.js';
    script.setAttribute('data-domain', 'nymeer.com');
    document.head.appendChild(script);
});

cookieDecline.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    cookieBanner.classList.remove('show');
});