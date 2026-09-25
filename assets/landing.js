(() => {
  "use strict";

  const productScreens = {
    reelsResult: {
      title: "AI Reels · A real client result",
      slides: [
        [
          "reels-results.jpg",
          "Original Instagram screenshots: 55.8K views, 240 likes, 32 shares, and comments requesting a tour link",
          "One Reel: 55.8K views, 240 likes, 32 shares, and viewers asking for the tour link.",
        ],
      ],
    },
    reels: {
      title: "StoryFast by Zerde · Your AI Video Studio",
      slides: [
        [
          "reels-studio.png",
          "StoryFast studio with a completed Reel and controls for footage, script, style, and shots",
          "Your clips, script, and final Reel — in your StoryFast workspace.",
        ],
        [
          "reels-upload.png",
          "StoryFast Media screen for uploading raw footage and adding an optional prompt",
          "Upload your clips to StoryFast and add a prompt to guide your Reel.",
        ],
        [
          "reels-script.png",
          "StoryFast script editor with AI suggestions and controls for shortening or rewriting the script",
          "Find the hook. Refine the script. Make every word sound like your business.",
        ],
        [
          "reels-voices.png",
          "StoryFast AI voice library with preview controls and voice choices",
          "Choose the voice that fits your brand, from a built-in voice library.",
          true,
        ],
        [
          "reels-own-voice.png",
          "StoryFast settings for a custom AI voice, including style and accent",
          "Make it your own: customize your AI voice and its style.",
          true,
        ],
        [
          "reels-dashboard.png",
          "StoryFast dashboard showing drafted and completed Reels in one place",
          "Keep your drafts and finished Reels together, ready for your next post.",
        ],
      ],
    },
    assistant: {
      title: "Inside Zerde · 24/7 Booking Assistant",
      slides: [
        [
          "assistant-dashboard.png",
          "Zerde dashboard showing 47 conversations started, 16 appointments booked, and 34 percent conversion in seven days",
          "Conversations and bookings. A clear view of your week.",
        ],
        [
          "assistant-conversation-redacted.png",
          "Zerde assistant answering questions about a hairstyling program; customer phone numbers are blurred",
          "See how the assistant explains a service and answers a customer’s questions.",
        ],
        [
          "assistant-conversations-redacted.png",
          "Zerde conversation inbox with agent, status, and message counts; all customer phone numbers are blurred",
          "Every conversation in one place, with its status and message history.",
        ],
      ],
    },
  };
  const assetPath = "assets/products/";
  const dialog = document.querySelector(".lightbox");
  const modalImage = document.querySelector("#lightbox-image");
  let activeGallery = null;
  let modalIndex = 0;
  let modalOpener = null;

  function renderGallery(gallery, index, focusTab = false) {
    const { element, product } = gallery;
    gallery.index = (index + product.slides.length) % product.slides.length;
    const slide = product.slides[gallery.index];
    const img = element.querySelector(".gallery-image img");
    img.src = assetPath + slide[0];
    img.alt = slide[1];
    img.classList.toggle("portrait", Boolean(slide[3]));
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
        `Enlarge screenshot: ${tabs[gallery.index].textContent}`,
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
    activeGallery = gallery;
    modalOpener = opener;
    renderLightbox(gallery.index);
    dialog.showModal();
    document.body.classList.add("modal-open");
    dialog.querySelector(".lightbox-close").focus();
  }

  document.querySelectorAll("[data-gallery]").forEach((element) => {
    const gallery = {
      element,
      product: productScreens[element.dataset.gallery],
      index: 0,
    };
    element.querySelectorAll('[role="tab"]').forEach((tab) => {
      tab.addEventListener("click", () =>
        renderGallery(gallery, Number(tab.dataset.slide)),
      );
      tab.addEventListener("keydown", (event) => {
        let next;
        if (event.key === "ArrowRight") next = gallery.index + 1;
        if (event.key === "ArrowLeft") next = gallery.index - 1;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = gallery.product.slides.length - 1;
        if (next !== undefined) {
          event.preventDefault();
          renderGallery(gallery, next, true);
        }
      });
    });
    element
      .querySelector("[data-open-gallery]")
      .addEventListener("click", (event) => {
        openLightbox(gallery, event.currentTarget);
      });
  });

  document.querySelectorAll("[data-proof-image]").forEach((button) => {
    button.addEventListener("click", () => {
      openLightbox(
        { product: productScreens[button.dataset.proofImage], index: 0 },
        button,
      );
    });
  });

  dialog
    .querySelector(".lightbox-close")
    .addEventListener("click", () => dialog.close());
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
    if (activeGallery?.element) renderGallery(activeGallery, modalIndex);
    modalOpener?.focus({ preventScroll: true });
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
  const desktopQuery = window.matchMedia("(min-width: 621px)");
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });
  const navbar = document.querySelector("#mainNavbar");
  const updateNav = () =>
    navbar.classList.toggle("scrolled", window.scrollY > 15);
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();
})();
