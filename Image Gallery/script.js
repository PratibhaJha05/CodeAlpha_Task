// Global variables
let currentImages = [];
let currentIndex = 0;

// Initialize the gallery
document.addEventListener("DOMContentLoaded", function () {
  // Set up filter buttons
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Filter gallery items
      const filter = this.dataset.filter;
      const galleryItems = document.querySelectorAll(".gallery-item");

      galleryItems.forEach((item) => {
        if (filter === "all" || item.dataset.category === filter) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // Set up lightbox for all gallery items
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", function () {
      // Get all visible images (respecting current filter)
      const filter =
        document.querySelector(".filter-btn.active").dataset.filter;
      currentImages = Array.from(document.querySelectorAll(".gallery-item"))
        .filter((el) => filter === "all" || el.dataset.category === filter)
        .filter((el) => window.getComputedStyle(el).display !== "none")
        .map((el) => ({
          src: el.querySelector("img").src,
          alt: el.querySelector("img").alt,
          title: el.querySelector("h3").textContent,
          category: el.dataset.category,
        }));

      // Find the clicked image index
      currentIndex = currentImages.findIndex(
        (img) => img.src === this.querySelector("img").src
      );

      openLightbox();
    });
  });
});

// Lightbox functions
function openLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxCounter = document.getElementById("lightbox-counter");

  lightboxImage.src = currentImages[currentIndex].src;
  lightboxImage.alt = currentImages[currentIndex].alt;
  lightboxTitle.textContent = currentImages[currentIndex].title;
  lightboxCounter.textContent = `${currentIndex + 1} of ${
    currentImages.length
  }`;

  lightbox.style.opacity = "1";
  lightbox.style.pointerEvents = "auto";
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.style.opacity = "0";
  lightbox.style.pointerEvents = "none";
  document.body.style.overflow = "auto";
}

function navigateLightbox(direction) {
  currentIndex += direction;

  // Handle wrap-around
  if (currentIndex < 0) {
    currentIndex = currentImages.length - 1;
  } else if (currentIndex >= currentImages.length) {
    currentIndex = 0;
  }

  openLightbox();
}

// Keyboard navigation for lightbox
document.addEventListener("keydown", function (e) {
  const lightbox = document.getElementById("lightbox");
  if (lightbox.style.opacity === "1") {
    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      navigateLightbox(-1);
    } else if (e.key === "ArrowRight") {
      navigateLightbox(1);
    }
  }
});
