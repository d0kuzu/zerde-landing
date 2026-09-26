(() => {
  "use strict";

  const productScreens = {
    reelsResult: {
      title: "Reels · A real client result",
      slides: [
        [
          "reels-results.jpg",
          "Original Instagram screenshots: 55.8K views, 240 likes, 32 shares, and comments requesting a tour link",
          "55.8K views. 32 shares. Real tour inquiries.",
        ],
      ],
    },
    visibility: {
      title: "Search visibility · Cinta Aveda Institute",
      slides: [
        [
          "visibility-chatgpt-01.png",
          "ChatGPT answer listing Cinta Aveda Institute first among Bay Area beauty schools",
          "Cinta Aveda Institute. First in this answer.",
        ],
        [
          "visibility-chatgpt-02.png",
          "ChatGPT comparison table listing Cinta Aveda Institute second among Bay Area beauty schools",
          "Another answer. Cinta Aveda Institute is in the top two.",
        ],
      ],
      rankings: [
        [
          ["Cinta Aveda Institute", "Cinta Aveda Institute"],
          ["Paul Mitchell", "Paul Mitchell The School East Bay"],
          [
            "SF Institute",
            "San Francisco Institute of Esthetics and Cosmetology",
          ],
        ],
        [
          [
            "SF Institute",
            "San Francisco Institute of Esthetics and Cosmetology",
          ],
          ["Cinta Aveda Institute", "Cinta Aveda Institute"],
          ["J D Academy", "J D Academy of Salon and Spa"],
        ],
      ],
    },
    assistant: {
      title: "Booking automation · Client examples",
      slides: [
        [
          "assistant-dashboard.png",
          "Zerde dashboard showing 47 conversations started, 16 appointments booked, and 34 percent conversion in seven days",
          "16 bookings in one 7-day snapshot.",
        ],
        [
          "assistant-conversation-redacted.png",
          "Zerde assistant answering questions about a hairstyling program; customer phone numbers are blurred",
          "A question answered. A conversation moving forward.",
        ],
        [
          "assistant-conversations-redacted.png",
          "Zerde conversation inbox with agent, status, and message counts; all customer phone numbers are blurred",
          "Every conversation, in one place.",
        ],
      ],
    },
  };
  const assetPath = "assets/products/";
  const dialog = document.querySelector(".lightbox");
  const modalImage = document.querySelector("#lightbox-image");
  const imageWrap = dialog.querySelector(".lightbox-image-wrap");
  const zoomButton = dialog.querySelector("[data-lightbox-zoom]");
  let activeGallery = null;
  let modalIndex = 0;
  let modalOpener = null;
  const galleries = [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const slideLoads = new Map();
  const slideInterval = 6000;

  function cancelGalleryChange(gallery) {
    gallery.changeId += 1;
    clearTimeout(gallery.fadeTimer);
    gallery.panel.classList.remove("is-changing");
    gallery.changing = false;
    gallery.requestedIndex = gallery.index;
  }

  function canAutoAdvance(gallery) {
    const focused =
      gallery.element.contains(document.activeElement) &&
      document.activeElement !== gallery.playButton;
    return (
      !gallery.paused &&
      gallery.inView &&
      !gallery.hovered &&
      !focused &&
      !document.hidden &&
      !dialog.open
    );
  }

  function scheduleGallery(gallery) {
    clearTimeout(gallery.autoTimer);
    if (!canAutoAdvance(gallery)) {
      if (gallery.changing && gallery.automaticChange)
        cancelGalleryChange(gallery);
      return;
    }
    if (gallery.changing) return;
    gallery.caption.setAttribute("aria-live", "off");
    gallery.autoTimer = setTimeout(() => {
      changeGallery(gallery, gallery.index + 1, false, true);
    }, slideInterval);
  }

  function loadSlide(product, index) {
    if (product.rankings) return Promise.resolve(true);
    const src = assetPath + product.slides[index][0];
    if (!slideLoads.has(src)) {
      const image = new Image();
      image.src = src;
      const loaded = image.decode().then(
        () => true,
        () => {
          slideLoads.delete(src);
          return false;
        },
      );
      slideLoads.set(src, loaded);
    }
    return slideLoads.get(src);
  }

  async function changeGallery(
    gallery,
    index,
    focusTab = false,
    automatic = false,
  ) {
    const focusOrigin = document.activeElement;
    clearTimeout(gallery.autoTimer);
    cancelGalleryChange(gallery);
    const next =
      (index + gallery.product.slides.length) % gallery.product.slides.length;
    if (next === gallery.index) {
      if (focusTab)
        gallery.element
          .querySelectorAll('[role="tab"]')
          [next].focus({ preventScroll: true });
      scheduleGallery(gallery);
      return;
    }
    gallery.requestedIndex = next;
    gallery.changing = true;
    gallery.automaticChange = automatic;
    const changeId = gallery.changeId;
    const loaded = await loadSlide(gallery.product, next);
    if (gallery.changeId !== changeId) return;
    if (!loaded || (automatic && !canAutoAdvance(gallery))) {
      cancelGalleryChange(gallery);
      scheduleGallery(gallery);
      return;
    }
    const commit = () => {
      if (gallery.changeId !== changeId) return;
      gallery.changing = false;
      gallery.caption.setAttribute("aria-live", automatic ? "off" : "polite");
      renderGallery(
        gallery,
        next,
        focusTab && document.activeElement === focusOrigin && !dialog.open,
      );
      gallery.panel.classList.remove("is-changing");
      scheduleGallery(gallery);
    };
    if (reducedMotion.matches) {
      commit();
    } else {
      gallery.panel.classList.add("is-changing");
      gallery.fadeTimer = setTimeout(commit, 220);
    }
  }

  function updatePlayButton(gallery) {
    const label = gallery.paused ? "Play slideshow" : "Pause slideshow";
    gallery.playButton.setAttribute("aria-label", label);
    gallery.playButton.title = label;
    gallery.playButton
      .querySelector("use")
      .setAttribute("href", gallery.paused ? "#i-play" : "#i-pause");
  }

  const galleryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const gallery = galleries.find((item) => item.element === entry.target);
        gallery.inView = entry.isIntersecting && entry.intersectionRatio >= 0.2;
        scheduleGallery(gallery);
      });
    },
    { threshold: 0.2 },
  );

  document.addEventListener("visibilitychange", () =>
    galleries.forEach(scheduleGallery),
  );
  reducedMotion.addEventListener("change", () => {
    galleries.forEach((gallery) => {
      cancelGalleryChange(gallery);
      updatePlayButton(gallery);
      scheduleGallery(gallery);
    });
  });

  function setLightboxZoom(zoomed) {
    dialog.classList.toggle("is-zoomed", zoomed);
    if (zoomButton) {
      zoomButton.setAttribute("aria-pressed", String(zoomed));
      zoomButton.setAttribute("aria-label", zoomed ? "Zoom out" : "Zoom in");
      zoomButton.textContent = zoomed ? "Zoom out" : "Zoom in";
    }
    imageWrap.scrollLeft = 0;
    imageWrap.scrollTop = 0;
  }

  function renderGallery(gallery, index, focusTab = false) {
    const { element, product } = gallery;
    gallery.index = (index + product.slides.length) % product.slides.length;
    const slide = product.slides[gallery.index];
    const img = element.querySelector(".gallery-image img");
    if (img) {
      img.src = assetPath + slide[0];
      img.alt = slide[1];
      img.classList.toggle("portrait", Boolean(slide[3]));
    }
    if (product.rankings) {
      const ranking = product.rankings[gallery.index];
      element.querySelectorAll(".podium-place").forEach((place, index) => {
        const [label, fullName] = ranking[index];
        place.querySelector(".podium-school").textContent = label;
        place.setAttribute("aria-label", `${index + 1}. ${fullName}`);
        place.classList.toggle(
          "is-featured",
          fullName === "Cinta Aveda Institute",
        );
      });
    }
    element.querySelector(".caption-number").textContent =
      `${String(gallery.index + 1).padStart(2, "0")} / ${String(product.slides.length).padStart(2, "0")}`;
    element.querySelector(".gallery-caption p").textContent = slide[2];
    const tabs = [...element.querySelectorAll('[role="tab"]')];
    tabs.forEach((tab, position) => {
      const selected = position === gallery.index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    element
      .querySelector('[role="tabpanel"]')
      .setAttribute("aria-labelledby", tabs[gallery.index].id);
    element
      .querySelector("[data-open-gallery]")
      .setAttribute(
        "aria-label",
        element.dataset.gallery === "visibility"
          ? `See the ChatGPT answer: ${tabs[gallery.index].textContent}`
          : `Enlarge screenshot: ${tabs[gallery.index].textContent}`,
      );
    if (focusTab) tabs[gallery.index].focus({ preventScroll: true });
    // Keep a keyboard-selected tab visible without moving the page vertically.
    const tablist = element.querySelector('[role="tablist"]');
    const selectedTab = tabs[gallery.index];
    const tabBounds = selectedTab.getBoundingClientRect();
    const listBounds = tablist.getBoundingClientRect();
    if (tabBounds.left < listBounds.left)
      tablist.scrollLeft -= listBounds.left - tabBounds.left;
    if (tabBounds.right > listBounds.right)
      tablist.scrollLeft += tabBounds.right - listBounds.right;
  }

  function renderLightbox(index) {
    setLightboxZoom(false);
    const { product } = activeGallery;
    modalIndex = (index + product.slides.length) % product.slides.length;
    const slide = product.slides[modalIndex];
    modalImage.src = assetPath + slide[0];
    modalImage.alt = slide[1];
    document.querySelector("#lightbox-title").textContent = product.title;
    document.querySelector("#lightbox-count").textContent =
      `${modalIndex + 1} / ${product.slides.length}`;
    document.querySelector("#lightbox-caption").textContent = slide[2];
    dialog
      .querySelectorAll("[data-lightbox-prev], [data-lightbox-next]")
      .forEach((button) => {
        button.hidden = product.slides.length < 2;
      });
  }

  function openLightbox(gallery, opener) {
    if (gallery.element) cancelGalleryChange(gallery);
    activeGallery = gallery;
    modalOpener = opener;
    renderLightbox(gallery.index);
    dialog.showModal();
    galleries.forEach(scheduleGallery);
    document.body.classList.add("modal-open");
    dialog.querySelector(".lightbox-close").focus();
  }

  document.querySelectorAll("[data-gallery]").forEach((element) => {
    const product = productScreens[element.dataset.gallery];
    // An empty visibility gallery is intentionally hidden until real proof arrives.
    if (!product?.slides.length) return;

    if (element.dataset.gallery === "visibility") {
      const tablist = element.querySelector('[role="tablist"]');
      const panel = element.querySelector('[role="tabpanel"]');
      product.slides.forEach((slide, index) => {
        const tab = document.createElement("button");
        tab.type = "button";
        tab.id = `visibility-tab-${index}`;
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-controls", panel.id);
        tab.dataset.slide = String(index);
        tab.textContent = `Example ${index + 1}`;
        tablist.append(tab);
      });
      element.hidden = false;
      document
        .querySelectorAll("[data-visibility-fallback]")
        .forEach((fallback) => {
          fallback.hidden = true;
        });
    }

    const gallery = {
      element,
      product,
      index: 0,
      requestedIndex: 0,
      panel: element.querySelector('[role="tabpanel"]'),
      caption: element.querySelector(".gallery-caption"),
      paused: false,
      inView: false,
      hovered: false,
      changeId: 0,
    };
    const tablist = element.querySelector('[role="tablist"]');
    const controls = document.createElement("div");
    controls.className = "gallery-controls";
    const playButton = document.createElement("button");
    playButton.type = "button";
    playButton.className = "gallery-autoplay";
    playButton.setAttribute("data-gallery-autoplay", "");
    playButton.setAttribute("aria-controls", gallery.panel.id);
    playButton.innerHTML =
      '<svg class="icon" aria-hidden="true"><use href="#i-pause" /></svg>';
    gallery.playButton = playButton;
    tablist.before(controls);
    controls.append(tablist, playButton);
    updatePlayButton(gallery);
    playButton.addEventListener("click", () => {
      gallery.paused = !gallery.paused;
      updatePlayButton(gallery);
      scheduleGallery(gallery);
    });
    element.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "mouse") return;
      gallery.hovered = true;
      scheduleGallery(gallery);
    });
    element.addEventListener("pointerleave", (event) => {
      if (event.pointerType !== "mouse") return;
      gallery.hovered = false;
      scheduleGallery(gallery);
    });
    element.addEventListener("focusin", () => scheduleGallery(gallery));
    element.addEventListener("focusout", () =>
      queueMicrotask(() => scheduleGallery(gallery)),
    );
    element.querySelectorAll('[role="tab"]').forEach((tab) => {
      tab.addEventListener("click", () =>
        changeGallery(gallery, Number(tab.dataset.slide)),
      );
      tab.addEventListener("keydown", (event) => {
        let next;
        if (event.key === "ArrowRight") next = gallery.requestedIndex + 1;
        if (event.key === "ArrowLeft") next = gallery.requestedIndex - 1;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = gallery.product.slides.length - 1;
        if (next !== undefined) {
          event.preventDefault();
          changeGallery(gallery, next, true);
        }
      });
    });
    element
      .querySelector("[data-open-gallery]")
      .addEventListener("click", (event) => {
        openLightbox(gallery, event.currentTarget);
      });
    renderGallery(gallery, 0);
    galleries.push(gallery);
    galleryObserver.observe(element);
  });

  document.querySelectorAll("[data-proof-image]").forEach((button) => {
    const product = productScreens[button.dataset.proofImage];
    if (!product?.slides.length) return;
    button.addEventListener("click", () => {
      openLightbox({ product, index: 0 }, button);
    });
  });

  dialog
    .querySelector(".lightbox-close")
    .addEventListener("click", () => dialog.close());
  zoomButton?.addEventListener("click", () => {
    setLightboxZoom(!dialog.classList.contains("is-zoomed"));
  });
  dialog
    .querySelector("[data-lightbox-prev]")
    .addEventListener("click", () => renderLightbox(modalIndex - 1));
  dialog
    .querySelector("[data-lightbox-next]")
    .addEventListener("click", () => renderLightbox(modalIndex + 1));
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      renderLightbox(modalIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (activeGallery?.element) {
      cancelGalleryChange(activeGallery);
      renderGallery(activeGallery, modalIndex);
      activeGallery.requestedIndex = activeGallery.index;
    }
    modalOpener?.focus({ preventScroll: true });
    galleries.forEach(scheduleGallery);
  });

  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#mobile-menu");
  function setMenu(open) {
    menu.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
  }
  menuButton.addEventListener("click", () => setMenu(menu.hidden));
  menu
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      setMenu(false);
      menuButton.focus();
    }
  });
  const desktopQuery = window.matchMedia("(min-width: 761px)");
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });
  const navbar = document.querySelector("#mainNavbar");
  const updateNav = () =>
    navbar.classList.toggle("scrolled", window.scrollY > 15);
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();
})();
