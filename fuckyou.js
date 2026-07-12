let t = 0;
let height = 1;
let width = 1;
let growth = 0.008;

const animIv = setInterval(()=>{
    t += 0.15;

    // increasingly unnatural growth
    height += growth;
    growth += 0.00008;

    // occasional "malfunction" moments
    const panic = Math.random() < 0.08 ? (Math.random()*0.5+0.5) : 1;

    const jitterX = Math.sin(t*7) * (height*2) + (Math.random()-0.5)*15;
    const jitterY = Math.cos(t*5) * (height*1.5);

    // body gets thinner as it becomes absurdly tall
    width = Math.max(0.25, 1 / Math.sqrt(height));

    // impossible bending
    const bend = Math.sin(t*1.7) * Math.min(height*3,35);

    // glitch colors
    const hue = (t*40)%360;
    el.style.filter = `
        contrast(1.5)
        saturate(2)
        hue-rotate(${hue}deg)
        drop-shadow(${Math.sin(t)*10}px 0 8px rgba(255,0,255,.7))
    `;

    // creepy stretching
    el.style.transform = `
        translate(${jitterX}px, ${jitterY}px)
        scaleY(${height * panic})
        scaleX(${width})
        rotate(${bend}deg)
        skew(${Math.sin(t*3)*20}deg)
    `;

    // make the audio follow the mutation
    o1.frequency.value = 40 + Math.sin(t)*20 - height*2;
    o2.frequency.value = 45 + Math.cos(t)*25 - height*1.5;

},50);
