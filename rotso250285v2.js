(()=>{

if(window.bookGameCleanup) window.bookGameCleanup();

const WORDS=[
"STUPID","NASTY","BONZI.GAY","HTTPS://FACEBOOK.COM",
"FAMILY","GUY","FUNNY","MOMENTS","LOLCOWS.COM",
"TWITTER.COM DRAMA","DISNEYPLUS","STUPID CARTOON CAR"
];

const BOOK="https://files.catbox.moe/y9hp6z.png";

const MAX_HP=100;
const TEXT_DAMAGE=8;

const objs=[];
const booksL=[];
const booksR=[];
let mercy=null;
let gameOver=false;

const root=document.createElement("div");
root.id="bookGameRoot";
document.body.appendChild(root);

function mk(tag,css){
    const e=document.createElement(tag);
    e.style.cssText=css;
    root.appendChild(e);
    return e;
}

for(let y=0;y<innerHeight+100;y+=102){

    let l=mk("img",`
    position:fixed;
    left:0;
    top:${y}px;
    width:92px;
    z-index:9999;
    pointer-events:none;
    image-rendering:pixelated;
    `);

    l.src=BOOK;
    booksL.push(l);

    let r=mk("img",`
    position:fixed;
    right:0;
    top:${y}px;
    width:92px;
    z-index:9999;
    pointer-events:none;
    image-rendering:pixelated;
    `);

    r.src=BOOK;
    booksR.push(r);
}

document.querySelectorAll(".bonzi").forEach(b=>{

    if(b.querySelector(".bookHp")) return;

    b.dataset.bookhp=MAX_HP;
    b.dataset.bookdead=0;

    const bar=document.createElement("div");
    bar.className="bookHp";

    bar.style.cssText=`
    position:absolute;
    left:10px;
    right:10px;
    bottom:-10px;
    height:6px;
    background:#222;
    border:1px solid #000;
    border-radius:4px;
    overflow:hidden;
    pointer-events:none;
    `;

    const fill=document.createElement("div");

    fill.style.cssText=`
    width:100%;
    height:100%;
    background:#33ff33;
    `;

    bar.appendChild(fill);
    b.appendChild(bar);

});

function dmg(b,n){

    if(b.dataset.bookdead==="1") return;

    let hp=Math.max(
        0,
        (+b.dataset.bookhp)-n
    );

    b.dataset.bookhp=hp;

    const fill=b.querySelector(".bookHp div");

    fill.style.width=hp+"%";

    if(hp<60) fill.style.background="#ffd000";
    if(hp<30) fill.style.background="#ff4040";

    if(hp<=0){

        b.dataset.bookdead=1;
        b.style.filter="grayscale(1)";
        b.style.opacity=".45";

    }
}

function spawnText(){

    if(gameOver) return;
    if(objs.length>7) return;

    const left=Math.random()<.5;

    const side=left?booksL:booksR;

    const book=
        side[
            (Math.random()*side.length)|0
        ];

    const br=book.getBoundingClientRect();

    const t=mk("div","");

    t.textContent=
        WORDS[
            (Math.random()*WORDS.length)|0
        ];

    t.style.cssText=`
    position:fixed;
    top:${br.top+10}px;
    color:#fff;
    font:900 64px Arial;
    white-space:nowrap;
    z-index:9998;
    pointer-events:none;
    `;

    const startX=left?br.right+4:br.left-4-t.offsetWidth;

    t.style.left=startX+"px";

    objs.push({
        el:t,
        x:startX,
        vx:left?2.4:-2.4,
        mercy:false
    });

}

function spawnMercy(){

    if(gameOver||mercy) return;

    const left=Math.random()<.5;

    const side=left?booksL:booksR;

    const book=
        side[
            (Math.random()*side.length)|0
        ];

    const br=book.getBoundingClientRect();

    const t=mk("div","");

    t.textContent="MERCY";

    t.style.cssText=`
    position:fixed;
    top:${br.top+10}px;
    color:#00ff00;
    font:900 64px Arial;
    white-space:nowrap;
    z-index:9999;
    pointer-events:none;
    `;

    const startX=left?br.right+4:br.left-4-t.offsetWidth;

    t.style.left=startX+"px";

    mercy={
        el:t,
        x:startX,
        vx:left?2.2:-2.2,
        mercy:true
    };

}

function endGame(){

    gameOver=true;

    const winners=
    [...document.querySelectorAll(".bonzi")]
    .filter(b=>b.dataset.bookdead!=="1")
    .map(b=>
        b.dataset.username||
        b.dataset.name||
        b.getAttribute("data-name")||
        "Bonzi"
    );

    const msg=document.createElement("div");

    msg.style.cssText=`
    position:fixed;
    left:50%;
    top:20px;
    transform:translateX(-50%);
    background:#000;
    color:#fff;
    padding:12px 18px;
    z-index:10000;
    font:bold 22px Arial;
    border-radius:8px;
    `;

    msg.textContent=
    "WINNERS: "+winners.join(", ");

    root.appendChild(msg);

    window.bookGameCleanup();
}

function hit(a,b){

    return(
        a.left<b.right &&
        a.right>b.left &&
        a.top<b.bottom &&
        a.bottom>b.top
    );
}

function boxHit(a){

    const boxes=[...booksL,...booksR];

    for(const bk of boxes){

        const br=bk.getBoundingClientRect();

        if(hit(a,br)) return true;

    }

    return false;

}

function tick(){

    objs.forEach((o,i)=>{

        o.x+=o.vx;

        o.el.style.left=o.x+"px";

        const tr=o.el.getBoundingClientRect();

        if(boxHit(tr)){

            o.el.remove();
            objs.splice(i,1);
            return;

        }

        document
        .querySelectorAll(".bonzi")
        .forEach(b=>{

            if(
                b.dataset.bookdead==="1"
            ) return;

            const br=
            b.getBoundingClientRect();

            if(hit(tr,br)){

                dmg(
                    b,
                    TEXT_DAMAGE
                );

                o.el.remove();

                objs.splice(i,1);

            }

        });

        if(
            o.x>innerWidth+400||
            o.x<-1500
        ){

            o.el.remove();

            objs.splice(i,1);

        }

    });

    if(mercy){

        mercy.x+=mercy.vx;

        mercy.el.style.left=
        mercy.x+"px";

        const mr=
        mercy.el.getBoundingClientRect();

        if(boxHit(mr)){

            mercy.el.remove();
            mercy=null;
            return;

        }

        document
        .querySelectorAll(".bonzi")
        .forEach(b=>{

            if(
                b.dataset.bookdead==="1"
            ) return;

            const br=
            b.getBoundingClientRect();

            if(hit(mr,br)){

                mercy.el.remove();

                mercy=null;

                endGame();

            }

        });

        if(
            mercy &&
            (
                mercy.x>innerWidth+400||
                mercy.x<-1500
            )
        ){

            mercy.el.remove();
            mercy=null;

        }

    }

}

const gameLoop=
setInterval(
tick,
16
);

const textLoop=
setInterval(
spawnText,
1400
);

const mercyLoop=
setInterval(
()=>{

    if(
        !gameOver &&
        Math.random()<.6
    )
        spawnMercy();

},
15000
);

for(
    let i=0;
    i<3;
    i++
)
setTimeout(
spawnText,
i*700
);

window.bookGameCleanup=
()=>{

    clearInterval(
        gameLoop
    );

    clearInterval(
        textLoop
    );

    clearInterval(
        mercyLoop
    );

    root.remove();

};

console.log(
"Book Game Loaded"
);

})();
