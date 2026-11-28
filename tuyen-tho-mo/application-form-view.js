(() => {
  'use strict';
  const form = document.querySelector('form[data-form-context="central_application"]');
  const first = form?.elements.namedItem('full_name');
  if (!first) return;
  let measured = false;
  let observer;
  function record() {
    const analytics = window.thayLinhAnalytics;
    if (measured || analytics?.consentState() !== 'granted') return;
    measured = true;
    observer?.disconnect();
    analytics.track({event:'application_form_view', page_path:location.pathname, context:'central_application'});
  }
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting && e.intersectionRatio >= .5)) record();
    }, {threshold:.5});
    observer.observe(first);
  }
  form.addEventListener('focusin', record);
})();
