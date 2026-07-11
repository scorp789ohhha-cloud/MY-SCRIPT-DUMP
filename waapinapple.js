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
@keyframes bonziSquish{
0%{transform:scaleY(1) scaleX(1);}
50%{transform:scaleY(0.6) scaleX(1.3);}
100%{transform:scaleY(1) scaleX(1);}
}
.bonzi-squish{
animation:bonziSquish 0.2s ease-in-out infinite;
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
let moveDuration=450;
let hitPause=200;


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


function startCryingLoop(){

const shuffled=[...bonziList].sort(()=>Math.random()-0.5);
const criers=shuffled.slice(0,Math.min(3,shuffled.length));

criers.forEach(b=>{

b.element.classList.add("bonzi-squish");

const cryAudio=new Audio("https://files.catbox.moe/712yuh.mp3");
cryAudio.playbackRate=0.7+Math.random()*1.6;
cryAudio.play().catch(()=>{});

});

return criers;

}


function stopCryingLoop(criers){

criers.forEach(b=>{
b.element.classList.remove("bonzi-squish");
});

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

const criers=startCryingLoop();

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

document.body.classList.remove("screen-shake");

stopCryingLoop(criers);

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



pineapple.style.transition=
`left ${moveDuration}ms cubic-bezier(0.25,1,0.5,1),
top ${moveDuration}ms cubic-bezier(0.25,1,0.5,1)`;


pineapple.style.left=targetX+"px";
pineapple.style.top=targetY+"px";



setTimeout(()=>{


const hitAudio=new Audio(
"https://files.catbox.moe/1iz879.mp3"
);

hitAudio.play().catch(()=>{});


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
45,
moveDuration-45
);

hitPause=Math.max(
25,
hitPause-25
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
