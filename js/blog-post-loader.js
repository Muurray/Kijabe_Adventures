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
      "datePublished": post.date
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
        </div>
      </div>
    `;

    relatedContainer.innerHTML += card;
  });
}
