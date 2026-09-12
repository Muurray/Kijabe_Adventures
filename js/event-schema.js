document.addEventListener("DOMContentLoaded", () => {

    if (typeof SITE_CONFIG === "undefined") {

        console.error(
            "SITE_CONFIG is not available. Check config.js loading order."
        );

        return;
    }


    /*
    ==========================================
    EVENT START DATE
    ==========================================
    */

    const startDate = new Date(SITE_CONFIG.eventDate);


    /*
    ==========================================
    EVENT END DATE
    ==========================================
    */

    const endDate = new Date(startDate);

    endDate.setHours(16, 0, 0, 0);


    /*
    ==========================================
    EVENT SCHEMA
    ==========================================
    */

    const eventSchema = {

        "@context": "https://schema.org",

        "@type": "Event",

        "name": SITE_CONFIG.eventTitle,

        "description":
            "Guided Kijabe Hills hiking adventure featuring scenic forest trails, waterfalls, river crossings, escarpment views and panoramic Great Rift Valley viewpoints.",

        "image": [
            "https://kijabeadventures.com/images/kijabe-hills.webp"
        ],

        "startDate": startDate.toISOString(),

        "endDate": endDate.toISOString(),

        "eventAttendanceMode":
            "https://schema.org/OfflineEventAttendanceMode",

        "eventStatus":
            "https://schema.org/EventScheduled",

        "location": {

            "@type": "Place",

            "name": "Kijabe Hills Hiking Route",

            "address": {

                "@type": "PostalAddress",

                "addressLocality": "Kijabe",

                "addressCountry": "KE"

            }

        },

        "offers": {

            "@type": "Offer",

            "url": SITE_CONFIG.eventURL,

            "price": String(SITE_CONFIG.eventPrice),

            "priceCurrency": "KES",

            "availability":
                "https://schema.org/InStock"

        },

        "organizer": {

            "@type": "Organization",

            "name": "Kijabe Adventures",

            "url": "https://kijabeadventures.com",

            "telephone": "+254743980340"

        }

    };


    /*
    ==========================================
    ADD JSON-LD TO PAGE
    ==========================================
    */

    const script =
        document.createElement("script");

    script.type = "application/ld+json";

    script.textContent =
        JSON.stringify(eventSchema);

    document.head.appendChild(script);


    console.log(
        "Event structured data created:",
        eventSchema
    );

});