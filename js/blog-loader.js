/**
 * ==========================================================
 *  BLOG LISTING LOADER (Improved)
 *  - Loads posts from JSON
 *  - Search filtering
 *  - Pagination
 *  - Faster rendering & cleaner structure
 * ==========================================================
 */

let postsData = [];
let currentPage = 1;
const postsPerPage = 6;

// DOM elements
const container = document.getElementById("blog-container");
const searchInput = document.getElementById("blog-search");
const paginationEl = document.getElementById("pagination");


// Fetch blog posts
async function loadBlogs() {
  try {
    const response = await fetch("../data/blogs.json");
    if (!response.ok) throw new Error("Failed to load blog posts");

    postsData = await response.json();

    // Sort by date (newest first)
    postsData.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderPosts();
    setupPagination();
  } catch (err) {
    container.innerHTML = `<div class="error-message">Could not load blogs.</div>`;
    console.error(err);
  }
}


// Render visible posts
function renderPosts() {
  container.innerHTML = "";

  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;

  const filtered = applySearch(postsData);
  const visible = filtered.slice(start, end);

  if (visible.length === 0) {
    container.innerHTML = `<p>No blog posts found.</p>`;
    return;
  }

  visible.forEach(post => {
    const dateFormatted = new Date(post.date).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });

    container.innerHTML += `
      <div class="blog-card">
        <div class="blog-card-image">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
        </div>
        <div class="blog-card-content">
          <span class="blog-date">${dateFormatted}</span>
          <h3>${post.title}</h3>
          <p class="blog-excerpt">${post.excerpt}</p>
          <a href="blog-post.html?id=${post.id}" class="read-more">Read More →</a>
        </div>
      </div>
    `;
  });
}


// Apply search filter
function applySearch(posts) {
  const term = searchInput.value.toLowerCase();
  return posts.filter(p =>
    p.title.toLowerCase().includes(term) ||
    p.excerpt.toLowerCase().includes(term)
  );
}


// SEARCH EVENT
searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderPosts();
  setupPagination();
});


// Pagination setup
function setupPagination() {
  const filtered = applySearch(postsData);
  const totalPages = Math.ceil(filtered.length / postsPerPage);

  paginationEl.innerHTML = `
    <button ${currentPage === 1 ? "disabled" : ""} onclick="prevPage()">Prev</button>
    <span>Page ${currentPage} of ${totalPages}</span>
    <button ${currentPage === totalPages ? "disabled" : ""} onclick="nextPage()">Next</button>
  `;
}

function nextPage() {
  currentPage++;
  renderPosts();
  setupPagination();
}

function prevPage() {
  currentPage--;
  renderPosts();
  setupPagination();
}

// Start
loadBlogs();

/**
 * Blog Loader
 * Fetches blog posts from JSON and dynamically renders them
 */

// Fetch and render blog posts
fetch("../data/blogs.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to load blog posts");
    }
    return response.json();
  })
  .then(posts => {
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const container = document.getElementById("blog-container");
    
    // Clear loading message
    container.innerHTML = "";

    // Create blog cards
    posts.forEach(post => {
      const card = document.createElement("div");
      card.className = "blog-card";
      
      // Format date
      const date = new Date(post.date);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      card.innerHTML = `
        <div class="blog-card-image">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
        </div>
        <div class="blog-card-content">
          <span class="blog-date">${formattedDate}</span>
          <h3>${post.title}</h3>
          <p class="blog-excerpt">${post.excerpt}</p>
          <a href="blog-post.html?id=${post.id}" class="read-more">Read More →</a>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Error loading blog posts:", error);
    const container = document.getElementById("blog-container");
    container.innerHTML = '<div class="error-message">Sorry, we could not load the blog posts. Please try again later.</div>';
  });
/**
 * Blog Loader
 * Fetches blog posts from JSON and dynamically renders them
 */

// Fetch and render blog posts
fetch("../data/blogs.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to load blog posts");
    }
    return response.json();
  })
  .then(posts => {
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const container = document.getElementById("blog-container");
    
    // Clear loading message
    container.innerHTML = "";

    // Create blog cards
    posts.forEach(post => {
      const card = document.createElement("div");
      card.className = "blog-card";
      
      // Format date
      const date = new Date(post.date);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      card.innerHTML = `
        <div class="blog-card-image">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
        </div>
        <div class="blog-card-content">
          <span class="blog-date">${formattedDate}</span>
          <h3>${post.title}</h3>
          <p class="blog-excerpt">${post.excerpt}</p>
          <a href="blog-post.html?id=${post.id}" class="read-more">Read More →</a>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Error loading blog posts:", error);
    const container = document.getElementById("blog-container");
    container.innerHTML = '<div class="error-message">Sorry, we could not load the blog posts. Please try again later.</div>';
  });
  /**
 * ============================================
 *  MORE ARTICLES SECTION (JSON-powered)
 *  - Loads latest 3 posts
 *  - Displays below main articles
 * ============================================
 */

async function loadMoreArticles() {
  try {
    const res = await fetch("../data/blogs.json");
    if (!res.ok) throw new Error("Failed to load JSON posts");

    const posts = await res.json();

    // Sort by newest
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Limit to the latest 3
    const latestThree = posts.slice(0, 3);

    const moreContainer = document.getElementById("more-articles-json");
    moreContainer.innerHTML = "";

    latestThree.forEach(post => {
      const formatted = new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
      });

      moreContainer.innerHTML += `
        <div class="more-article-card">
          <img src="${post.image}" alt="${post.title}">
          <span class="blog-date">${formatted}</span>
          <h4>${post.title}</h4>
          <p>${post.excerpt}</p>
          <a href="blog-post.html?id=${post.id}" class="read-more">Read More →</a>
        </div>
      `;
    });

  } catch (error) {
    console.error("More Articles Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadMoreArticles);
