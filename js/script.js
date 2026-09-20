document.addEventListener("DOMContentLoaded", () => {
  
  /* =========================================================
     1. ENVELOPE OPENING LOGIC
     ========================================================= */
  const envelopeWrapper = document.getElementById("inviteEnvelopeWrapper");
  const envelopeImage = document.getElementById("envelopeImage");
  const mainContent = document.getElementById("mainContent");

  if (envelopeWrapper && envelopeImage) {
    envelopeImage.addEventListener("click", () => {
      envelopeImage.classList.add("is-glowing");
      setTimeout(() => {
        envelopeWrapper.classList.add("is-hidden");
        mainContent.classList.remove("hidden");
        window.scrollTo(0, 0);
      }, 500); 
    });
  }

  /* =========================================================
     2. COUNTDOWN
     ========================================================= */
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
    const pathLength = timelinePath.getTotalLength();
    
    // Hide stroke initially
    timelinePath.style.strokeDasharray = pathLength;
    timelinePath.style.strokeDashoffset = pathLength;
    // Smooth trailing transition
    timelinePath.style.transition = "stroke-dashoffset 0.15s ease-out";
    
    const timelineSection = document.querySelector(".timeline-section");
    let sectionTop = 0;
    let sectionHeight = 0;

    // Cache dimensions to prevent layout thrashing on scroll
    function updateDimensions() {
      if (!timelineSection) return;
      sectionTop = timelineSection.offsetTop;
      sectionHeight = timelineSection.offsetHeight;
    }

    // Initial calculation
    setTimeout(updateDimensions, 500); // slight delay to allow layout to settle
    window.addEventListener("resize", updateDimensions);
    
    let isTicking = false;
    window.addEventListener("scroll", () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          if (!timelineSection || sectionHeight === 0) {
             updateDimensions();
          }
          
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          
          // Start drawing when the top of the section enters the bottom of the viewport
          const startDrawPos = sectionTop - windowHeight + 100;
          // Finish drawing when the bottom of the section enters the bottom of the viewport (or slightly before)
          const endDrawPos = sectionTop + sectionHeight - windowHeight - 50;
          
          let progress = 0;
          
          if (scrollY > startDrawPos) {
            progress = (scrollY - startDrawPos) / (endDrawPos - startDrawPos);
          }
          
          // Clamp progress between 0 and 1
          progress = Math.max(0, Math.min(1, progress));
          
          // Update offset (from full length to 0)
          timelinePath.style.strokeDashoffset = pathLength * (1 - progress);
          
          isTicking = false;
        });
        isTicking = true;
      }
    }, { passive: true });
  }

});
