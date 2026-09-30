// Menu mobile
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
});