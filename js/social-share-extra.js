/* =========================================================
   INSTAGRAM / TIKTOK SHARE
   ---------------------------------------------------------
   Neither platform offers a public "share this URL" web
   endpoint (unlike Facebook/WhatsApp/X/LinkedIn), because
   both are native-app, content-first platforms rather than
   link-sharing platforms.

   This does the closest real equivalent:
     1. Copies the current page link to the clipboard
     2. Attempts to open the Instagram/TikTok app
        (falls back to the website if the app isn't
        installed, or on desktop)
     3. Shows a small toast telling the visitor to paste
        the link into their Story / bio / caption
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const toastEl = document.getElementById("shareToast");

  function showToast(message, duration = 3200) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toastEl.classList.remove("visible");
    }, duration);
  }

  async function copyLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (err) {
      // Fallback for older/unsupported browsers
      const temp = document.createElement("textarea");
      temp.value = url;
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      document.body.appendChild(temp);
      temp.focus();
      temp.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (e) {
        ok = false;
      }
      document.body.removeChild(temp);
      return ok;
    }
  }

  // Tries the app deep link first; if the app doesn't open within
  // ~1.5s (e.g. not installed, or on desktop), falls back to the website.
  function openAppOrFallback(deepLink, webFallback) {
    const start = Date.now();
    let didHide = false;

    const onVisibilityChange = () => {
      if (document.hidden) didHide = true;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    window.location.href = deepLink;

    setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      // If the page never lost visibility, the app almost certainly
      // isn't installed (or this is desktop) — send them to the web version.
      if (!didHide && Date.now() - start < 2000) {
        window.location.href = webFallback;
      }
    }, 1200);
  }

  async function shareToApp({ label, deepLink, webFallback, instructions }) {
    const copied = await copyLink();
    showToast(
      copied
        ? `🔗 Link copied! Opening ${label} — ${instructions}`
        : `Opening ${label} — copy this page's link and ${instructions}`
    );
    openAppOrFallback(deepLink, webFallback);
  }

  const instagramBtn = document.getElementById("instagramBtn");
  if (instagramBtn) {
    instagramBtn.addEventListener("click", () => {
      shareToApp({
        label: "Instagram",
        // Opens the IG camera/story composer on mobile if the app is installed
        deepLink: "instagram://camera",
        webFallback: "https://www.instagram.com/",
        instructions: "paste it into your Story or bio",
      });
    });
  }

  const tiktokBtn = document.getElementById("tiktokBtn");
  if (tiktokBtn) {
    tiktokBtn.addEventListener("click", () => {
      shareToApp({
        label: "TikTok",
        // Opens TikTok's upload flow on mobile if the app is installed
        deepLink: "snssdk1128://",
        webFallback: "https://www.tiktok.com/upload",
        instructions: "paste it into your video caption",
      });
    });
  }

});
