(function(){

const style=document.createElement("style");
style.innerHTML=`
@keyframes pineappleSlam{
0%{transform:scale(1) rotate(0deg);}
50%{transform:scale(1.3) rotate(-20deg);}
100%{transform:scale(1) rotate(0deg);}
}
.pineapple-slam{
animation:pineappleSlam 0.15s ease-in-out;
}
@keyframes screenShake{
0%{transform:translate(0,0);}
25%{transform:translate(-8px,6px);}
50%{transform:translate(7px,-9px);}
75%{transform:translate(-6px,-5px);}
100%{transform:translate(5px,7px);}
}
.screen-shake{
animation:screenShake 0.08s linear infinite;
}
@keyframes trailFade{
0%{opacity:0.7;}
100%{opacity:0;}
}
.blue-trail{
animation:trailFade 0.25s ease-out forwards;
}`;
document.head.appendChild(style);

const pineapple=document.createElement("div");
pineapple.id="chasing-pineapple";
pineapple.style.position="fixed";
pineapple.style.width="250px";
pineapple.style.height="250px";
pineapple.style.backgroundImage='url("https://files.catbox.moe/x9gadt.png")';
pineapple.style.backgroundSize="contain";
pineapple.style.backgroundRepeat="no-repeat";
pineapple.style.backgroundPosition="center";
pineapple.style.zIndex="9999999";
pineapple.style.pointerEvents="none";
pineapple.style.left="-300px";
pineapple.style.top="-300px";
pineapple.style.filter="hue-rotate(0deg) saturate(100%) brightness(100%)";

document.body.appendChild(pineapple);

const bonziList=Array.from(bonzis.values());

let targetIndex=0;
let currentRun=1;

const totalRuns=3;
let moveDuration=875;
let hitPause=200;
let jaronaRate=1.0;


function playRandomBoom(x,y){
const boomAudio=new Audio("https://www.myinstants.com/media/sounds/roblox-explosion-sound.mp3");
boomAudio.playbackRate=0.6+Math.random()*1.8;
boomAudio.play().catch(()=>{});

const clone=document.createElement("div");
clone.style.position="fixed";
clone.style.width="150px";
clone.style.height="150px";
clone.style.backgroundImage='url("https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyNHlnaTlqZ2cwc3liMWFsZjEyYjhvZ2lzMDByeTVva3J1Y2lsdGdoaSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/pKWCBvHevLcMU/200w.gif")';
clone.style.backgroundSize="contain";
clone.style.backgroundRepeat="no-repeat";
clone.style.backgroundPosition="center";
clone.style.zIndex="9999998";
clone.style.pointerEvents="none";
clone.style.left=x+"px";
clone.style.top=y+"px";
clone.style.transform=`scale(${0.7+Math.random()*1.3}) rotate(${Math.random()*360}deg)`;
document.body.appendChild(clone);

setTimeout(()=>{
clone.remove();
},500);
}


function spawnTrail(){

const trail=document.createElement("div");
trail.className="blue-trail";
trail.style.position="fixed";
trail.style.width="250px";
trail.style.height="250px";
trail.style.left=pineapple.style.left;
trail.style.top=pineapple.style.top;
trail.style.backgroundImage=pineapple.style.backgroundImage;
trail.style.backgroundSize="contain";
trail.style.backgroundRepeat="no-repeat";
trail.style.backgroundPosition="center";
trail.style.zIndex="9999998";
trail.style.pointerEvents="none";
trail.style.filter="brightness(0) saturate(100%) invert(38%) sepia(93%) saturate(2000%) hue-rotate(200deg)";
document.body.appendChild(trail);

setTimeout(()=>{
trail.remove();
},260);

}


function screamAll(){

const shuffled=[...bonziList].sort(()=>Math.random()-0.5);
const screamers=shuffled.slice(0,Math.min(3,shuffled.length));

// Removed baby crying noise

}


function runBonzisToTarget(darlloguyEl){

const rect=darlloguyEl.getBoundingClientRect();
const originalPositions=[];

bonziList.forEach(b=>{

const bRect=b.element.getBoundingClientRect();
originalPositions.push({
el:b.element,
left:b.element.style.left,
top:b.element.style.top,
origTransition:b.element.style.transition
});

b.element.style.transition="left 0.4s ease-in, top 0.4s ease-in";
b.element.style.left=(rect.left+rect.width/2-bRect.width/2)+"px";
b.element.style.top=(rect.top+rect.height/2-bRect.height/2)+"px";

});

setTimeout(()=>{

playRandomBoom(rect.left,rect.top);

setTimeout(()=>{

originalPositions.forEach(p=>{
p.el.style.transition="left 0.5s ease-out, top 0.5s ease-out";
p.el.style.left=p.left;
p.el.style.top=p.top;
});

setTimeout(()=>{
originalPositions.forEach(p=>{
p.el.style.transition=p.origTransition;
});
},520);

},300);

},420);

}


function finalMeltdown(){

const AudioContext=window.AudioContext||window.webkitAudioContext;
const audioCtx=new AudioContext();

fetch("https://files.catbox.moe/rkx79w.wav")
.then(r=>r.arrayBuffer())
.then(data=>audioCtx.decodeAudioData(data))
.then(buffer=>{

const source=audioCtx.createBufferSource();
source.buffer=buffer;

source.connect(audioCtx.destination);

audioCtx.resume();

const startTime=Date.now();

source.start();


let meltInterval=setInterval(()=>{

const elapsed=Date.now()-startTime;
const progress=Math.min(elapsed/(buffer.duration*1000),1);


source.detune.setValueAtTime(
progress*3600,
audioCtx.currentTime
);


const hue=progress*360;

pineapple.style.filter=
`hue-rotate(${hue*3}deg)
saturate(${150+progress*200}%)
brightness(${100+progress*50}%)`;


const randX=Math.random()*(window.innerWidth-250);
const randY=Math.random()*(window.innerHeight-250);

const jumpDuration=Math.max(
30,
150-progress*120
);


pineapple.style.transition=
`left ${jumpDuration}ms ease-out,
top ${jumpDuration}ms ease-out`;

pineapple.style.left=randX+"px";
pineapple.style.top=randY+"px";


pineapple.classList.add("pineapple-slam");

setTimeout(()=>{
pineapple.classList.remove("pineapple-slam");
},jumpDuration*0.8);


},90);


source.onended=()=>{
clearInterval(meltInterval);
audioCtx.close();
explode();
};


})
.catch(e=>{
console.log("Scream failed:",e);
explode();
});

}



function explode(){

pineapple.style.backgroundImage='url("https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyNHlnaTlqZ2cwc3liMWFsZjEyYjhvZ2lzMDByeTVva3J1Y2lsdGdoaSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/pKWCBvHevLcMU/200w.gif")';

pineapple.style.transition=
"transform 0.15s ease-out";

pineapple.style.transform="scale(2.5)";


document.body.classList.add("screen-shake");

const darlloguy=bonziList.find(b=>
(b.username&&b.username.toLowerCase()==="darlloguy")||
(b.name&&b.name.toLowerCase()==="darlloguy")
);

if(darlloguy){
runBonzisToTarget(darlloguy.element);
}

// Make all bonzis jump up and down
bonziList.forEach((b, index) => {
const jumpHeight = 50 + Math.random() * 100;
const duration = 100 + Math.random() * 200;
b.element.style.transition = `transform ${duration}ms ease-in-out`;
b.element.style.transform = `translateY(-${jumpHeight}px)`;

setTimeout(() => {
b.element.style.transition = `transform ${duration}ms ease-in-out`;
b.element.style.transform = `translateY(0px)`;
}, duration);

// Keep them jumping
const jumpInterval = setInterval(() => {
const newJumpHeight = 50 + Math.random() * 150;
b.element.style.transition = `transform ${duration}ms ease-in-out`;
b.element.style.transform = `translateY(-${newJumpHeight}px)`;
setTimeout(() => {
b.element.style.transition = `transform ${duration}ms ease-in-out`;
b.element.style.transform = `translateY(0px)`;
}, duration);
}, duration * 2);

// Store interval for cleanup
b._jumpInterval = jumpInterval;
});

playRandomBoom(pineapple.offsetLeft,pineapple.offsetTop);


const boomInterval=setInterval(()=>{

const randX=Math.random()*(window.innerWidth-250);
const randY=Math.random()*(window.innerHeight-250);

playRandomBoom(randX,randY);

pineapple.style.transition="left 0.05s linear, top 0.05s linear, transform 0.05s linear";
pineapple.style.left=randX+"px";
pineapple.style.top=randY+"px";
pineapple.style.transform=`scale(${1.5+Math.random()*1.5}) rotate(${Math.random()*360}deg)`;

pineapple.classList.remove("pineapple-slam");
void pineapple.offsetWidth;
pineapple.classList.add("pineapple-slam");

},100);


setTimeout(()=>{

clearInterval(boomInterval);

// Clear jump intervals
bonziList.forEach(b => {
if (b._jumpInterval) {
clearInterval(b._jumpInterval);
}
});

document.body.classList.remove("screen-shake");

pineapple.style.transition="opacity 0.2s ease-out";
pineapple.style.opacity="0";

setTimeout(()=>{
pineapple.remove();
style.remove();
},250);

},5000);

}



function chaseNextBonzi(){

if(targetIndex>=bonziList.length){

if(currentRun<totalRuns){

currentRun++;
targetIndex=0;

}else{

finalMeltdown();
return;

}

}


const currentTarget=bonziList[targetIndex];
const el=currentTarget.element;


const rect=el.getBoundingClientRect();

const targetX=
rect.left+(rect.width/2)-125;

const targetY=
rect.top+(rect.height/2)-125;


const jaronaAudio=new Audio("https://www.myinstants.com/media/sounds/deltarune-jarona.mp3");
jaronaAudio.playbackRate=jaronaRate;
jaronaAudio.play().catch(()=>{});


pineapple.style.transition=
`left ${moveDuration}ms cubic-bezier(0.25,1,0.5,1),
top ${moveDuration}ms cubic-bezier(0.25,1,0.5,1)`;


pineapple.style.left=targetX+"px";
pineapple.style.top=targetY+"px";


const trailInterval=setInterval(()=>{
spawnTrail();
},40);



setTimeout(()=>{

clearInterval(trailInterval);


const hitAudio=new Audio(
"https://files.catbox.moe/1iz879.mp3"
);

hitAudio.play().catch(()=>{});


screamAll();


const originalTransform=
el.style.transform;


el.style.transition=
"transform 0.1s ease-out";

el.style.transform=
`${originalTransform} rotate(45deg) scale(0.6)`;


pineapple.classList.add("pineapple-slam");



setTimeout(()=>{


el.style.transform=originalTransform;

pineapple.classList.remove("pineapple-slam");


moveDuration=Math.max(
150,
moveDuration-150
);

hitPause=Math.max(
25,
hitPause-25
);

jaronaRate=Math.min(
3,
jaronaRate+0.1
);


targetIndex++;

chaseNextBonzi();


},hitPause);



},moveDuration);



}



if(bonziList.length>0){

chaseNextBonzi();

}else{

pineapple.remove();
style.remove();

}


})();
