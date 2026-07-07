(function(){
for (let bonzi of bonzis.values()) {
if (bonzi.userPublic.name !== "DarlloGuy") continue;

const el = bonzi.element;
const originalTransform = el.style.transform;
const originalTransformOrigin = el.style.transformOrigin;
const originalFilter = el.style.filter;
const originalHatDisplay = bonzi.hatLayer.style.display;

setTimeout(()=>{
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

setTimeout(()=>{
clearInterval(animIv);
clearInterval(buzzIv);
o1.stop();
o2.stop();
ctx.close();

el.style.transform = originalTransform;
el.style.filter = originalFilter;
el.style.transformOrigin = originalTransformOrigin;
bonzi.updateSprite();
bonzi.hatLayer.style.display = originalHatDisplay;
},8000);

},10000);
}
})();
