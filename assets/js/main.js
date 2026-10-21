/* Maison Aurelle — interactions. No dependencies. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ICON = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M4 12h16M14 6l6 6-6 6"/></svg>',
    out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M7 17 17 7M9 7h8v8"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2M11 8v6M8 11h6"/></svg>',
  };

  /* Header: transparent over the hero, solid once scrolled */
  const header = $(".header");
  const onScroll = () => header && header.classList.toggle("is-solid", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile menu */
  const menuBtn = $(".menu-btn");
  menuBtn?.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  $$(".drawer a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));

  /* Reveal on scroll */
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("is-in"), io.unobserve(e.target))), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" })
    : null;
  const observe = (root = document) => $$(".reveal:not(.is-in)", root).forEach((el) => (io ? io.observe(el) : el.classList.add("is-in")));
  observe();

  /* Rotating slideshow (hero + craftsmanship reel) */
  function slideshow(root, frameSel, ms, onChange) {
    const frames = $$(frameSel, root);
    if (frames.length < 2) return;
    let i = 0;
    let timer;
    const go = (n) => {
      frames[i].classList.remove("is-active");
      i = (n + frames.length) % frames.length;
      frames[i].classList.add("is-active");
      onChange?.(i);
    };
    const start = () => (timer = setInterval(() => go(i + 1), ms));
    start();
    return {
      go: (n) => {
        clearInterval(timer);
        go(n);
        start();
      },
    };
  }
  const hero = $(".hero");
  if (hero) {
    const dots = $$(".hero__dots button", hero);
    const show = slideshow(hero, ".hero__slide", 6000, (i) => dots.forEach((d, k) => d.classList.toggle("is-active", k === i)));
    dots.forEach((d, k) => d.addEventListener("click", () => show?.go(k)));
  }
  const reel = $(".reel");
  if (reel) {
    const bars = $$(".reel__progress span", reel);
    const caps = $$(".reel__caption", reel);
    slideshow(reel, ".reel__frame", 4500, (i) => {
      bars.forEach((b, k) => {
        b.classList.remove("is-active");
        if (k === i) void b.offsetWidth, b.classList.add("is-active");
      });
      caps.forEach((c, k) => (c.hidden = k !== i));
    });
  }

  /* ---------------- Collections (rendered from data/products.json) ---------------- */
  const mount = $("#collections");
  let gallery = [];
  if (mount) {
    fetch("data/products.json")
      .then((r) => r.json())
      .then(({ collections }) => {
        $("#subnav").innerHTML = collections
          .map((c) => `<a href="#${c.id}" data-target="${c.id}">${c.title}<sup>${c.items.length}</sup></a>`)
          .join("");
        mount.innerHTML = collections
          .map(
            (c) => `
          <section class="collection" id="${c.id}" aria-labelledby="h-${c.id}">
            <div class="wrap">
              <div class="section-head">
                <div class="reveal">
                  <p class="eyebrow">${c.number} — ${c.kicker}</p>
                  <h2 class="display h2" id="h-${c.id}">${c.title}</h2>
                </div>
                <p class="lede reveal reveal-d1">${c.intro}</p>
              </div>
              <div class="grid">
                ${c.items
                  .map((p) => {
                    const idx = gallery.push({ ...p, collection: c.title }) - 1;
                    return `
                  <article class="card reveal">
                    <button class="card__media" type="button" data-lb="${idx}" aria-label="View ${p.name} larger">
                      <img src="assets/img/${p.image}-sm.webp" srcset="assets/img/${p.image}-sm.webp 720w, assets/img/${p.image}.webp 1600w" sizes="(min-width: 980px) 30vw, (min-width: 520px) 46vw, 92vw" alt="${p.alt}" loading="lazy" decoding="async" width="720" height="900">
                      ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ""}
                      <span class="card__zoom" aria-hidden="true">${ICON.zoom}</span>
                    </button>
                    <div class="card__body">
                      <h3 class="h3">${p.name}</h3>
                      <p class="card__meta">${p.material}</p>
                      <div class="card__foot">
                        <span class="card__price">${p.price}</span>
                        <a class="buy" href="${p.buyUrl}" target="_blank" rel="noopener">Buy Now ${ICON.out}</a>
                      </div>
                    </div>
                  </article>`;
                  })
                  .join("")}
              </div>
            </div>
          </section>`
          )
          .join("");
        observe(mount);
        $$("[data-lb]", mount).forEach((b) => b.addEventListener("click", () => openLightbox(Number(b.dataset.lb))));

        // Sub-nav highlights the collection in view
        const links = $$("#subnav a");
        const spy = new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              if (e.isIntersecting) links.forEach((l) => l.classList.toggle("is-active", l.dataset.target === e.target.id));
            }),
          { rootMargin: "-45% 0px -50% 0px" }
        );
        $$(".collection", mount).forEach((s) => spy.observe(s));
        if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
      })
      .catch(() => (mount.innerHTML = '<p class="wrap" style="padding:80px 0">The collection could not be loaded. Please refresh.</p>'));
  }

  /* ---------------- Lightbox with zoom ---------------- */
  const lb = $(".lightbox");
  let cur = 0;
  function render() {
    const p = gallery[cur];
    const img = $(".lightbox__stage img", lb);
    img.style.opacity = 0;
    const next = new Image();
    next.onload = () => {
      img.src = next.src;
      img.alt = p.alt;
      img.style.opacity = 1;
    };
    next.src = `assets/img/${p.image}.webp`;
    $(".lightbox__title", lb).textContent = p.name;
    $(".lightbox__sub", lb).textContent = `${p.collection} · ${p.material} · ${p.price}`;
    $(".lightbox__count", lb).textContent = `${String(cur + 1).padStart(2, "0")} / ${String(gallery.length).padStart(2, "0")}`;
    $(".lightbox .buy", lb).href = p.buyUrl;
    $(".lightbox__stage", lb).classList.remove("is-zoomed");
  }
  function openLightbox(i) {
    cur = i;
    render();
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $(".lb-close", lb).focus();
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  if (lb) {
    const stage = $(".lightbox__stage", lb);
    const img = $("img", stage);
    $(".lb-close", lb).addEventListener("click", closeLightbox);
    $(".lb-prev", lb).addEventListener("click", () => ((cur = (cur - 1 + gallery.length) % gallery.length), render()));
    $(".lb-next", lb).addEventListener("click", () => ((cur = (cur + 1) % gallery.length), render()));
    stage.addEventListener("click", (e) => {
      if (e.target !== img) return;
      stage.classList.toggle("is-zoomed");
      if (!stage.classList.contains("is-zoomed")) img.style.transformOrigin = "center";
    });
    stage.addEventListener("mousemove", (e) => {
      if (!stage.classList.contains("is-zoomed")) return;
      const r = img.getBoundingClientRect();
      img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    });
    let x0 = null;
    stage.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    stage.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) $(dx < 0 ? ".lb-next" : ".lb-prev", lb).click();
      x0 = null;
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") $(".lb-next", lb).click();
      if (e.key === "ArrowLeft") $(".lb-prev", lb).click();
    });
  }

  /* ---------------- Contact form ---------------- */
  const form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let ok = true;
      $$("[required]", form).forEach((el) => {
        const field = el.closest(".field");
        const bad = !el.value.trim() || (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
        field.classList.toggle("is-invalid", bad);
        if (bad) ok = false;
      });
      if (!ok) return;
      const btn = $("button[type=submit]", form);
      btn.disabled = true;
      btn.firstChild.textContent = "Sending… ";
      // Posts to the form endpoint in the form's action (Formspree / Netlify / Basin). Demo endpoints just show the thank-you.
      try {
        if (!form.action.includes("YOUR_FORM_ID")) {
          await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        }
      } catch {
        /* still thank the visitor; the studio follows up by email */
      }
      form.closest(".form").classList.add("is-sent");
    });
    $$("input, textarea", form).forEach((el) => el.addEventListener("input", () => el.closest(".field")?.classList.remove("is-invalid")));
  }

  /* Year in footer */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
