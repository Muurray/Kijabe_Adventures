// === NEXT HIKE CONFIG (EDIT ONLY HERE) ===
const nextHike = {
    title: "Ngong Hills",
    date: "2026-01-15", // YYYY-MM-DD
    status: "open" // open | almost-full
};

// === HELPERS ===
function daysRemaining(hikeDate) {
    const today = new Date();
    const eventDate = new Date(hikeDate);
    const diff = eventDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// === RENDER BADGE ===
document.addEventListener("DOMContentLoaded", () => {
    const badge = document.getElementById("next-hike-badge");
    if (!badge) return;

    const daysLeft = daysRemaining(nextHike.date);

    const statusLabel =
        nextHike.status === "almost-full"
            ? "🔴 Almost Full"
            : "🟢 Open";

    badge.classList.add(
        nextHike.status === "almost-full" ? "almost-full" : "open"
    );

    badge.innerHTML = `
        🌄 ${nextHike.title}<br>
        ${statusLabel} · ⏳ ${daysLeft} days left
    `;
});
