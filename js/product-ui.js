/**
 * Charm cards, the quick view, and small add-to-cart actions.
 * Illustrations stand in until image is set on the catalog record.
 */
(function (root) {
  'use strict';

  var dialogMetal = 'gold';

  function tierLabel(tier) {
    if (tier === 'dangle') return 'Dangle';
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  }

  function frame(charm, metal, lazy) {
    var dangle = charm && charm.tier === 'dangle' ? ' is-dangle' : '';
    if (charm && charm.image) {
      return '<span class="charm-frame' + dangle + '"><img src="' + root.Util.esc(charm.image) + '" alt="' + root.Util.esc(charm.name) + ', demo product"></span>';
    }
    if (lazy) {
      return '<span class="charm-frame' + dangle + '" data-lazy="' + root.Util.esc(charm.id) + '" data-metal="' + (metal === 'silver' ? 'silver' : 'gold') + '"></span>';
    }
    return '<span class="charm-frame' + dangle + '">' + root.CharmArt.render(charm, metal) + '</span>';
  }

  function hydrate(scope) {
    var nodes = (scope || document).querySelectorAll('[data-lazy]');
    if (!nodes.length) return;
    var paint = function (node) {
      if (node.getAttribute('data-ready')) return;
      var charm = root.Catalog.byId(node.getAttribute('data-lazy'));
      if (!charm) return;
      node.innerHTML = root.CharmArt.render(charm, node.getAttribute('data-metal'));
      node.setAttribute('data-ready', '1');
    };
    if (typeof IntersectionObserver !== 'function') {
      Array.prototype.forEach.call(nodes, paint);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        paint(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '240px' });
    Array.prototype.forEach.call(nodes, function (node) { io.observe(node); });
  }

  function card(charm, opts) {
    opts = opts || {};
    var metal = opts.metal === 'silver' ? 'silver' : 'gold';
    var price = root.Pricing.formatCents(root.Pricing.charmCents(charm));
    var wished = root.Vault.wished(charm.id);
    var club = charm.exclusive === 'club' ? '<span class="club-label">Club edit</span>' : '';
    return '' +
      '<article class="card">' +
        '<button type="button" class="card-media" data-open-charm="' + charm.id + '" data-metal="' + metal + '">' +
          frame(charm, metal, opts.lazy !== false) +
          '<span class="demo-label">Concept illustration. Not a product photograph.</span>' +
        '</button>' +
        '<h3>' + root.Util.esc(charm.name) + club + '</h3>' +
        '<p class="card-meta">' + tierLabel(charm.tier) + ' · ' + price + '</p>' +
        '<p class="card-copy">' + root.Util.esc(charm.description) + '</p>' +
        '<div class="card-actions">' +
          '<button type="button" class="btn" data-add-charm="' + charm.id + '" data-metal="' + metal + '">Add to bag</button>' +
          '<button type="button" class="icon-btn" data-wish="' + charm.id + '" aria-pressed="' + (wished ? 'true' : 'false') + '" aria-label="Save ' + root.Util.esc(charm.name) + ' to wishlist">' + (wished ? 'Saved' : 'Save') + '</button>' +
        '</div>' +
      '</article>';
  }

  function mountGrid(el, charms, opts) {
    if (!el) return;
    if (!charms.length) {
      el.innerHTML = '<p class="empty-slot">Nothing in this edit yet.</p>';
      return;
    }
    el.innerHTML = charms.map(function (charm) { return card(charm, opts); }).join('');
    hydrate(el);
  }

  function legend(el) {
    if (!el) return;
    var p = root.Pricing.formatKey;
    el.innerHTML =
      '<span>Plain starter <strong>' + p('starterBracelet') + '</strong></span>' +
      '<span>Standard charm <strong>' + p('standard') + '</strong></span>' +
      '<span>Premium crystal <strong>' + p('premium') + '</strong></span>' +
      '<span>Dangling charm <strong>' + p('dangle') + '</strong></span>' +
      '<span>' + root.Util.esc(root.CS.priceNotes.metal) + '</span>';
  }

  function ensureDialog() {
    var dlg = document.getElementById('charm-dialog');
    if (dlg) return dlg;
    dlg = document.createElement('dialog');
    dlg.id = 'charm-dialog';
    dlg.innerHTML = '<div class="dialog-grid"><div id="dialog-art"></div><div class="dialog-body" id="dialog-body"></div></div>';
    document.body.appendChild(dlg);
    return dlg;
  }

  function open(charm, metal) {
    dialogMetal = metal === 'silver' ? 'silver' : 'gold';
    var dlg = ensureDialog();
    renderDialog(charm);
    if (dlg.open) return;
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
  }

  function renderDialog(charm) {
    var art = document.getElementById('dialog-art');
    var body = document.getElementById('dialog-body');
    art.innerHTML = frame(charm, dialogMetal, false) + '<p class="concept-label">Concept illustration. Not a product photograph.</p>';
    var price = root.Pricing.formatCents(root.Pricing.charmCents(charm));
    var recs = root.Recs.charms({ placedIds: [charm.id], ownedIds: root.Vault.ownedIds(), limit: 3 });
    body.innerHTML =
      '<button type="button" class="icon-btn dialog-close" data-close-dialog aria-label="Close">Close</button>' +
      '<p class="eyebrow">' + root.Util.esc(root.Catalog.categoryLabel(charm.category)) + '</p>' +
      '<h2>' + root.Util.esc(charm.name) + '</h2>' +
      '<p class="club-price">' + price + '</p>' +
      '<p>' + root.Util.esc(charm.description) + '</p>' +
      '<p class="note">Add a charm for someone you love. ' + root.Util.esc(root.CS.priceNotes.metal) + '</p>' +
      '<div class="metal-switch" role="group" aria-label="Finish">' +
        '<button type="button" data-dialog-metal="gold" aria-pressed="' + (dialogMetal === 'gold' ? 'true' : 'false') + '">Gold</button>' +
        '<button type="button" data-dialog-metal="silver" aria-pressed="' + (dialogMetal === 'silver' ? 'true' : 'false') + '">Silver</button>' +
      '</div>' +
      '<div class="cluster" style="margin-top:0.8rem">' +
        '<button type="button" class="btn" data-add-charm="' + charm.id + '" data-metal="' + dialogMetal + '">Add to bag</button>' +
        '<a class="btn secondary" href="' + root.CS.pages.builder.href + '">' + root.Util.esc(root.CS.pages.builder.label) + '</a>' +
      '</div>' +
      '<h3 class="serif" style="margin-top:1.2rem;font-size:1.6rem">Complete the story</h3>' +
      '<div class="product-grid" style="grid-template-columns:repeat(3,1fr);margin-top:0.6rem">' +
        recs.map(function (item) { return card(item, { metal: dialogMetal, lazy: false }); }).join('') +
      '</div>';
    body.dataset.charm = charm.id;
  }

  function bind() {
    document.addEventListener('click', function (e) {
      var openBtn = e.target.closest('[data-open-charm]');
      if (openBtn) {
        var charm = root.Catalog.byId(openBtn.getAttribute('data-open-charm'));
        if (charm) open(charm, openBtn.getAttribute('data-metal'));
        return;
      }
      var add = e.target.closest('[data-add-charm]');
      if (add && !add.closest('#builder')) {
        var item = root.Catalog.byId(add.getAttribute('data-add-charm'));
        if (!item) return;
        var metal = add.getAttribute('data-metal') || dialogMetal;
        root.Cart.addCharm(item, metal);
        var dlg = document.getElementById('charm-dialog');
        if (dlg && dlg.open && typeof dlg.close === 'function') dlg.close();
        return;
      }
      var wish = e.target.closest('[data-wish]');
      if (wish) {
        root.Vault.toggleWish(wish.getAttribute('data-wish'));
        var on = root.Vault.wished(wish.getAttribute('data-wish'));
        wish.setAttribute('aria-pressed', on ? 'true' : 'false');
        wish.textContent = on ? 'Saved' : 'Save';
        return;
      }
      var metalBtn = e.target.closest('[data-dialog-metal]');
      if (metalBtn) {
        var id = document.getElementById('dialog-body').dataset.charm;
        var again = root.Catalog.byId(id);
        if (again) open(again, metalBtn.getAttribute('data-dialog-metal'));
        return;
      }
      if (e.target.closest('[data-close-dialog]')) {
        var dialog = document.getElementById('charm-dialog');
        if (dialog && dialog.close) dialog.close();
      }
    });
  }

  root.ProductUI = {
    card: card,
    frame: frame,
    mountGrid: mountGrid,
    legend: legend,
    hydrate: hydrate,
    open: open,
    bind: bind,
    tierLabel: tierLabel,
  };
})(typeof window !== 'undefined' ? window : globalThis);
