/* =========================================================
   SHARE BUTTONS — Facebook, WhatsApp, X, LinkedIn,
   Instagram, TikTok, Copy Link
   ---------------------------------------------------------
   Every button that opens an external page opens it in a
   new tab (window.open with "_blank"), so visitors never
   lose their place on this site.

   Instagram/TikTok have no public "share this URL" web
   endpoint (unlike Facebook/WhatsApp/X/LinkedIn) — they're
   native-app, content-first platforms. So those two copy
   the link, open the platform's website in a new tab, and
   show a toast telling the visitor to paste it in.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const pageUrl = window.location.href;
  const pageTitle =
    document.getElementById("featured-event-title")?.textContent.trim() ||
    document.title;

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

  function openNewTab(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      return true;
    } catch (err) {
      const temp = document.createElement("textarea");
      temp.value = pageUrl;
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

  /* ---------- Facebook ---------- */
  document.getElementById("facebookBtn")?.addEventListener("click", () => {
    openNewTab(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`
    );
  });

  /* ---------- WhatsApp ---------- */
  document.getElementById("whatsappBtn")?.addEventListener("click", () => {
    openNewTab(
      `https://wa.me/?text=${encodeURIComponent(`${pageTitle} — ${pageUrl}`)}`
    );
  });

  /* ---------- X (Twitter) ---------- */
  document.getElementById("xBtn")?.addEventListener("click", () => {
    openNewTab(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        pageUrl
      )}&text=${encodeURIComponent(pageTitle)}`
    );
  });

  /* ---------- LinkedIn ---------- */
  document.getElementById("linkedinBtn")?.addEventListener("click", () => {
    openNewTab(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        pageUrl
      )}`
    );
  });

  /* ---------- Instagram ---------- */
  document.getElementById("instagramBtn")?.addEventListener("click", async () => {
    const copied = await copyLink();
    showToast(
      copied
        ? "🔗 Link copied! Paste it into your Instagram Story or bio."
        : "Opening Instagram — copy this page's link and paste it into your Story or bio."
    );
    openNewTab("https://www.instagram.com/");
  });

  /* ---------- TikTok ---------- */
  document.getElementById("tiktokBtn")?.addEventListener("click", async () => {
    const copied = await copyLink();
    showToast(
      copied
        ? "🔗 Link copied! Paste it into your TikTok video caption."
        : "Opening TikTok — copy this page's link and paste it into your video caption."
    );
    openNewTab("https://www.tiktok.com/upload");
  });

  /* ---------- Copy Link ---------- */
  document.getElementById("copyBtn")?.addEventListener("click", async () => {
    const copied = await copyLink();
    showToast(copied ? "🔗 Link copied to clipboard!" : "Couldn't copy the link — try again.");
  });

  /* ---------- Hero share-pill icon button (shareBtn) ---------- */
  document.getElementById("shareBtn")?.addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: pageTitle, url: pageUrl });
        return;
      } catch (err) {
        // User cancelled or share failed — fall through to copy
      }
    }
    const copied = await copyLink();
    showToast(copied ? "🔗 Link copied to clipboard!" : "Couldn't copy the link — try again.");
  });

});
