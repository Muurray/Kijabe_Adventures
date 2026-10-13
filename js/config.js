/*
=========================================
Kijabe Adventures
Global Configuration
=========================================
*/

window.GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyJSwL2gy-l_tA_krrmHnOVWaGRl7R56Es1PndLBCRnpN-EIR6R_S8C_5MBaj1B_00W/exec";

window.saveBookingToGoogleSheet = async function (booking) {
    const formData = new URLSearchParams();

    Object.entries(booking).forEach(([key, value]) => {
        formData.set(key, String(value ?? ""));
    });

    await fetch(window.GOOGLE_SHEETS_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData,
        keepalive: true
    });
};

function getNextHikeDate() {

    const now = new Date();

    let year = now.getFullYear();
    let month = now.getMonth();

    while (true) {

        // First day of the current candidate month
        const hike = new Date(year, month, 1, 9, 30, 0);

        // Move to first Sunday
        hike.setDate(hike.getDate() + ((7 - hike.getDay()) % 7));

        // If this hike is still upcoming, use it
        if (hike > now) {
            return hike;
        }

        // Otherwise move to next month
        month++;

        if (month > 11) {
            month = 0;
            year++;
        }
    }
}

const nextHike = getNextHikeDate();

const SITE_CONFIG = {

    eventTitle: "Kijabe Hills Scenic Group Hike",

    eventDate: nextHike.getTime(),

    eventDateText: nextHike.toLocaleDateString(
        "en-KE",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    ),

    eventPrice: 2000,

    meetingPoint: "Mai Mahiu Parking Area",

    destination: "Kijabe Hills",

    location: "Kijabe Hills",

    eventStatus: "open",

    eventURL: "https://kijabeadventures.com/upcoming-hiking-events.html",

    whatsapp: "254743980340",

    mpesaTill: "5440810",

    bookingFee: 0.30

};