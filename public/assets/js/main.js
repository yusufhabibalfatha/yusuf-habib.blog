document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  const syncThemeMeta = () => {
    if (!themeColorMeta) return;
    const isDark = root.classList.contains("dark");
    themeColorMeta.setAttribute("content", isDark ? "#171310" : "#F7F4EB");
  };

  /* ---------- Dark mode toggle ---------- */
  const themeToggle = document.getElementById("theme-toggle");

  const syncThemeButton = () => {
    syncThemeMeta();
    if (!themeToggle) return;
    const isDark = root.classList.contains("dark");
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Ganti ke tema terang" : "Ganti ke tema gelap"
    );
  };

  if (themeToggle) {
    syncThemeButton();
    themeToggle.addEventListener("click", () => {
      const isDark = root.classList.toggle("dark");
      try {
        localStorage.setItem("theme", isDark ? "dark" : "light");
      } catch (e) {
        /* localStorage tidak tersedia, tema tetap berubah untuk halaman ini */
      }
      syncThemeButton();
    });
  } else {
    syncThemeMeta();
  }

  /* ---------- Menu mobile (hamburger) ---------- */
  const menuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.classList.toggle("hidden", isOpen);
      document.getElementById("icon-hamburger")?.classList.toggle("hidden", !isOpen);
      document.getElementById("icon-close")?.classList.toggle("hidden", isOpen);
    });
  }

  /* ---------- Tombol kembali ke atas ---------- */
  const backToTop = document.getElementById("back-to-top");

  if (backToTop) {
    const toggleBackToTop = () => {
      const show = window.scrollY > 200;
      backToTop.classList.toggle("opacity-0", !show);
      backToTop.classList.toggle("invisible", !show);
      backToTop.classList.toggle("translate-y-2", !show);
    };

    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener("click", () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Navigasi mulus saat dibuka dari Layar Utama iPhone (iOS Standalone) ---------- */
  if (window.navigator.standalone === true) {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }
      const targetUrl = new URL(link.href, window.location.origin);
      if (targetUrl.origin === window.location.origin) {
        event.preventDefault();
        window.location.href = targetUrl.href;
      }
    });
  }

  /* ---------- Registrasi Service Worker untuk PWA / Tambah ke Layar Utama ---------- */
  if (
    "serviceWorker" in navigator &&
    (window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
  ) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }
});
