(function(){
for (let bonzi of bonzis.values()) {
    if (bonzi.userPublic.name !== "DarlloGuy") continue;

    const el = bonzi.element;

    const originalTransform = el.style.transform;
    const originalFilter = el.style.filter;
    const originalZ = el.style.zIndex;

    setTimeout(()=>{

        el.style.zIndex = "999999";
        el.style.transformOrigin = "center center";


        let t = 0;
        let insanity = 0;


        let x = 0;
        let y = 0;

        let targetX = 0;
        let targetY = 0;


        let scaleX = 1;
        let scaleY = 1;

        let rot = 0;


        // constantly changing "forces"
        const forceIv = setInterval(()=>{

            targetX =
                (Math.random()-0.5)*1200;

            targetY =
                (Math.random()-0.5)*800;


            scaleX =
                Math.random()*8+0.2;

            scaleY =
                Math.random()*10+0.2;


            rot =
                (Math.random()-0.5)*720;


        },100);



        // chaos engine
        const animIv = setInterval(()=>{

            t += .2;
            insanity += .003;


            x +=
                (targetX-x)*0.08;

            y +=
                (targetY-y)*0.08;


            const shake =
                Math.sin(t*30) *
                insanity*100;


            const scream =
                Math.sin(t*7) *
                50;


            const pulse =
                1 +
                Math.sin(t*10)*0.5;



            el.style.transform = `

                translate(
                    ${x+shake}px,
                    ${y+scream}px
                )

                scaleX(
                    ${scaleX*pulse}
                )

                scaleY(
                    ${scaleY/pulse}
                )

                rotate(
                    ${rot +
                    Math.sin(t*20)*50}deg
                )

                skew(
                    ${Math.sin(t*15)*80}deg,
                    ${Math.cos(t*12)*80}deg
                )
            `;


            // corrupted reality filter
            el.style.filter = `

                contrast(${2+insanity*3})

                saturate(${3+insanity*5})

                hue-rotate(${t*200}deg)

                blur(${Math.random()*3}px)

                drop-shadow(
                    ${Math.sin(t)*30}px
                    ${Math.cos(t)*30}px
                    20px
                    rgba(
                        ${Math.random()*255},
                        ${Math.random()*255},
                        ${Math.random()*255},
                        .8
                    )
                )
            `;


            // random ghost copies
            if (Math.random()<0.08){

                const ghost =
                    el.cloneNode(true);

                ghost.style.position =
                    "absolute";

                ghost.style.pointerEvents =
                    "none";

                ghost.style.opacity =
                    ".3";

                ghost.style.transform =
                    el.style.transform;

                document.body.appendChild(
                    ghost
                );


                setTimeout(()=>{
                    ghost.remove();
                },500);

            }


        },20);



        // the universe gives up
        setTimeout(()=>{

            clearInterval(animIv);
            clearInterval(forceIv);


            el.animate([

                {
                    transform:
                    el.style.transform
                },

                {
                    transform:
                    `
                    translate(
                        0px,
                        0px
                    )
                    scaleX(.01)
                    scaleY(20)
                    rotate(999deg)
                    `
                },

                {
                    transform:
                    originalTransform
                }

            ],{

                duration:3000,

                easing:
                "cubic-bezier(.2,2,.8,-2)"

            });



            setTimeout(()=>{

                el.style.transform =
                    originalTransform;

                el.style.filter =
                    originalFilter;

                el.style.zIndex =
                    originalZ;


            },3000);


        },15000);


    },5000);
}
})();
