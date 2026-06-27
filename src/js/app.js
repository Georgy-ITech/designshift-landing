// ==========================================================================
// DesignShift Landing — app.js
// ==========================================================================

const header     = document.getElementById("header");
const themeToggle = document.getElementById("themeToggle");
const burger     = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
const enrollForm = document.getElementById("enrollForm");
const enrollSuccess = document.getElementById("enrollSuccess");
const nameInput  = document.getElementById("nameInput");
const nameError  = document.getElementById("nameError");
const emailInput = document.getElementById("emailInput");
const emailError = document.getElementById("emailError");

// — Theme —

const THEME_KEY = "designshift-theme";

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem(THEME_KEY, theme); } catch { /* silent */ }
}

function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) { applyTheme(stored); return; }
  applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

themeToggle.addEventListener("click", function () {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

// — Header scroll —

window.addEventListener("scroll", function () {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}, { passive: true });

// — Mobile menu —

function closeMenu() {
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  burger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

burger.addEventListener("click", function () {
  const isOpen = mobileMenu.classList.contains("is-open");
  if (isOpen) {
    closeMenu();
  } else {
    mobileMenu.classList.add("is-open");
    mobileMenu.removeAttribute("aria-hidden");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
});

mobileMenu.querySelectorAll(".mobile-menu__link, .btn").forEach(function (el) {
  el.addEventListener("click", closeMenu);
});

// — Smooth anchors —

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    const id = anchor.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (!target) { return; }
    e.preventDefault();
    closeMenu();
    setTimeout(function () {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  });
});

// — Scroll reveal —

const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(function (el) {
  revealObserver.observe(el);
});

// — Form validation —

function showError(input, errorEl, message) {
  input.classList.add("is-error");
  errorEl.textContent = message;
  errorEl.hidden = false;
  input.addEventListener("input", function () {
    input.classList.remove("is-error");
    errorEl.hidden = true;
  }, { once: true });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

enrollForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let valid = true;

  if (nameInput.value.trim().length < 2) {
    showError(nameInput, nameError, "Введите ваше имя");
    valid = false;
  }

  if (!isValidEmail(emailInput.value.trim())) {
    showError(emailInput, emailError, "Введите корректный email");
    if (valid) { emailInput.focus(); }
    valid = false;
  }

  if (!valid) { return; }

  enrollForm.hidden = true;
  enrollSuccess.hidden = false;
});

// — Marquee —

async function initMarquee() {
  await document.fonts.ready;
  const inner = document.querySelector(".marquee__inner");
  if (!inner) return;
  const origin = inner.querySelector(".marquee__track");
  inner.querySelectorAll("[data-clone]").forEach(function (el) { el.remove(); });
  const trackW = origin.getBoundingClientRect().width;
  if (!trackW) return;
  const needed = Math.ceil((window.innerWidth * 3) / trackW);
  for (let i = 1; i < needed; i++) {
    const clone = origin.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.dataset.clone = "true";
    inner.appendChild(clone);
  }
  inner.style.setProperty("--tw", trackW + "px");
}

// — Init —

initTheme();
initMarquee();
