(function () {
    const bonzis = document.querySelectorAll('.bonzi');
    const content = document.getElementById('content') || document.body;

    // --- Setup Audio (Shepard Tone) ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
        console.error("Web Audio API not supported in this browser.");
        return;
    }
    const audioCtx = new AudioContext();
    
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    const numOscillators = 5;
    const oscillators = [];
    const oscGains = [];
    const baseFreq = 110;

    for (let i = 0; i < numOscillators; i++) {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'triangle'; 
        osc.frequency.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        
        osc.connect(gainNode);
        gainNode.connect(masterGain);
        
        osc.start();
        
        oscillators.push(osc);
        oscGains.push(gainNode);
    }
    // ----------------------------------

    // --- Setup Trippy Canvas Background ---
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    
    if (window.getComputedStyle(content).position === 'static') {
        content.style.position = 'relative';
    }
    content.insertBefore(canvas, content.firstChild);
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = content.clientWidth;
        canvas.height = content.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    // --------------------------------------

    // --- Initialize DVD Bounce State for each Element ---
    // We give each element its own independent position, base speed, and random starting angle
    const bonziStates = Array.from(bonzis).map((b, i) => {
        // Ensure standard absolute positioning so we can move them freely across the container
        b.style.position = 'absolute';
        
        const rect = b.getBoundingClientRect();
        const containerRect = content.getBoundingClientRect();

        // Start them roughly near the center or spaced out
        const startX = (containerRect.width - rect.width) / 2 + (i * 30 - (bonzis.length * 15));
        const startY = (containerRect.height - rect.height) / 2 + (i * 30 - (bonzis.length * 15));
        
        // Random starting direction angles
        const angle = Math.random() * Math.PI * 2;
        const baseVelocity = 150; // Base pixels per second

        return {
            element: b,
            width: rect.width || 50,  // Fallback if elements aren't fully rendered yet
            height: rect.height || 50,
            x: Math.max(0, startX),
            y: Math.max(0, startY),
            dx: Math.cos(angle) * baseVelocity,
            dy: Math.sin(angle) * baseVelocity
        };
    });
    // -----------------------------------------------------

    const start = performance.now();
    let running = true;
    
    let accumulatedPhase = 0;
    let lastElapsed = 0;

    function loop(t) {
        if (!running) return;

        const elapsed = (t - start) / 1000;

        // Stop after 20 seconds
        if (elapsed >= 20) {
            reset();
            return;
        }

        const delta = elapsed - lastElapsed;
        lastElapsed = elapsed;

        // SPEED MULTIPLIER: Ramps up smoothly over 20 seconds
        const currentSpeed = 5 + (elapsed * 1.2); 
        accumulatedPhase += delta * currentSpeed;

        const fixedBrightness = 1;
        const fixedContrast = 120;

        // 1. Audio Engine: Update Shepard Tone
        const audioPhase = (accumulatedPhase * 0.05) % 1; 

        for (let i = 0; i < numOscillators; i++) {
            let l = (audioPhase + (i / numOscillators)) % 1;
            const freq = baseFreq * Math.pow(2, l * numOscillators);
            const gain = Math.sin(l * Math.PI);
            
            oscillators[i].frequency.setValueAtTime(freq, audioCtx.currentTime);
            oscGains[i].gain.setValueAtTime(gain * 0.2, audioCtx.currentTime); 
        }

        // 2. Render Canvas Waves
        if (canvas.width > 0 && canvas.height > 0) {
            const width = canvas.width;
            const height = canvas.height;
            const imgData = ctx.createImageData(width, height);
            const data = imgData.data;

            const waveFrequency = 0.01 + (elapsed * 0.002);

            for (let y = 0; y < height; y += 4) {
                for (let x = 0; x < width; x += 4) {
                    const v1 = Math.sin(x * waveFrequency + accumulatedPhase);
                    const v2 = Math.sin(y * waveFrequency + accumulatedPhase * 1.5);
                    const v3 = Math.sin((x + y) * waveFrequency + accumulatedPhase);
                    const cx = x - width / 2;
                    const cy = y - height / 2;
                    const v4 = Math.sin(Math.sqrt(cx * cx + cy * cy) * waveFrequency - accumulatedPhase);
                    
                    const totalWave = (v1 + v2 + v3 + v4) / 4;

                    const r = Math.floor((Math.sin(totalWave * Math.PI) + 1) * 127.5);
                    const g = Math.floor((Math.sin(totalWave * Math.PI + (2 * Math.PI / 3)) + 1) * 127.5);
                    const b = Math.floor((Math.sin(totalWave * Math.PI + (4 * Math.PI / 3)) + 1) * 127.5);

                    for (let dx = 0; dx < 4 && (x + dx) < width; dx++) {
                        for (let dy = 0; dy < 4 && (y + dy) < height; dy++) {
                            const pixelIndex = ((y + dy) * width + (x + dx)) * 4;
                            data[pixelIndex] = r;
                            data[pixelIndex + 1] = g;
                            data[pixelIndex + 2] = b;
                            data[pixelIndex + 3] = 255;
                        }
                    }
                }
            }
            ctx.putImageData(imgData, 0, 0);
        }

        // 3. Update DVD Positions & Render Visual Transformations
        const containerWidth = content.clientWidth;
        const containerHeight = content.clientHeight;

        // Velocity multiplier escalates alongside the animation speed
        const speedFactor = 1 + (elapsed * 0.4); 

        bonziStates.forEach((state, i) => {
            const b = state.element;
            const elementPhase = accumulatedPhase + i * 0.6; 

            // Update positions based on delta time and tracking momentum
            state.x += state.dx * delta * speedFactor;
            state.y += state.dy * delta * speedFactor;

            // Bounce check Left / Right boundaries
            if (state.x <= 0) {
                state.x = 0;
                state.dx = -state.dx;
            } else if (state.x + state.width >= containerWidth) {
                state.x = containerWidth - state.width;
                state.dx = -state.dx;
            }

            // Bounce check Top / Bottom boundaries
            if (state.y <= 0) {
                state.y = 0;
                state.dy = -state.dy;
            } else if (state.y + state.height >= containerHeight) {
                state.y = containerHeight - state.height;
                state.dy = -state.dy;
            }

            // Jelly physics (Sway + Skew)
            const sway = Math.sin(elementPhase) * 20;
            const skewX = Math.cos(elementPhase) * 15;

            // Jelly Squish & Stretch
            const squishX = 1 - Math.cos(elementPhase * 2) * 0.25;
            const squishY = 1 + Math.cos(elementPhase * 2) * 0.25;

            // Continuous Spin
            const spinAngle = (accumulatedPhase * 25) + (i * 20);

            // Zoom In / Out cycle
            const zoomPulse = 1 + (Math.sin(elementPhase * 0.4) * 0.3);
            const finalScaleX = squishX * zoomPulse;
            const finalScaleY = squishY * zoomPulse;

            // Use translate() to map the raw DVD screen positions alongside the subtle physics adjustments
            b.style.transform = `translate(${state.x + sway}px, ${state.y}px) rotate(${spinAngle}deg) scaleX(${finalScaleX}) scaleY(${finalScaleY}) skewX(${skewX}deg)`;
            b.style.filter = `brightness(${fixedBrightness}) contrast(${fixedContrast}%)`;
            b.style.transformOrigin = "center center";
        });

        requestAnimationFrame(loop);
    }

    function reset() {
        running = false;
        window.removeEventListener('resize', resizeCanvas);
        
        oscillators.forEach(osc => {
            try { osc.stop(); } catch(e) {}
        });
        audioCtx.close();

        if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }

        bonziStates.forEach(state => {
            const b = state.element;
            b.style.position = "";
            b.style.transform = "";
            b.style.filter = "";
            b.style.transformOrigin = "";
        });
    }

    requestAnimationFrame(loop);
})();
