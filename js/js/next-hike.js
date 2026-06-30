/*
=========================================
Kijabe Adventures
Next Hike Badge
=========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    const badges = document.querySelectorAll(".next-hike-badge");

    if (!badges.length) return;

    if (typeof SITE_CONFIG === "undefined") {

        console.error("SITE_CONFIG not found.");

        badges.forEach(badge => {
            badge.textContent = "Configuration Error";
        });

        return;

    }

    function updateBadges() {

        const now = Date.now();

        const distance = SITE_CONFIG.eventDate - now;

        let daysLeft = Math.ceil(
            distance / (1000 * 60 * 60 * 24)
        );

        if (daysLeft < 0) daysLeft = 0;

        const statusLabel =
            SITE_CONFIG.eventStatus === "almost-full"
                ? "🔴 Almost Full"
                : "🟢 Open";

        badges.forEach(badge => {

            badge.classList.remove("open", "almost-full");

            badge.classList.add(SITE_CONFIG.eventStatus);

            if (distance <= 0) {

                badge.innerHTML = `
                    🌄 ${SITE_CONFIG.eventTitle}<br>
                    🥾 Hiking Today!
                `;

            } else {

                badge.innerHTML = `
                    🌄 ${SITE_CONFIG.eventTitle}<br>
                    ${statusLabel} • 🔥 Only ${daysLeft} ${daysLeft === 1 ? "Day" : "Days"} Left
                `;

            }

        });

    }

    updateBadges();

    setInterval(updateBadges, 60000);

});