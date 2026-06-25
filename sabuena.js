(function () {
    const bonzis = document.querySelectorAll('.bonzi');
    if (bonzis.length === 0) {
        console.error("No elements with class '.bonzi' were found on the page!");
        return;
    }

    // 1. Initialize the party music
    const audio = new Audio("https://files.catbox.moe/m4cdq8.mp3");
    audio.loop = false;
    
    let running = false;
    let start;
    let lastBeatIndex = -1;

    // 103 BPM Rhythm Calculations
    const bpm = 103;
    const bps = bpm / 60; 
    const freq = bps * Math.PI * 2; 

    // Core Animation Loop
    function loop(t) {
        if (!running) return;
        if (!start) start = t;

        const elapsed = (t - start) / 1000;

        // Stop after 10 seconds
        if (elapsed >= 10) {
            reset();
            return;
        }

        // Beat tracking for confetti
        const currentBeatIndex = Math.floor(elapsed * bps);
        if (currentBeatIndex > lastBeatIndex) {
            lastBeatIndex = currentBeatIndex;
            
            // Safe call: Only fire confetti if party.js successfully loaded
            if (window.party) {
                try {
                    window.party.confetti({ x: window.innerWidth * 0.2, y: window.innerHeight }, {
                        count: window.party.variation.range(20, 30),
                        angle: window.party.variation.range(-75, -45),
                        spread: 30
                    });
                    window.party.confetti({ x: window.innerWidth * 0.8, y: window.innerHeight }, {
                        count: window.party.variation.range(20, 30),
                        angle: window.party.variation.range(-135, -105),
                        spread: 30
                    });
                } catch (e) {
                    console.warn("Party.js failed to fire:", e);
                }
            }
        }

        // Jelly Dancing Mechanics
        bonzis.forEach((b, i) => {
            const offset = i * 0.5;
            const phase = (elapsed * freq) + offset;

            const bounceHeight = 35; 
            const bounce = Math.abs(Math.sin(phase)) * -bounceHeight;
            const sway = Math.sin(phase) * 25;

            const squishFactor = Math.cos(phase * 2) * 0.2;
            const scaleX = 1 - squishFactor;
            const scaleY = 1 + squishFactor;
            const skewX = Math.cos(phase) * 10;

            b.style.transform = `translate(${sway}px, ${bounce}px) scaleX(${scaleX}) scaleY(${scaleY}) skewX(${skewX}deg)`;
            b.style.filter = "brightness(1) contrast(120%)";
            b.style.transformOrigin = "bottom center";
        });

        requestAnimationFrame(loop);
    }

    function reset() {
        running = false;
        
        // Pause audio and reset its time point
        audio.pause();
        audio.currentTime = 0;

        bonzis.forEach(b => {
            b.style.transform = "";
            b.style.filter = "";
            b.style.transformOrigin = "";
        });
        console.log("Party over!");
    }

    // Function to safely start both audio AND animation together
    function startParty() {
        if (running) return; // Prevent double-triggering
        running = true;
        start = null; // Reset start time for animation sync
        lastBeatIndex = -1;
        
        audio.play().catch(err => {
            console.error("Audio playback failed completely:", err);
        });
        
        requestAnimationFrame(loop);
    }

    // Attempt to play immediately
    audio.play()
        .then(() => {
            // Autoplay allowed! Start the party immediately.
            startParty();
        })
        .catch(err => {
            console.warn("Autoplay blocked. Click anywhere on the page to start the music and animation!");
            
            // Fallback: Wait for the first user click to trigger everything in sync
            const startOnInteraction = () => {
                startParty();
                document.removeEventListener('click', startOnInteraction);
            };
            document.addEventListener('click', startOnInteraction);
        });

    // Load Party.js dynamically
    if (!window.party) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/party-js@2/bundle/party.min.js";
        script.onerror = () => console.warn("Confetti CDN blocked or failed to load. Running dance/audio only.");
        document.head.appendChild(script);
    }
})();
