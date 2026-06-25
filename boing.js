(function () {
    const targets = document.querySelectorAll('.bonzi');
    if (targets.length === 0) {
        return;
    }

    let running = true;
    let start = null;

    const gravity = 2400;       
    const bounceFactor = -0.5;  
    const boingUrl = "https://www.myinstants.com/media/sounds/cartoon-boing_7vRWDlc.mp3";

    const initialOffset = -window.innerHeight - 200;

    const physicsData = Array.from(targets, (el, index) => {
        el.style.transformOrigin = "bottom center";
        
        return {
            element: el,
            y: initialOffset,            
            velocity: 0,        
            delay: index * 0.7, 
            rotation: -45 + (Math.random() * 90),
            rotationSpeed: -180 + (Math.random() * 360),
            hasLanded: false
        };
    });

    function physicsLoop(timestamp) {
        if (!running) return;
        if (!start) start = timestamp;
        
        const totalElapsed = (timestamp - start) / 1000;

        if (totalElapsed >= 10) {
            reset();
            return;
        }

        physicsData.forEach((data) => {
            if (totalElapsed < data.delay) {
                data.element.style.transform = `translateY(${initialOffset}px) rotate(${data.rotation}deg)`;
                return;
            }

            const dt = 0.016; 

            if (!data.hasLanded) {
                data.velocity += gravity * dt;
                data.y += data.velocity * dt;
                data.rotation += data.rotationSpeed * dt;
            }

            if (data.y >= 0) {
                data.y = 0; 
                data.rotation = 0;
                data.rotationSpeed = 0;
                
                if (Math.abs(data.velocity) > 200) {
                    data.velocity *= bounceFactor; 

                    const audioInstance = new Audio(boingUrl);
                    audioInstance.volume = 0.35;
                    audioInstance.play().catch(() => {});
                } else {
                    data.velocity = 0; 
                    data.hasLanded = true;
                }
            }

            let scaleY = 1;
            let groundTilt = 0;
            
            if (!data.hasLanded && data.y === 0) {
                const impactForce = Math.abs(data.velocity) / 1200;
                scaleY = Math.max(0.5, 1 - impactForce);
                groundTilt = (data.velocity > 0 ? 12 : -12);
            }

            if (data.hasLanded) {
                data.element.style.transform = `translateY(${data.y}px) scaleY(1) rotate(0deg)`;
            } else if (data.y === 0) {
                data.element.style.transform = `translateY(${data.y}px) scaleY(${scaleY}) rotate(${groundTilt}deg)`;
            } else {
                data.element.style.transform = `translateY(${data.y}px) rotate(${data.rotation}deg)`;
            }
        });

        requestAnimationFrame(physicsLoop);
    }

    function reset() {
        running = false;
        targets.forEach(el => {
            el.style.transform = "";
            el.style.transformOrigin = "";
        });
    }

    requestAnimationFrame(physicsLoop);

    window.stopHiddenGravityDrop = reset;
})();
