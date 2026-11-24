/**
 * Boots every page: shell, copy from config, then the page controller.
 */
(function () {
  'use strict';
  function start() {
    Shell.mount();
    Shell.fill(document);
    Shell.bind();
    ProductUI.bind();
    var page = document.body.getAttribute('data-page');
    if (page && window.Pages && Pages[page]) Pages[page]();
    Shell.fill(document);
    if (document.body.getAttribute('data-sticky')) Shell.sticky();
    var errors = Catalog.validate();
    if (errors.length) console.error(errors);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
