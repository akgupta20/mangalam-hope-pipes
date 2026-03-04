

document.addEventListener("DOMContentLoaded", () => {

  /* --------------------------------------------------------
     1. STICKY HEADER
     --------------------------------------------------------
     - Shows when user scrolls down past 200px
     - Hides when user scrolls back up
     - Closes mobile menu on scroll
  -------------------------------------------------------- */
  const stickyHeader = document.getElementById("sticky-header");
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const headerNav = document.getElementById("header-nav");
  const iconMenu = document.getElementById("icon-menu");
  const iconClose = document.getElementById("icon-close");
  let lastScrollY = 0;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    // Close mobile menu on scroll
    closeMobileMenu();

    if (currentScrollY > 200 && currentScrollY > lastScrollY) {
      // Scrolling DOWN past 200px — show sticky header
      stickyHeader.classList.add("visible");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling UP — hide sticky header
      stickyHeader.classList.remove("visible");
    }

    lastScrollY = currentScrollY;
  }, { passive: true });


  /* --------------------------------------------------------
     5. MOBILE MENU TOGGLE
  -------------------------------------------------------- */
  function closeMobileMenu() {
    headerNav.classList.remove("mobile-open");
    iconMenu.style.display = "block";
    iconClose.style.display = "none";
  }

  hamburgerBtn.addEventListener("click", () => {
    const isOpen = headerNav.classList.toggle("mobile-open");
    iconMenu.style.display = isOpen ? "none" : "block";
    iconClose.style.display = isOpen ? "block" : "none";
  });


  /* --------------------------------------------------------
     2. IMAGE CAROUSEL ZOOM
     --------------------------------------------------------
     - On hover: show a lens following the cursor
     - Show a zoomed preview box beside the image
     - Only active on screens >= 1024px
  -------------------------------------------------------- */
  const heroImage = document.getElementById("hero-zoom-image");
  const zoomLens = document.getElementById("zoom-lens");
  const zoomPreview = document.getElementById("zoom-preview");

  if (heroImage && zoomLens && zoomPreview) {
    // Set the background image of the preview to match the hero image
    zoomPreview.style.backgroundImage = `url("assets/fish-man.jpg")`;

    heroImage.addEventListener("mouseenter", () => {
      if (window.innerWidth >= 1024) {
        zoomLens.style.display = "block";
        zoomPreview.style.display = "block";
      }
    });

    heroImage.addEventListener("mouseleave", () => {
      zoomLens.style.display = "none";
      zoomPreview.style.display = "none";
    });

    heroImage.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 1024) return;

      const rect = heroImage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // Position the lens centered on the cursor
      zoomLens.style.left = `${e.clientX - 50}px`;
      zoomLens.style.top = `${e.clientY - 50}px`;

      // Update zoomed preview background position
      zoomPreview.style.backgroundPosition = `${x}% ${y}%`;
    });
  }


  /* --------------------------------------------------------
     3. FAQ ACCORDION
     --------------------------------------------------------
     - Only one item open at a time
     - Click toggles the active class
     - max-height animation handled via CSS
  -------------------------------------------------------- */
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item, index) => {
    const header = item.querySelector(".accordion-header");

    header.addEventListener("click", () => {
      // If clicking the already-open item, close it
      if (item.classList.contains("active")) {
        item.classList.remove("active");
        return;
      }

      // Close all other items
      accordionItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
      });

      // Open the clicked item
      item.classList.add("active");
    });
  });


  /* --------------------------------------------------------
     4. VERSATILE APPLICATION SLIDER
     --------------------------------------------------------
     - prev/next buttons shift the slider track
     - Full-width slides on mobile, 420px on desktop
     - Wraps around (loops)
  -------------------------------------------------------- */
  const sliderTrack = document.getElementById("slider-track");
  const sliderPrev = document.getElementById("slider-prev");
  const sliderNext = document.getElementById("slider-next");
  const slides = sliderTrack ? sliderTrack.querySelectorAll(".slide") : [];
  let currentSlideIndex = 0;
  const totalSlides = slides.length;

  /**
   * Calculate and apply the translateX value based on viewport width.
   * Mobile: slides take 100% width, so translate by percentage.
   * Desktop (>=768px): slides are 420px wide + 20px margin.
   */
  function updateSliderPosition() {
    if (!sliderTrack) return;

    if (window.innerWidth >= 768) {
      // Desktop: each slide is 420px + 20px gap = 440px offset
      sliderTrack.style.transform = `translateX(-${currentSlideIndex * 420}px)`;
    } else {
      // Mobile: slide takes full width, translate by percentage
      sliderTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }
  }

  if (sliderPrev) {
    sliderPrev.addEventListener("click", () => {
      currentSlideIndex = currentSlideIndex === 0 ? totalSlides - 1 : currentSlideIndex - 1;
      updateSliderPosition();
    });
  }

  if (sliderNext) {
    sliderNext.addEventListener("click", () => {
      currentSlideIndex = currentSlideIndex === totalSlides - 1 ? 0 : currentSlideIndex + 1;
      updateSliderPosition();
    });
  }

  // Update position on window resize (responsive)
  window.addEventListener("resize", updateSliderPosition);


  /* --------------------------------------------------------
     6. DATASHEET MODAL
     --------------------------------------------------------
     - Open modal on button click
     - Close modal on X click or outside click
     - Enable submit button only if email is provided
  -------------------------------------------------------- */
  const downloadBtn = document.getElementById("download-datasheet-btn");
  const modal = document.getElementById("datasheet-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalEmail = document.getElementById("modal-email");
  const modalSubmitBtn = document.getElementById("modal-submit-btn");

  if (downloadBtn && modal && modalCloseBtn && modalEmail && modalSubmitBtn) {
    // Open modal
    downloadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "flex";
      // Prevent background scrolling
      document.body.style.overflow = "hidden";
    });

    // Close modal function
    const closeModal = () => {
      modal.style.display = "none";
      document.body.style.overflow = "";
    };

    // Close on X btn click
    modalCloseBtn.addEventListener("click", closeModal);

    // Close on outside click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Validate email to enable submit button
    modalEmail.addEventListener("input", () => {
      const isValidEmail = modalEmail.checkValidity() && modalEmail.value.trim() !== "";
      if (isValidEmail) {
        modalSubmitBtn.removeAttribute("disabled");
      } else {
        modalSubmitBtn.setAttribute("disabled", "true");
      }
    });

    // Form submission
    const datasheetForm = document.getElementById("datasheet-form");
    if (datasheetForm) {
      datasheetForm.addEventListener("submit", (e) => {
        e.preventDefault();
        // Form submission logic
        alert("Thanks! The catalogue will be sent to your email.");
        closeModal();
        datasheetForm.reset();
        modalSubmitBtn.setAttribute("disabled", "true");
      });
    }
  }


  /* --------------------------------------------------------
     7. QUOTE MODAL
     --------------------------------------------------------
     - Open modal on 'Request a Quote' button click
     - Close modal on X click or outside click
     - Enable submit button if Name, Email, and Phone are filled
  -------------------------------------------------------- */
  const quoteBtn = document.getElementById("request-quote-btn");
  const quoteModal = document.getElementById("quote-modal");
  const quoteModalCloseBtn = document.getElementById("quote-modal-close-btn");
  const quoteName = document.getElementById("quote-name");
  const quoteEmail = document.getElementById("quote-email");
  const quotePhone = document.getElementById("quote-phone");
  const quoteSubmitBtn = document.getElementById("quote-submit-btn");

  if (quoteBtn && quoteModal && quoteModalCloseBtn && quoteName && quoteEmail && quotePhone && quoteSubmitBtn) {
    // Open modal
    quoteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      quoteModal.style.display = "flex";
      document.body.style.overflow = "hidden";
    });

    // Close modal function
    const closeQuoteModal = () => {
      quoteModal.style.display = "none";
      document.body.style.overflow = "";
    };

    // Close on X btn click
    quoteModalCloseBtn.addEventListener("click", closeQuoteModal);

    // Close on outside click
    quoteModal.addEventListener("click", (e) => {
      if (e.target === quoteModal) {
        closeQuoteModal();
      }
    });

    // Validate required fields to enable submit button
    const validateQuoteForm = () => {
      const isNameValid = quoteName.value.trim() !== "";
      const isEmailValid = quoteEmail.checkValidity() && quoteEmail.value.trim() !== "";
      const isPhoneValid = quotePhone.value.trim() !== "";

      if (isNameValid && isEmailValid && isPhoneValid) {
        quoteSubmitBtn.removeAttribute("disabled");
      } else {
        quoteSubmitBtn.setAttribute("disabled", "true");
      }
    };

    quoteName.addEventListener("input", validateQuoteForm);
    quoteEmail.addEventListener("input", validateQuoteForm);
    quotePhone.addEventListener("input", validateQuoteForm);

    // On submit
    const quoteForm = document.getElementById("quote-form");
    if (quoteForm) {
      quoteForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Thank you! Our team will contact you shortly.");
        closeQuoteModal();
        quoteForm.reset();
        quoteSubmitBtn.setAttribute("disabled", "true");
      });
    }
  }

});
