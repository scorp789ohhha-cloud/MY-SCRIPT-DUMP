let words=['STUPID','NASTY','BONZI.GAY','HTTPS://FACEBOOK.COM','FAMILY','GUY','FUNNY','MOMENTS','LOLCOWS.COM','TWITTER.COM DRAMA','DISNEY PLUS','STUPID CARTOON CAR'];
let bs=[...document.querySelectorAll('.bonzi')];
let dead=new Set();
let over=false;

let books=Array.from({length:8},(_,i)=>{
  let w=document.createElement('div');
  w.style.cssText='position:fixed;width:70px;z-index:9998;left:'+(Math.random()*90)+'vw;top:'+(Math.random()*80)+'vh';
  w.innerHTML='<img src="https://files.catbox.moe/y9hp6z.png" style="width:100%;display:block"><div style="position:absolute;top:0;left:0;width:100%;overflow:hidden;height:16px;font:bold 10px monospace;color:#fff;background:#000;white-space:nowrap"><span style="position:relative;display:inline-block"></span></div>';
  document.body.appendChild(w);
  let span=w.querySelector('span');
  span.textContent=words[Math.floor(Math.random()*words.length)];
  span.style.left='100%';
  let dir=Math.random()<0.5?1:-1;
  let x=Math.random()*90,y=Math.random()*80,vx=(Math.random()-0.5)*1.5,vy=(Math.random()-0.5)*1.5,scrollX=100;
  w.isMercy=false;
  return{el:w,span,x,y,vx,vy,dir,scrollX};
});

let mercyTimer=Math.random()*5000+4000,elapsed=0;

let d=setInterval(()=>{
  if(over)return;
  elapsed+=16;
  books.forEach(bk=>{
    bk.x+=bk.vx;
    bk.y+=bk.vy;
    if(bk.x<0||bk.x>90)bk.vx*=-1;
    if(bk.y<0||bk.y>80)bk.vy*=-1;
    bk.el.style.left=bk.x+'vw';
    bk.el.style.top=bk.y+'vh';
    bk.scrollX-=bk.dir*1.5;
    if(bk.scrollX<-100)bk.scrollX=100;
    if(bk.scrollX>100)bk.scrollX=-100;
    bk.span.style.left=bk.scrollX+'%';
    let br=bk.el.getBoundingClientRect();
    bs.forEach((bz,i)=>{
      if(dead.has(i))return;
      let r=bz.getBoundingClientRect();
      if(Math.abs(r.left-br.left)<40&&Math.abs(r.top-br.top)<40){
        if(bk.isMercy){
          over=true;
          clearInterval(d);
          let msg=document.createElement('div');
          msg.style.cssText='position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:9999;font:bold 24px sans-serif;color:#fff;background:#000;padding:8px 16px;border-radius:8px';
          msg.textContent=(bz.getAttribute('data-username')||bz.getAttribute('data-name')||'A bonzi')+' found MERCY and WON!';
          document.body.appendChild(msg);
          books.forEach(bb=>bb.el.remove());
          setTimeout(()=>msg.remove(),6000);
        }else{
          dead.add(i);
          bz.style.filter='contrast(1000) hue-rotate(-60deg) saturate(5)';
        }
      }
    });
  });
  if(elapsed>=mercyTimer&&!books.some(bb=>bb.isMercy)){
    let mb=books[Math.floor(Math.random()*books.length)];
    mb.isMercy=true;
    mb.span.textContent='MERCY';
    mb.span.style.color='#0f0';
  }
},16);
