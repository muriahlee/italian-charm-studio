/**
 * My Charm Vault — local demo data layer.
 *
 * Tracks owned charms, saved designs, wishlist, club quiz, and the demo membership.
 * Replace VaultStore with an account API later; the page talks only to these methods.
 *
 * Future shape:
 *   GET  /api/me/vault
 *   PUT  /api/me/designs/:id
 *   Auth belongs on the server. This file does not collect passwords.
 */
(function (root) {
  'use strict';

  var KEY = 'vault';

  function blank() {
    return {
      owned: [],
      wishlist: [],
      designs: [],
      subscription: null,
      quiz: null,
      referral: null,
    };
  }

  function load() {
    var data = root.Store.read(KEY, null);
    if (!data || typeof data !== 'object') return blank();
    data.owned = Array.isArray(data.owned) ? data.owned : [];
    data.wishlist = Array.isArray(data.wishlist) ? data.wishlist : [];
    data.designs = Array.isArray(data.designs) ? data.designs : [];
    return data;
  }

  function commit(data) {
    root.Store.write(KEY, data);
    if (root.Util) root.Util.emit('cs:vault', data);
    return data;
  }

  var Vault = {
    all: load,

    owns: function (charmId) {
      return load().owned.some(function (item) { return item.charmId === charmId; });
    },

    ownedIds: function () {
      return load().owned.map(function (item) { return item.charmId; });
    },

    addOwned: function (charmId, source) {
      var data = load();
      if (!data.owned.some(function (item) { return item.charmId === charmId; })) {
        data.owned.push({ charmId: charmId, source: source || 'manual', addedAt: new Date().toISOString() });
      }
      return commit(data);
    },

    removeOwned: function (charmId) {
      var data = load();
      data.owned = data.owned.filter(function (item) { return item.charmId !== charmId; });
      return commit(data);
    },

    wished: function (charmId) {
      return load().wishlist.indexOf(charmId) !== -1;
    },

    toggleWish: function (charmId) {
      var data = load();
      var i = data.wishlist.indexOf(charmId);
      if (i === -1) data.wishlist.push(charmId);
      else data.wishlist.splice(i, 1);
      return commit(data);
    },

    designs: function () {
      return load().designs.slice();
    },

    saveDesign: function (design) {
      var data = load();
      var record = {
        id: design.id || (root.Util ? root.Util.uid('design') : 'design-' + Date.now()),
        name: (design.name || 'Untitled').slice(0, 60),
        savedAt: new Date().toISOString(),
        design: {
          metal: design.metal,
          wrist: design.wrist,
          links: (design.links || []).slice(),
          assembly: design.assembly,
          story: (design.story || '').slice(0, 180),
          giftMessage: (design.giftMessage || '').slice(0, 140),
        },
      };
      var replaced = false;
      data.designs = data.designs.map(function (item) {
        if (item.id !== record.id) return item;
        replaced = true;
        return record;
      });
      if (!replaced) data.designs.unshift(record);
      commit(data);
      return record;
    },

    deleteDesign: function (id) {
      var data = load();
      data.designs = data.designs.filter(function (item) { return item.id !== id; });
      return commit(data);
    },

    missingFromDesign: function (design) {
      var owned = {};
      load().owned.forEach(function (item) { owned[item.charmId] = true; });
      var missing = [];
      var seen = {};
      (design.links || []).forEach(function (id) {
        if (!id || owned[id] || seen[id]) return;
        seen[id] = true;
        var charm = root.Catalog.byId(id);
        if (charm) missing.push(charm);
      });
      return missing;
    },

    quiz: function () { return load().quiz; },

    setQuiz: function (quiz) {
      var data = load();
      data.quiz = quiz;
      return commit(data);
    },

    subscription: function () { return load().subscription; },

    setSubscription: function (sub) {
      var data = load();
      data.subscription = sub;
      return commit(data);
    },

    referral: function () { return load().referral; },

    setReferral: function (referral) {
      var data = load();
      data.referral = referral;
      return commit(data);
    },

    /** Demo helper so “design with what you own” can be tried on an empty device. */
    addSampleOwned: function () {
      var self = this;
      ['heart-little', 'coffee-cup', 'pencil', 'north-star'].forEach(function (id) {
        self.addOwned(id, 'sample');
      });
      return load();
    },

    recordCart: function (cart) {
      var self = this;
      (cart.lines || []).forEach(function (line) {
        if (line.meta && line.meta.charmId) self.addOwned(line.meta.charmId, 'cart-demo');
        if (line.meta && Array.isArray(line.meta.links)) {
          line.meta.links.forEach(function (id) { if (id) self.addOwned(id, 'cart-demo'); });
        }
        if (line.meta && Array.isArray(line.meta.charmIds)) {
          line.meta.charmIds.forEach(function (id) { self.addOwned(id, 'cart-demo'); });
        }
      });
      return load();
    },
  };

  root.Vault = Vault;
})(typeof window !== 'undefined' ? window : globalThis);
