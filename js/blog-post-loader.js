/**
 * ==========================================================
 *  BLOG POST LOADER (Updated + Clean + SEO Ready)
 *  - Loads specific post by ?id=
 *  - Updates SEO tags + JSON-LD schema
 *  - Displays Related Posts
 * ==========================================================
 */

// Read URL parameter (?id=xxxx)
const blogId = new URLSearchParams(window.location.search).get("id");

// DOM elements
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const postContainer = document.getElementById("post-container");

// No ID → Show error
if (!blogId) {
  loadingEl.style.display = "none";
  errorEl.style.display = "block";
} else {
  loadBlogPost();
}

/**
 * Load & render blog post
 */
async function loadBlogPost() {
  try {
    const res = await fetch("../data/blogs.json");
    if (!res.ok) throw new Error("Failed to load blog posts");

    const posts = await res.json();

    // Find specific post
    const post = posts.find(p => p.id === blogId);
    if (!post) {
      loadingEl.style.display = "none";
      errorEl.style.display = "block";
      return;
    }

    // Inject data
    renderPost(post);

    // SEO updates
    updateMetaTags(post);

    // Related articles
    loadRelatedPosts(posts, blogId);

    // Show content
    loadingEl.style.display = "none";
    postContainer.style.display = "block";

    // Scroll top
    window.scrollTo(0, 0);

  } catch (err) {
    console.error("Error:", err);
    loadingEl.style.display = "none";
    errorEl.style.display = "block";
  }
}

/**
 * Render blog post content
 */
function renderPost(post) {
  document.getElementById("blog-title").textContent = post.title;
  document.getElementById("blog-image").src = post.image;
  document.getElementById("blog-image").alt = post.title;
  document.getElementById("blog-content").innerHTML = post.content;

  // Format date
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  document.getElementById("blog-date").textContent = `Published on ${formattedDate}`;
  document.getElementById("blog-author").textContent = post.author || "Kijabe Adventures Team";

  // Insert share buttons for the current post if placeholder exists
  const shareContainer = document.getElementById('blog-share');
  if (shareContainer) {
    const url = window.location.href;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(post.title || document.title);
    shareContainer.innerHTML = `
      <a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener">Share on Facebook</a>
      <a class="share-btn" href="https://wa.me/?text=${encodedTitle}%20${encodedUrl}" target="_blank" rel="noopener">Share on WhatsApp</a>
      <button class="share-btn" type="button" onclick="copyURLTo('${encodedUrl}')">Copy Link</button>
    `;
  }

  // Calculate reading time and insert
  try {
    const text = document.getElementById('blog-content').innerText || '';
    const minutes = Math.max(1, Math.round((text.split(/\s+/).length || 0) / 200));
    const readingEl = document.getElementById('reading-time');
    if (readingEl) readingEl.textContent = ` • ${minutes} min read`;
  } catch (e) { console.error('reading time', e); }

  // Generate Table of Contents based on h2/h3
  generateTOC();

  // Initialize scroll progress
  initScrollProgress();

  // Initialize comments (Firebase or local)
  initComments(post.id);
  // Enable TOC interactions and back-to-top
  enableTOCInteractions();
  initBackToTop();
}

// Smooth scroll for TOC links and active-section highlighting
function enableTOCInteractions() {
  const toc = document.getElementById('post-toc');
  if (!toc) return;

  // Smooth scrolling
  toc.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    const id = a.getAttribute('href').replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#' + id);
  });

  // Active highlight on scroll
  const headings = Array.from(document.getElementById('blog-content').querySelectorAll('h2, h3'));
  if (!headings.length) return;

  function onScroll() {
    const offset = window.scrollY + 120;
    let current = headings[0];
    for (const h of headings) {
      if (h.offsetTop <= offset) current = h;
    }
    const id = current.id;
    toc.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Back-to-top controls
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  function toggle() { btn.style.display = (window.scrollY > 300) ? 'block' : 'none'; }
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
}

/**
 * Update SEO meta tags + JSON-LD schema
 */
function updateMetaTags(post) {
  // Page Title
  document.title = `${post.title} | Kijabe Adventures Blog`;

  // Meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", post.excerpt);

  // OG tags
  updateOg("og:title", post.title);
  updateOg("og:description", post.excerpt);
  updateOg("og:image", post.image);
  updateOg("og:url", window.location.href);

  // Twitter tags
  updateTwitter("twitter:title", post.title);
  updateTwitter("twitter:description", post.excerpt);
  updateTwitter("twitter:image", post.image);

  // JSON-LD Structured Data
  const schemaEl = document.getElementById("article-schema");
  if (schemaEl) {
    // compute word count & reading time
    const text = (post.content || '').replace(/<[^>]+>/g, ' ');
    const wordCount = (text.split(/\s+/).filter(Boolean).length) || 0;
    const readingTime = Math.max(1, Math.round(wordCount / 200));

    schemaEl.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.image,
      "author": {
        "@type": "Organization",
        "name": post.author || "Kijabe Adventures Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Kijabe Adventures",
        "logo": {
          "@type": "ImageObject",
          "url": "https://kijabeadventures.com/images/logo.png"
        }
      },
      "datePublished": post.date,
      "wordCount": wordCount,
      "timeRequired": `PT${readingTime}M`
    });
  }
}

function updateOg(property, value) {
  const tag = document.querySelector(`meta[property="${property}"]`);
  if (tag) tag.setAttribute("content", value);
}

function updateTwitter(name, value) {
  const tag = document.querySelector(`meta[name="${name}"]`);
  if (tag) tag.setAttribute("content", value);
}

/**
 * Load related posts (3)
 */
function loadRelatedPosts(posts, currentId) {
  const relatedContainer = document.getElementById("related-container");

  const related = posts
    .filter(p => p.id !== currentId)
    .slice(0, 3);

  relatedContainer.innerHTML = "";

  if (related.length === 0) {
    relatedContainer.innerHTML = "<p>No related articles available.</p>";
    return;
  }

  related.forEach(post => {
    const formatted = new Date(post.date).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });

    const card = `
      <div class="blog-card">
        <div class="blog-card-image">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
        </div>
        <div class="blog-card-content">
          <span class="blog-date">${formatted}</span>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <a href="blog-post.html?id=${post.id}" class="read-more">Read More →</a>
          <div class="card-share">
            <a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('blog-post.html?id=' + post.id)}" target="_blank" rel="noopener">Facebook</a>
            <a class="share-btn" href="https://wa.me/?text=${encodeURIComponent(post.title + ' ' + ('blog-post.html?id=' + post.id))}" target="_blank" rel="noopener">WhatsApp</a>
            <button class="share-btn" type="button" onclick="copyURLTo('${encodeURIComponent(location.origin + '/blogs/blog-post.html?id=' + post.id)}')">Copy Link</button>
          </div>
        </div>
      </div>
    `;

    relatedContainer.innerHTML += card;
  });
}
function shareFB() {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}`);
}

function shareTwitter() {
  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(location.href)}&text=${document.title}`);
}

function shareWhatsApp() {
  window.open(`https://wa.me/?text=${encodeURIComponent(document.title + " " + location.href)}`);
}

function copyURL() {
  navigator.clipboard.writeText(location.href);
  alert("Link copied!");
}

// Fallback copy helper (used by related-post copy buttons)
window.copyURLTo = window.copyURLTo || function(encodedUrl) {
  try {
    const url = decodeURIComponent(encodedUrl);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => alert('Link copied!'), () => prompt('Copy this link', url));
    } else {
      prompt('Copy this link', url);
    }
  } catch (e) {
    console.error('copyURLTo error', e);
  }
};

/* -----------------------
   Table of Contents
   ----------------------- */
function generateTOC() {
  const tocEl = document.getElementById('post-toc');
  if (!tocEl) return;
  tocEl.innerHTML = '';

  const content = document.getElementById('blog-content');
  if (!content) return;

  const headings = content.querySelectorAll('h2, h3');
  if (!headings.length) { tocEl.style.display = 'none'; return; }

  const ul = document.createElement('ul');
  ul.className = 'toc-list';

  headings.forEach((h, i) => {
    const id = h.id || ('heading-' + i + '-' + (h.tagName.toLowerCase()));
    h.id = id;
    const li = document.createElement('li');
    li.className = 'toc-' + h.tagName.toLowerCase();
    const a = document.createElement('a');
    a.href = '#' + id;
    a.textContent = h.textContent;
    li.appendChild(a);
    ul.appendChild(li);
  });

  tocEl.appendChild(ul);
}

/* -----------------------
   Scroll Progress Bar
   ----------------------- */
function initScrollProgress() {
  const progress = document.getElementById('scroll-progress');
  if (!progress) return;

  function update() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height ? Math.min(100, (scrollTop / height) * 100) : 0;
    progress.style.width = pct + '%';
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* -----------------------
   Comments (Firebase optional / localStorage fallback)
   ----------------------- */
async function initComments(postId) {
  const container = document.getElementById('comments');
  const form = document.getElementById('comment-form');
  const nameInput = document.getElementById('comment-name');
  const textInput = document.getElementById('comment-text');
  if (!container || !form) return;

  // Render helper
  function render(comments) {
    container.innerHTML = '';
    comments.forEach(c => {
      const item = document.createElement('div');
      item.className = 'comment-item';
      item.innerHTML = `<strong>${escapeHtml(c.name)}</strong> <span class="comment-time">${new Date(c.ts).toLocaleString()}</span><p>${escapeHtml(c.text)}</p>`;
      container.appendChild(item);
    });
  }

  // Escape helper
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m];}); }

  // Firebase path if configured
  if (window.FIREBASE_CONFIG) {
    try {
      if (!window.firebase || !window.firebase.database) {
        await loadScript('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
        await loadScript('https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js');
      }
      if (!window.firebase.apps || !window.firebase.apps.length) {
        window.firebase.initializeApp(window.FIREBASE_CONFIG);
      }
      const db = window.firebase.database();
      const ref = db.ref('comments/' + postId);

      ref.on('value', snap => {
        const data = snap.val() || {};
        const arr = Object.keys(data).map(k => data[k]).sort((a,b)=>a.ts-b.ts);
        render(arr);
      });

      form.addEventListener('submit', e => {
        e.preventDefault();
        const entry = { name: nameInput.value || 'Anonymous', text: textInput.value, ts: Date.now() };
        ref.push(entry);
        textInput.value = '';
      });
      return;
    } catch (err) {
      console.warn('Firebase comments failed, falling back to localStorage', err);
    }
  }

  // LocalStorage fallback
  const key = 'comments_' + postId;
  const stored = JSON.parse(localStorage.getItem(key) || '[]');
  render(stored);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const entry = { name: nameInput.value || 'Anonymous', text: textInput.value, ts: Date.now() };
    stored.push(entry);
    localStorage.setItem(key, JSON.stringify(stored));
    render(stored);
    textInput.value = '';
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
