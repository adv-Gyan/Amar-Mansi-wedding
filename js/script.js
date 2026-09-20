document.addEventListener("DOMContentLoaded", () => {
  
  /* =========================================================
     1. ENVELOPE OPENING LOGIC
     ========================================================= */
  const envelopeWrapper = document.getElementById("inviteEnvelopeWrapper");
  const envelopeImage = document.getElementById("envelopeImage");
  const mainContent = document.getElementById("mainContent");

  if (envelopeWrapper && envelopeImage) {
    envelopeImage.addEventListener("click", () => {
      // Trigger golden light boundary animation on the envelope
      envelopeImage.classList.add("is-glowing");

      // Wait for glow animation, then fade out wrapper
      setTimeout(() => {
        envelopeWrapper.classList.add("is-hidden");
        mainContent.classList.remove("hidden");
        
        // Ensure scroll is at top
        window.scrollTo(0, 0);
      }, 500); // Reduced delay for immediate response
    });
  }

  /* =========================================================
     2. COUNTDOWN
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
     3. TIMELINE SCROLL (SVG WAVY LINE)
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
