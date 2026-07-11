(function(){

// =====================
// STYLES
// =====================

const style=document.createElement("style");

style.innerHTML=`

@keyframes screenShake {
0% {transform:translate(0,0);}
20% {transform:translate(-15px,10px);}
40% {transform:translate(12px,-12px);}
60% {transform:translate(-10px,-8px);}
80% {transform:translate(12px,8px);}
100% {transform:translate(0,0);}
}

.screen-shake {
animation:screenShake .08s infinite;
}


@keyframes alertShake {
0% {transform:translateX(-50%);}
25% {transform:translateX(calc(-50% - 8px));}
50% {transform:translateX(calc(-50% + 8px));}
75% {transform:translateX(calc(-50% - 5px));}
100% {transform:translateX(-50%);}
}


.system-warning {

position:fixed;
top:20px;
left:50%;

font-family:Arial Black,sans-serif;
font-size:38px;

color:red;

text-align:center;

text-shadow:
0 0 10px red,
0 0 35px red;

z-index:99999999;

animation:alertShake .08s infinite;

pointer-events:none;

}



.red-alert {

position:fixed;
inset:0;

background:red;

z-index:9999998;

animation:redFlash .25s infinite;

pointer-events:none;

}


@keyframes redFlash {

0%,100% {
opacity:.1;
}

50% {
opacity:.5;
}

}



.saved {

position:fixed;

top:50%;
left:50%;

transform:translate(-50%,-50%);

font-family:Arial Black,sans-serif;

font-size:90px;

color:lime;

text-shadow:
0 0 20px lime,
0 0 50px lime;

z-index:999999999;

animation:savedPulse .5s infinite;

}


@keyframes savedPulse {

0%,100%{
scale:1;
}

50%{
scale:1.1;
}

}

`;

document.head.appendChild(style);




// =====================
// WARNING COUNTDOWN
// =====================


const warning=document.createElement("div");

warning.className="system-warning";

warning.innerHTML=
`
SYSTEM FAIL<br>
COOLDOWN IN <span id="timer">22</span> SECONDS
`;

document.body.appendChild(warning);



let seconds=22;

const timer=document.getElementById("timer");


const countdown=setInterval(()=>{

seconds--;

timer.textContent=seconds;


if(seconds<=0){

clearInterval(countdown);

}

},1000);





// =====================
// ALERT OVERLAY
// =====================


const redAlert=document.createElement("div");

redAlert.className="red-alert";

redAlert.style.display="none";

document.body.appendChild(redAlert);




// =====================
// EXPLOSION FUNCTION
// =====================


function playRandomBoom(x,y){


const boomSound=new Audio(
"https://www.myinstants.com/media/sounds/roblox-explosion-sound.mp3"
);


boomSound.volume=1;

boomSound.playbackRate=
0.6+Math.random()*1.8;


boomSound.play().catch(()=>{});



const boom=document.createElement("div");


boom.style.position="fixed";

boom.style.width="150px";

boom.style.height="150px";


boom.style.backgroundImage=
'url("https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyNHlnaTlqZ2cwc3liMWFsZjEyYjhvZ2lzMDByeTVva3J1Y2lsdGdoaSZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/pKWCBvHevLcMU/200w.gif")';



boom.style.backgroundSize="contain";

boom.style.backgroundRepeat="no-repeat";

boom.style.backgroundPosition="center";


boom.style.left=x+"px";

boom.style.top=y+"px";


boom.style.zIndex="9999997";


boom.style.transform=
`
scale(${0.7+Math.random()*1.5})
rotate(${Math.random()*360}deg)
`;



document.body.appendChild(boom);



setTimeout(()=>{

boom.remove();

},500);



}




// =====================
// MUSIC
// =====================


const music=new Audio(
"https://files.catbox.moe/zha97g.mp3"
);


music.loop=true;

music.volume=.8;

music.play().catch(()=>{});



let boomLoop=null;

let alarm=null;





// =====================
// FAILURE START AFTER 10s
// =====================


setTimeout(()=>{


// shake screen

document.documentElement.classList.add(
"screen-shake"
);



// red emergency flash

redAlert.style.display="block";



// alarm

alarm=new Audio(
"https://www.myinstants.com/media/sounds/air-raid-siren.mp3"
);


alarm.loop=true;

alarm.volume=1;


alarm.play().catch(()=>{});




// explosions everywhere

boomLoop=setInterval(()=>{


playRandomBoom(

Math.random()*(innerWidth-150),

Math.random()*(innerHeight-150)

);


},100);



},10000);






// =====================
// GOOD ENDING AT 22s
// =====================


setTimeout(()=>{


// stop explosions

if(boomLoop){

clearInterval(boomLoop);

}



// stop shaking

document.documentElement.classList.remove(
"screen-shake"
);



// stop red alert

redAlert.style.display="none";



// stop alarm

if(alarm){

alarm.pause();

alarm.currentTime=0;

}



// stop music

music.pause();

music.currentTime=0;




clearInterval(countdown);



// remove warning

warning.remove();




// SAVED MESSAGE

const saved=document.createElement("div");

saved.className="saved";

saved.innerHTML="SAVED!";

document.body.appendChild(saved);



setTimeout(()=>{

saved.remove();

},5000);



},22000);



})();
