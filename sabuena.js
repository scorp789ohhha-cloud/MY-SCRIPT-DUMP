window.addEventListener("DOMContentLoaded", () => {
    let bonzis = document.querySelectorAll(".bonzi");
    if (!bonzis.length) {
        console.warn("No .bonzi elements found.");
        return;
    }

    const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_115b9b6d6c.mp3?filename=fun-party-110659.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 1;

    let running = false;
    let startTime = 0;
    let lastBeat = -1;

    const bpm = 103;
    const bps = bpm / 60;
    const freq = bps * Math.PI * 2;

    function animate(time) {
        if (!running) return;

        if (!startTime) startTime = time;

        const elapsed = (time - startTime) / 1000;

        if (elapsed >= 10) {
            stopParty();
            return;
        }

        const beat = Math.floor(elapsed * bps);

        if (beat !== lastBeat && window.party) {
            lastBeat = beat;

            party.confetti(
                { x: innerWidth * 0.2, y: innerHeight },
                { count: 25, angle: -60, spread: 30 }
            );

            party.confetti(
                { x: innerWidth * 0.8, y: innerHeight },
                { count: 25, angle: -120, spread: 30 }
            );
        }

        bonzis.forEach((b, i) => {
            const phase = elapsed * freq + i * 0.5;

            const bounce = Math.abs(Math.sin(phase)) * -35;
            const sway = Math.sin(phase) * 25;
            const squash = Math.cos(phase * 2) * 0.2;

            b.style.transform = `
                translate(${sway}px, ${bounce}px)
                scaleX(${1 - squash})
                scaleY(${1 + squash})
                skewX(${Math.cos(phase) * 10}deg)
            `;

            b.style.transformOrigin = "bottom center";
            b.style.filter = "brightness(1) contrast(120%)";
        });

        requestAnimationFrame(animate);
    }

    function stopParty() {
        running = false;
        audio.pause();
        audio.currentTime = 0;

        bonzis.forEach(b => {
            b.style.transform = "";
            b.style.filter = "";
            b.style.transformOrigin = "";
        });
    }

    function startParty() {
        if (running) return;

        bonzis = document.querySelectorAll(".bonzi");

        running = true;
        startTime = 0;
        lastBeat = -1;

        audio.play().catch(console.error);

        requestAnimationFrame(animate);
    }

    function begin() {
        if (window.party) {
            startParty();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/party-js@2/bundle/party.min.js";
        script.onload = startParty;
        script.onerror = () => console.error("Failed to load Party.js");
        document.head.appendChild(script);
    }

    document.addEventListener("click", begin, { once: true });
});
