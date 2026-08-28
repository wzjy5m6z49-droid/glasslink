// ========================================
// Glass Engine v2
// Mouse reflection + lightweight animation
// ========================================

const glassCards = new Map();

function initGlass() {
    document.querySelectorAll(".glass").forEach((card, index) => {

        // 再初期化時のイベント重複を防ぐ
        if (card.dataset.glassInitialized === "true") {
            return;
        }

        card.dataset.glassInitialized = "true";

        const state = {
            currentX: 50,
            currentY: 50,
            targetX: 50,
            targetY: 50,
            phase: Math.random() * Math.PI * 2,
            speed: 0.00025 + Math.random() * 0.00015
        };

        glassCards.set(card, state);

        // 初期値
        card.style.setProperty("--glass-x", "50%");
        card.style.setProperty("--glass-y", "50%");
        card.style.setProperty("--glass-tilt-x", "0deg");
        card.style.setProperty("--glass-tilt-y", "0deg");

        card.addEventListener("pointermove", event => {
            const rect = card.getBoundingClientRect();

            const x =
                ((event.clientX - rect.left) / rect.width) * 100;

            const y =
                ((event.clientY - rect.top) / rect.height) * 100;

            state.targetX = Math.max(0, Math.min(100, x));
            state.targetY = Math.max(0, Math.min(100, y));

            const tiltY = ((x - 50) / 50) * 1.5;
            const tiltX = -((y - 50) / 50) * 1.5;

            card.style.setProperty(
                "--glass-tilt-x",
                `${tiltX.toFixed(2)}deg`
            );

            card.style.setProperty(
                "--glass-tilt-y",
                `${tiltY.toFixed(2)}deg`
            );
        });

        card.addEventListener("pointerleave", () => {
            state.targetX = 50;
            state.targetY = 50;

            card.style.setProperty("--glass-tilt-x", "0deg");
            card.style.setProperty("--glass-tilt-y", "0deg");
        });
    });
}

function animateGlass(time) {
    glassCards.forEach((state, card) => {

        // マウス位置へ滑らかに追従
        state.currentX +=
            (state.targetX - state.currentX) * 0.075;

        state.currentY +=
            (state.targetY - state.currentY) * 0.075;

        // ごく弱い自然な揺らぎ
        const driftX =
            Math.sin(time * state.speed + state.phase) * 1.2;

        const driftY =
            Math.cos(time * state.speed * 0.8 + state.phase) * 0.8;

        card.style.setProperty(
            "--glass-x",
            `${(state.currentX + driftX).toFixed(2)}%`
        );

        card.style.setProperty(
            "--glass-y",
            `${(state.currentY + driftY).toFixed(2)}%`
        );
    });

    requestAnimationFrame(animateGlass);
}

// script.jsでカード生成後に呼び出せるよう公開
window.initGlass = initGlass;

// 念のため通常読込時にも初期化
window.addEventListener("load", () => {
    initGlass();
    requestAnimationFrame(animateGlass);
});
