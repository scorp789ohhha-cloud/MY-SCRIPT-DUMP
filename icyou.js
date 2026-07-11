(function(){
for (let bonzi of bonzis.values()) {
if (bonzi.userPublic.name !== "DarlloGuy") continue;

const el = bonzi.element;
const originalTransform = el.style.transform;
const originalTransformOrigin = el.style.transformOrigin;
const originalFilter = el.style.filter;
const originalHatDisplay = bonzi.hatLayer.style.display;
const originalBackgroundImage = el.style.backgroundImage;
const originalBackgroundSize = el.style.backgroundSize;

setTimeout(()=>{
// --- PHASE 1: TRANSFORMATION & BUZZ (0s - 8s) ---
el.style.backgroundImage = 'url("https://files.catbox.moe/dwp6bu.png")';
el.style.backgroundSize = "contain";
bonzi.hatLayer.style.display = "none";
el.style.transformOrigin = "center bottom";
el.style.filter = "contrast(1.3) saturate(1.4)";

const ctx = new (window.AudioContext||window.webkitAudioContext)();
const o1 = ctx.createOscillator();
const o2 = ctx.createOscillator();
const g = ctx.createGain();
o1.type = "sawtooth";
o2.type = "square";
o1.frequency.value = 55;
o2.frequency.value = 57;
g.gain.value = 0.06;
o1.connect(g);
o2.connect(g);
g.connect(ctx.destination);
o1.start();
o2.start();

const buzzIv = setInterval(()=>{
o1.frequency.value = 55+Math.random()*40;
o2.frequency.value = 57+Math.random()*40;
g.gain.value = 0.03+Math.random()*0.08;
},80);

let t=0;
let height=1;
const growSpeed=0.015;
const animIv = setInterval(()=>{
t += 0.1;
height += growSpeed;
const jitterX = (Math.random()-0.5)*8;
const skew = Math.sin(t*2)*4;
el.style.transform = `translate(${jitterX}px,0px) scaleY(${height}) scaleX(${1-Math.min(height*0.05,0.4)}) rotate(${skew}deg) skew(${skew}deg)`;
},50);

// --- PHASE 2: GO BLACK & AUDIO PLAYBACK (Starts at 8s) ---
setTimeout(()=>{
clearInterval(animIv);
clearInterval(buzzIv);
o1.stop();
o2.stop();
ctx.close();

// Keep the fully stretched transform from the end of the animation
const finalStretchedTransform = el.style.transform;

// Go black for 0.2 seconds by hiding the sprite and showing a black background color
el.style.backgroundImage = 'none';
el.style.backgroundColor = '#000000';

// Initialize and play audio
const audio = new Audio("https://files.catbox.moe/ull3ny.mp3");
audio.play().catch(e => console.log("Audio playback failed:", e));

// After 0.2 seconds (8.2s total mark), display the stretched evil sprite with 4000 contrast & 0.5 brightness
let flickerIv;
setTimeout(()=>{
el.style.backgroundColor = 'transparent';
el.style.backgroundImage = 'url("https://files.catbox.moe/dwp6bu.png")';
el.style.filter = "contrast(4000%) brightness(0.5)";
el.style.transform = finalStretchedTransform;
}, 200);

// --- PHASE 3: THE STRETCHED EVIL BONZI FLICKERS (Starts at 58s total mark) ---
setTimeout(()=>{
let isVisible = true;
flickerIv = setInterval(()=>{
isVisible = !isVisible;
// Flickers the visibility of the stretched evil Bonzi directly
el.style.opacity = isVisible ? "1" : "0";
}, 50); // Rapid glitch/flicker speed
}, 50000); // 50 seconds after the audio starts = 58 seconds total

// --- PHASE 4: COMPLETE RESET (Starts at 1:05 / 65s total mark) ---
setTimeout(()=>{
if (flickerIv) clearInterval(flickerIv);
audio.pause();
audio.currentTime = 0;

// Completely restore original properties
el.style.opacity = "1";
el.style.transform = originalTransform;
el.style.filter = originalFilter;
el.style.transformOrigin = originalTransformOrigin;
el.style.backgroundImage = originalBackgroundImage;
el.style.backgroundSize = originalBackgroundSize;
el.style.backgroundColor = 'transparent';
bonzi.updateSprite();
bonzi.hatLayer.style.display = originalHatDisplay;
}, 57000); // 8s + 57s = 65s total (1:05)

},8000);

},10000);
}
})();
