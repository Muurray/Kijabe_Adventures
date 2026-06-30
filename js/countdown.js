/*
=========================================
Kijabe Adventures
Countdown Timer
=========================================
*/

(() => {

    // =====================================
    // EVENT SETTINGS
    // =====================================
    const EVENT_DATE = SITE_CONFIG.eventDate;

    const EVENT_STARTED_TEXT = "🎉 Event In Progress!";

    // =====================================
    // ELEMENTS
    // =====================================

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    const badge = document.querySelector(".featured-event-badge");

    // Exit quietly if countdown isn't on this page
    if (!daysEl || !hoursEl || !minutesEl) {
        return;
    }

    // =====================================
    // UPDATE COUNTDOWN
    // =====================================

    function updateCountdown() {

        const now = Date.now();

        const distance = EVENT_DATE - now;

        if (distance <= 0) {

            daysEl.textContent = "0";
            hoursEl.textContent = "0";
            minutesEl.textContent = "0";

            if (secondsEl) {
                secondsEl.textContent = "0";
            }

            if (badge) {
                badge.textContent = EVENT_STARTED_TEXT;
            }

            clearInterval(timer);

            return;

        }

        const days = Math.floor(
            distance / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

        const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        const seconds = Math.floor(
            (distance % (1000 * 60)) /
            1000
        );

        daysEl.textContent = days;
        hoursEl.textContent = hours;
        minutesEl.textContent = minutes;

        if (secondsEl) {
            secondsEl.textContent = seconds;
        }

    }

    // =====================================
    // START TIMER
    // =====================================

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

})();