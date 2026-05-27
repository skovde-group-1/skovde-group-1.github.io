(function () {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const backToTop = document.getElementById("backToTop");
  const zoomableImages = document.querySelectorAll(".zoomable, .content img, .collage img, .reflection-photo");
  const revealTargets = document.querySelectorAll(
    ".content, .content p, .image-row, .highlight, .day-header, .author-block, .intro, .day-entry, .collage, .reflection-row, .credit-entry"
  );

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxImage.alt = "";
  }

  if (lightbox && lightboxImage && lightboxClose) {
    zoomableImages.forEach((img) => {
      img.classList.add("zoomable");

      img.addEventListener("mousemove", (event) => {
        const rect = img.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width;
        const relY = (event.clientY - rect.top) / rect.height;
        img.style.setProperty("--tilt-x", `${(0.5 - relY) * 8}deg`);
        img.style.setProperty("--tilt-y", `${(relX - 0.5) * 8}deg`);
        img.style.setProperty("--img-scale", "1.04");
      });

      img.addEventListener("mouseleave", () => {
        img.style.setProperty("--tilt-x", "0deg");
        img.style.setProperty("--tilt-y", "0deg");
        img.style.setProperty("--img-scale", "1");
      });

      img.addEventListener("click", () => {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt || "Expanded image";
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
      });
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });
  }

  revealTargets.forEach((el) => el.classList.add("reveal-on-scroll"));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));

  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 500);
    });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const heroCta = document.querySelector(".hero-cta");
  if (heroCta) {
    heroCta.addEventListener("click", (event) => {
      const href = heroCta.getAttribute("href");
      if (href && href.startsWith("#")) {
        event.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      heroCta.classList.remove("clicked");
      void heroCta.offsetWidth;
      heroCta.classList.add("clicked");
    });
  }
})();
