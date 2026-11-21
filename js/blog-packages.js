(() => {
  const sectionId = "adventure-packages";
  const faq = document.querySelector("#faq, #frequently-asked-questions, .faq-section");
  const placementTarget = faq || document.querySelector("footer");

  if (!placementTarget) {
    throw new Error("Cannot add the hiking packages section: no FAQ section or page footer found.");
  }

  const existingSection = document.querySelector(`.pk#${sectionId}`);
  if (existingSection) {
    placementTarget.insertAdjacentElement("beforebegin", existingSection);
    return;
  }

  const section = `
    <section class="pk" id="${sectionId}" aria-labelledby="pk-title">
      <div class="pk-inner">
        <h2 id="pk-title">Our popular Hiking and Outdoor Exprience Packages</h2>
        <p>Join a scheduled group hike, or plan a private adventure for a date, couple, school or team. Prices are per person.</p>

        <div class="pk-feature">
          <article class="pk-card">
            <h3>Half-Day Hills</h3>
            <p class="pk-price"><small>From</small>KES 1,500</p>
            <p>3–4 hours, beginner friendly. Guide and safety briefing included.</p>
            <p class="pk-for"><strong>Best for:</strong> Karura Forest, Ngong Hills</p>
            <a href="/upcoming-hiking-events.html" class="pk-btn pk-btn--line">Book this hike</a>
          </article>
          <article class="pk-card pk-card--hero">
            <span class="pk-badge">Most popular</span>
            <h3>Sunrise Ridge</h3>
            <p class="pk-price"><small>From</small>KES 2,200</p>
            <p>Early start, golden-hour views, snacks and photo spots.</p>
            <p class="pk-for"><strong>Best for:</strong> Kijabe Hills, Ngong Hills</p>
            <a href="/upcoming-hiking-events.html" class="pk-btn pk-btn--sun">Book this hike</a>
          </article>
          <article class="pk-card">
            <h3>Full-Day Escarpment</h3>
            <p class="pk-price"><small>From</small>KES 3,200</p>
            <p>Challenging terrain and ridge walks with first-aid trained guides.</p>
            <p class="pk-for"><strong>Best for:</strong> Kijabe Escarpment, Mt. Longonot</p>
            <a href="/private-group-hikes.html" class="pk-btn pk-btn--line">Plan a private hike</a>
          </article>
        </div>

        <div class="pk-cat">
          <div class="pk-cat-head">
            <h3><i class="fas fa-person-hiking" aria-hidden="true"></i> Group hikes and trails</h3>
            <p>Join a scheduled group hike or book a guided walk on one of Kijabe's trails.</p>
          </div>
          <ul class="pk-trails">
            <li class="pk-trail pk-trail--open">
              <span class="pk-ico"><i class="fas fa-mountain" aria-hidden="true"></i></span>
              <div><h4>Kijabe Hills Group Hike <span class="pk-open-tag">Upcoming</span></h4><p>Guided group hike with sweeping Rift Valley views.</p><span class="pk-tag">Open to individuals, friends and small groups</span></div>
              <div class="pk-amt">KES 2,000</div>
              <a href="/upcoming-hiking-events.html" class="pk-btn pk-btn--solid">View upcoming hikes</a>
            </li>
            <li class="pk-trail">
              <span class="pk-ico"><i class="fas fa-mountain-sun" aria-hidden="true"></i></span>
              <div><h4>Mount Longonot Group Hike</h4><p>Hike to the crater rim for panoramic views of the Great Rift Valley.</p><span class="pk-tag">Full day, for individuals and groups</span></div>
              <div class="pk-amt">KES 2,500</div>
              <a href="/mount-longonot-hike.html" class="pk-btn pk-btn--solid">See the Longonot hike</a>
            </li>
            <li class="pk-trail">
              <span class="pk-ico"><i class="fas fa-hot-tub-person" aria-hidden="true"></i></span>
              <div><h4>Kijabe Hot Springs</h4><p>Explore the Kijabe landscape and its natural hot springs with a guide.</p><span class="pk-tag">Couples, friends and private groups</span></div>
              <div class="pk-amt"><small>Est. from</small>KES 2,000</div>
              <a href="/private-group-hikes.html" class="pk-btn pk-btn--line">Plan this trip</a>
            </li>
            <li class="pk-trail">
              <span class="pk-ico"><i class="fas fa-tree" aria-hidden="true"></i></span>
              <div><h4>Kinare Forest Hike</h4><p>A guided walk through a quiet, nature-rich forest.</p><span class="pk-tag">Nature lovers, families and small groups</span></div>
              <div class="pk-amt"><small>Est. from</small>KES 1,500</div>
              <a href="/private-group-hikes.html" class="pk-btn pk-btn--line">Plan this trip</a>
            </li>
            <li class="pk-trail">
              <span class="pk-ico"><i class="fas fa-water" aria-hidden="true"></i></span>
              <div><h4>Kijabe River Trail</h4><p>Follow a scenic river route through the surrounding landscape.</p><span class="pk-tag">Hikers, photographers and nature groups</span></div>
              <div class="pk-amt"><small>Est. from</small>KES 1,500</div>
              <a href="/private-group-hikes.html" class="pk-btn pk-btn--line">Plan this trip</a>
            </li>
            <li class="pk-trail">
              <span class="pk-ico"><i class="fas fa-train" aria-hidden="true"></i></span>
              <div><h4>Railway Trail Hike</h4><p>A distinctive trail with local history and changing escarpment views.</p><span class="pk-tag">Hikers looking for a different Kijabe route</span></div>
              <div class="pk-amt"><small>Est. from</small>KES 1,500</div>
              <a href="/private-group-hikes.html" class="pk-btn pk-btn--line">Plan this trip</a>
            </li>
            <li class="pk-trail">
              <span class="pk-ico"><i class="fas fa-droplet" aria-hidden="true"></i></span>
              <div><h4>Kijabe Waterfalls</h4><p>Discover the waterfalls and scenic trails on a guided nature walk.</p><span class="pk-tag">Nature lovers, photographers and hiking groups</span></div>
              <div class="pk-amt"><small>Est. from</small>KES 2,000</div>
              <a href="/private-group-hikes.html" class="pk-btn pk-btn--line">Plan this trip</a>
            </li>
          </ul>
        </div>

        <div class="pk-cat">
          <div class="pk-cat-head">
            <h3><i class="fas fa-people-group" aria-hidden="true"></i> Private and group experiences</h3>
            <p>A personalised outing for your school, team, family or special occasion. Choose the route, date and pace.</p>
          </div>
          <div class="pk-grid">
            <article class="pk-card pk-card--soft"><h3><i class="fas fa-heart" aria-hidden="true"></i> Couples hike</h3><p class="pk-price">Custom package</p><p>Scenic trails, good viewpoints and a peaceful private adventure for two.</p><p class="pk-for"><strong>Best for:</strong> anniversaries, birthdays, getaways</p><a href="/private-group-hikes.html" class="pk-btn pk-btn--solid">Plan your couples hike</a></article>
            <article class="pk-card"><h3><i class="fas fa-graduation-cap" aria-hidden="true"></i> School and student trips</h3><p class="pk-price">Group packages</p><p>Outdoor learning that builds teamwork and environmental awareness.</p><p class="pk-for"><strong>Best for:</strong> schools, colleges, student associations</p><a href="/private-group-hikes.html" class="pk-btn pk-btn--line">Plan a school trip</a></article>
            <article class="pk-card"><h3><i class="fas fa-briefcase" aria-hidden="true"></i> Corporate and organisations</h3><p class="pk-price">Custom packages</p><p>Guided hikes, outdoor challenges and team-building days.</p><p class="pk-for"><strong>Best for:</strong> companies, NGOs, churches</p><a href="/private-group-hikes.html" class="pk-btn pk-btn--line">Organise a team day</a></article>
            <article class="pk-card"><h3><i class="fas fa-users" aria-hidden="true"></i> Family, friends and other groups</h3><p class="pk-price">Custom packages</p><p>A private hike matched to your group's interests, schedule and pace.</p><p class="pk-for"><strong>Best for:</strong> families, youth groups, social clubs</p><a href="/private-group-hikes.html" class="pk-btn pk-btn--line">Plan your hike</a></article>
          </div>
        </div>

        <div class="pk-cat">
          <div class="pk-cat-head">
            <h3><i class="fas fa-campground" aria-hidden="true"></i> Outdoor events and activities</h3>
            <p>Add something different to your outing.</p>
          </div>
          <div class="pk-grid">
            <article class="pk-card"><h3><i class="fas fa-campground" aria-hidden="true"></i> Camping</h3><p class="pk-price">Custom packages</p><p>An outdoor stay with activities arranged for your group.</p><a href="/private-group-hikes.html" class="pk-btn pk-btn--line">Plan a camping trip</a></article>
            <article class="pk-card"><h3><i class="fas fa-parachute-box" aria-hidden="true"></i> Paragliding</h3><p class="pk-price">On request</p><p>We coordinate with providers for individuals or private groups, subject to availability.</p><a href="/private-group-hikes.html" class="pk-btn pk-btn--line">Ask about paragliding</a></article>
            <article class="pk-card"><h3><i class="fas fa-seedling" aria-hidden="true"></i> Tree planting and conservation</h3><p class="pk-price">Custom group packages</p><p>Pair a hike with tree planting for a lasting environmental impact.</p><p class="pk-for"><strong>Best for:</strong> schools, companies, churches</p><a href="/private-group-hikes.html" class="pk-btn pk-btn--line">Plan a planting day</a></article>
          </div>
        </div>

        <div class="pk-end">
          <div><h3>Don't see what you need?</h3><p>We also organise custom hiking, camping, forest walks and bird watching.</p></div>
          <a href="/private-group-hikes.html" class="pk-btn pk-btn--solid">Plan your adventure</a>
        </div>
      </div>
    </section>
  `;

  placementTarget.insertAdjacentHTML("beforebegin", section);
})();
