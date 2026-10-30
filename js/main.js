/* Little Minions Learning Center — site script (no build step) */

/* =====================================================================
   CREDENTIAL PHOTOS — edit this list to show license/certificate photos.
   1) Put the image file in assets/credentials/
   2) Add one line per photo, e.g.:
      { src: "assets/credentials/nm-child-care-license.jpg", title: "New Mexico Child Care License", alt: "Photo of the New Mexico child care license" },
   Empty slots show a "coming soon" tile (at least PLACEHOLDER_SLOTS tiles are shown).
   ===================================================================== */
const CREDENTIALS = [
  // { src: "assets/credentials/example.jpg", title: "Certificate name", alt: "Describe the photo" },
];
const PLACEHOLDER_SLOTS = 6;

/* Where enrollment inquiries go (used by the mailto form) */
const OWNER_EMAIL = "cerives1@gmail.com";

(function () {
  "use strict";

  /* ---------- Sticky header shadow ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Credentials gallery ---------- */
  const grid = document.getElementById("cred-grid");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tiles = CREDENTIALS.map((c, i) =>
    `<li class="cred-tile"><button type="button" data-index="${i}" aria-label="View larger: ${esc(c.title || "credential photo")}">` +
    `<img src="${esc(c.src)}" alt="${esc(c.alt || c.title || "License or certificate photo")}" loading="lazy">` +
    (c.title ? `<span class="cap">${esc(c.title)}</span>` : "") + `</button></li>`
  );
  for (let i = CREDENTIALS.length; i < PLACEHOLDER_SLOTS; i++) {
    tiles.push('<li class="cred-tile placeholder"><svg aria-hidden="true"><use href="#i-doc"/></svg><span>License / certificate photo coming soon</span></li>');
  }
  grid.innerHTML = tiles.join("");

  /* ---------- Lightbox ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCap = document.getElementById("lightbox-cap");
  const lbClose = lb.querySelector(".lightbox-close");
  let lastFocus = null;
  const openLb = (i) => {
    const c = CREDENTIALS[i];
    lastFocus = document.activeElement;
    lbImg.src = c.src;
    lbImg.alt = c.alt || c.title || "License or certificate photo";
    lbCap.textContent = c.title || "";
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lbClose.focus();
  };
  const closeLb = () => {
    lb.hidden = true;
    lbImg.removeAttribute("src");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-index]");
    if (btn) openLb(Number(btn.dataset.index));
  });
  lbClose.addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) closeLb(); });

  /* ---------- Enrollment form ---------- */
  const form = document.getElementById("enroll-form");
  const errBox = document.getElementById("form-error");
  const okBox = document.getElementById("form-success");

  form.addEventListener("submit", (e) => {
    errBox.hidden = true;
    okBox.hidden = true;
    const data = new FormData(form);
    const val = (k) => (data.get(k) || "").toString().trim();
    const missing = [];
    [["name", "f-name", "your name"], ["phone", "f-phone", "a phone number"], ["child_age", "f-age", "your child's age"]].forEach(([k, id, label]) => {
      const el = document.getElementById(id);
      const bad = !val(k);
      el.setAttribute("aria-invalid", String(bad));
      if (bad) missing.push(label);
    });
    const emailEl = document.getElementById("f-email");
    const emailBad = val("email") && !emailEl.checkValidity();
    emailEl.setAttribute("aria-invalid", String(!!emailBad));
    if (!val("shift")) missing.push("a preferred shift");

    if (missing.length || emailBad) {
      e.preventDefault();
      errBox.textContent = missing.length
        ? "Please add " + missing.join(", ").replace(/, ([^,]*)$/, " and $1") + "."
        : "Please check the email address.";
      if (emailBad && missing.length) errBox.textContent += " Also check the email address.";
      errBox.hidden = false;
      const firstBad = form.querySelector('[aria-invalid="true"]') || form.querySelector('input[name="shift"]');
      if (firstBad) firstBad.focus();
      return;
    }

    // Formspree (or similar) mode: let the browser post normally.
    if (form.dataset.mode !== "mailto") return;

    e.preventDefault();
    const subject = `Enrollment inquiry from ${val("name")} (${val("shift")})`;
    const body = [
      "Hello Little Minions Learning Center,",
      "",
      "I'm interested in enrolling my child. My details:",
      "",
      `Name: ${val("name")}`,
      `Phone: ${val("phone")}`,
      `Email: ${val("email") || "(not given)"}`,
      `Child's age: ${val("child_age")}`,
      `Preferred shift: ${val("shift")}`,
      "",
      "Message:",
      val("message") || "(none)",
    ].join("\n");
    window.location.href = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    okBox.textContent = "Your email app should open with your inquiry ready to send. If it doesn't, email " + OWNER_EMAIL + " or call 505-369-8606.";
    okBox.hidden = false;
  });

  /* ---------- Reveal-on-scroll ---------- */
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const els = document.querySelectorAll(".section-head, .mini-card, .feature-card, .shift-card, .cred-tile, .contact-info, .enroll-form, .address-card, .map-frame");
    els.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));
  }
})();
