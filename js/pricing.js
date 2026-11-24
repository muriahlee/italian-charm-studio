/**
 * All money math. Reads prices from CS config and works in integer cents.
 */
(function (root) {
  'use strict';

  function cents(dollars) {
    return Math.round(Number(dollars) * 100);
  }

  function priceCents(key) {
    var prices = root.CS && root.CS.prices;
    if (!prices || typeof prices[key] !== 'number' || !isFinite(prices[key])) {
      throw new Error('Unknown price: ' + key);
    }
    return cents(prices[key]);
  }

  function formatCents(amount) {
    var safe = Number(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(safe / 100);
  }

  function formatKey(key) {
    return formatCents(priceCents(key));
  }

  function charmCents(charm) {
    if (!charm) return 0;
    return priceCents(charm.priceKey || charm.tier);
  }

  /**
   * Studio set versus the same starter and the same five charms bought separately.
   * Returns null if the configured charm ids are missing.
   */
  function bundleQuote() {
    var bundle = root.CS.bundle;
    var charms = [];
    for (var i = 0; i < bundle.charmIds.length; i++) {
      var charm = root.Catalog && root.Catalog.byId(bundle.charmIds[i]);
      if (!charm) return null;
      charms.push(charm);
    }
    var separate = priceCents('starterBracelet');
    charms.forEach(function (charm) {
      separate += charmCents(charm);
    });
    var setCents = priceCents('bundle');
    return {
      charms: charms,
      separateCents: separate,
      bundleCents: setCents,
      savingsCents: separate - setCents,
    };
  }

  function clubPrepaidCents(months) {
    return priceCents('clubMonthly') * months;
  }

  root.Pricing = {
    cents: cents,
    priceCents: priceCents,
    formatCents: formatCents,
    formatKey: formatKey,
    charmCents: charmCents,
    bundleQuote: bundleQuote,
    clubPrepaidCents: clubPrepaidCents,
  };
})(typeof window !== 'undefined' ? window : globalThis);
