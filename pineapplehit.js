(function(){
    // --- Audio Setup ---
    // Background background music (Slap Slap Slap track)
    const bgAudio = new Audio("https://files.catbox.moe/9w0jek.mp3");
    bgAudio.loop = true;
    bgAudio.play().catch(e => console.log("Background audio playback failed:", e));

    // --- Create the Giant Pineapple ---
    const pineapple = document.createElement("div");
    pineapple.id = "chasing-pineapple";
    pineapple.style.position = "fixed";
    pineapple.style.width = "250px";
    pineapple.style.height = "250px";
    pineapple.style.backgroundImage = 'url("https://files.catbox.moe/x9gadt.png")';
    pineapple.style.backgroundSize = "contain";
    pineapple.style.backgroundRepeat = "no-repeat";
    pineapple.style.backgroundPosition = "center";
    pineapple.style.zIndex = "9999999"; 
    pineapple.style.pointerEvents = "none";
    pineapple.style.transition = "left 0.4s ease-out, top 0.4s ease-out"; // Smooth chasing movement
    
    // Start off-screen
    let currentX = -300;
    let currentY = -300;
    pineapple.style.left = currentX + "px";
    pineapple.style.top = currentY + "px";
    document.body.appendChild(pineapple);

    // --- Gather All Bonzis ---
    const bonziList = Array.from(bonzis.values());
    let targetIndex = 0;

    function chaseNextBonzi() {
        // If all Bonzis have been hit, clean up and stop everything
        if (targetIndex >= bonziList.length) {
            setTimeout(() => {
                bgAudio.pause();
                bgAudio.currentTime = 0;
                pineapple.remove();
            }, 500);
            return;
        }

        const currentTarget = bonziList[targetIndex];
        const el = currentTarget.element;

        // Get target Bonzi's current screen position
        const rect = el.getBoundingClientRect();
        const targetX = rect.left + (rect.width / 2) - 125; 
        const targetY = rect.top + (rect.height / 2) - 125;

        // Move pineapple to the target location
        pineapple.style.left = targetX + "px";
        pineapple.style.top = targetY + "px";

        // Wait for the movement transition to finish, then hit the Bonzi
        setTimeout(() => {
            // Play the specific hit sound effect on impact
            const hitAudio = new Audio("https://files.catbox.moe/1iz879.mp3");
            hitAudio.play().catch(e => console.log("Hit sound playback failed:", e));

            // Impact/Slap visual effect on the target Bonzi
            const originalTransform = el.style.transform;
            el.style.transition = "transform 0.1s ease";
            el.style.transform = `${originalTransform} rotate(45deg) scale(0.6)`;

            // Pineapple aggressive tilt/slam animation
            pineapple.style.transform = "scale(1.3) rotate(-20deg)";

            // Settle both before moving to the next target
            setTimeout(() => {
                el.style.transform = originalTransform;
                pineapple.style.transform = "scale(1) rotate(0deg)";
                
                // Proceed to the next target
                targetIndex++;
                chaseNextBonzi();
            }, 200);

        }, 450); // Matches the 0.4s movement transition duration + brief buffer
    }

    // Start the chase sequence if targets exist
    if (bonziList.length > 0) {
        chaseNextBonzi();
    } else {
        // No targets found, auto clean up
        bgAudio.pause();
        pineapple.remove();
    }
})();
