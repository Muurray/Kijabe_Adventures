/* =========================================================
   MOUNT LONGONOT SHARE SCRIPT
   Kijabe Adventures
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const shareBtn =
    document.getElementById("longonotShareBtn");

  const facebookBtn =
    document.getElementById("longonotFacebookBtn");

  const whatsappBtn =
    document.getElementById("longonotWhatsappBtn");

  const xBtn =
    document.getElementById("longonotXBtn");

  const linkedinBtn =
    document.getElementById("longonotLinkedInBtn");

  const instagramBtn =
    document.getElementById("longonotInstagramBtn");

const tiktokBtn =
  document.getElementById("longonotTiktokBtn");
  
  const copyBtn =
    document.getElementById("longonotCopyBtn");

  const toast =
    document.getElementById("longonotShareToast");


  const pageURL =
    window.location.href;

  const shareTitle =
    "Mount Longonot Guided Hiking Tour | Kijabe Adventures";

  const shareText =
    "Join Kijabe Adventures for a guided Mount Longonot hiking experience in Kenya.";


  /* ============================
     TOAST
     ============================ */

  function showToast(message) {

    if (!toast) {
      return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);

  }


  /* ============================
     NATIVE SHARE
     ============================ */

  if (shareBtn) {

    shareBtn.addEventListener(
      "click",
      async () => {

        if (
          navigator.share
        ) {

          try {

            await navigator.share({
              title: shareTitle,
              text: shareText,
              url: pageURL
            });

          } catch (error) {

            /*
             * User cancelled the native share dialog.
             * No action required.
             */

          }

        } else {

          await copyPageURL();

        }

      }
    );

  }


  /* ============================
     FACEBOOK
     ============================ */

  if (facebookBtn) {

    facebookBtn.addEventListener(
      "click",
      () => {

        const url =
          "https://www.facebook.com/sharer/sharer.php?u=" +
          encodeURIComponent(pageURL);

        window.open(
          url,
          "_blank",
          "width=650,height=500"
        );

      }
    );

  }


  /* ============================
     WHATSAPP
     ============================ */

  if (whatsappBtn) {

    whatsappBtn.addEventListener(
      "click",
      () => {

        const message =
          `${shareText} ${pageURL}`;

        const url =
          "https://wa.me/?text=" +
          encodeURIComponent(message);

        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );

      }
    );

  }


  /* ============================
     X / TWITTER
     ============================ */

  if (xBtn) {

    xBtn.addEventListener(
      "click",
      () => {

        const url =
          "https://twitter.com/intent/tweet?text=" +
          encodeURIComponent(shareText) +
          "&url=" +
          encodeURIComponent(pageURL);

        window.open(
          url,
          "_blank",
          "width=650,height=500"
        );

      }
    );

  }


  /* ============================
     LINKEDIN
     ============================ */

  if (linkedinBtn) {

    linkedinBtn.addEventListener(
      "click",
      () => {

        const url =
          "https://www.linkedin.com/sharing/share-offsite/?url=" +
          encodeURIComponent(pageURL);

        window.open(
          url,
          "_blank",
          "width=650,height=600"
        );

      }
    );

  }


  /* ============================
     INSTAGRAM
     ============================ */

  if (instagramBtn) {

    instagramBtn.addEventListener(
      "click",
      async () => {

        await copyPageURL();

        showToast(
          "Link copied — paste it into Instagram."
        );

        window.open(
          "https://www.instagram.com/",
          "_blank",
          "noopener,noreferrer"
        );

      }
    );

  }


  /* ============================
     TIKTOK
     ============================ */

  if (tiktokBtn) {

    tiktokBtn.addEventListener(
      "click",
      async () => {

        await copyPageURL();

        showToast(
          "Link copied — paste it into TikTok."
        );

        window.open(
          "https://www.tiktok.com/",
          "_blank",
          "noopener,noreferrer"
        );

      }
    );

  }


  /* ============================
     COPY LINK
     ============================ */

  async function copyPageURL() {

    try {

      await navigator.clipboard.writeText(
        pageURL
      );

      showToast(
        "Link copied successfully!"
      );

    } catch (error) {

      /*
       * Fallback for browsers that
       * restrict clipboard access.
       */

      const textarea =
        document.createElement("textarea");

      textarea.value =
        pageURL;

      textarea.style.position =
        "fixed";

      textarea.style.opacity =
        "0";

      document.body.appendChild(
        textarea
      );

      textarea.select();

      try {
        document.execCommand("copy");

        showToast(
          "Link copied successfully!"
        );

      } catch (copyError) {

        showToast(
          "Copy the page link from your browser."
        );

      }

      textarea.remove();

    }

  }


  if (copyBtn) {

    copyBtn.addEventListener(
      "click",
      copyPageURL
    );

  }

});