// @ts-check

/**
 * Initializes interactive game handlers once the DOM tree is attached.
 */
export function initApp() {
    const btnStart = document.getElementById('btn-start-reset');
    const btnFullscreen = document.getElementById('btn-fullscreen');

    if (btnStart) {
        btnStart.addEventListener('click', () => {
            console.log('Game initialized.');
        });
    }

    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch((err) => {
                    console.error(`Fullscreen request failed: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });
    }
}
