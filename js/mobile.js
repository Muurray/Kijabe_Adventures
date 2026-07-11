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

            document.body.classList.toggle("menu-open");

        });

    }

    /* ==========================================
       MOBILE STICKY BOOKING BAR
    ========================================== */

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

    let lastScroll = 0;

    window.addEventListener("scroll", () => {

        const currentScroll = window.scrollY;

        // Show bar after scrolling down a little
        if (currentScroll > 300) {
            stickyBar.classList.add("show");
        } else {
            stickyBar.classList.remove("show");
        }

        // Hide while scrolling down
        if (currentScroll > lastScroll && currentScroll > 450) {
            stickyBar.classList.add("hidden");
        } else {
            stickyBar.classList.remove("hidden");
        }

        lastScroll = currentScroll;

    });

});