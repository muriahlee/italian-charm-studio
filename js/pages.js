/**
 * Page controllers. Each one reads prices, labels, and catalog data from config.
 */
(function (root) {
  'use strict';

  function money(cents) { return root.Pricing.formatCents(cents); }

  function home() {
    var snap = document.getElementById('snap');
    if (snap) {
      var ids = ['heart-little', 'daisy', 'coffee-cup', 'plane', 'north-star'];
      snap.innerHTML = '<div class="snap-caption"><span>Pick a metal</span><span>Add a charm</span><span>Make it yours</span></div><div class="snap-row">' +
        ids.map(function (id, i) {
          var charm = root.Catalog.byId(id);
          return '<div class="snap-link"><div class="snap-charm" style="--i:' + i + '"><span class="charm-frame">' +
            root.CharmArt.render(charm, 'gold') + '</span></div></div>';
        }).join('') + '</div>';
    }
    root.ProductUI.legend(document.getElementById('legend'));
    root.ProductUI.mountGrid(
      document.getElementById('best-grid'),
      root.Catalog.charms.filter(function (charm) { return charm.isBestSeller; }).slice(0, 4),
      { metal: 'gold' }
    );
    var quote = root.Pricing.bundleQuote();
    var savings = document.getElementById('bundle-savings');
    if (savings && quote) {
      savings.innerHTML = 'Separately, this bracelet and these five charms are <strong>' + money(quote.separateCents) + '</strong>. The set is <strong>' + money(quote.bundleCents) + '</strong>' +
        (quote.savingsCents > 0 ? ' — ' + money(quote.savingsCents) + ' less.' : '.') +
        ' <span>' + root.Util.esc(root.CS.priceNotes.metal) + '</span>';
    }
    root.Shell.reviews(document.getElementById('reviews-root'));
    root.Shell.trust(document.getElementById('trust-root'));
  }

  function shop() {
    var mode = document.body.getAttribute('data-shop') || 'all';
    var metal = mode === 'silver' ? 'silver' : 'gold';
    var lead = document.getElementById('shop-lead');
    if (lead) {
      var lines = {
        all: root.CS.brand.lines.charm + ' ' + root.CS.priceNotes.metal,
        gold: 'The same charms, the same prices, in a gold finish.',
        silver: 'The same charms, the same prices, in a silver finish.',
        teacher: 'Charms for classrooms and the people who keep them. The house is not only for teachers — this edit is.',
        best: 'A studio edit of pieces we are putting forward. No invented sales counts.',
        fresh: 'The newest illustrations in the prototype catalog.',
      };
      lead.textContent = lines[mode] || lines.all;
    }
    root.ProductUI.legend(document.getElementById('legend'));
    var category = '';
    var tier = '';
    function list() {
      return root.Catalog.charms.filter(function (charm) {
        if (mode === 'best' && !charm.isBestSeller) return false;
        if (mode === 'fresh' && !charm.isNew) return false;
        if (mode === 'teacher' && charm.tags.indexOf('teacher') === -1 && charm.category !== 'teachers') return false;
        if (category && charm.category !== category) return false;
        if (tier && charm.tier !== tier) return false;
        return true;
      });
    }
    function draw() {
      root.ProductUI.mountGrid(document.getElementById('grid'), list(), { metal: metal });
      var recs = root.Recs.charms({
        placedIds: [],
        ownedIds: root.Vault.ownedIds(),
        tags: mode === 'teacher' ? ['teacher', 'school', 'book'] : (root.Vault.quiz() && root.Vault.quiz().tags) || [],
        limit: 4,
      });
      var complete = document.getElementById('complete');
      if (complete) {
        complete.innerHTML = '<h2>Complete the story</h2><p class="note">Charms that sit beside what you already keep.</p>';
        var grid = document.createElement('div');
        grid.className = 'product-grid';
        grid.style.marginTop = '1rem';
        complete.appendChild(grid);
        root.ProductUI.mountGrid(grid, recs, { metal: metal });
      }
    }
    var filters = document.getElementById('shop-filters');
    if (filters) {
      var cats = '<button type="button" class="chip" data-cat="" aria-pressed="true">All</button>' +
        root.Catalog.categories.map(function (cat) {
          return '<button type="button" class="chip" data-cat="' + cat.id + '" aria-pressed="false">' + root.Util.esc(cat.label) + '</button>';
        }).join('');
      filters.innerHTML = cats;
      filters.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-cat]');
        if (!btn) return;
        category = btn.getAttribute('data-cat');
        filters.querySelectorAll('[data-cat]').forEach(function (chip) {
          chip.setAttribute('aria-pressed', chip === btn ? 'true' : 'false');
        });
        draw();
      });
    }
    var tiers = document.getElementById('tier-filters');
    if (tiers) {
      tiers.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-tier]');
        if (!btn) return;
        tier = btn.getAttribute('data-tier');
        tiers.querySelectorAll('[data-tier]').forEach(function (chip) {
          chip.setAttribute('aria-pressed', chip === btn ? 'true' : 'false');
        });
        draw();
      });
    }
    draw();
  }

  function gifts() {
    var quote = root.Pricing.bundleQuote();
    var host = document.getElementById('gift-set');
    if (host && quote) {
      host.innerHTML =
        '<p class="eyebrow">The studio set</p>' +
        '<h2>' + root.Util.esc(root.CS.bundle.name) + '</h2>' +
        '<p class="bundle-hero"><b>' + money(quote.bundleCents) + '</b></p>' +
        '<p id="gift-math">Separately ' + money(quote.separateCents) + (quote.savingsCents > 0 ? '. The set is ' + money(quote.savingsCents) + ' less.' : '.') + '</p>' +
        '<p class="note">' + root.Util.esc(root.CS.priceNotes.metal) + '</p>' +
        '<div class="product-grid" id="set-grid"></div>' +
        '<div class="cluster" style="margin-top:1rem">' +
          '<button type="button" class="btn" id="add-set-gold">Add in gold</button>' +
          '<button type="button" class="btn secondary" id="add-set-silver">Add in silver</button>' +
        '</div>';
      root.ProductUI.mountGrid(document.getElementById('set-grid'), quote.charms, { metal: 'gold' });
      host.addEventListener('click', function (e) {
        if (e.target.id === 'add-set-gold') root.Cart.addBundle('gold');
        if (e.target.id === 'add-set-silver') root.Cart.addBundle('silver');
      });
    }
    var box = document.getElementById('gift-box-price');
    if (box) box.textContent = root.Pricing.formatKey('giftBox');
    var plans = document.getElementById('prepaid');
    if (plans) {
      plans.innerHTML = root.CS.club.prepaidMonths.map(function (months) {
        return '<article class="panel"><h3>' + months + ' months</h3><p class="club-price">' + money(root.Pricing.clubPrepaidCents(months)) + '</p>' +
          '<p class="note">The monthly price, times ' + months + '. A gift membership, paid once in this demo.</p>' +
          '<button type="button" class="btn" data-prepaid="' + months + '">Add gift membership</button></article>';
      }).join('');
      plans.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-prepaid]');
        if (!btn) return;
        root.Cart.addClub({ months: Number(btn.getAttribute('data-prepaid')), metal: 'gold' });
      });
    }
  }

  function club() {
    var price = document.getElementById('club-price');
    if (price) price.textContent = root.Pricing.formatKey('clubMonthly');
    var benefits = document.getElementById('club-benefits');
    if (benefits) {
      benefits.innerHTML = root.CS.club.benefits.map(function (item) {
        return '<li>' + root.Util.esc(item) + '</li>';
      }).join('');
    }
    var plans = document.getElementById('club-prepaid');
    if (plans) {
      plans.innerHTML = root.CS.club.prepaidMonths.map(function (months) {
        return '<article class="panel"><h3>' + months + '-month gift</h3><p class="club-price">' + money(root.Pricing.clubPrepaidCents(months)) + '</p>' +
          '<button type="button" class="btn secondary" data-gift-months="' + months + '">Add as a gift</button></article>';
      }).join('');
    }
    renderMembership();
    var step = 0;
    var answers = { who: '', mood: '', theme: '', metal: 'gold' };
    var steps = document.querySelectorAll('.quiz-step');
    function show() {
      Array.prototype.forEach.call(steps, function (el, i) { el.classList.toggle('is-on', i === step); });
    }
    var quiz = document.getElementById('quiz');
    if (quiz) {
      quiz.addEventListener('click', function (e) {
        var choice = e.target.closest('[data-quiz]');
        if (choice) {
          var key = choice.getAttribute('data-quiz');
          answers[key] = choice.getAttribute('data-value');
          choice.parentElement.querySelectorAll('button').forEach(function (btn) {
            btn.setAttribute('aria-pressed', btn === choice ? 'true' : 'false');
          });
          return;
        }
        if (e.target.closest('[data-next]')) { step = Math.min(steps.length - 1, step + 1); show(); }
        if (e.target.closest('[data-prev]')) { step = Math.max(0, step - 1); show(); }
        if (e.target.id === 'join-demo') join(1, answers.metal);
        var gift = e.target.closest('[data-gift-months]');
        if (gift) root.Cart.addClub({ months: Number(gift.getAttribute('data-gift-months')), metal: answers.metal || 'gold' });
      });
      show();
    }
    document.body.addEventListener('click', function (e) {
      if (e.target.id === 'cancel-demo') {
        var sub = root.Vault.subscription();
        if (sub) {
          sub.status = 'cancelled';
          root.Vault.setSubscription(sub);
          renderMembership();
        }
      }
    });

    function join(months, metal) {
      var tags = [];
      if (answers.theme === 'stories') tags.push('book', 'reading');
      if (answers.theme === 'travel') tags.push('travel');
      if (answers.theme === 'classroom') tags.push('teacher', 'school');
      if (answers.theme === 'family') tags.push('family', 'mother');
      if (answers.theme === 'color') tags.push('pink', 'flower');
      if (answers.mood === 'quiet') tags.push('pearl');
      if (answers.mood === 'warm') tags.push('coffee', 'heart');
      if (answers.mood === 'playful') tags.push('butterfly');
      if (answers.mood === 'formal') tags.push('luxury');
      root.Vault.setQuiz({ who: answers.who, mood: answers.mood, theme: answers.theme, metal: metal, tags: tags });
      root.Vault.setSubscription({
        metal: metal === 'silver' ? 'silver' : 'gold',
        cadence: 'monthly',
        months: months,
        status: 'demo',
        createdAt: new Date().toISOString(),
      });
      root.Cart.addClub({ months: 1, metal: metal === 'silver' ? 'silver' : 'gold' });
      renderMembership();
    }

    function renderMembership() {
      var el = document.getElementById('membership');
      if (!el) return;
      var sub = root.Vault.subscription();
      if (!sub) {
        el.innerHTML = '<p class="note">No demo membership is saved on this device.</p>';
        return;
      }
      el.innerHTML = '<p>Demo membership · ' + (sub.metal === 'silver' ? 'Silver' : 'Gold') + ' · ' + root.Util.esc(sub.status) + '.</p>' +
        '<p class="note">Skip or cancel anytime. Here, that only updates the note on this device. No payment is taken.</p>' +
        (sub.status === 'demo' ? '<button type="button" class="btn secondary" id="cancel-demo">Cancel demo membership</button>' : '');
    }
  }

  function vault() {
    var ownedEl = document.getElementById('owned');
    var designsEl = document.getElementById('designs');
    var wishEl = document.getElementById('wishlist');
    var monthsEl = document.getElementById('months');

    function draw() {
      var data = root.Vault.all();
      var owned = data.owned.map(function (item) { return root.Catalog.byId(item.charmId); }).filter(Boolean);
      if (!owned.length) {
        ownedEl.innerHTML = '<p class="empty-slot">Your story so far is a blank bracelet. Add a sample set to try the vault, or shop a charm.</p>' +
          '<div class="cluster"><button type="button" class="btn" id="add-sample">Add sample chapters</button><a class="btn secondary" data-page-link="shop" href="./shop.html"></a></div>';
        root.Shell.fill(ownedEl);
      } else {
        root.ProductUI.mountGrid(ownedEl, owned, { metal: 'gold' });
      }
      if (!data.designs.length) {
        designsEl.innerHTML = '<p class="empty-slot">Saved designs will gather here, story and all.</p>';
      } else {
        designsEl.innerHTML = data.designs.map(function (record) {
          var missing = root.Vault.missingFromDesign(record.design);
          var ids = record.design.links.filter(Boolean).slice(0, 5);
          var preview = ids.map(function (id) {
            var charm = root.Catalog.byId(id);
            return charm ? '<span class="charm-frame" style="width:52px;display:inline-block">' + root.CharmArt.render(charm, record.design.metal) + '</span>' : '';
          }).join('');
          return '<article class="vault-design"><div>' + preview + '</div><div>' +
            '<h3>' + root.Util.esc(record.name) + '</h3>' +
            '<p class="note">' + (record.design.metal === 'silver' ? 'Silver' : 'Gold') + ' · ' + record.design.links.length + ' links' +
            (record.design.story ? ' · “' + root.Util.esc(record.design.story) + '”' : '') + '</p>' +
            (missing.length ? '<p>Still to add: ' + missing.map(function (charm) { return root.Util.esc(charm.name); }).join(', ') + '.</p>' +
              '<button type="button" class="btn" data-missing="' + record.id + '">Add missing charms</button>' : '<p class="note">Every charm in this design is in the vault.</p>') +
            '<div class="cluster" style="margin-top:0.5rem"><a class="btn secondary" href="./builder.html?design=' + encodeURIComponent(record.id) + '">Open in the Mood Bar</a>' +
            '<button type="button" class="text-btn" data-delete-design="' + record.id + '">Remove</button></div></div></article>';
        }).join('');
      }
      var wishes = data.wishlist.map(function (id) { return root.Catalog.byId(id); }).filter(Boolean);
      wishEl.innerHTML = wishes.length ? '' : '<p class="empty-slot">Nothing saved yet.</p>';
      if (wishes.length) root.ProductUI.mountGrid(wishEl, wishes, { metal: 'gold' });
      monthsEl.innerHTML = root.Catalog.collections.map(function (col) {
        return '<article class="panel"><p class="eyebrow">Sample monthly edit · ' + root.Util.esc(col.month) + '</p><h3>' + root.Util.esc(col.title) + '</h3><p>' + root.Util.esc(col.blurb) + '</p></article>';
      }).join('');
    }

    document.getElementById('vault-root').addEventListener('click', function (e) {
      if (e.target.id === 'add-sample') { root.Vault.addSampleOwned(); draw(); }
      var missing = e.target.closest('[data-missing]');
      if (missing) {
        var record = root.Vault.designs().filter(function (item) { return item.id === missing.getAttribute('data-missing'); })[0];
        if (!record) return;
        root.Vault.missingFromDesign(record.design).forEach(function (charm) {
          root.Cart.addCharm(charm, record.design.metal);
        });
      }
      var del = e.target.closest('[data-delete-design]');
      if (del) { root.Vault.deleteDesign(del.getAttribute('data-delete-design')); draw(); }
    });
    draw();
  }

  function society() {
    var rates = root.CS.ambassador.exampleRates;
    var table = document.getElementById('rates');
    if (table) {
      table.innerHTML = '<p><span class="example-flag">' + root.Util.esc(rates.label) + '</span></p>' +
        '<table class="society-table"><tbody>' +
        '<tr><th>On a referred order</th><td>' + rates.orderPercent + '%</td></tr>' +
        '<tr><th>On a referred club membership</th><td>' + rates.clubPercent + '%</td></tr>' +
        '</tbody></table>' +
        '<p class="note">These percentages are placeholders for the prototype. They are not an active offer and not a contract.</p>';
    }
    var existing = root.Vault.referral();
    var out = document.getElementById('code-out');
    if (existing && out) out.textContent = 'Demo code ' + existing.code + '. It is stored on this device only.';
    document.getElementById('code-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('code-name').value || '').trim();
      var base = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
      if (base.length < 3) base = 'MOOD';
      var code = base + '-' + Math.floor(1000 + Math.random() * 9000);
      root.Vault.setReferral({ code: code, name: name, demo: true, at: new Date().toISOString() });
      out.textContent = 'Demo code ' + code + '. Share the Mood Bar with it in the note. Nothing is tracked on a server.';
    });
    ['group-form', 'fund-form'].forEach(function (id) {
      var form = document.getElementById(id);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var data = { kind: id, at: new Date().toISOString() };
        Array.prototype.forEach.call(form.elements, function (field) {
          if (field.name) data[field.name] = field.value;
        });
        var all = root.Store.read('inquiries', []);
        all.push(data);
        root.Store.write('inquiries', all);
        form.querySelector('.form-status').textContent = 'Saved on this device. This prototype does not send the request.';
        form.reset();
      });
    });
  }

  function cart() {
    var el = document.getElementById('cart-lines');
    var summary = document.getElementById('cart-summary');
    function draw(cart) {
      cart = cart || { lines: [] };
      if (!cart.lines.length) {
        el.innerHTML = '<p class="empty-slot">The bag is empty. The Mood Bar is the shortest way to fill it.</p>' +
          '<a class="btn" data-page-link="builder" href="./builder.html"></a>';
        root.Shell.fill(el);
      } else {
        el.innerHTML = cart.lines.map(function (line) {
          var detail = '';
          if (line.meta && line.meta.breakdown) {
            detail = '<ul class="price-lines">' + line.meta.breakdown.map(function (part) {
              return '<li><span>' + root.Util.esc(part.label) + '</span><span>' + money(part.cents) + '</span></li>';
            }).join('') + '</ul>';
          }
          if (line.meta && line.meta.story) detail += '<p class="note">Story: ' + root.Util.esc(line.meta.story) + '</p>';
          if (line.meta && line.meta.giftMessage) detail += '<p class="note">Gift note: ' + root.Util.esc(line.meta.giftMessage) + '</p>';
          return '<article class="cart-line"><div><h3>' + root.Util.esc(line.name) + '</h3>' + detail +
            '<button type="button" class="text-btn" data-remove="' + line.lineId + '">Remove</button></div>' +
            '<div class="qty"><button type="button" data-qty="' + line.lineId + '" data-delta="-1" aria-label="Decrease quantity">−</button><span>' + line.qty + '</span><button type="button" data-qty="' + line.lineId + '" data-delta="1" aria-label="Increase quantity">+</button></div>' +
            '<strong>' + money(line.unitCents * line.qty) + '</strong></article>';
        }).join('');
      }
      var sub = root.Cart.subtotalCents(cart);
      var threshold = root.Pricing.cents(root.CS.shipping.freeThreshold);
      var ratio = threshold ? Math.min(1, sub / threshold) : 0;
      var ship = sub >= threshold
        ? 'This order meets the complimentary US shipping threshold. The final shipping cost is confirmed at checkout.'
        : 'Add ' + money(threshold - sub) + ' to reach complimentary US shipping. Shipping is confirmed at checkout. No delivery date is quoted here.';
      var quote = root.Pricing.bundleQuote();
      var hasBundle = cart.lines.some(function (line) { return line.type === 'bundle'; });
      var hasTool = cart.lines.some(function (line) { return line.type === 'tool'; });
      var hasClub = cart.lines.some(function (line) { return line.type === 'club'; });
      var hasBracelet = cart.lines.some(function (line) { return line.type === 'configured-bracelet' || line.type === 'bundle'; });
      summary.innerHTML =
        '<div class="progress" aria-hidden="true"><span style="width:' + (ratio * 100) + '%"></span></div>' +
        '<p class="note">' + ship + '</p>' +
        '<p class="note">' + root.Util.esc(root.CS.shipping.policy) + '</p>' +
        '<div class="total-row"><span>Subtotal</span><span>' + money(sub) + '</span></div>' +
        '<p class="note">' + root.Util.esc(root.CS.priceNotes.metal) + '</p>' +
        (quote && !hasBundle ? '<div class="panel"><p>Bracelet + five charms is ' + money(quote.bundleCents) + '. Separately those pieces are ' + money(quote.separateCents) + '.</p><button type="button" class="btn secondary" id="cart-bundle">Add the set</button></div>' : '') +
        (hasBracelet && !hasTool ? '<div class="panel"><p>The assembly tool is ' + root.Pricing.formatKey('tool') + ' if you want to set a link at home.</p><button type="button" class="btn secondary" id="cart-tool">Add the tool</button></div>' : '') +
        (!hasClub ? '<div class="panel"><p>The Charm Club is ' + root.Pricing.formatKey('clubMonthly') + ' a month — five charms, a mood, a standing story.</p><a class="btn secondary" data-page-link="club" href="./club.html"></a></div>' : '') +
        '<div class="panel"><h3 class="serif" style="font-size:1.5rem">Complete the story</h3><div id="cart-recs" class="product-grid"></div></div>' +
        '<button type="button" class="btn full" id="checkout">Continue</button>' +
        '<p id="checkout-note" class="note" role="status"></p>' +
        '<button type="button" class="text-btn" id="to-vault">Save these pieces to the Mood Vault (demo)</button>';
      root.Shell.fill(summary);
      var placed = [];
      cart.lines.forEach(function (line) {
        if (line.meta && line.meta.charmId) placed.push(line.meta.charmId);
        if (line.meta && line.meta.links) placed = placed.concat(line.meta.links.filter(Boolean));
      });
      root.ProductUI.mountGrid(document.getElementById('cart-recs'), root.Recs.charms({ placedIds: placed, ownedIds: root.Vault.ownedIds(), excludeIds: placed, limit: 3 }), { metal: 'gold' });
    }

    root.Cart.get().then(draw);
    root.addEventListener('cs:cart', function (event) { draw(event.detail); });
    document.getElementById('cart-app').addEventListener('click', function (e) {
      var remove = e.target.closest('[data-remove]');
      if (remove) { root.Cart.remove(remove.getAttribute('data-remove')); return; }
      var qty = e.target.closest('[data-qty]');
      if (qty) {
        root.Cart.get().then(function (cart) {
          var line = cart.lines.filter(function (item) { return item.lineId === qty.getAttribute('data-qty'); })[0];
          if (!line) return;
          root.Cart.updateQty(line.lineId, line.qty + Number(qty.getAttribute('data-delta')));
        });
        return;
      }
      if (e.target.id === 'cart-bundle') root.Cart.addBundle('gold');
      if (e.target.id === 'cart-tool') root.Cart.addTool();
      if (e.target.id === 'checkout') {
        root.Commerce.current().beginCheckout().then(function (result) {
          var note = document.getElementById('checkout-note');
          if (note) note.textContent = result.message || root.CS.checkoutNote;
        });
      }
      if (e.target.id === 'to-vault') {
        root.Cart.get().then(function (cart) {
          root.Vault.recordCart(cart);
          var note = document.getElementById('checkout-note');
          if (note) note.textContent = 'Saved to the Mood Vault on this device. This is not a purchase.';
        });
      }
    });
  }

  root.Pages = {
    home: home,
    builder: function () { root.Builder.mount(); },
    shop: shop,
    gifts: gifts,
    club: club,
    vault: vault,
    society: society,
    cart: cart,
    about: function () {},
    faq: function () {},
  };
})(typeof window !== 'undefined' ? window : globalThis);
