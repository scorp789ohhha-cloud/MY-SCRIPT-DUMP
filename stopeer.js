(function () {
    // --- 1. Clear State and Duplication Guard ---
    window.__frutigerCubeRunning__ = false;

    // --- 2. Stop and Clean Up Audio Pipeline ---
    if (window.__frutigerAudioInstance__) {
        try {
            window.__frutigerAudioInstance__.pause();
            window.__frutigerAudioInstance__.src = "";
            window.__frutigerAudioInstance__.load();
        } catch (e) {
            console.log("Audio instance cleanup handling...");
        }
        delete window.__frutigerAudioInstance__;
    }

    // --- 3. Cancel Animation Frame Loops ---
    if (window.__frutigerAnimationFrameId__) {
        cancelAnimationFrame(window.__frutigerAnimationFrameId__);
        delete window.__frutigerAnimationFrameId__;
    }

    // --- 4. Remove Performance Canvas and Clean DOM ---
    const existingCanvases = document.querySelectorAll('canvas');
    existingCanvases.forEach(canvas => {
        // Double-check context or style matching to prevent killing unrelated page elements
        if (canvas.style.position === 'absolute' && canvas.style.pointerEvents === 'none') {
            canvas.remove();
        }
    });

    // --- 5. Reset Background Container Properties ---
    const content = document.getElementById('content') || document.body;
    if (content) {
        content.style.backgroundColor = '';
        content.style.overflow = '';
    }

    console.log("Frutiger Aero Script safely and completely terminated.");
})();
