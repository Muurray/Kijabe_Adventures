/*
=========================================================
Kijabe Adventures
Staff Login Modal
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("staffModal");
    const openBtn = document.getElementById("staffLoginBtn");
    const closeBtn = document.getElementById("closeModal");
    const loginForm = document.getElementById("staffLoginForm");
    const passwordInput = document.getElementById("staffPassword");
    const errorMessage = document.getElementById("staffError");

    if (!modal || !openBtn) return;

    // Open modal
    openBtn.addEventListener("click", () => {

        modal.classList.add("active");

        if (errorMessage) {
            errorMessage.style.display = "none";
            errorMessage.textContent = "";
        }

        if (loginForm) loginForm.reset();

        setTimeout(() => {
            if (passwordInput) passwordInput.focus();
        }, 100);

    });

    // Close modal
    function closeModal() {

        modal.classList.remove("active");

        if (loginForm) loginForm.reset();

        if (errorMessage) {
            errorMessage.style.display = "none";
            errorMessage.textContent = "";
        }

    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    });

    // Block all logins
    if (loginForm) {

        loginForm.addEventListener("submit", (e) => {

            e.preventDefault();

            if (errorMessage) {

                errorMessage.style.display = "block";

                errorMessage.innerHTML =
                    "❌ <strong>Access Denied.</strong><br>" +
                    "Please contact our Tech Support team for assistance.";

            }

            if (passwordInput) {
                passwordInput.value = "";
                passwordInput.focus();
            }

        });

    }

});