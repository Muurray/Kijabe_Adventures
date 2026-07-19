/*
=========================================
Kijabe Adventures
Social Sharing Widget
=========================================
*/
(() => {

    const pageURL = SITE_CONFIG.eventURL;
    const title = SITE_CONFIG.eventTitle;
    const eventDate = SITE_CONFIG.eventDate;

    /**
     * Returns a live countdown string.
     */
    function getCountdown() {

       const EVENT_DATE = SITE_CONFIG.eventDate;

        const now = Date.now();

        const distance = EVENT_DATE - now;

        if (distance <= 0) {

            return "🎉 The hike is happening now!";

        }

        const days =
            Math.floor(distance / (1000 * 60 * 60 * 24));

        const hours =
            Math.floor(
                (distance % (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
            );

        const minutes =
            Math.floor(
                (distance % (1000 * 60 * 60)) /
                (1000 * 60)
            );

        return `${days} days ${hours} hrs ${minutes} mins remaining`;

    }

function shareText() {

    return `🥾 ${title}

📅 ${eventDate}

🔥 ${getCountdown()}

✅ Guided hike
✅ Beginner friendly
✅ Book online

🌍 ${pageURL}`;

}
    /* ========================================= */

    const shareBtn = document.getElementById("shareBtn");
    const facebookBtn = document.getElementById("facebookBtn");
    const whatsappBtn = document.getElementById("whatsappBtn");
    const xBtn = document.getElementById("xBtn");
    const linkedinBtn = document.getElementById("linkedinBtn");
    const copyBtn = document.getElementById("copyBtn");

    if (shareBtn) {

        shareBtn.addEventListener("click", async () => {

            if (navigator.share) {

                try {

                    await navigator.share({
                        title,
                        text: shareText(),
                        url: pageURL
                    });

                } catch (e) {
                    console.log(e);
                }

            } else {

                window.open(
                    "https://www.facebook.com/sharer/sharer.php?u=" +
                    encodeURIComponent(pageURL),
                    "_blank"
                );

            }

        });

    }

    if (facebookBtn) {

        facebookBtn.onclick = () => {

            window.open(
                "https://www.facebook.com/sharer/sharer.php?u=" +
                encodeURIComponent(pageURL),
                "_blank"
            );

        };

    }

    if (whatsappBtn) {

        whatsappBtn.onclick = () => {

            window.open(
                "https://wa.me/?text=" +
                encodeURIComponent(shareText()),
                "_blank"
            );

        };

    }

    if (xBtn) {

        xBtn.onclick = () => {

            window.open(
                "https://twitter.com/intent/tweet?text=" +
                encodeURIComponent(shareText()),
                "_blank"
            );

        };

    }

    if (linkedinBtn) {

        linkedinBtn.onclick = () => {

            window.open(
                "https://www.linkedin.com/sharing/share-offsite/?url=" +
                encodeURIComponent(pageURL),
                "_blank"
            );

        };

    }

    if (copyBtn) {

        copyBtn.onclick = async () => {

            try {

                await navigator.clipboard.writeText(pageURL);

                copyBtn.textContent = "✅ Link Copied!";

                setTimeout(() => {

                    copyBtn.textContent = "🔗 Copy Link";

                }, 2000);

            } catch (err) {

                alert("Unable to copy the link.");

            }

        };

    }

})();