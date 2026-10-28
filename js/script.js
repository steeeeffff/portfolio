/* // Menu mobile
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
};
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

// Voce di menu attiva in base alla sezione visibile
const links = [...menu.querySelectorAll('a:not(.btn)')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));
const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => s && spy.observe(s));

// Form contatti -> contact.php
const form = document.getElementById('contactForm');
const status = form.querySelector('.status');
form.addEventListener('submit', async e => {
    e.preventDefault();
    status.className = 'status';
    if (!form.checkValidity()) {
        status.textContent = 'Compila nome, email valida e messaggio.';
        status.classList.add('err');
        return;
    }
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    status.textContent = 'Invio in corso…';
    try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
        const data = await res.json();
        status.textContent = data.message;
        status.classList.add(data.ok ? 'ok' : 'err');
        if (data.ok) form.reset();
    } catch {
        status.textContent = 'Errore di connessione. Riprova tra poco.';
        status.classList.add('err');
    }
    btn.disabled = false;
}) */;

/* (function () {
    var h = document.getElementById('hero'), t = document.getElementById('tag');
    h.addEventListener('pointermove', function (e) {
        var r = h.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        h.style.setProperty('--x', x + 'px'); h.style.setProperty('--y', y + 'px');
        t.textContent = 'x ' + Math.round(x) + ' · y ' + Math.round(y);
    });
})(); */
/* Lenis: scroll fluido (opzionale, disattivato con prefers-reduced-motion) */
if (window.Lenis && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
    var lenis = new Lenis();
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var el = document.querySelector(a.getAttribute('href'));
            if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -64 }); }
        });
    });
}



//form
const params = new URLSearchParams(location.search);
const esito = params.get('status');
const box = document.getElementById('form-status');

const testi = {
    ok: 'Messaggio inviato. Ti rispondo al più presto!',
    invalid: 'Controlla i campi e riprova.',
    error: 'Invio non riuscito. Riprova più tardi.'
};

if (box && testi[esito]) {
    box.textContent = testi[esito];
    box.className = 'form-status ' + (esito === 'ok' ? 'ok' : 'error');
}
