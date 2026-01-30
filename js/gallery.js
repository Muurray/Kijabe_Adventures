// Lightweight slideshow for the gallery page
(function () {
  const images = window.GALLERY_IMAGES || [];
  const basePath = '/images/Gallery/';
  const slidesEl = document.getElementById('slides');
  const indicatorsEl = document.getElementById('indicators');
  const prevBtn = document.querySelector('.slide-btn.prev');
  const nextBtn = document.querySelector('.slide-btn.next');
  const slideshowEl = document.querySelector('.slideshow');
  if (!slidesEl || !images.length) {
    if (slidesEl) slidesEl.innerHTML = '<p>No gallery images found.</p>';
    return;
  }

  let current = 0;
  let timer = null;
  const delay = 5000; // ms

  function createSlide(src, idx) {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${idx + 1} of ${images.length}`);

    const img = document.createElement('img');
    img.src = basePath + src;
    img.alt = src.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '').replace(/\b\w/g, c => c.toUpperCase());
    img.loading = 'lazy';

    slide.appendChild(img);
    return slide;
  }

  function buildSlides() {
    images.forEach((img, i) => {
      slidesEl.appendChild(createSlide(img, i));

      const dot = document.createElement('button');
      dot.className = 'indicator';
      dot.setAttribute('aria-label', `Show slide ${i + 1}`);
      dot.addEventListener('click', () => { showSlide(i); restartAuto(); });
      indicatorsEl.appendChild(dot);
    });
  }

  function updateUI() {
    const width = slideshowEl.clientWidth;
    slidesEl.style.transform = `translateX(-${current * 100}%)`;
    [...indicatorsEl.children].forEach((b, i) => b.classList.toggle('active', i === current));
  }

  function showSlide(i) {
    current = (i + images.length) % images.length;
    updateUI();
  }

  function next() { showSlide(current + 1); }
  function prev() { showSlide(current - 1); }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, delay);
  }
  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; }
  }
  function restartAuto() { stopAuto(); startAuto(); }

  // touch support (swipe)
  let startX = 0, endX = 0;
  slideshowEl.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stopAuto(); });
  slideshowEl.addEventListener('touchmove', (e) => { endX = e.touches[0].clientX; });
  slideshowEl.addEventListener('touchend', () => {
    const diff = endX - startX;
    if (Math.abs(diff) > 40) { if (diff < 0) next(); else prev(); }
    restartAuto();
  });

  // keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); restartAuto(); }
    if (e.key === 'ArrowLeft') { prev(); restartAuto(); }
  });

  // button clicks
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartAuto(); });

  // pause on hover
  slideshowEl.addEventListener('mouseenter', stopAuto);
  slideshowEl.addEventListener('mouseleave', startAuto);

  // build and init
  buildSlides();
  showSlide(0);
  startAuto();
  window.addEventListener('resize', updateUI);
})();
