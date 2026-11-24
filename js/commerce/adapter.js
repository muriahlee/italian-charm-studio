/**
 * Commerce adapter.
 *
 * LocalDemoAdapter persists a cart in localStorage. It never collects card data.
 * ShopifyStorefrontAdapter is a stub for the Storefront API cart + checkoutUrl.
 *
 * Production wiring (do this on a server, not in the browser, if you can):
 *   1. Create a Shopify custom app and enable the Storefront API.
 *   2. Grant unauthenticated_read_product_listings and unauthenticated_write_checkouts.
 *   3. Keep the token on the server. The Admin API key must never be in this repo.
 *      A public Storefront token is still safer behind your own endpoint.
 *   4. Set CS.commerce.provider = 'shopify-storefront'
 *      and CS.commerce.shopify.domain = 'your-shop.myshopify.com'.
 *   5. Fill shopifyVariantId on each catalog record (a ProductVariant GID).
 *   6. cartCreate returns cart.id and cart.checkoutUrl. Send the customer to checkoutUrl.
 *      Configured bracelets need line item attributes (metal, link size, charm SKUs, story).
 *
 * Endpoint shape if you proxy:
 *   POST {your-host}/api/cart      → { cartId, checkoutUrl }
 *   POST {your-host}/api/cart/lines
 *   GET  {your-host}/api/cart
 */
(function (root) {
  'use strict';

  var CART_KEY = 'cart';

  function emptyCart() {
    return { lines: [] };
  }

  function load() {
    var cart = root.Store.read(CART_KEY, null);
    if (!cart || !Array.isArray(cart.lines)) return emptyCart();
    return cart;
  }

  function save(cart) {
    root.Store.write(CART_KEY, cart);
    if (root.Util) root.Util.emit('cs:cart', cart);
    return cart;
  }

  function lineMatch(a, b) {
    if (a.type !== b.type || a.sku !== b.sku) return false;
    return JSON.stringify(a.meta || {}) === JSON.stringify(b.meta || {});
  }

  var LocalDemoAdapter = {
    id: 'local-demo',

    getCart: function () {
      return Promise.resolve(load());
    },

    addLine: function (line) {
      var cart = load();
      var found = null;
      for (var i = 0; i < cart.lines.length; i++) {
        if (lineMatch(cart.lines[i], line)) { found = cart.lines[i]; break; }
      }
      if (found) {
        found.qty += line.qty || 1;
      } else {
        cart.lines.push({
          lineId: line.lineId || (root.Util ? root.Util.uid('line') : 'line-' + Date.now()),
          type: line.type,
          sku: line.sku,
          name: line.name,
          unitCents: line.unitCents,
          qty: line.qty || 1,
          meta: line.meta || {},
        });
      }
      return Promise.resolve(save(cart));
    },

    updateQty: function (lineId, qty) {
      var cart = load();
      cart.lines = cart.lines.map(function (line) {
        if (line.lineId !== lineId) return line;
        line.qty = qty;
        return line;
      }).filter(function (line) { return line.qty > 0; });
      return Promise.resolve(save(cart));
    },

    removeLine: function (lineId) {
      var cart = load();
      cart.lines = cart.lines.filter(function (line) { return line.lineId !== lineId; });
      return Promise.resolve(save(cart));
    },

    clear: function () {
      return Promise.resolve(save(emptyCart()));
    },

    /**
     * Demo checkout does not redirect and does not take payment.
     * A live adapter returns { demo:false, url: checkoutUrl }.
     */
    beginCheckout: function () {
      return Promise.resolve({
        demo: true,
        url: null,
        message: root.CS.checkoutNote,
      });
    },
  };

  var ShopifyStorefrontAdapter = {
    id: 'shopify-storefront',

    _notReady: function () {
      var domain = root.CS.commerce.shopify.domain;
      var token = root.CS.commerce.shopify.storefrontAccessToken;
      if (!domain) {
        return Promise.reject(new Error('Shopify domain is empty. Set CS.commerce.shopify.domain when you launch. Do not commit a token.'));
      }
      if (!token && !root.CS.commerce.shopify.proxy) {
        return Promise.reject(new Error('Shopify Storefront adapter is a stub. Point it at your server, which returns checkoutUrl.'));
      }
      return null;
    },

    getCart: function () {
      var fail = this._notReady();
      if (fail) return fail;
      return Promise.reject(new Error('ShopifyStorefrontAdapter.getCart is not implemented. See js/commerce/adapter.js.'));
    },

    addLine: function () {
      var fail = this._notReady();
      if (fail) return fail;
      return Promise.reject(new Error('ShopifyStorefrontAdapter.addLine is not implemented.'));
    },

    updateQty: function () {
      return Promise.reject(new Error('ShopifyStorefrontAdapter.updateQty is not implemented.'));
    },

    removeLine: function () {
      return Promise.reject(new Error('ShopifyStorefrontAdapter.removeLine is not implemented.'));
    },

    clear: function () {
      return Promise.reject(new Error('ShopifyStorefrontAdapter.clear is not implemented.'));
    },

    /**
     * When implemented, return the cart.checkoutUrl from cartCreate / cartLinesAdd.
     * Example mutation (run on your server):
     *   mutation cartCreate($input: CartInput) {
     *     cartCreate(input: $input) { cart { id checkoutUrl } userErrors { message } }
     *   }
     */
    beginCheckout: function () {
      var fail = this._notReady();
      if (fail) return fail;
      return Promise.reject(new Error('ShopifyStorefrontAdapter.beginCheckout is not implemented.'));
    },
  };

  function current() {
    if (root.CS.commerce.provider === 'shopify-storefront') return ShopifyStorefrontAdapter;
    return LocalDemoAdapter;
  }

  root.Commerce = {
    LocalDemoAdapter: LocalDemoAdapter,
    ShopifyStorefrontAdapter: ShopifyStorefrontAdapter,
    current: current,
  };
})(typeof window !== 'undefined' ? window : globalThis);
