// Intersection Observer for scroll reveals
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
});

// Navbar hide/show on scroll
let lastScroll = 0;
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        navbar.classList.add('bg-toma-darker/90');
        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
    } else {
        navbar.classList.remove('bg-toma-darker/90');
        navbar.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
}, { passive: true });

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('opacity-0');
    mobileMenu.classList.toggle('pointer-events-none');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.add('opacity-0');
        mobileMenu.classList.add('pointer-events-none');
    });
});

// ── Animaciones con scroll (GSAP) ──
// Si GSAP no carga, la página queda completa y estática: nada depende de esto para verse.
if (window.gsap && window.ScrollTrigger && window.SplitText) {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        // Hero: la foto se aleja y el contenido se desvanece al bajar
        gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } })
            .fromTo('[data-hero-img]', { scale: 1.05, yPercent: 0 }, { scale: 1.2, yPercent: 8, ease: 'none' }, 0)
            .to('[data-hero-content]', { yPercent: -25, opacity: 0, ease: 'none' }, 0);

        // Cinta roja: se acelera y se inclina según la velocidad del scroll
        const band = document.querySelector('[data-marquee]');
        const track = band.querySelector('.marquee-track');
        track.style.animation = 'none';
        const loop = gsap.to(track, { xPercent: -50, duration: 20, ease: 'none', repeat: -1 });
        const skewTo = gsap.quickTo(band, 'skewX', { duration: 0.4, ease: 'power3' });
        ScrollTrigger.create({
            onUpdate: self => {
                const v = self.getVelocity();
                gsap.to(loop, {
                    timeScale: 1 + Math.min(Math.abs(v) / 400, 5), duration: 0.2, overwrite: true,
                    onComplete: () => gsap.to(loop, { timeScale: 1, duration: 1 })
                });
                skewTo(gsap.utils.clamp(-8, 8, v / -300));
            }
        });
        ScrollTrigger.addEventListener('scrollEnd', () => skewTo(0));
        band.addEventListener('mouseenter', () => loop.pause());
        band.addEventListener('mouseleave', () => loop.play());

        // La banda: el título sube línea por línea y la foto pasa de gris a color
        gsap.from('[data-lines] .mask-line > span', {
            yPercent: 110, duration: 1, ease: 'expo.out', stagger: 0.12,
            scrollTrigger: { trigger: '[data-lines]', start: 'top 85%' }
        });
        gsap.to('[data-bw]', {
            opacity: 0, ease: 'none',
            scrollTrigger: { trigger: '[data-colorize]', start: 'top 75%', end: 'center 35%', scrub: true }
        });

        // Música: las carátulas caen como discos sobre la mesa
        gsap.from('[data-release]', {
            y: 90, opacity: 0, rotation: i => [-6, 4, -3, 5][i % 4],
            duration: 1, ease: 'back.out(1.4)', stagger: 0.12,
            scrollTrigger: { trigger: '#music .grid', start: 'top 85%' }
        });

        // Cita: la foto de fondo se desplaza, las palabras se encienden y el subrayado se pinta
        const quote = document.querySelector('[data-words]');
        gsap.fromTo('[data-parallax-bg]', { yPercent: -8, scale: 1.2 }, {
            yPercent: 8, scale: 1.2, ease: 'none',
            scrollTrigger: { trigger: quote.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true }
        });
        document.fonts.ready.then(() => {
            const split = SplitText.create(quote, { type: 'words' });
            gsap.fromTo(split.words, { opacity: 0.15 }, {
                opacity: 1, stagger: 0.1, ease: 'none',
                scrollTrigger: { trigger: quote, start: 'top 80%', end: 'bottom 50%', scrub: true }
            });
            gsap.fromTo(quote.querySelector('.paint-underline'), { backgroundSize: '0% 6px' }, {
                backgroundSize: '100% 6px', ease: 'none',
                scrollTrigger: { trigger: quote, start: 'top 60%', end: 'bottom 45%', scrub: true }
            });
        });

        // En vivo: cada foto se mueve a una velocidad distinta dentro de su marco
        gsap.utils.toArray('#live [data-speed]').forEach(img => {
            const range = 4 * Number(img.dataset.speed);
            gsap.fromTo(img, { yPercent: -range }, {
                yPercent: range, ease: 'none',
                scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
            });
        });

        // Cifras: cuentan desde cero al aparecer
        document.querySelectorAll('[data-count]').forEach(el => {
            const counter = { value: 0 };
            const suffix = el.dataset.suffix;
            el.textContent = '0' + suffix;
            gsap.to(counter, {
                value: Number(el.dataset.count), duration: 1.6, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 90%' },
                onUpdate: () => { el.textContent = Math.round(counter.value) + suffix; }
            });
        });
    });
}
