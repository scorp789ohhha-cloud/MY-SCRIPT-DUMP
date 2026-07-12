(function(){
for (let bonzi of bonzis.values()) {
    if (bonzi.userPublic.name !== "DarlloGuy") continue;

    const el = bonzi.element;
    const originalTransform = el.style.transform;
    const originalTransformOrigin = el.style.transformOrigin;
    const originalFilter = el.style.filter;
    const originalHatDisplay = bonzi.hatLayer.style.display;
    const originalBackground = el.style.backgroundImage;

    setTimeout(()=>{

        // visual corruption
        el.style.backgroundImage = 'url("https://files.catbox.moe/dwp6bu.png")';
        el.style.backgroundSize = "contain";
        bonzi.hatLayer.style.display = "none";

        el.style.transformOrigin = "center bottom";
        el.style.filter = "contrast(1.3) saturate(1.4)";

        // cursed audio
        const ctx = new (window.AudioContext||window.webkitAudioContext)();

        const o1 = ctx.createOscillator();
        const o2 = ctx.createOscillator();
        const g = ctx.createGain();

        o1.type = "sawtooth";
        o2.type = "square";

        o1.frequency.value = 55;
        o2.frequency.value = 57;

        g.gain.value = 0.06;

        o1.connect(g);
        o2.connect(g);
        g.connect(ctx.destination);

        o1.start();
        o2.start();

        const buzzIv = setInterval(()=>{
            o1.frequency.value = 35 + Math.random()*80;
            o2.frequency.value = 40 + Math.random()*90;

            g.gain.value = 0.02 + Math.random()*0.1;
        },80);


        // impossible growth
        let t = 0;
        let height = 1;
        let width = 1;
        let growth = 0.008;

        const animIv = setInterval(()=>{

            t += 0.15;

            // exponential cursed stretching
            height += growth;
            growth += 0.00008;

            // random mutation spikes
            const panic = Math.random() < 0.08
                ? (Math.random()*0.5+0.5)
                : 1;

            // jittering movement
            const jitterX =
                Math.sin(t*7) * (height*2) +
                (Math.random()-0.5)*15;

            const jitterY =
                Math.cos(t*5) * (height*1.5);


            // becomes impossibly thin
            width = Math.max(
                0.25,
                1 / Math.sqrt(height)
            );


            // bending reality
            const bend =
                Math.sin(t*1.7) *
                Math.min(height*3,35);


            // RGB nightmare
            const hue = (t*40)%360;

            el.style.filter = `
                contrast(1.5)
                saturate(2)
                hue-rotate(${hue}deg)
                drop-shadow(
                    ${Math.sin(t)*10}px
                    0
                    8px
                    rgba(255,0,255,.7)
                )
            `;


            el.style.transform = `
                translate(
                    ${jitterX}px,
                    ${jitterY}px
                )
                scaleY(${height * panic})
                scaleX(${width})
                rotate(${bend}deg)
                skew(${Math.sin(t*3)*20}deg)
            `;


            // audio gets lower as Bonzi ascends
            o1.frequency.value =
                40 + Math.sin(t)*20 - height*2;

            o2.frequency.value =
                45 + Math.cos(t)*25 - height*1.5;


        },50);



        // after 8 seconds: collapse
        setTimeout(()=>{

            clearInterval(animIv);
            clearInterval(buzzIv);

            o1.stop();
            o2.stop();

            ctx.close();


            // dramatic implosion
            el.animate([
                {
                    transform: el.style.transform,
                    filter: el.style.filter
                },
                {
                    transform: `
                        scaleY(0.1)
                        scaleX(5)
                        rotate(720deg)
                    `,
                    filter:
                        "blur(20px) contrast(5)"
                }
            ],{
                duration:1500,
                easing:"cubic-bezier(.8,-1,.2,2)"
            });


            setTimeout(()=>{

                el.style.transform =
                    originalTransform;

                el.style.filter =
                    originalFilter;

                el.style.transformOrigin =
                    originalTransformOrigin;

                el.style.backgroundImage =
                    originalBackground;

                bonzi.updateSprite();

                bonzi.hatLayer.style.display =
                    originalHatDisplay;

            },1500);


        },8000);


    },10000);
}
})();
