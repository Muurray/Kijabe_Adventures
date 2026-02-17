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
