(function() {
    // 1. Create and configure the Audio object
    const audio = new Audio('https://files.catbox.moe/kpcq8g.wav');
    audio.crossOrigin = "anonymous";

    // 2. Create and style the canvas dynamically
    const canvas = document.createElement('canvas');
    canvas.width = 1000; 
    canvas.height = 1000;
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '99999',
        pointerEvents: 'none'
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;
    let approachScale = 0.1; 
    let isJumpscare = false;

    // 3. Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.1; 

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        let currentScale = approachScale;
        let shakeIntensity = 0;
        let finalX = cx;
        let finalY = cy;

        if (!isJumpscare) {
            // --- STANDARD CREEPY APPROACH ---
            if (approachScale < 2.0) {
                approachScale += 0.015 + (approachScale * 0.01); 
            }
            
            shakeIntensity = Math.pow(approachScale, 2) * 18;
            const bopSpeed = time * 3; 
            const bopY = Math.sin(bopSpeed) * 15;
            const twitch = Math.random() > 0.96 ? (Math.random() - 0.5) * 30 : 0;

            finalX = cx + ((Math.random() - 0.5) * shakeIntensity) + twitch;
            finalY = cy + bopY + ((Math.random() - 0.5) * shakeIntensity) + twitch;
        } else {
            // --- JUMPSCARE MODE ---
            currentScale = 4.5; 
            shakeIntensity = 90; 
            finalX = cx + (Math.random() - 0.5) * shakeIntensity;
            finalY = cy + (Math.random() - 0.5) * shakeIntensity;
        }

        ctx.save();
        
        // Apply zoom
        ctx.translate(cx, cy);
        ctx.scale(currentScale, currentScale);
        ctx.translate(-cx, -cy);

        // --- FLASHING BACKGROUND / DIGITAL GLITCH ---
        const isGlitched = Math.random() > (isJumpscare ? 0.3 : 0.97); 
        if (isGlitched) {
            ctx.fillStyle = isJumpscare ? 'rgba(120, 0, 0, 0.5)' : 'rgba(40, 40, 40, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // --- THE BLACK BODY BASE ---
        ctx.beginPath();
        const headWarpX = isJumpscare ? 0 : Math.sin(time * 2) * 10;
        const headWarpY = isJumpscare ? 0 : Math.cos(time * 1.5) * 15;
        ctx.ellipse(finalX + headWarpX, finalY + headWarpY, 110, 160, Math.sin(time * 0.5) * 0.15, 0, Math.PI * 2);
        
        // Body color is now pure abyssal black, or static grey during glitches
        ctx.fillStyle = isGlitched ? '#1a1a1a' : '#000000'; 
        ctx.fill();
        ctx.lineWidth = 5;
        // Outline slightly lighter so the shape remains visible against dark backgrounds
        ctx.strokeStyle = '#1c1c1c';
        ctx.stroke();

        // --- THE EYE SOCKETS (Empty voids, no eyeballs/pupils) ---
        // Left Eye Socket - Void hole that stretches abnormally
        const leftEyeWarp = isJumpscare ? 25 : Math.sin(time * 4) * 5;
        ctx.beginPath();
        ctx.ellipse(finalX - 45, finalY - 40, 20, 35 + leftEyeWarp, -0.1, 0, Math.PI * 2);
        ctx.fillStyle = isGlitched ? '#220000' : '#0d0d0d';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#3a0000';
        ctx.stroke();

        // Right Eye Socket - Wide, hollow, trembling pit
        const rightEyeWarp = (isJumpscare ? 30 : Math.cos(time * 3) * 6);
        ctx.beginPath();
        ctx.ellipse(finalX + 45, finalY - 35, 25 + rightEyeWarp, 25 + rightEyeWarp, 0.1, 0, Math.PI * 2);
        ctx.fillStyle = isGlitched ? '#220000' : '#0d0d0d';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#3a0000';
        ctx.stroke();

        // --- THE MOUTH (Massive Abyss) ---
        const mouthStretch = isJumpscare ? 130 : Math.min(approachScale * 25, 60);
        const mouthWarp = isJumpscare ? (Math.random() - 0.5) * 20 : Math.abs(Math.sin(time * 5)) * 15;
        
        ctx.beginPath();
        ctx.ellipse(finalX, finalY + 60, 30 + mouthWarp, 35 + mouthStretch, 0, 0, Math.PI * 2);
        ctx.fillStyle = isGlitched ? '#110000' : '#050505'; 
        ctx.fill();
        
        ctx.lineWidth = 3;
        ctx.strokeStyle = isGlitched ? '#ffffff' : '#2a0000';
        ctx.stroke();

        ctx.restore();

        animationFrameId = requestAnimationFrame(animate);
    }

    // 4. Trigger Jumpscare for 3 seconds when the audio ends
    audio.onended = function() {
        isJumpscare = true; 

        setTimeout(() => {
            cancelAnimationFrame(animationFrameId);
            canvas.remove(); 
            audio.remove(); 
        }, 3000);
    };

    // 5. Start sequence
    animate();
    audio.play().catch(err => {
        console.error("Audio playback failed. Click on the page first to allow audio to play!", err);
    });
})();
