(function(){
const bonzis=Array.from(document.querySelectorAll('.bonzi'));
if(!bonzis.length)return;

const victimIdx=Math.floor(Math.random()*bonzis.length);
const victim=bonzis[victimIdx];

const audio=new Audio('https://www.myinstants.com/media/sounds/sounds_eng-00381.mp3');
audio.play();

const rect=victim.getBoundingClientRect();
const victimY=rect.top;

const eagle=document.createElement('img');
eagle.src='https://files.catbox.moe/kql8xb.png';
eagle.style.cssText=`
position:fixed;
top:${victimY-40}px;
left:-200px;
width:150px;
z-index:99999;
transform:scaleX(1);
transition:left 1s linear;
`;
document.body.appendChild(eagle);

const victimOriginal={
transform:victim.style.transform,
transition:victim.style.transition,
opacity:victim.style.opacity,
position:victim.style.position
};

requestAnimationFrame(()=>{
eagle.style.left=`${window.innerWidth+200}px`;
});

// when eagle reaches the bonzi's position, snatch it along
const flyDuration=1000;
const screenSpan=window.innerWidth+400;
const timeToReachVictim=((rect.left+rect.width/2)+200)/screenSpan*flyDuration;

setTimeout(()=>{
victim.style.transition=`transform ${flyDuration-timeToReachVictim}ms linear`;
victim.style.transform=`translateX(${window.innerWidth+400-(rect.left+rect.width/2)}px) translateY(${-30}px) scale(0.6)`;
victim.style.zIndex='99998';
},timeToReachVictim);

setTimeout(()=>{
eagle.remove();
victim.style.opacity='0';
},flyDuration+100);

setTimeout(()=>{
victim.style.transition='none';
victim.style.transform=victimOriginal.transform;
victim.style.zIndex='';
victim.style.opacity='0';
void victim.offsetWidth;
victim.style.transition='opacity 2s ease-in';
victim.style.opacity='1';
setTimeout(()=>{
victim.style.transition=victimOriginal.transition;
},2000);
},flyDuration+2000);
})();
