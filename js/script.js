document.addEventListener("DOMContentLoaded", () => {
  
  /* =========================================================
     1. ENVELOPE OPENING LOGIC
     ========================================================= */
  const envelopeWrapper = document.getElementById("inviteEnvelopeWrapper");
  const envelopeImage = document.getElementById("envelopeImage");
  const mainContent = document.getElementById("mainContent");
  const weddingMusic = document.getElementById("weddingMusic");
  const musicToggle = document.getElementById("musicToggle");
  const musicIcon = document.getElementById("musicIcon");
  const musicLabel = document.getElementById("musicLabel");

  if (envelopeWrapper && envelopeImage) {
    envelopeImage.addEventListener("click", () => {
      envelopeImage.classList.add("is-glowing");

      // The envelope click is a direct user gesture, so start the music here.
      if (weddingMusic) {
        weddingMusic.volume = 0.55;
        weddingMusic.play().then(() => {
          setMusicButtonState(true);
        }).catch(() => {
          setMusicButtonState(false);
        });
      }

      setTimeout(() => {
        envelopeWrapper.classList.add("is-hidden");
        mainContent.classList.remove("hidden");
        window.scrollTo(0, 0);
      }, 500); 
    });
  }

  function setMusicButtonState(isPlaying) {
    if (!musicToggle) return;
    musicToggle.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
    if (musicIcon) musicIcon.textContent = isPlaying ? "♫" : "♪";
    if (musicLabel) musicLabel.textContent = isPlaying ? "Music On" : "Music Off";
  }

  if (musicToggle && weddingMusic) {
    musicToggle.addEventListener("click", () => {
      if (weddingMusic.paused) {
        weddingMusic.play().then(() => setMusicButtonState(true)).catch(() => {});
      } else {
        weddingMusic.pause();
        setMusicButtonState(false);
      }
    });

    weddingMusic.addEventListener("play", () => setMusicButtonState(true));
    weddingMusic.addEventListener("pause", () => setMusicButtonState(false));
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

  /* =========================================================
     4. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================= */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -15% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal, .hero-section, .invite-footer').forEach(el => {
    observer.observe(el);
  });

  /* =========================================================
     5. RSVP FORM SUBMISSION
     ========================================================= */
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSubmitBtn = document.getElementById('rsvpSubmitBtn');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const originalText = rsvpSubmitBtn.textContent;
      rsvpSubmitBtn.textContent = "Sending...";
      rsvpSubmitBtn.disabled = true;

      // Extract form data
      const formData = new FormData(rsvpForm);
      const data = Object.fromEntries(formData.entries());
      data.events = formData.getAll("events").join(", ");
      
      // SIMULATE SUBMISSION (Since we don't have a backend URL yet)
      // See below for Google Sheets integration instructions
      setTimeout(() => {
        alert(`Thank you, ${data.name}! Your RSVP has been received.\n\n(Note: To actually save this to an Excel/Google Sheet, follow the instructions provided by the AI).`);
        rsvpForm.reset();
        rsvpSubmitBtn.textContent = "RSVP Confirmed!";
        rsvpSubmitBtn.style.background = "#2c5f2d"; // Green success color
        rsvpSubmitBtn.style.color = "white";
        rsvpSubmitBtn.disabled = false;
      }, 800);

      /*
      // --- REAL GOOGLE SHEETS / EXCEL SUBMISSION CODE ---
      // Replace 'YOUR_WEB_APP_URL' with the link from Google Apps Script
      
      fetch('YOUR_WEB_APP_URL', {
        method: 'POST',
        body: new URLSearchParams(data)
      })
      .then(res => res.json())
      .then(response => {
        alert("Thank you! Your RSVP is confirmed.");
        rsvpForm.reset();
        rsvpSubmitBtn.textContent = originalText;
        rsvpSubmitBtn.disabled = false;
      })
      .catch(err => {
        alert("Error sending RSVP. Please try again.");
        rsvpSubmitBtn.textContent = originalText;
        rsvpSubmitBtn.disabled = false;
      });
      */
    });
  }
