const CONTACT_EMAIL = "doubafly@gmail.com";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* Menu mobile */
const menuButton = $(".mobile-menu-button");
const navWrapper = $(".nav-wrapper");

function setMenu(open) {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    navWrapper.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
}
menuButton.addEventListener("click", () =>
    setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
$$(".nav-links a, .nav-cta").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => e.key === "Escape" && setMenu(false));

/* Apparition au scroll, avec décalage entre frères */
const revealTargets = $$(
    ".section-title, .project, .stack > div, .about-text p, .contact-lead, .email-big, .contact-actions, .hero-links"
);
revealTargets.forEach(el => {
    el.classList.add("reveal");
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains("reveal") || revealTargets.includes(c));
    el.style.setProperty("--d", `${Math.min(siblings.indexOf(el), 5) * 90}ms`);
});

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });
revealTargets.forEach(el => revealObserver.observe(el));

/* Header + barre de progression */
const header = $(".site-header");
const progress = $(".scroll-progress");

function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 30);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Lien de navigation actif */
const navMap = new Map($$(".nav-links a").map(a => [a.getAttribute("href").slice(1), a]));
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const link = navMap.get(entry.target.id);
        if (link && entry.isIntersecting) {
            navMap.forEach(l => l.classList.remove("is-active"));
            link.classList.add("is-active");
        }
    });
}, { rootMargin: "-45% 0px -50% 0px" });
navMap.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
});

/* Copier l'adresse email */
const copyBtn = $("#copy-email");
const copyStatus = $("#copy-status");
let copyTimer;

copyBtn.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
        copyBtn.textContent = "Adresse copiée ✓";
        copyStatus.textContent = "Adresse copiée dans le presse-papiers.";
    } catch {
        copyStatus.textContent = `Copie impossible. Mon adresse : ${CONTACT_EMAIL}`;
    }
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
        copyBtn.textContent = "Copier l'adresse";
        copyStatus.textContent = "";
    }, 2500);
});
