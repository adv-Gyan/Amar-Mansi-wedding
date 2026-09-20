document.addEventListener("DOMContentLoaded", () => {
  
  /* =========================================================
     1. ENVELOPE OPENING LOGIC
     ========================================================= */
  const envelopeWrapper = document.getElementById("inviteEnvelopeWrapper");
  const seal = document.getElementById("waxSeal");
  const mainContent = document.getElementById("mainContent");

  if (envelopeWrapper && seal) {
    seal.addEventListener("click", () => {
      // Trigger golden light boundary animation
      seal.classList.add("is-glowing");

      // Wait for glow animation, then fade out wrapper
      setTimeout(() => {
        envelopeWrapper.classList.add("is-hidden");
        mainContent.classList.remove("hidden");
        
        // Ensure scroll is at top
        window.scrollTo(0, 0);

        // Initialize observers once main content is visible
        initObserver();
      }, 500); // Reduced delay for immediate response
    });
  }

  /* =========================================================
     2. INTERSECTION OBSERVER
     ========================================================= */
  function initObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // We want to trigger it once
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -5% 0px"
      }
    );

    document
      .querySelectorAll(".reveal")
      .forEach((el) => observer.observe(el));
  }

  /* =========================================================
     3. COUNTDOWN
     ========================================================= */
  // Target: December 2, 2026 @ 10:00 AM
  const targetDate = new Date("2026-12-02T10:00:00+05:30").getTime();

  function updateCountdown() {
    const now = Date.now();
    const distance = targetDate - now;

    if (distance <= 0) return;

    const values = {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance / 3600000) % 24),
      minutes: Math.floor((distance / 60000) % 60),
      seconds: Math.floor((distance / 1000) % 60)
    };

    Object.entries(values).forEach(([key, value]) => {
      const el = document.getElementById(key);
      if (!el) return;

      const next = String(value).padStart(2, "0");
      if (el.textContent !== next) {
        el.textContent = next;
      }
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* =========================================================
     4. TIMELINE SCROLL (SVG WAVY LINE)
     ========================================================= */
  const timelinePath = document.getElementById("timelineProgress");
  
  if (timelinePath) {
    // Calculate SVG path length
    const pathLength = timelinePath.getTotalLength();
    
    // Set up dash array and offset to hide the stroke initially
    timelinePath.style.strokeDasharray = pathLength;
    timelinePath.style.strokeDashoffset = pathLength;
    
    window.addEventListener("scroll", () => {
      // Calculate scroll progress relative to the timeline section
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      const timelineSection = document.querySelector(".timeline-section");
      if (!timelineSection) return;

      const sectionTop = timelineSection.offsetTop;
      const sectionHeight = timelineSection.offsetHeight;
      
      // Calculate how far we've scrolled into the section
      // Start filling when the top of the section enters the bottom of the screen
      // Finish filling when the bottom of the section leaves the top of the screen
      const scrollPosition = scrollY + windowHeight;
      const progress = (scrollPosition - sectionTop) / sectionHeight;
      
      // Clamp progress between 0 and 1
      const clampedProgress = Math.min(Math.max(progress, 0), 1);
      
      // Update offset (from full length to 0)
      const drawLength = pathLength * (1 - clampedProgress);
      timelinePath.style.strokeDashoffset = drawLength;
    }, { passive: true });
  }

});
