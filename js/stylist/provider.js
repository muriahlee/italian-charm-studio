/**
 * Stylist provider.
 *
 * active: 'catalog' uses StylistEngine in the browser (tags, synonyms, keywords).
 * active: 'remote' POSTs to CS.stylist.endpoint. That endpoint is yours.
 *
 * The server should accept:
 *   { text, context: { metal, linkCount, ownedIds } }
 * and return:
 *   { metal, links: (string|null)[], explanation }
 * Hold the model API key on the server. Do not add it to CS or to this file.
 *
 * To switch later:
 *   CS.stylist.endpoint = 'https://your-domain.example/api/stylist';
 *   Stylist.active = 'remote';
 */
(function (root) {
  'use strict';

  var Stylist = {
    active: 'catalog',

    recommend: function (text, context) {
      if (this.active === 'remote') return this.remote(text, context);
      return Promise.resolve(root.StylistEngine.recommend(text, context));
    },

    remote: function (text, context) {
      var endpoint = root.CS.stylist && root.CS.stylist.endpoint;
      if (!endpoint) {
        return Promise.reject(new Error('No stylist endpoint is configured. The on-device catalog stylist is still available.'));
      }
      return fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: text, context: context || {} }),
      }).then(function (res) {
        if (!res.ok) throw new Error('The stylist service returned ' + res.status);
        return res.json();
      });
    },
  };

  root.Stylist = Stylist;
})(typeof window !== 'undefined' ? window : globalThis);
