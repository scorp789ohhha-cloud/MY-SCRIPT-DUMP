(function () {
    const content = document.getElementById('content') || document.body;
    const BONZI_SPRITESHEET_URL = '/img/bonzi/red.webp';
    const LAND_AUDIO_URL = 'https://files.catbox.moe/39uy0m.mp3';
    const INTRO_AUDIO_URL = 'https://www.myinstants.com/media/sounds/slide-whistle-fall-and-boomp.mp3';

    if (window.getComputedStyle(content).position === 'static') {
        content.style.position = 'relative';
    }

    // --- Create Performance Surface Canvas ---
    const canvas = document.createElement('canvas');
    canvas.setAttribute('style', `
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: -2 !important;               /* Keeps canvas completely behind foreground UI */
        pointer-events: none !important;
        opacity: 1 !important;
        transition: opacity 2s ease-out !important;
    `);
    content.insertBefore(canvas, content.firstChild);

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    function resizeCanvas() {
        canvas.width = content.clientWidth;
        canvas.height = content.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // --- Vertex and Fragment Shaders ---
    const vsSource = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        void main() {
            v_texCoord = a_texCoord;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fsSource = `
        precision mediump float;
        varying vec2 v_texCoord;
        uniform sampler2D u_texture;
        uniform float u_jiggleIntensity;

        void main() {
            vec4 baseColor = texture2D(u_texture, v_texCoord);
            if (baseColor.a < 0.01) { discard; }

            vec2 normCoord = (v_texCoord - vec2(0.5)) * 2.0;
            float z = sqrt(max(0.0, 1.0 - dot(normCoord, normCoord)));
            vec3 normal = normalize(vec3(normCoord, z));

            vec3 lightDir = normalize(vec3(0.3, 0.5, 0.8));
            vec3 viewDir = vec3(0.0, 0.0, 1.0);
            vec3 halfDir = normalize(lightDir + viewDir);
            
            float spec = pow(max(dot(normal, halfDir), 0.0), 32.0) * 0.4 * u_jiggleIntensity;
            float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0) * 0.25;

            baseColor.rgb += vec3(spec) + vec3(fresnel * vec3(1.0, 0.6, 0.6));
            gl_FragColor = baseColor;
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
    }

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    // --- Mesh Grid Mapping ---
    const GRID_X = 16, GRID_Y = 16;
    const vertices = [], texCoords = [], indices = [];
    
    for (let j = 0; j <= GRID_Y; j++) {
        for (let i = 0; i <= GRID_X; i++) {
            vertices.push((i / GRID_X) * 2 - 1, (j / GRID_Y) * 2 - 1);
            texCoords.push(i / GRID_X, 1.0 - (j / GRID_Y));
        }
    }

    for (let j = 0; j < GRID_Y; j++) {
        for (let i = 0; i < GRID_X; i++) {
            const p0 = j * (GRID_X + 1) + i;
            const p1 = p0 + 1;
            const p2 = p0 + (GRID_X + 1);
            const p3 = p2 + 1;
            indices.push(p0, p1, p2, p1, p3, p2);
        }
    }

    const positionBuffer = gl.createBuffer();
    const texCoordBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // --- Texture Loading ---
    const texture = gl.createTexture();
    const image = new Image();
    image.src = BONZI_SPRITESHEET_URL;
    let textureLoaded = false;
    
    let sourceWidth = 200;
    let sourceHeight = 160;

    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        textureLoaded = true;
    };

    // --- Audio Pipeline ---
    const introAudio = new Audio(INTRO_AUDIO_URL);
    const landAudio = new Audio(LAND_AUDIO_URL);
    introAudio.volume = 0.5;
    landAudio.volume = 0.5;

    // --- Animation Timeline Controls ---
    let startTime = null;
    let animRunning = true;
    let audioTriggered = false;
    
    const delayDuration = 1300;  // ADJUSTED TIMING: Exactly 1.3 seconds (1300ms) before falling
    const dropDuration = 350;    
    const jiggleDuration = 3000; 

    // Fire the slide whistle sound instantly upon script mount
    introAudio.play().catch(err => console.log("Audio blocked by browser context:", err));

    function renderLoop(now) {
        if (!animRunning) return;
        if (!startTime) startTime = now;

        const elapsed = now - startTime;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (!textureLoaded) {
            requestAnimationFrame(renderLoop);
            return;
        }

        const viewW = canvas.width;
        const viewH = canvas.height;
        
        const targetWidth = 320; 
        const targetHeight = 260; 

        let centerTop = -260;
        let scaleX = 1.0;
        let scaleY = 1.0;
        let jiggleIntensity = 0.0;

        // Phase 0: Initial 1.3-second delay window (Bonzi stays hidden off-screen)
        if (elapsed < delayDuration) {
            centerTop = -260;
        }
        // Phase 1: Fast Drop Phase (Starts exactly at second 1.3)
        else if (elapsed < (delayDuration + dropDuration)) {
            const p = (elapsed - delayDuration) / dropDuration;
            centerTop = -260 + ((viewH / 2) + 260) * (p * p);
            scaleX = 0.95;
            scaleY = 1.05;
        } 
        // Phase 2: Instant Impact Landing Frame Dynamic Wobble
        else if (elapsed < (delayDuration + dropDuration + jiggleDuration)) {
            centerTop = viewH / 2;
            const jiggleTime = (elapsed - delayDuration - dropDuration) / 1000;
            
            if (!audioTriggered) {
                audioTriggered = true;
                landAudio.play().catch(err => console.log("Land audio blocked:", err));
            }

            const decay = Math.exp(-2.2 * jiggleTime); 
            jiggleIntensity = decay;
            
            scaleX = 1.0 + (Math.sin(jiggleTime * 24.0) * 0.45 * decay);
            scaleY = 1.0 / scaleX; 
        } 
        // Phase 3: Settle & Run 2-second Node Cleanup Fade Out
        else {
            centerTop = viewH / 2;
            canvas.style.opacity = '0';
            
            setTimeout(() => {
                animRunning = false;
                if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
            }, 2000);
        }

        const currentVertices = [];
        const tSec = elapsed / 1000;

        for (let j = 0; j <= GRID_Y; j++) {
            const vBase = j / GRID_Y;
            for (let i = 0; i <= GRID_X; i++) {
                const uBase = i / GRID_X;

                let baseMeshX = (uBase - 0.5) * targetWidth * scaleX;
                let baseMeshY = (vBase - 0.5) * targetHeight * scaleY;

                if (elapsed >= (delayDuration + dropDuration) && elapsed < (delayDuration + dropDuration + jiggleDuration)) {
                    const jiggleTime = (elapsed - delayDuration - dropDuration) / 1000;
                    const decay = Math.exp(-2.2 * jiggleTime);
                    const waveX = Math.sin(vBase * 5.0 + tSec * 30.0) * 10.0 * decay;
                    const waveY = Math.cos(uBase * 5.0 + tSec * 26.0) * 8.0 * decay;
                    baseMeshX += waveX;
                    baseMeshY += waveY;
                }

                const ndcX = ((viewW / 2 + baseMeshX) / viewW) * 2 - 1;
                const ndcY = (1.0 - ((centerTop + baseMeshY) / viewH)) * 2 - 1;

                currentVertices.push(ndcX, ndcY);
            }
        }

        gl.uniform1f(gl.getUniformLocation(program, "u_jiggleIntensity"), jiggleIntensity);

        const aPosition = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(aPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(currentVertices), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        const aTexCoord = gl.getAttribLocation(program, "a_texCoord");
        gl.enableVertexAttribArray(aTexCoord);
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        
        const normW = sourceWidth / image.width;
        const normH = sourceHeight / image.height;
        const croppedTexCoords = texCoords.map((val, idx) => idx % 2 === 0 ? val * normW : val * normH);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(croppedTexCoords), gl.STATIC_DRAW);
        gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);
})();
