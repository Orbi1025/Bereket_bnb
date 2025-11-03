// Project Configuration
const PROJECT = {
  token: "BlackRockcoin",
  ticker: "BLKRCK",
  contract: "BLKVeABMHZZFJetDL3Hyz7hidxiUtTQF1HYv6KsJmTaw",
  telegram: "https://t.me/BereketBankBsc",
  twitter: "https://x.com/BereketBnb",
  dex: "#", // Raydium/Orca link
  litepaper: "#", // PDF link
  solscan: "#",
};

// Tokenomics Data for Chart.js
const TOKENOMICS_DATA = {
  labels: ["100% COMMUNITY"],
  data: [100],
  colors: ["#00ffffff"],
};

// DOM Elements
const elements = {
  navbar: document.getElementById("navbar"),
  navLinks: document.querySelectorAll(".nav-link"),
  navToggle: document.getElementById("nav-toggle"),
  navLinksContainer: document.getElementById("nav-links"),
  backToTop: document.getElementById("back-to-top"),
  contractDisplay: document.getElementById("contract-display"),
  contractCopy: document.getElementById("contract-copy"),
  copyButtons: document.querySelectorAll(".copy-btn"),
  newsletterForm: document.getElementById("newsletter-form"),
  newsletterEmail: document.getElementById("newsletter-email"),
  toastContainer: document.getElementById("toast-container"),
  lastUpdatedDate: document.getElementById("last-updated-date"),
  copyrightYear: document.getElementById("copyright-year"),
  faqQuestions: document.querySelectorAll(".faq-question"),
  socialButtons: document.querySelectorAll("[data-social]"),
  footerSocials: document.querySelectorAll(".footer-socials [data-social]"),
};

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initScrollSpy();
  initSmoothAnchors();
  initAccordions();
  initCopyContract();
  initToasts();
  initNewsletter();
  initSocialLinks();
  initBackToTop();
  initTokenomicsChart();
  updateDates();
  initMobileNav();
  initIntersectionObserver();
});

// Scroll Spy for Navigation
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavLink);
  updateActiveNavLink(); // Initial call
}

// Smooth Scrolling for Anchor Links
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });

        // Close mobile menu if open
        if (elements.navLinksContainer.classList.contains("active")) {
          elements.navLinksContainer.classList.remove("active");
        }
      }
    });
  });
}

// FAQ Accordion Functionality
function initAccordions() {
  elements.faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";

      // Close all other accordions
      elements.faqQuestions.forEach((q) => {
        q.setAttribute("aria-expanded", "false");
      });

      // Toggle current accordion
      this.setAttribute("aria-expanded", !isExpanded);
    });
  });
}

// Copy Contract Address Functionality
function initCopyContract() {
  elements.copyButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      try {
        await navigator.clipboard.writeText(PROJECT.contract);
        showToast("Contract address copied to clipboard!", "success");
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = PROJECT.contract;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        showToast("Contract address copied to clipboard!", "success");
      }
    });
  });
}

// Toast Notification System
function initToasts() {
  // Toast functionality is handled by showToast function
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  elements.toastContainer.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Newsletter Form Handling
function initNewsletter() {
  if (elements.newsletterForm) {
    elements.newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = elements.newsletterEmail.value.trim();
      if (validateEmail(email)) {
        // Simulate form submission
        showToast("Thank you for subscribing!", "success");
        elements.newsletterEmail.value = "";
      } else {
        showToast("Please enter a valid email address.", "error");
      }
    });
  }
}

// Email validation helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Social Links Initialization
function initSocialLinks() {
  const socialLinks = {
    telegram: PROJECT.telegram,
    twitter: PROJECT.twitter,
  };

  // Update all social buttons
  [...elements.socialButtons, ...elements.footerSocials].forEach((button) => {
    const socialType = button.getAttribute("data-social");
    if (socialLinks[socialType]) {
      button.href = socialLinks[socialType];
    }
  });
}

// Back to Top Button
function initBackToTop() {
  if (elements.backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 500) {
        elements.backToTop.classList.add("visible");
      } else {
        elements.backToTop.classList.remove("visible");
      }
    });

    elements.backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// Tokenomics Chart with Chart.js
function initTokenomicsChart() {
  const ctx = document.getElementById("tokenomicsChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: TOKENOMICS_DATA.labels,
      datasets: [
        {
          data: TOKENOMICS_DATA.data,
          backgroundColor: TOKENOMICS_DATA.colors,
          borderWidth: 0,
          cutout: "70%",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#f5f7ff",
            font: {
              family: "Plus Jakarta Sans",
              size: 12,
            },
            padding: 20,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          backgroundColor: "#151521",
          titleColor: "#f5f7ff",
          bodyColor: "#f5f7ff",
          borderColor: "#ff7a00",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.parsed}%`;
            },
          },
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
      },
    },
  });
}

// Update Dates
function updateDates() {
  const now = new Date();

  // Update last updated date
  if (elements.lastUpdatedDate) {
    elements.lastUpdatedDate.textContent = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Update copyright year
  if (elements.copyrightYear) {
    elements.copyrightYear.textContent = now.getFullYear();
  }
}

// Mobile Navigation Toggle
function initMobileNav() {
  if (elements.navToggle && elements.navLinksContainer) {
    elements.navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      elements.navLinksContainer.classList.toggle("active");
      elements.navToggle.classList.toggle("active");
    });

    // Close mobile menu when clicking on a link
    elements.navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        elements.navLinksContainer.classList.remove("active");
        elements.navToggle.classList.remove("active");
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !elements.navToggle.contains(e.target) &&
        !elements.navLinksContainer.contains(e.target)
      ) {
        elements.navLinksContainer.classList.remove("active");
        elements.navToggle.classList.remove("active");
      }
    });

    // Close mobile menu on window resize
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        elements.navLinksContainer.classList.remove("active");
        elements.navToggle.classList.remove("active");
      }
    });
  }
}

// Intersection Observer for Animations
function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    ".tokenomics-card, .step, .partner-card, .timeline-item, .faq-item"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// Navbar Background on Scroll
window.addEventListener("scroll", function () {
  if (elements.navbar) {
    if (window.scrollY > 50) {
      elements.navbar.style.background = "rgba(14, 14, 17, 0.98)";
      elements.navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
    } else {
      elements.navbar.style.background = "rgba(14, 14, 17, 0.95)";
      elements.navbar.style.boxShadow = "none";
    }
  }
});

// Respect Reduced Motion Preference
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  // Disable animations for users who prefer reduced motion
  const style = document.createElement("style");
  style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
  document.head.appendChild(style);
}

// Error Handling
window.addEventListener("error", function (e) {
  console.error("JavaScript error:", e.error);
  // You could send this to an error tracking service
});

// Performance Monitoring
window.addEventListener("load", function () {
  // Log page load performance
  if ("performance" in window) {
    const perfData = performance.getEntriesByType("navigation")[0];
    console.log(
      "Page load time:",
      perfData.loadEventEnd - perfData.loadEventStart,
      "ms"
    );
  }
});

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Optimized scroll handlers
const optimizedScrollSpy = throttle(initScrollSpy, 100);
const optimizedNavbarScroll = throttle(function () {
  if (elements.navbar) {
    if (window.scrollY > 50) {
      elements.navbar.style.background = "rgba(14, 14, 17, 0.98)";
      elements.navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
    } else {
      elements.navbar.style.background = "rgba(14, 14, 17, 0.95)";
      elements.navbar.style.boxShadow = "none";
    }
  }
}, 16);

// Replace original scroll handlers with optimized versions
window.removeEventListener("scroll", initScrollSpy);
window.addEventListener("scroll", optimizedScrollSpy);

window.removeEventListener("scroll", function () {
  if (elements.navbar) {
    if (window.scrollY > 50) {
      elements.navbar.style.background = "rgba(14, 14, 17, 0.98)";
      elements.navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
    } else {
      elements.navbar.style.background = "rgba(14, 14, 17, 0.95)";
      elements.navbar.style.boxShadow = "none";
    }
  }
});
window.addEventListener("scroll", optimizedNavbarScroll);
