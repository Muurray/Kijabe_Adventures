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
       STICKY MOBILE BAR
    ========================================== */

    const stickyBar = document.querySelector(".mobile-sticky-bar");

    if (stickyBar) {

        let lastScroll = 0;

        window.addEventListener("scroll", () => {

            const currentScroll = window.pageYOffset;

            if (currentScroll > lastScroll && currentScroll > 100) {

                stickyBar.style.transform = "translateY(100%)";

            } else {

                stickyBar.style.transform = "translateY(0)";

            }

            lastScroll = currentScroll;

        });

    }

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