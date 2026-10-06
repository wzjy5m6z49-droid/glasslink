const dataScript = document.createElement("script");

dataScript.src =
  "https://digitalgojp.sharepoint.com/sites/NTA_IBHub12/SiteAssets/quick-links/quick-links-data.js?v=" +
  Date.now();

dataScript.onload = () => {
  const app = document.getElementById("links");
  const nav = document.getElementById("categoryNav");
  const buttonsHost = document.getElementById("categoryButtons");

  const data = [...(window.quickLinksData || [])]
    .sort((a,b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));

  /* category の初出順をそのままタブ順にする。 */
  const categories = [...new Set(data.map(item => item.category || "その他"))];
  let activeCategory = categories[0] || "その他";
  let changeTimer = 0;
  let moveTimer = 0;

  function createLink(item,index){
    const el = document.createElement("a");
    el.className = "link glass";
    el.href = item.link || "#";
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    el.style.setProperty("--delay",`${Math.min(index * 34,170)}ms`);

    el.innerHTML = `
      <div class="glass-layer"></div>
      <div class="glass-highlight"></div>
      <div class="glass-noise"></div>
      <div class="glass-reflection"></div>
      <div class="glass-content">
        <div class="left">
          <i data-lucide="${item.icon || "link"}"></i>
          <span></span>
        </div>
        <div class="arrow" aria-hidden="true">
          <i data-lucide="chevron-right"></i>
        </div>
      </div>`;

    el.querySelector(".left span").textContent = item.title || "";
    return el;
  }

  function renderLinks(category,animate=true){
    const items = data.filter(item => (item.category || "その他") === category);

    const commit = () => {
      app.replaceChildren(...items.map(createLink));
      app.classList.remove("is-leaving","is-changing");
      if(window.lucide) lucide.createIcons();
      if(typeof window.initGlass === "function") window.initGlass(app);
    };

    clearTimeout(changeTimer);
    if(!animate || !app.children.length){ commit(); return; }

    app.classList.add("is-changing","is-leaving");
    changeTimer = window.setTimeout(commit,155);
  }

  function positionIndicator(button,animate=true){
    if(!button) return;
    const navRect = nav.getBoundingClientRect();
    const rect = button.getBoundingClientRect();
    const x = rect.left - navRect.left;

    if(!animate) nav.classList.add("no-transition");
    nav.style.setProperty("--indicator-x",`${x}px`);
    nav.style.setProperty("--indicator-width",`${rect.width}px`);

    if(!animate){
      requestAnimationFrame(() => nav.classList.remove("no-transition"));
      return;
    }

    clearTimeout(moveTimer);
    nav.classList.add("is-moving");
    moveTimer = window.setTimeout(() => nav.classList.remove("is-moving"),470);
  }

  function selectCategory(category,button,animate=true){
    if(category === activeCategory && animate) return;
    activeCategory = category;

    buttonsHost.querySelectorAll(".category-button").forEach(btn => {
      const selected = btn.dataset.category === category;
      btn.classList.toggle("is-active",selected);
      btn.setAttribute("aria-selected",String(selected));
    });

    positionIndicator(button,animate);
    renderLinks(category,animate);
  }

  categories.forEach((category,index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-button";
    button.dataset.category = category;
    button.textContent = category;
    button.setAttribute("role","tab");
    button.setAttribute("aria-selected",String(index === 0));
    if(index === 0) button.classList.add("is-active");

    button.addEventListener("click",() => selectCategory(category,button,true));
    buttonsHost.appendChild(button);
  });

  const firstButton = buttonsHost.querySelector(".category-button");
  renderLinks(activeCategory,false);
  requestAnimationFrame(() => positionIndicator(firstButton,false));

  const reposition = () => {
    const active = buttonsHost.querySelector(".category-button.is-active");
    positionIndicator(active,false);
  };
  window.addEventListener("resize",reposition,{passive:true});
  if("ResizeObserver" in window) new ResizeObserver(reposition).observe(nav);
};

dataScript.onerror = () => {
  console.error("quick-links-data.js の読み込みに失敗しました");
};

document.head.appendChild(dataScript);
