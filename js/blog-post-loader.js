/**
 * Blog Post Loader
 * Fetches a specific blog post based on URL parameter and renders it
 */

// Get blog id from URL
const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get("id");

// Elements
const loadingEl = document.getElementById("loading");
const postContainer = document.getElementById("post-container");
const errorEl = document.getElementById("error");

if (!blogId) {
  // No blog ID provided
  loadingEl.style.display = "none";
  errorEl.style.display = "block";
} else {
  // Fetch all blogs and find the one we need
  fetch("../data/blogs.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load blog data");
      }
      return response.json();
    })
    .then(posts => {
      // Find the post with matching ID
      const post = posts.find(p => p.id === blogId);

      if (!post) {
        // Post not found
        loadingEl.style.display = "none";
        errorEl.style.display = "block";
        return;
      }

      // Update meta tags and title dynamically
      updateMetaTags(post);

      // Populate the post
      document.getElementById("blog-title").textContent = post.title;
      document.getElementById("blog-image").src = post.image;
      document.getElementById("blog-image").alt = post.title;
      document.getElementById("blog-content").innerHTML = post.content;
      
      // Format and display date
      const date = new Date(post.date);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      document.getElementById("blog-date").textContent = `Published on ${formattedDate}`;
      document.getElementById("blog-author").textContent = post.author || "Kijabe Adventures Team";

      // Load related posts (all except current)
      loadRelatedPosts(posts, blogId);

      // Hide loading, show content
      loadingEl.style.display = "none";
      postContainer.style.display = "block";

      // Scroll to top
      window.scrollTo(0, 0);
    })
    .catch(error => {
      console.error("Error loading blog post:", error);
      loadingEl.style.display = "none";
      errorEl.style.display = "block";
    });
}

/**
 * Update meta tags dynamically for SEO
 */
function updateMetaTags(post) {
  // Update title
  document.title = `${post.title} | Kijabe Adventures Blog`;

  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', post.excerpt);
  }

  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', post.title);
  }

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', post.excerpt);
  }

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) {
    ogImage.setAttribute('content', post.image);
  }

  // Update Twitter Card tags
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute('content', post.title);
  }

  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) {
    twitterDescription.setAttribute('content', post.excerpt);
  }

  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage) {
    twitterImage.setAttribute('content', post.image);
  }

  // Update structured data (Schema.org Blog Post)
  const schemaScript = document.getElementById('article-schema');
  if (schemaScript) {
    const schema = {
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
        "logo": "https://kijabeadventures.com/images/logo.png"
      },
      "datePublished": post.date
    };
    schemaScript.textContent = JSON.stringify(schema);
  }
}

/**
 * Load and display related posts
 */
function loadRelatedPosts(posts, currentId) {
  const relatedContainer = document.getElementById("related-container");
  
  // Filter out current post and get up to 3 others
  const related = posts
    .filter(p => p.id !== currentId)
    .slice(0, 3);

  relatedContainer.innerHTML = "";

  if (related.length === 0) {
    relatedContainer.innerHTML = '<p>No other posts available.</p>';
    return;
  }

  related.forEach(post => {
    const card = document.createElement("div");
    card.className = "blog-card";
    
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

    relatedContainer.appendChild(card);
  });
}
