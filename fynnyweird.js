(function(){
const start=Date.now();
const duration=10000;
const bonzis=Array.from(document.querySelectorAll('.bonzi'));
if(!bonzis.length)return;

// pick a random bonzi to become the giant chaser
const chaserIdx=Math.floor(Math.random()*bonzis.length);
const chaser=bonzis[chaserIdx];

// store originals to restore later
const originals=bonzis.map(el=>({
el,
transform:el.style.transform,
transition:el.style.transition,
zIndex:el.style.zIndex
}));

const dirs=bonzis.map((el,i)=>i===chaserIdx?null:{
speed:2+Math.random()*2,
wob:Math.random()*Math.PI*2,
offsetY:(Math.random()-0.5)*100
});

chaser.style.zIndex='9999';

const iv=setInterval(()=>{
const elapsed=Date.now()-start;
if(elapsed>duration){
clearInterval(iv);
originals.forEach(o=>{
o.el.style.transform=o.transform;
o.el.style.transition=o.transition;
o.el.style.zIndex=o.zIndex;
});
return;
}

const progress=elapsed/duration;

bonzis.forEach((el,i)=>{
if(i===chaserIdx){
// giant bonzi chases, slightly behind the fleeing pack, growing
const scale=1+progress*4;
const x=progress*550;
const y=Math.sin(elapsed/120)*15;
el.style.transform=`translateX(${x-80}px) translateY(${y}px) scale(${scale})`;
}else{
const d=dirs[i];
const wobble=Math.sin(elapsed/100+d.wob)*20;
const x=progress*700*d.speed*0.3+progress*300;
const y=d.offsetY+wobble;
const legBob=Math.abs(Math.sin(elapsed/80+i))*10;
el.style.transform=`translateX(${x}px) translateY(${y-legBob}px) rotate(${wobble*0.3}deg)`;
}
});
},16);
})();
