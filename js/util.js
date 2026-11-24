/**
 * Small shared helpers. No dependencies.
 */
(function (root) {
  'use strict';

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function emit(name, detail) {
    if (typeof root.dispatchEvent !== 'function' || typeof root.CustomEvent !== 'function') return;
    root.dispatchEvent(new root.CustomEvent(name, { detail: detail }));
  }

  function announce(message) {
    var el = root.document && root.document.getElementById('live');
    if (el) el.textContent = message;
  }

  function uid(prefix) {
    return (prefix || 'id') + '-' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  }

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  root.Util = {
    esc: esc,
    emit: emit,
    announce: announce,
    uid: uid,
    clamp: clamp,
  };
})(typeof window !== 'undefined' ? window : globalThis);
