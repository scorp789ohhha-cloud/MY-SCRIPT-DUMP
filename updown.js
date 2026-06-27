(function () {
    // --- Duplicate Script Guard ---
    if (window.__frutigerCubeRunning__) {
        alert('YOU CANNOT PLAY THE SCRIPT AT THE SAME TIME');
        return; 
    }
    // Mark this script session as active
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

    function playNextTrack() {
        if (playlist.length === 0) return;
        audio.src = playlist[currentTrackIndex];
        audio.play().catch(err => {
            console.log("Audio waiting for any casual user interaction to unmute...");
        });
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    }
    
    audio.addEventListener('ended', playNextTrack);

    window.addEventListener('click', () => { if(audio.paused && audio.src === "") playNextTrack(); }, { once: true });
    window.addEventListener('keydown', () => { if(audio.paused && audio.src === "") playNextTrack(); }, { once: true });

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
        uniform int u_renderMode; 
        uniform float u_cubeAlpha;  
        uniform float u_whiteProgress;

        void main() {
            if (u_renderMode == 0) {
                vec2 uv = v_texCoord;
                uv.y += u_time * 0.2; 
                uv.x += u_time * 0.1; 

                vec2 check = floor(uv * 12.0);
                float pattern = mod(check.x + check.y, 2.0);

                vec3 color1 = vec3(0.85, 0.93, 0.98);
                vec3 color2 = vec3(0.70, 0.85, 0.95);
                vec3 finalCheck = mix(color1, color2, pattern);

                gl_FragColor = vec4(finalCheck, 0.4);
            } else {
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
    gl.enable(gl.DEPTH_TEST);

    function renderLoop(now) {
        if (!startTime) startTime = now;
        const elapsed = (now - startTime) / 1000;

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

        // --- Render Checkerboard ---
        gl.uniform1i(gl.getUniformLocation(program, "u_renderMode"), 0);
        gl.uniform1f(gl.getUniformLocation(program, "u_time"), elapsed);
        gl.uniform1f(gl.getUniformLocation(program, "u_cubeAlpha"), 1.0);
        gl.uniform1f(gl.getUniformLocation(program, "u_whiteProgress"), 0.0);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "u_matrix"), false, identityMatrix());

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bgVertices), gl.DYNAMIC_DRAW);
        let aPos = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0);
        let aTex = gl.getAttribLocation(program, "a_texCoord");
        gl.enableVertexAttribArray(aTex);
        gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 16, 8);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // --- Render Cube ---
        if (cubeAlpha > 0.0) {
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

        requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);
})();
