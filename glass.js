/* =========================================================
   Liquid Glass Engine v4
   - pointer-following optical highlight
   - subtle 3D tilt
   - independent slow liquid drift per card
   - one RAF loop for every card
========================================================= */

(() => {
  const states = new Map();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let rafId = 0;
  let running = false;

  const clamp = (value,min,max) => Math.max(min,Math.min(max,value));

  function attach(card){
    if(card.dataset.glassInitialized === "true") return;
    card.dataset.glassInitialized = "true";

    const state = {
      card,
      currentX:50,
      currentY:50,
      targetX:50,
      targetY:50,
      hover:0,
      hoverTarget:0,
      phase:Math.random() * Math.PI * 2,
      speed:.00019 + Math.random() * .00009
    };

    states.set(card,state);

    card.style.setProperty("--gx","50%");
    card.style.setProperty("--gy","50%");
    card.style.setProperty("--tilt-x","0deg");
    card.style.setProperty("--tilt-y","0deg");
    card.style.setProperty("--liquid-x","0px");
    card.style.setProperty("--liquid-y","0px");

    card.addEventListener("pointerenter",() => {
      state.hoverTarget = 1;
    },{passive:true});

    card.addEventListener("pointermove",event => {
      const rect = card.getBoundingClientRect();
      if(!rect.width || !rect.height) return;

      const x = clamp(((event.clientX - rect.left) / rect.width) * 100,0,100);
      const y = clamp(((event.clientY - rect.top) / rect.height) * 100,0,100);

      state.targetX = x;
      state.targetY = y;

      /* Deliberately tiny: enough to make the surface feel curved,
         not enough to make text wobble. */
      const tiltY = ((x - 50) / 50) * 1.15;
      const tiltX = -((y - 50) / 50) * .85;

      card.style.setProperty("--tilt-x",`${tiltX.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y",`${tiltY.toFixed(2)}deg`);
    },{passive:true});

    card.addEventListener("pointerleave",() => {
      state.hoverTarget = 0;
      state.targetX = 50;
      state.targetY = 50;
      card.style.setProperty("--tilt-x","0deg");
      card.style.setProperty("--tilt-y","0deg");
    },{passive:true});
  }

  function initGlass(root=document){
    root.querySelectorAll(".glass").forEach(attach);
    startLoop();
  }

  function frame(time){
    if(!running) return;

    states.forEach(state => {
      state.hover += (state.hoverTarget - state.hover) * .08;

      const follow = .065 + state.hover * .075;
      state.currentX += (state.targetX - state.currentX) * follow;
      state.currentY += (state.targetY - state.currentY) * follow;

      const ambientX = Math.sin(time * state.speed + state.phase) * 1.15;
      const ambientY = Math.cos(time * state.speed * .76 + state.phase) * .85;

      state.card.style.setProperty(
        "--gx",
        `${(state.currentX + ambientX).toFixed(2)}%`
      );
      state.card.style.setProperty(
        "--gy",
        `${(state.currentY + ambientY).toFixed(2)}%`
      );

      /* Internal liquid moves more than the card itself. */
      const driftScale = 1 + state.hover * .45;
      const lx = Math.sin(time * state.speed * .70 + state.phase) * 5.2 * driftScale;
      const ly = Math.cos(time * state.speed * .54 + state.phase) * 3.4 * driftScale;

      state.card.style.setProperty("--liquid-x",`${lx.toFixed(2)}px`);
      state.card.style.setProperty("--liquid-y",`${ly.toFixed(2)}px`);
    });

    rafId = requestAnimationFrame(frame);
  }

  function startLoop(){
    if(running || reduceMotion.matches || document.hidden) return;
    running = true;
    rafId = requestAnimationFrame(frame);
  }

  function stopLoop(){
    running = false;
    if(rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  document.addEventListener("visibilitychange",() => {
    if(document.hidden) stopLoop();
    else startLoop();
  });

  if(typeof reduceMotion.addEventListener === "function"){
    reduceMotion.addEventListener("change",event => {
      if(event.matches) stopLoop();
      else startLoop();
    });
  }

  window.initGlass = initGlass;

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",() => initGlass());
  }else{
    initGlass();
  }
})();
