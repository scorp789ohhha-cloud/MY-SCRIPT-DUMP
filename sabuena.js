(function () {
    const bonzis = document.querySelectorAll('.bonzi');
    if (bonzis.length === 0) {
        console.error("No elements with class '.bonzi' were found on the page!");
        return;
    }

    const start = performance.now();
    let running = true;

    // 103 BPM Rhythm Calculations
    const bpm = 103;
    const bps = bpm / 60; 
    const freq = bps * Math.PI * 2; 
    let lastBeatIndex = -1;

    // Core Animation Loop
    function loop(t) {
        if (!running) return;

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
                    party.confetti({ x: window.innerWidth * 0.2, y: window.innerHeight }, {
                        count: party.variation.range(20, 30),
                        angle: party.variation.range(-75, -45),
                        spread: 30
                    });
                    party.confetti({ x: window.innerWidth * 0.8, y: window.innerHeight }, {
                        count: party.variation.range(20, 30),
                        angle: party.variation.range(-135, -105),
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
        bonzis.forEach(b => {
            b.style.transform = "";
            b.style.filter = "";
            b.style.transformOrigin = "";
        });
        console.log("Animation complete.");
    }

    // Load Party.js dynamically, but start the animation immediately anyway
    if (!window.party) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/party-js@2/bundle/party.min.js";
        script.onerror = () => console.warn("Confetti CDN blocked or failed to load. Running dance only.");
        document.head.appendChild(script);
    }

    // Fire it up!
    requestAnimationFrame(loop);
})();
