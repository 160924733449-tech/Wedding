document.addEventListener("DOMContentLoaded", () => {
    const splashAnimation = document.getElementById('splash-animation');
    const splashUi = document.getElementById('splash-ui');
    const mainContent = document.getElementById('main-content');
    const openBtn = document.getElementById('open-btn');
    const bgMusic = document.getElementById('bg-music');
    const animationFrame = document.getElementById('animation-frame');

    // Setup Animation Frames
    const totalFrames = 60;
    const frames = [];
    const folderPath = 'ezgif-6cb4b9acd78cfb56-jpg';
    
    // Preload images for smooth playback
    for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        // Format number with leading zeros (001, 002, etc.)
        const frameNum = String(i).padStart(3, '0');
        img.src = `${folderPath}/ezgif-frame-${frameNum}.jpg`;
        frames.push(img.src);
    }

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

        // Wait for the overlay text to fade out before starting the cinematic animation
        setTimeout(() => {
            
            // Play the image sequence animation
            let currentFrame = 0;
            const frameRate = 33; // ~30 fps (33ms per frame)
            
            const playSequence = setInterval(() => {
                if (currentFrame < totalFrames) {
                    animationFrame.src = frames[currentFrame];
                    currentFrame++;
                } else {
                    // Animation finished
                    clearInterval(playSequence);
                    
                    // Trigger the cinematic end animation (zoom and blur)
                    animationFrame.classList.add('zoom-blur');
                    
                    // Slightly delay the fade out so the zoom effect starts being visible
                    setTimeout(() => {
                        // Fade out the entire cinematic animation wrapper
                        splashAnimation.classList.add('hidden');
                        
                        // Show and fade in main scrolling content
                        setTimeout(() => {
                            mainContent.classList.remove('hidden');
                            void mainContent.offsetWidth; // Trigger reflow for CSS transition
                            mainContent.classList.add('visible');
                        }, 500); // Crossfade timing
                    }, 300);
                }
            }, frameRate);
            
        }, 800); // 800ms matches the CSS transition time for splash-ui
    });
});
