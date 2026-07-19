/*
=========================================
Kijabe Adventures
Staff Login Modal
=========================================
*/
document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("staffModal");
    const openBtn = document.getElementById("staffLoginBtn");
    const closeBtn = document.getElementById("closeStaffModal");
    const form = document.getElementById("staffLoginForm");
    const password = document.getElementById("staffPassword");
    const error = document.getElementById("staffError");

    if (!modal || !openBtn) return;

    // Open modal
    openBtn.addEventListener("click", () => {
        modal.classList.add("active");
        password.focus();
    });

    // Close using X
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    // Close by clicking outside
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });

    // Close with ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            modal.classList.remove("active");
        }
    });

    // Fake login
    form.addEventListener("submit", (e) => {

        e.preventDefault();

        error.style.display = "block";

        error.innerHTML = `
            <strong>Access Denied</strong><br>
            Contact the Kijabe Adventures Tech Support Team
            for assistance.
        `;

        password.value = "";
        password.focus();

    });

});