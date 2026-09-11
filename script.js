document.addEventListener("DOMContentLoaded", () => {
    const splashAnimation = document.getElementById('splash-animation');
    const splashUi = document.getElementById('splash-ui');
    const mainContent = document.getElementById('main-content');
    const openBtn = document.getElementById('open-btn');
    const bgMusic = document.getElementById('bg-music');
    const envelopeVideo = document.getElementById('envelope-video');
    const glowTransition = document.getElementById('glow-transition');

    openBtn.addEventListener('click', () => {
        // Fade out just the text and button overlay
        splashUi.classList.add('fade-out');
        
        // Attempt to play the background nasheed immediately
        if (bgMusic) {
            bgMusic.play().then(() => {
                console.log("Audio playing successfully.");
            }).catch(error => {
                console.log("Audio autoplay was prevented or failed:", error);
            });
        }

        // Wait for the overlay text to fade out before starting the video
        setTimeout(() => {
            if (envelopeVideo) {
                envelopeVideo.play();
                
                // When the video ends, trigger the glow transition
                envelopeVideo.addEventListener('ended', () => {
                    triggerGlowTransition();
                });
            } else {
                triggerGlowTransition(); // Fallback if video fails
            }
        }, 800); // 800ms matches the CSS transition time for splash-ui
    });

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
