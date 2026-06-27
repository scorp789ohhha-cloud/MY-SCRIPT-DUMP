(function () {
    // --- Duplicate Script Guard ---
    if (window.__frutigerCubeRunning__) {
        alert('YOU CANNOT PLAY THE SCRIPT AT THE SAME TIME');
        return; 
    }
    window.__frutigerCubeRunning__ = true;

    const content = document.getElementById('content') || document.body;

    if (window.getComputedStyle(content).position === 'static') {
        content.style.position = 'relative';
    }

    content.style.backgroundColor = '#eef6fc';
    content.style.overflow = 'hidden';

    // --- Audio Playlist Pipeline ---
    const rawTracks = [
        'https://files.catbox.moe/yaqyfq.mp3',
        'https://files.catbox.moe/kw2xet.mp3',
        'https://files.catbox.moe/l9fn5r.mp3',
        'https://files.catbox.moe/y5v1bh.mp3',
        'https://files.catbox.moe/ui92xa.mp3'
    ];

    function shufflePlaylist(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    const playlist = shufflePlaylist([...rawTracks]);
    let currentTrackIndex = 0;
    const audio = new Audio();
    let isAudioPlaying = false; 

    function playNextTrack() {
        if (playlist.length === 0 || isAudioPlaying) return;
        audio.src = playlist[currentTrackIndex];
        audio.play()
            .then(() => { isAudioPlaying = true; })
            .catch(err => { isAudioPlaying = false; });
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    }
    
    audio.addEventListener('ended', () => {
        isAudioPlaying = false;
        playNextTrack();
    });

    function handleInteraction() {
        if (!isAudioPlaying) playNextTrack();
    }
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    playNextTrack();

    // --- Create Performance Surface Canvas ---
    const canvas = document.createElement('canvas');
    canvas.setAttribute('style', `
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 1 !important;
        pointer-events: none !important;
    `);
    content.insertBefore(canvas, content.firstChild);

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    gl.getExtension('OES_standard_derivatives');

    function resizeCanvas() {
        canvas.width = content.clientWidth;
        canvas.height = content.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // --- Bubble Particles 3D Data Setup ---
    const NUM_BUBBLES = 12;
    const bubbles = [];
    for (let i = 0; i < NUM_BUBBLES; i++) {
        bubbles.push({
            x: Math.random() * 2 - 1,          
            y: Math.random() * 2 - 1.5,        
            z: Math.random() * 0.4 - 0.2,      
            size: Math.random() * 0.09 + 0.05, 
            speedY: Math.random() * 0.12 + 0.08,
            rotSpeedX: Math.random() * 1.5 + 0.5,
            rotSpeedY: Math.random() * 1.5 + 0.5,
            wobbleSpeed: Math.random() * 3 + 2,
            wobbleAmp: Math.random() * 0.04 + 0.01,
            seed: Math.random() * 100
        });
    }

    // --- Shaders ---
    const vsSource = `
        attribute vec3 a_position;
        attribute vec2 a_texCoord;
        varying vec2 v_texCoord;
        varying vec3 v_pos;
        
        uniform mat4 u_matrix;

        void main() {
            v_texCoord = a_texCoord;
            v_pos = a_position;
            gl_Position = u_matrix * vec4(a_position, 1.0);
        }
    `;

    const fsSource = `
        precision mediump float;
        varying vec2 v_texCoord;
        varying vec3 v_pos;

        uniform float u_time;
        uniform int u_renderMode; // 0=Water/Grid Surface, 1=Intro Cube, 2=3D Bubbles
        uniform float u_cubeAlpha;  
        uniform float u_whiteProgress;

        // Mathematical helper to calculate layered sine interference patterns
        float getWaveHeight(vec2 p, float time) {
            float h = 0.0;
            // Wave layer 1: Large slow rolling swell
            h += sin(p.x * 2.5 + time * 1.2) * 0.12;
            // Wave layer 2: Diagonal intersecting counter-swell
            h += sin(p.y * 3.0 - time * 1.5 + p.x * 1.5) * 0.09;
            // Wave layer 3: High frequency tiny glassy secondary ripple
            h += cos(p.x * 7.0 + p.y * 6.0 + time * 2.8) * 0.025;
            // Wave layer 4: Fine micro-texture caustics driver
            h += sin(-p.y * 14.0 + time * 4.0) * 0.01;
            return h;
        }

        void main() {
            if (u_renderMode == 0) {
                // --- 2000s CGI Liquid Aero Surface Simulation ---
                vec2 uv = v_texCoord * 2.0 - 1.0;
                
                // Track wave interference across coordinates
                float height = getWaveHeight(uv * 1.5, u_time);
                
                // Finite difference trick to generate true updating surface normals dynamically
                float eps = 0.02;
                float hX = getWaveHeight((uv + vec2(eps, 0.0)) * 1.5, u_time);
                float hY = getWaveHeight((uv + vec2(0.0, eps)) * 1.5, u_time);
                
                vec3 normal = normalize(vec3((height - hX) / eps, (height - hY) / eps, 1.0));
                
                // Refraction distortion applied to underlying grid UV space
                vec2 refractedUV = v_texCoord + normal.xy * 0.04;
                
                // Sliding timeline variables for the vector lines
                refractedUV.y += u_time * 0.1;
                refractedUV.x += u_time * 0.05;

                // Checkerboard generator
                vec2 check = floor(refractedUV * 10.0);
                float pattern = mod(check.x + check.y, 2.0);
                vec3 color1 = vec3(0.85, 0.94, 0.99);
                vec3 color2 = vec3(0.70, 0.85, 0.95);
                vec3 finalCheck = mix(color1, color2, pattern);

                // Grid Vector lines
                vec2 gridCoord = fract(refractedUV * 10.0);
                float gridLine = step(0.95, gridCoord.x) + step(0.95, gridCoord.y);
                finalCheck = mix(finalCheck, vec3(0.55, 0.78, 0.95), gridLine * 0.5);

                // Specular sunlight highlights on wave crests
                vec3 lightDir = normalize(vec3(0.3, 0.6, 0.75));
                float specPower = pow(max(dot(normal, lightDir), 0.0), 45.0);
                vec3 sunGlint = vec3(1.0, 1.0, 1.0) * specPower * 0.75;

                // Shallow fake caustic shimmer blending using wave height map data
                float caustic = smoothstep(0.02, 0.1, abs(height)) * 0.15;
                
                // Glass Fresnel rim finish
                float fresnel = pow(1.0 - max(normal.z, 0.0), 3.0) * 0.35;
                
                vec3 finalLiquidColor = finalCheck + sunGlint + vec3(caustic) + vec3(fresnel * 0.4);
                gl_FragColor = vec4(finalLiquidColor, 0.65);
            } 
            else if (u_renderMode == 1) {
                // Intro 3D Cube
                vec3 baseGradient = mix(vec3(0.05, 0.4, 0.9), vec3(0.4, 0.8, 1.0), v_texCoord.y + sin(u_time) * 0.1);
                float gloss = pow(1.0 - distance(v_texCoord, vec2(0.3, 0.75)), 3.5) * 0.45;
                baseGradient += vec3(gloss);

                float borderX = smoothstep(0.0, 0.05, v_texCoord.x) * smoothstep(1.0, 0.95, v_texCoord.x);
                float borderY = smoothstep(0.0, 0.05, v_texCoord.y) * smoothstep(1.0, 0.95, v_texCoord.y);
                float edgeMask = 1.0 - (borderX * borderY);
                baseGradient = mix(baseGradient, vec3(1.0, 1.0, 1.0), edgeMask * 0.7);

                vec3 mixedOutColor = mix(baseGradient, vec3(1.0), u_whiteProgress);
                gl_FragColor = vec4(mixedOutColor, 0.95) * u_cubeAlpha;
            } 
            else {
                // Volumetric 3D Sphere Bubble Shader
                vec2 uv = v_texCoord * 2.0 - 1.0;
                float dist = length(uv);
                if (dist > 1.0) discard;

                float zNormal = sqrt(1.0 - dist * dist);
                vec3 normal = vec3(uv.x, uv.y, zNormal);

                float fresnel = pow(1.0 - normal.z, 2.5);
                vec3 lightDir = normalize(vec3(-0.4, 0.5, 0.8));
                float specPower = pow(max(dot(normal, lightDir), 0.0), 32.0);
                float specular = smoothstep(0.1, 0.9, specPower) * 0.75;
                float rimLight = pow(1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0), 4.0) * 0.4;

                vec3 iridescence = vec3(
                    sin(normal.x * 2.5 + u_time) * 0.15 + 0.85,
                    sin(normal.y * 3.0 + u_time + 2.0) * 0.12 + 0.88,
                    sin(normal.z * 2.0 + u_time + 4.0) * 0.18 + 0.82
                );

                vec3 bubbleColor = mix(vec3(0.35, 0.70, 0.95), iridescence, fresnel);
                bubbleColor += vec3(specular + rimLight);
                float alpha = mix(0.18, 0.80, fresnel) + specular;
                
                gl_FragColor = vec4(bubbleColor, alpha * 0.85);
            }
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

    // --- Geometries ---
    const bgVertices = [
        -1, -1,  0, 0,
         1, -1,  1, 0,
        -1,  1,  0, 1,
        -1,  1,  0, 1,
         1, -1,  1, 0,
         1,  1,  1, 1,
    ];

    const cubeVertices = [
        // Front face
        -0.3, -0.3,  0.3,  0, 0,   0.3, -0.3,  0.3,  1, 0,   0.3,  0.3,  0.3,  1, 1,
        -0.3, -0.3,  0.3,  0, 0,   0.3,  0.3,  0.3,  1, 1,  -0.3,  0.3,  0.3,  0, 1,
        // Back face
        -0.3, -0.3, -0.3,  0, 0,  -0.3,  0.3, -0.3,  0, 1,   0.3,  0.3, -0.3,  1, 1,
        -0.3, -0.3, -0.3,  0, 0,   0.3,  0.3, -0.3,  1, 1,   0.3, -0.3, -0.3,  1, 0,
        // Top face
        -0.3,  0.3, -0.3,  0, 0,  -0.3,  0.3,  0.3,  0, 1,   0.3,  0.3,  0.3,  1, 1,
        -0.3,  0.3, -0.3,  0, 0,   0.3,  0.3,  0.3,  1, 1,   0.3,  0.3, -0.3,  1, 0,
        // Bottom face
        -0.3, -0.3, -0.3,  0, 0,   0.3, -0.3, -0.3,  1, 0,   0.3, -0.3,  0.3,  1, 1,
        -0.3, -0.3, -0.3,  0, 0,   0.3, -0.3,  0.3,  1, 1,  -0.3, -0.3,  0.3,  0, 1,
        // Right face
         0.3, -0.3, -0.3,  0, 0,   0.3,  0.3, -0.3,  0, 1,   0.3,  0.3,  0.3,  1, 1,
         0.3, -0.3, -0.3,  0, 0,   0.3,  0.3,  0.3,  1, 1,   0.3, -0.3,  0.3,  1, 0,
        // Left face
        -0.3, -0.3, -0.3,  0, 0,  -0.3, -0.3,  0.3,  1, 0,  -0.3,  0.3,  0.3,  1, 1,
        -0.3, -0.3, -0.3,  0, 0,  -0.3,  0.3,  0.3,  1, 1,  -0.3,  0.3, -0.3,  0, 1,
    ];

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    function identityMatrix() {
        return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
    }

    function rotateX(m, angle) {
        const c = Math.cos(angle), s = Math.sin(angle);
        const m1 = m[4], m2 = m[5], m3 = m[6], m4 = m[7], m5 = m[8];
        m[4] = m1 * c + m5 * s;   m[5] = m[5] * c + m[9] * s;
        m[6] = m[6] * c + m[10] * s; m[7] = m[7] * c + m[11] * s;
        m[8] = m5 * c - m1 * s;   m[9] = m[9] * c - m[5] * s;
        m[10] = m[10] * c - m[6] * s; m[11] = m[11] * c - m[7] * s;
    }

    function rotateY(m, angle) {
        const c = Math.cos(angle), s = Math.sin(angle);
        const m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3], m5 = m[8];
        m[0] = m0 * c - m5 * s;   m[1] = m1 * c - m[9] * s;
        m[2] = m2 * c - m[10] * s; m[3] = m3 * c - m[11] * s;
        m[8] = m0 * s + m5 * c;   m[9] = m1 * s + m[9] * c;
        m[10] = m2 * s + m[10] * c; m[11] = m3 * s + m[11] * c;
    }

    let startTime = null;
    let lastTime = 0;
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);

    function renderLoop(now) {
        if (!startTime) startTime = now;
        const elapsed = (now - startTime) / 1000;
        const deltaTime = elapsed - lastTime;
        lastTime = elapsed;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let whiteProgress = 0.0;
        let cubeAlpha = 1.0;

        if (elapsed > 2.0) {
            const stageTime = elapsed - 2.0;
            whiteProgress = Math.min(stageTime / 0.05, 1.0);
            if (stageTime > 0.05) {
                cubeAlpha = Math.max(1.0 - (stageTime - 0.05) / 0.3, 0.0);
            }
        }

        let aPos = gl.getAttribLocation(program, "a_position");
        let aTex = gl.getAttribLocation(program, "a_texCoord");

        // --- 1. Render Layered Interactive Liquid Grid Surface ---
        gl.disable(gl.DEPTH_TEST); 
        gl.uniform1i(gl.getUniformLocation(program, "u_renderMode"), 0);
        gl.uniform1f(gl.getUniformLocation(program, "u_time"), elapsed);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "u_matrix"), false, identityMatrix());

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bgVertices), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(aTex);
        gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 16, 8);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // --- 2. Render Intro 3D Cube ---
        if (cubeAlpha > 0.0) {
            gl.enable(gl.DEPTH_TEST);
            gl.uniform1i(gl.getUniformLocation(program, "u_renderMode"), 1);
            gl.uniform1f(gl.getUniformLocation(program, "u_whiteProgress"), whiteProgress);
            gl.uniform1f(gl.getUniformLocation(program, "u_cubeAlpha"), cubeAlpha);

            const matrix = identityMatrix();
            rotateX(matrix, elapsed * 1.9);
            rotateY(matrix, elapsed * 1.3);
            const aspect = canvas.width / canvas.height;
            matrix[0] /= aspect; 

            gl.uniformMatrix4fv(gl.getUniformLocation(program, "u_matrix"), false, matrix);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 20, 0);
            gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 20, 12);
            gl.drawArrays(gl.TRIANGLES, 0, 36);
        }

        // --- 3. Render Post-Intro 3D Spherical Bubbles ---
        if (elapsed > 2.1) {
            gl.enable(gl.DEPTH_TEST); 
            gl.uniform1i(gl.getUniformLocation(program, "u_renderMode"), 2);
            gl.uniform1f(gl.getUniformLocation(program, "u_time"), elapsed);

            const aspect = canvas.width / canvas.height;

            bubbles.forEach(bubble => {
                bubble.y += bubble.speedY * deltaTime;
                const currentWobble = Math.sin(elapsed * bubble.wobbleSpeed + bubble.seed) * bubble.wobbleAmp;

                if (bubble.y > 1.4) {
                    bubble.y = -1.4;
                    bubble.x = Math.random() * 2 - 1;
                }

                const bubbleMatrix = identityMatrix();
                bubbleMatrix[0] = bubble.size / aspect;
                bubbleMatrix[5] = bubble.size;
                bubbleMatrix[10] = bubble.size; 
                
                rotateX(bubbleMatrix, elapsed * bubble.rotSpeedX);
                rotateY(bubbleMatrix, elapsed * bubble.rotSpeedY);

                bubbleMatrix[12] = bubble.x + currentWobble;
                bubbleMatrix[13] = bubble.y;
                bubbleMatrix[14] = bubble.z;

                gl.uniformMatrix4fv(gl.getUniformLocation(program, "u_matrix"), false, bubbleMatrix);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.DYNAMIC_DRAW);
                
                gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 20, 0);
                gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 20, 12);
                gl.drawArrays(gl.TRIANGLES, 0, 36);
            });
        }

        requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);
})();
