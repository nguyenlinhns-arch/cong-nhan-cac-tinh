(() => {
  "use strict";
  const base = new URL(".", document.currentScript?.src || location.href);

  async function readBase64(path) {
    const response = await fetch(new URL(path, base), { cache: "force-cache" });
    if (!response.ok) throw new Error(`Unable to load ${path}`);
    return (await response.text()).trim();
  }

  document.querySelectorAll("img[data-b64-src]").forEach(async image => {
    try {
      const encoded = await readBase64(image.dataset.b64Src);
      image.src = `data:image/webp;base64,${encoded}`;
      image.removeAttribute("data-b64-src");
    } catch {
      image.removeAttribute("data-b64-src");
    }
  });

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    readBase64("assets/gallery-longwall-machine.webp.b64")
      .then(encoded => hero.style.setProperty("--hero-image", `url("data:image/webp;base64,${encoded}")`))
      .catch(() => {});
  }
})();
