/**
 * localStorage access for the demo. One prefix, from config.
 * Swap this module for an account-backed store later; callers use Store.read/write.
 */
(function (root) {
  'use strict';

  function memory() {
    if (!root.__mem) root.__mem = {};
    return root.__mem;
  }

  function driver() {
    try {
      if (typeof localStorage !== 'undefined' && localStorage) {
        var k = '__cs_test__';
        localStorage.setItem(k, '1');
        localStorage.removeItem(k);
        return localStorage;
      }
    } catch (e) { /* private mode or tests without a real driver */ }
    return {
      getItem: function (key) { return Object.prototype.hasOwnProperty.call(memory(), key) ? memory()[key] : null; },
      setItem: function (key, value) { memory()[key] = String(value); },
      removeItem: function (key) { delete memory()[key]; },
    };
  }

  function prefix() {
    return (root.CS && root.CS.brand && root.CS.brand.storagePrefix) || 'charmstudio.v1';
  }

  function key(name) {
    return prefix() + '.' + name;
  }

  function read(name, fallback) {
    try {
      var raw = driver().getItem(key(name));
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(name, value) {
    driver().setItem(key(name), JSON.stringify(value));
  }

  function remove(name) {
    driver().removeItem(key(name));
  }

  root.Store = { key: key, read: read, write: write, remove: remove };
})(typeof window !== 'undefined' ? window : globalThis);
