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
    // Use CSS transition for a smooth, lag-free animation
    timelinePath.style.transition = "stroke-dashoffset 4s ease-in-out";
    
    const timelineSection = document.querySelector(".timeline-section");
    
    if (timelineSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Draw the line completely when it comes into view
            timelinePath.style.strokeDashoffset = "0";
            // Unobserve after animating once to save resources
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(timelineSection);
    }
  }

});
