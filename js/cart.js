/**
 * Cart facade over the commerce adapter.
 * Configured bracelets are one line, with a price breakdown in meta.
 */
(function (root) {
  'use strict';

  function subtotalCents(cart) {
    var lines = (cart && cart.lines) || [];
    return lines.reduce(function (sum, line) {
      return sum + line.unitCents * line.qty;
    }, 0);
  }

  function count(cart) {
    var lines = (cart && cart.lines) || [];
    return lines.reduce(function (sum, line) { return sum + line.qty; }, 0);
  }

  function metalLabel(metal) {
    return metal === 'silver' ? 'Silver tone' : 'Gold tone';
  }

  function braceletBreakdown(design) {
    var lines = [{
      label: 'Starter bracelet, ' + metalLabel(design.metal).toLowerCase() + ', plain links included',
      cents: root.Pricing.priceCents('starterBracelet'),
    }];
    (design.links || []).forEach(function (id) {
      if (!id) return;
      var charm = root.Catalog.byId(id);
      if (!charm) return;
      lines.push({ label: charm.name, cents: root.Pricing.charmCents(charm), charmId: charm.id, sku: charm.sku });
    });
    return lines;
  }

  function braceletUnitCents(design) {
    return braceletBreakdown(design).reduce(function (sum, line) { return sum + line.cents; }, 0);
  }

  var Cart = {
    get: function () {
      return root.Commerce.current().getCart();
    },

    addCharm: function (charm, metal, qty) {
      var finish = metal === 'silver' ? 'silver' : 'gold';
      return root.Commerce.current().addLine({
        type: 'charm',
        sku: charm.sku,
        name: charm.name + ' · ' + metalLabel(finish),
        unitCents: root.Pricing.charmCents(charm),
        qty: qty || 1,
        meta: { metal: finish, charmId: charm.id, priceKey: charm.priceKey },
      }).then(function (cart) {
        if (root.Util) root.Util.announce(charm.name + ' added to the cart. ' + root.CS.priceNotes.metal);
        return cart;
      });
    },

    addSkuProduct: function (product, extraMeta) {
      return root.Commerce.current().addLine({
        type: product.type || product.id,
        sku: product.sku,
        name: product.name,
        unitCents: root.Pricing.priceCents(product.priceKey),
        qty: 1,
        meta: extraMeta || {},
      }).then(function (cart) {
        if (root.Util) root.Util.announce(product.name + ' added to the cart.');
        return cart;
      });
    },

    addTool: function () {
      return this.addSkuProduct(Object.assign({ type: 'tool' }, root.CS.products.tool));
    },

    addGiftBox: function () {
      return this.addSkuProduct(Object.assign({ type: 'giftbox' }, root.CS.products.giftBox));
    },

    addBundle: function (metal) {
      var finish = metal === 'silver' ? 'silver' : 'gold';
      var quote = root.Pricing.bundleQuote();
      return root.Commerce.current().addLine({
        type: 'bundle',
        sku: root.CS.bundle.sku,
        name: root.CS.bundle.name + ' · ' + metalLabel(finish),
        unitCents: root.Pricing.priceCents('bundle'),
        qty: 1,
        meta: {
          metal: finish,
          charmIds: root.CS.bundle.charmIds.slice(),
          separateCents: quote ? quote.separateCents : null,
          story: '',
        },
      }).then(function (cart) {
        if (root.Util) root.Util.announce('Five-charm set added to the cart. The price is the same in gold or silver.');
        return cart;
      });
    },

    addClub: function (opts) {
      var months = opts.months || 1;
      var cents = root.Pricing.clubPrepaidCents(months);
      var name = months > 1
        ? 'Fiorvelle Monthly Collection, ' + months + ' months'
        : 'Fiorvelle Monthly Collection, first month';
      return root.Commerce.current().addLine({
        type: 'club',
        sku: months > 1 ? 'CLUB-' + months + 'MO' : 'CLUB-MO',
        name: name + ' · ' + metalLabel(opts.metal),
        unitCents: cents,
        qty: 1,
        meta: {
          metal: opts.metal === 'silver' ? 'silver' : 'gold',
          months: months,
          cadence: months > 1 ? 'prepaid' : 'monthly',
          demo: true,
        },
      }).then(function (cart) {
        if (root.Util) root.Util.announce(name + ' added to the cart. 3-month minimum. No payment is taken in this prototype.');
        return cart;
      });
    },

    /**
     * One configured bracelet: starter + the charms on it.
     * Tool and gift box are separate lines so they can be removed on their own.
     */
    addConfigured: function (design) {
      var self = this;
      var breakdown = braceletBreakdown(design);
      var placed = breakdown.filter(function (line) { return line.charmId; });
      var name = 'Bracelet · ' + metalLabel(design.metal) + ' · ' + (design.links ? design.links.length : 0) + ' links';
      if (placed.length) name += ' · ' + placed.length + (placed.length === 1 ? ' charm' : ' charms');
      return root.Commerce.current().addLine({
        type: 'configured-bracelet',
        sku: 'BR-CUSTOM',
        name: name,
        unitCents: braceletUnitCents(design),
        qty: 1,
        meta: {
          metal: design.metal,
          wristInches: design.wrist,
          linkCount: design.links.length,
          links: design.links.slice(),
          assembly: design.assembly,
          story: (design.story || '').slice(0, 180),
          giftMessage: (design.giftMessage || '').slice(0, 140),
          breakdown: breakdown,
        },
      }).then(function (cart) {
        var extra = Promise.resolve(cart);
        if (design.includeTool && !self.hasType(cart, 'tool')) extra = self.addTool();
        return extra.then(function (next) {
          if (design.includeGiftBox && !self.hasType(next, 'giftbox')) return self.addGiftBox();
          return next;
        });
      }).then(function (cart) {
        if (root.Util) root.Util.announce('Bracelet added to the cart.');
        return cart;
      });
    },

    hasType: function (cart, type) {
      return (cart.lines || []).some(function (line) { return line.type === type; });
    },

    updateQty: function (lineId, qty) {
      return root.Commerce.current().updateQty(lineId, qty);
    },

    remove: function (lineId) {
      return root.Commerce.current().removeLine(lineId);
    },

    subtotalCents: subtotalCents,
    count: count,
    braceletBreakdown: braceletBreakdown,
    braceletUnitCents: braceletUnitCents,
    metalLabel: metalLabel,
  };

  root.Cart = Cart;
})(typeof window !== 'undefined' ? window : globalThis);
