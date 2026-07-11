(function(){const s=document.createElement("style");s.innerHTML=`@keyframes pslam{0%{transform:scale(1) rotate(0deg);}50%{transform:scale(1.3) rotate(-20deg);}100%{transform:scale(1) rotate(0deg);}}.pslam{animation:pslam .15s ease-in-out;}@keyframes shk{0%{transform:translate(0,0);}25%{transform:translate(-8px,6px);}50%{transform:translate(7px,-9px);}75%{transform:translate(-6px,-5px);}100%{transform:translate(5px,7px);}}.shk{animation:shk .08s linear infinite;}`;document.head.appendChild(s);
const cx=window.innerWidth/2-100,cy=window.innerHeight/2-100;
const p=document.createElement("div");p.style.cssText=`position:fixed;width:200px;height:200px;background-image:url('https://files.catbox.moe/x9gadt.png');background-size:contain;background-repeat:no-repeat;z-index:9999999;pointer-events:none;left:${cx}px;top:${cy}px;`;document.body.appendChild(p);
const santa=document.createElement("div");santa.style.cssText="position:fixed;width:220px;height:220px;background-image:url('https://files.catbox.moe/yfquls.png');background-size:contain;background-repeat:no-repeat;z-index:10000000;pointer-events:none;left:-300px;top:-300px;opacity:0;";document.body.appendChild(santa);
function boom(x,y){const a=new Audio("https://www.myinstants.com/media/sounds/roblox-explosion-sound.mp3");a.playbackRate=0.7+Math.random();a.play().catch(()=>{});const g=document.createElement("div");g.style.cssText=`position:fixed;width:150px;height:150px;background-image:url('https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyNHlnaTlqZ2cwc3liMWFsZjEyYjhvZ2lzMDByeTVva3J1Y2lsdGdoaSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/pKWCBvHevLcMU/200w.gif');background-size:contain;background-repeat:no-repeat;z-index:9999998;pointer-events:none;left:${x}px;top:${y}px;`;document.body.appendChild(g);setTimeout(()=>g.remove(),500);}
setTimeout(()=>{
santa.style.transition="opacity .3s";santa.style.left=(cx+250)+"px";santa.style.top=(cy-50)+"px";santa.style.opacity="1";
let angle=0,hits=0;const radius=180,maxHits=10;
const circ=setInterval(()=>{
angle+=Math.PI/3;hits++;
const sx=cx+100+Math.cos(angle)*radius-110,sy=cy+100+Math.sin(angle)*radius-110;
santa.style.left=sx+"px";santa.style.top=sy+"px";
const h=new Audio("https://files.catbox.moe/1iz879.mp3");h.playbackRate=1+Math.random()*0.5;h.play().catch(()=>{});
p.classList.remove("pslam");void p.offsetWidth;p.classList.add("pslam");
document.body.classList.add("shk");setTimeout(()=>document.body.classList.remove("shk"),80);
if(hits>=maxHits){
clearInterval(circ);
santa.style.transition="left 250ms ease-in,top 250ms ease-in";santa.style.left=cx+"px";santa.style.top=cy+"px";
setTimeout(()=>{
const fx=Math.random()*(window.innerWidth-200),fy=Math.random()*(window.innerHeight-200);
p.style.transition="left 400ms cubic-bezier(.5,-0.5,.7,0),top 400ms cubic-bezier(.5,-0.5,.7,0),transform 400ms linear";
p.style.left=fx+"px";p.style.top=fy+"px";p.style.transform="rotate(900deg) scale(1.4)";
setTimeout(()=>{
boom(fx,fy);document.body.classList.add("shk");
setTimeout(()=>{
document.body.classList.remove("shk");
p.style.transition="opacity .2s";p.style.opacity="0";
santa.style.transition="opacity .3s";santa.style.opacity="0";
setTimeout(()=>{p.remove();santa.remove();s.remove();},300);
},400);
},400);
},250);
}
},220);
},9000);
})();
