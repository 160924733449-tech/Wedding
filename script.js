document.addEventListener("DOMContentLoaded", () => {
    const splashAnimation = document.getElementById('splash-animation');
    const splashUi = document.getElementById('splash-ui');
    const mainContent = document.getElementById('main-content');
    const openBtn = document.getElementById('open-btn');
    const bgMusic = document.getElementById('bg-music');
    const envelopeVideo = document.getElementById('envelope-video');
    const glowTransition = document.getElementById('glow-transition');
    const scrollPrompt = document.getElementById('scroll-prompt');

    // ========================================================
    // UNIFORM CARD SCALER — guarantees identical layout on ALL devices
    // Design reference: 360px wide × 680px tall
    // The card is designed at a fixed pixel size, then uniformly
    // scaled (like zooming a photo) to fit any viewport.
    // ========================================================
    const DESIGN_W = 360;
    const DESIGN_H = 680;

    function scaleCard() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Leave safe margins for the fixed rose borders (top ~12%, bottom ~10%)
        const safeW = vw * 0.92;   // 4% margin each side
        const safeH = vh * 0.78;   // 12% top roses + 10% bottom roses

        // Pick the smallest scale so the card fits fully inside the safe zone
        const scale = Math.min(safeW / DESIGN_W, safeH / DESIGN_H);

        // Scale the main card
        const card = document.querySelector('.card-inner');
        if (card) {
            card.style.transform = `scale(${scale})`;
        }

        // Scale all other sections uniformly so the whole page matches
        const wrappers = document.querySelectorAll('.scale-wrapper');
        wrappers.forEach(wrapper => {
            wrapper.style.transform = `scale(${scale})`;
        });
    }

    scaleCard();
    window.addEventListener('resize', scaleCard);
    window.addEventListener('orientationchange', () => {
        setTimeout(scaleCard, 150);
    });

    openBtn.addEventListener('click', () => {
        // Start video playback IMMEDIATELY on click to eliminate 1s delay
        let transitionTriggered = false;

        if (envelopeVideo) {
            envelopeVideo.playbackRate = 1.8; // Fasten up video animation speed
            envelopeVideo.play().catch(error => {
                console.log("Video play error:", error);
            });

            // Trigger glow transition as video completes quickly
            envelopeVideo.addEventListener('timeupdate', () => {
                if (envelopeVideo.currentTime >= 1.8 && !transitionTriggered) {
                    clearTimeout(forceOpen);
                    transitionTriggered = true;
                    triggerGlowTransition();
                }
            });

            envelopeVideo.addEventListener('ended', () => {
                if (!transitionTriggered) {
                    clearTimeout(forceOpen);
                    transitionTriggered = true;
                    triggerGlowTransition();
                }
            });
        }

        // Fast failsafe: guarantee the invitation opens after 1.6s
        const forceOpen = setTimeout(() => {
            if (!transitionTriggered) {
                transitionTriggered = true;
                triggerGlowTransition();
            }
        }, 1600);

        // Fade out just the text and button overlay
        splashUi.classList.add('fade-out');
        
        // Attempt to play background audio
        if (bgMusic) {
            bgMusic.play().then(() => {
                console.log("Audio playing successfully.");
            }).catch(error => {
                console.log("Audio autoplay was prevented or failed:", error);
            });
        }
    });

    // Scroll prompt click handler
    if (scrollPrompt) {
        scrollPrompt.addEventListener('click', () => {
            const nextSection = document.querySelector('.events-section');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    function triggerGlowTransition() {
        // 1. Show and activate glow
        glowTransition.classList.remove('hidden');
        // Trigger reflow
        void glowTransition.offsetWidth;
        glowTransition.classList.add('active');

        // Wait for glow to become fully bright (e.g. 1.5 seconds)
        setTimeout(() => {
            // Hide the splash screen completely behind the glow
            splashAnimation.classList.add('hidden');
            splashAnimation.style.display = 'none';
            splashAnimation.setAttribute('aria-hidden', 'true');
            
            // Prepare main content
            mainContent.classList.remove('hidden');
            void mainContent.offsetWidth; // Trigger reflow
            mainContent.classList.add('visible');

            // 2. Fade out the glow
            glowTransition.classList.remove('active');

            // 3. Remove glow element from DOM after fade out
            setTimeout(() => {
                glowTransition.classList.add('hidden');
            }, 1500); // wait for glow fade out
        }, 1500); // Wait for glow fade in
    }
});
