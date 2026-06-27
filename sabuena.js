(function () {
    const bonzis = document.querySelectorAll('.bonzi');
    if (!bonzis.length) return;

    let audio = new Audio("https://files.catbox.moe/m4cdq8.mp3");
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 1;

    let running = false;
    let start;
    let lastBeatIndex = -1;

    const bpm = 103;
    const bps = bpm / 60;
    const freq = bps * Math.PI * 2;

    function loop(t) {
        if (!running) return;
        if (!start) start = t;

        const elapsed = (t - start) / 1000;
        if (elapsed >= 10) return reset();

        const beat = Math.floor(elapsed * bps);
        if (beat > lastBeatIndex) {
            lastBeatIndex = beat;
            if (window.party) {
                window.party.confetti({ x: window.innerWidth * 0.2, y: window.innerHeight }, { count: 25, angle: -60, spread: 30 });
                window.party.confetti({ x: window.innerWidth * 0.8, y: window.innerHeight }, { count: 25, angle: -120, spread: 30 });
            }
        }

        bonzis.forEach((b, i) => {
            const phase = elapsed * freq + i * 0.5;
            const bounce = Math.abs(Math.sin(phase)) * -35;
            const sway = Math.sin(phase) * 25;
            const s = Math.cos(phase * 2) * 0.2;

            b.style.transform = `translate(${sway}px,${bounce}px) scaleX(${1 - s}) scaleY(${1 + s}) skewX(${Math.cos(phase) * 10}deg)`;
            b.style.transformOrigin = "bottom center";
            b.style.filter = "brightness(1) contrast(120%)";
        });

        requestAnimationFrame(loop);
    }

    function reset() {
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
        running = true;
        start = null;
        lastBeatIndex = -1;
        
        audio.play().catch(e => console.log("Audio playback delayed or blocked:", e));
        requestAnimationFrame(loop);
    }

    document.addEventListener("click", () => {
        startParty();
    }, { once: true });

    if (!window.party) {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/party-js@2/bundle/party.min.js";
        document.head.appendChild(s);
    }
})();
