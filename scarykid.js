// =======================
// Horror Effect Sequence
// =======================

// ----- Sound -----
const bgSound = new Audio("https://files.catbox.moe/fqv36d.mp3");
bgSound.volume = 0.9;

// ----- Settings -----
const duration = 23000;       // Total runtime
const textSpawnTime = 22000;  // Text appears during the last second

const maxShake = 1000;        // Violent shake
const maxZoom = 3.5;          // Fast, deep zoom
const spinStart = 4000;       // Spin starts after 4 seconds
const maxRotation = 10800;    // 30 full spins for extreme speed
const spawnRate = 100;

let startTime = null;
let animationFrame = null;
let textInterval = null;

document.body.style.transformOrigin = "center center";

// =======================
// Text Pool
// =======================

const textPool = [];
const poolSize = 25;
let poolIndex = 0;

for (let i = 0; i < poolSize; i++) {
    const text = document.createElement("div");

    text.textContent = "IT WATCHES YOU";
    text.style.position = "fixed";
    text.style.display = "none";
    text.style.fontFamily = "Tahoma, sans-serif";
    text.style.fontWeight = "bold";
    text.style.fontSize = "32px";
    text.style.color = "#ff0000"; // Sharp, bright aggressive red
    text.style.pointerEvents = "none";
    text.style.userSelect = "none";
    text.style.zIndex = "999999";

    document.body.appendChild(text);
    textPool.push(text);
}

function spawnText() {
    const text = textPool[poolIndex];

    text.style.display = "block";
    text.style.left = Math.random() * (window.innerWidth - 250) + "px";
    text.style.top = Math.random() * (window.innerHeight - 60) + "px";
    text.style.fontSize = (24 + Math.random() * 24) + "px";

    poolIndex = (poolIndex + 1) % poolSize;
}

// =======================
// Animation
// =======================

function animate(timestamp) {
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Start text in the final second
    if (elapsed >= textSpawnTime && !textInterval) {
        textInterval = setInterval(spawnText, spawnRate);
    }

    // Shake gets more violent over time
    const shake = maxShake * Math.pow(progress, 2.5);

    const shakeX = (Math.random() - 0.5) * shake;
    const shakeY = (Math.random() - 0.5) * shake;

    // Zoom accelerates aggressively (No fading/opacity changes!)
    const zoomProgress = Math.pow(progress, 4);
    const zoom = 1 + (maxZoom - 1) * zoomProgress;

    // Spin starts after 4 seconds and accelerates exponentially
    let rotation = 0;

    if (elapsed >= spinStart) {
        const spinProgress = Math.min(
            (elapsed - spinStart) / (duration - spinStart),
            1
        );

        rotation = maxRotation * Math.pow(spinProgress, 3);
    }

    // Apply transformations
    document.body.style.transform =
        `translate(${shakeX}px, ${shakeY}px) scale(${zoom}) rotate(${rotation}deg)`;
        
    // Create a harsh, direct red matrix shift over time (forces all channels to crush into pure red)
    const r = progress; 
    document.body.style.filter = `matrix3d(
        1, 0, 0, 0,
        ${r}, 0, 0, 0,
        ${r}, 0, 0, 0,
        0, 0, 0, 1
    ) saturate(${100 + progress * 300}%) contrast(${100 + progress * 100}%)`;

    if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
    } else {
        stopEffects();
    }
}

// =======================
// Cleanup
// =======================

function stopEffects() {
    cancelAnimationFrame(animationFrame);

    if (textInterval) {
        clearInterval(textInterval);
        textInterval = null;
    }

    bgSound.pause();
    bgSound.currentTime = 0;

    document.body.style.transform =
        "translate(0px,0px) scale(1) rotate(0deg)";
    document.body.style.filter = "none";

    textPool.forEach(text => {
        text.style.display = "none";
    });

    startTime = null;
}

// =======================
// Start
// =======================

function startEffects() {
    bgSound.play().then(() => {
        requestAnimationFrame(animate);
    }).catch(() => {
        const clickStart = () => {
            bgSound.play().then(() => {
                requestAnimationFrame(animate);
            });

            document.removeEventListener("click", clickStart);
        };

        document.addEventListener("click", clickStart);
    });
}

startEffects();
