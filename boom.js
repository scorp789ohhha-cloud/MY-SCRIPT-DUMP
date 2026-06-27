(function () {
    const bonzis = document.querySelectorAll('.bonzi');
    const content = document.getElementById('content') || document.body;

    // --- Asset Links ---
    const SMOKE_IMAGE_URL = 'https://i.ibb.co/3mS2SCtS/image.png';
    const EXPLOSION_AUDIO_URL = 'https://files.catbox.moe/jj6wu2.mp3';
    const SHOTGUN_AUDIO_URL = 'https://www.myinstants.com/media/sounds/shotgun-sound-effect-pumping.mp3';

    if (window.getComputedStyle(content).position === 'static') {
        content.style.position = 'relative';
    }

    // Preload image
    const preloadSmoke = new Image();
    preloadSmoke.src = SMOKE_IMAGE_URL;

    // --- Initialize Base States ---
    const bonziStates = Array.from(bonzis).map((b) => {
        b.style.transition = 'opacity 0.5s ease';
        b.style.opacity = '1';

        return {
            element: b,
            isExploded: false
        };
    });

    // --- Audio Player ---
    function triggerExplosionSounds() {
        const audio1 = new Audio(EXPLOSION_AUDIO_URL);
        const audio2 = new Audio(SHOTGUN_AUDIO_URL);
        
        audio1.volume = 0.3;
        audio2.volume = 0.4;

        audio1.play().catch(err => console.log("Audio 1 blocked:", err));
        audio2.play().catch(err => console.log("Audio 2 blocked:", err));
    }

    // --- Static Smoke Spawner ---
    function spawnStaticSmoke(targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const containerRect = content.getBoundingClientRect();
        
        let targetX = rect.left - containerRect.left + (rect.width / 2);
        let targetY = rect.top - containerRect.top + (rect.height / 2);

        if (rect.width === 0 || rect.height === 0) {
            targetX = containerRect.width / 2;
            targetY = containerRect.height / 2;
        }

        const smoke = document.createElement('img');
        smoke.src = SMOKE_IMAGE_URL;
        
        smoke.setAttribute('style', `
            position: absolute !important;
            display: block !important;
            visibility: visible !important;
            pointer-events: none !important;
            width: 150px !important;
            height: 150px !important;
            max-width: none !important;
            max-height: none !important;
            left: ${targetX}px !important;
            top: ${targetY}px !important;
            z-index: 999999 !important;
            transform: translate(-50%, -50%) !important;
            opacity: 1 !important;
        `);
        
        content.appendChild(smoke);
        return smoke;
    }

    // --- Main Control Loop ---
    const startTime = performance.now();
    let running = true;
    let explosionTriggered = false;
    
    // Camera shake timing states
    let shakeStartTime = 0;
    let isShaking = false;
    const shakeDuration = 1.0; // Shaking lasts for 1 second total

    function loop(now) {
        if (!running) return;

        const elapsed = (now - startTime) / 1000;

        // --- Handle Aggressive Camera Shake Decay ---
        if (isShaking) {
            const shakeElapsed = (now - shakeStartTime) / 1000;
            
            if (shakeElapsed < shakeDuration) {
                // Decay from 1 (maximum intensity) down to 0 quickly
                const remainingIntensity = 1 - (shakeElapsed / shakeDuration);
                const maxOffset = 30 * remainingIntensity; // Starts aggressively at 30px max offset
                
                const shakeX = (Math.random() - 0.5) * maxOffset;
                const shakeY = (Math.random() - 0.5) * maxOffset;
                
                content.style.transform = `translate3d(${shakeX}px, ${shakeY}px, 0)`;
            } else {
                // Shake completes, reset container back to perfectly still
                isShaking = false;
                content.style.transform = '';
            }
        }

        // --- Handle Explosion Timeline at Exactly 10 Seconds ---
        if (elapsed >= 10 && !explosionTriggered && bonziStates.length > 0) {
            explosionTriggered = true;

            const targetIndex = Math.floor(Math.random() * bonziStates.length);
            const victim = bonziStates[targetIndex];

            victim.isExploded = true;
            
            const staticSmoke = spawnStaticSmoke(victim.element);
            
            // Hide the victim instantly
            victim.element.style.setProperty('transition', 'none', 'important'); 
            victim.element.style.display = 'none'; 
            
            triggerExplosionSounds();

            // Trigger the aggressive screen shake loop
            shakeStartTime = now;
            isShaking = true;

            // Exactly 4 seconds after explosion (At second 14)
            setTimeout(() => {
                // Restore the transition rule for a smooth fade-in setup
                victim.element.style.transition = 'opacity 0.5s ease';
                victim.element.style.opacity = '0';
                victim.element.style.display = ''; 
                
                // Force layout recalculation
                void victim.element.offsetWidth;
                
                // Begin the fade-in animation
                victim.element.style.opacity = '1';

                // Synchronize the smoke removal exactly as the fade-in finishes (0.5 seconds later)
                setTimeout(() => {
                    if (staticSmoke && staticSmoke.parentNode) {
                        staticSmoke.parentNode.removeChild(staticSmoke);
                    }
                    victim.isExploded = false;
                }, 500);

            }, 4000);
        }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
})();
