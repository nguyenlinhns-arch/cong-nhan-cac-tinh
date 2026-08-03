/* Compatibility loader for cached pages. Current pages load /mobile-core.js directly. */
(() => {
  if (window.ThayLinhMobile || document.querySelector('script[src^="/mobile-core.js"]')) return;
  const script = document.createElement("script");
  script.src = "/mobile-core.js?v=1";
  script.async = true;
  document.head.append(script);

  function loadVerificationPortalAssets() {
    if (!document.querySelector('link[href^="/verification-portal.css"]')) {
      const style = document.createElement("link");
      style.rel = "stylesheet";
      style.href = "/verification-portal.css?v=1";
      document.head.append(style);
    }
    if (!document.querySelector('script[src^="/verification-portal.js"]')) {
      const script = document.createElement("script");
      script.src = "/verification-portal.js?v=1";
      script.async = true;
      document.head.append(script);
    }
  }

  loadVerificationPortalAssets();
})();
