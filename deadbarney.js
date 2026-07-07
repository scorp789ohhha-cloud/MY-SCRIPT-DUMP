o=document.body.appendChild(document.createElement('div'));
o.style='position:fixed;inset:0;background:#f004;pointer-events:none;z-index:999999';

A=new Audio('//files.catbox.moe/ay0ip6.mp3');
B=new Audio('//files.catbox.moe/iukh7r.mp3');
C=new Audio('//files.catbox.moe/30xzj8.mp3');

B.loop=1;
C.loop=1;

A.play();
B.play();
C.play();

document.body.style.transformOrigin='50% 50%';

S=setInterval(()=>{
  document.body.style.cssText=
    'transform:translate('+(Math.random()*60-30)+'px,'+
    (Math.random()*60-30)+'px)rotate('+
    (Math.random()*20-10)+'deg)scale(1.3);filter:brightness(.7) contrast(5.9) blur(2px)';
},16);

R=setInterval(()=>{
  r=document.body.appendChild(document.createElement('div'));
  r.style='position:fixed;left:'+(Math.random()*innerWidth)+'px;top:-120px;width:2px;height:120px;background:linear-gradient(transparent,#fff8);pointer-events:none;z-index:999998';
  y=-120;
  t=setInterval(()=>{
    r.style.top=(y+=35)+'px';
    if(y>innerHeight){
      clearInterval(t);
      r.remove();
    }
  },16);
},20);

setTimeout(()=>{
  clearInterval(S);
  clearInterval(R);

  A.pause();
  B.pause();
  C.pause();

  A.currentTime=0;
  B.currentTime=0;
  C.currentTime=0;

  document.body.style='';
  o.remove();
},57000);
