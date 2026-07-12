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

        let x = 0;
        let y = 0;

        let targetX = 0;
        let targetY = 0;

        let scaleX = 1;
        let scaleY = 1;
        let rotation = 0;


        // change direction less often
        const forceIv = setInterval(()=>{

            targetX =
                (Math.random()-0.5)*700;

            targetY =
                (Math.random()-0.5)*500;

            scaleX =
                .3 + Math.random()*5;

            scaleY =
                .3 + Math.random()*6;

            rotation =
                (Math.random()-0.5)*360;

        },250);



        // lighter animation loop
        const animIv = setInterval(()=>{

            t += .15;


            // smooth movement
            x +=
                (targetX-x)*0.08;

            y +=
                (targetY-y)*0.08;


            const wobble =
                Math.sin(t*8)*10;


            el.style.transform = `
                translate(
                    ${x}px,
                    ${y}px
                )
                scaleX(
                    ${scaleX +
                    Math.sin(t*3)*.15}
                )
                scaleY(
                    ${scaleY +
                    Math.cos(t*3)*.2}
                )
                rotate(
                    ${rotation+wobble}deg
                )
                skew(
                    ${Math.sin(t*5)*15}deg
                )
            `;


            // cheaper filter
            el.style.filter = `
                hue-rotate(${t*40}deg)
                contrast(1.4)
                saturate(1.5)
            `;


        },50);



        // reset
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
                    scaleX(.2)
                    scaleY(5)
                    rotate(720deg)
                    `
                },

                {
                    transform:
                    originalTransform
                }

            ],{
                duration:1500,
                easing:
                "ease-out"
            });


            setTimeout(()=>{

                el.style.transform =
                    originalTransform;

                el.style.filter =
                    originalFilter;

                el.style.zIndex =
                    originalZ;

            },1500);


        },12000);


    },5000);
}
})();
