const dataScript = document.createElement("script");

dataScript.src =
  "https://digitalgojp.sharepoint.com/sites/NTA_IBHub12/SiteAssets/quick-links/quick-links-data.js?v=" +
  Date.now();

dataScript.onload = () => {
  const app = document.getElementById("links");

  const data = [...(window.quickLinksData || [])]
    .sort((a,b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));

  app.replaceChildren();

  data.forEach(item => {
    const el = document.createElement("a");

    el.className = "link glass";
    el.href = item.link || "#";
    el.target = "_blank";
    el.rel = "noopener noreferrer";

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
      </div>
    `;

    el.querySelector(".left span").textContent = item.title || "";
    app.appendChild(el);
  });

  if(window.lucide){
    lucide.createIcons();
  }

  if(typeof window.initGlass === "function"){
    window.initGlass(app);
  }
};

dataScript.onerror = () => {
  console.error("quick-links-data.js の読み込みに失敗しました");
};

document.head.appendChild(dataScript);
