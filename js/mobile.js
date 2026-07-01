/* ======================================================
   MOBILE.JS
   Shared mobile functionality for all pages
   ====================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       MOBILE NAVIGATION
    ========================================== */

    const navToggle = document.querySelector(".nav-toggle");
    const primaryNav = document.getElementById("primary-nav");

    if (navToggle && primaryNav) {

        navToggle.addEventListener("click", () => {

            const isOpen =
                navToggle.getAttribute("aria-expanded") === "true";

            navToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            primaryNav.classList.toggle("open");

        });

    }
/* ==========================================
   MOBILE STICKY BOOKING BAR
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const stickyBar = document.querySelector(".mobile-sticky-bar");

    if (!stickyBar) return;

    // Highlight current page button
    const currentPage = window.location.pathname;

    document.querySelectorAll(".sticky-btn").forEach(button => {

        const href = button.getAttribute("href");

        if (href && currentPage.endsWith(href)) {
            button.classList.add("active");
        }

    });

    // Hide bar while scrolling down
    let lastScroll = 0;

    window.addEventListener("scroll", () => {

        const currentScroll = window.scrollY;

        if (currentScroll > lastScroll && currentScroll > 100) {
            stickyBar.classList.add("hidden");
        } else {
            stickyBar.classList.remove("hidden");
        }

        lastScroll = currentScroll;

    });

});

    /* ==========================================
       ACTIVE STICKY BUTTON
    ========================================== */

    const page = window.location.pathname;

    document.querySelectorAll(".sticky-btn").forEach(btn => {

        const href = btn.getAttribute("href");

        if (href && page.endsWith(href)) {

            btn.classList.add("active");

        }

    });

});