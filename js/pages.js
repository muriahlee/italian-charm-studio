/**
 * Page controllers. Each one reads prices, labels, and catalog data from config.
 */
(function (root) {
  'use strict';

  function money(cents) { return root.Pricing.formatCents(cents); }

  function menuIcon(kind) {
    var paths = {
      bracelet: '<rect x="6" y="14" width="28" height="12" rx="6" fill="none" stroke="currentColor" stroke-width="1.6"/>',
      charm: '<circle cx="20" cy="20" r="7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M20 13 v14 M13 20 h14" stroke="currentColor" stroke-width="1.2"/>',
      crystal: '<path d="M20 8 L30 20 L20 34 L10 20 Z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
      dangle: '<rect x="14" y="8" width="12" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M20 18 v6 M16 30 a4 6 0 1 0 8 0 a4 5 0 1 0 -8 0" fill="none" stroke="currentColor" stroke-width="1.6"/>',
      link: '<rect x="12" y="14" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>',
      tool: '<path d="M14 26 L26 14 M22 14 h6 v6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
      month: '<path d="M20 28 C20 28 12 22 12 16 a8 8 0 0 1 16 0 c0 6-8 12-8 12z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
    };
    return '<svg class="menu-icon" viewBox="0 0 40 40" aria-hidden="true">' + (paths[kind] || paths.charm) + '</svg>';
  }

  function renderPriceMenu(menu, examples) {
    if (menu) {
      var rows = [
        ['bracelet', 'Plain starter bracelet', 'starterBracelet', 'The row of plain links, sized to the wrist.'],
        ['charm', 'Standard charm', 'standard', 'A decorative link that replaces a plain one.'],
        ['crystal', 'Premium crystal charm', 'premium', 'A crystal link. Same price in either tone.'],
        ['dangle', 'Dangling charm', 'dangle', 'A link with a little drop.'],
        ['link', 'Additional plain link', 'plainLink', 'One extra plain link, for a repair or a resize.'],
        ['tool', 'Charm-changing tool', 'tool', 'Opens a link so you can slide another in.'],
        ['month', 'Your Monthly Dose of Happy', 'clubMonthly', 'Two charms, the card, the sticker, and the pouch. Domestic shipping included.'],
      ];
      menu.innerHTML = rows.map(function (row) {
        var suffix = row[2] === 'clubMonthly' ? '<span class="menu-suffix"> / month</span>' : '';
        return '<article class="menu-card"><div>' + menuIcon(row[0]) + '</div><h3>' + row[1] + '</h3><p class="menu-price">' +
          root.Pricing.formatKey(row[2]) + suffix + '</p><p class="note">' + row[3] + '</p></article>';
      }).join('');
    }
    if (!examples) return;
    examples.innerHTML = root.CS.priceExamples.map(function (item) {
      return '<div class="menu-line"><span>' + root.Util.esc(item.label) + '</span><span class="menu-dots" aria-hidden="true"></span><strong>' +
        money(root.Pricing.exampleCents(item.charms)) + '</strong></div>';
    }).join('');
  }

  function renderSweetNote(el) {
    if (!el) return;
    el.innerHTML = 'Two standard charms on their own are <strong>' + money(root.Pricing.standardPairCents()) +
      '</strong>. Your Monthly Dose of Happy is <strong>' + root.Pricing.formatKey('clubMonthly') +
      '</strong> a month, and it also includes the card, the sticker, and the pouch. It is the sweetest way to collect. ' +
      root.Util.esc(root.CS.priceNotes.metal);
  }

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
    renderPriceMenu(document.getElementById('price-menu'), document.getElementById('build-examples'));
    renderSweetNote(document.getElementById('monthly-sweet'));
    root.ProductUI.mountGrid(
      document.getElementById('best-grid'),
      root.Catalog.charms.filter(function (charm) { return charm.isBestSeller; }).slice(0, 4),
      { metal: 'gold' }
    );
    renderSweetNote(document.getElementById('bundle-savings'));
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
        gold: 'The same links, the same prices, in a gold tone. They replace a plain link. They do not change the size.',
        silver: 'The same links, the same prices, in a silver tone. They replace a plain link. They do not change the size.',
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
    var basics = document.getElementById('basics');
    if (basics && mode === 'all') renderBasics(basics, metal);
  }

  function renderBasics(el, metal) {
    var finish = metal === 'silver' ? 'silver' : 'gold';
    var starter = root.CS.products.starter;
    var plain = root.CS.products.plainLink;
    var tool = root.CS.products.tool;
    el.innerHTML =
      '<article class="panel"><h2>' + root.Util.esc(starter.name) + '</h2><p class="club-price">' + root.Pricing.formatKey(starter.priceKey) + '</p><p>' + root.Util.esc(starter.description) + '</p><p class="note">' + root.Util.esc(root.CS.priceNotes.metal) + '</p><button type="button" class="btn" data-add-product="starter" data-metal="' + finish + '">Add a starter</button></article>' +
      '<article class="panel"><h2>' + root.Util.esc(plain.name) + '</h2><p class="club-price">' + root.Pricing.formatKey(plain.priceKey) + '</p><p>' + root.Util.esc(plain.description) + '</p><p class="note">' + root.Util.esc(root.CS.priceNotes.plainLink) + '</p><button type="button" class="btn secondary" data-add-product="plainLink" data-metal="' + finish + '">Add a plain link</button></article>' +
      '<article class="panel"><h2>' + root.Util.esc(tool.name) + '</h2><p class="club-price">' + root.Pricing.formatKey(tool.priceKey) + '</p><p>' + root.Util.esc(tool.description) + '</p><button type="button" class="btn secondary" data-add-product="tool">Add the tool</button></article>';
    if (!el.dataset.bound) {
      el.dataset.bound = '1';
      el.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-add-product]');
        if (!btn) return;
        var key = btn.getAttribute('data-add-product');
        var product = root.CS.products[key];
        if (!product) return;
        if (key === 'tool') root.Cart.addTool();
        else root.Cart.addSkuProduct(product, { metal: btn.getAttribute('data-metal') || 'gold' });
      });
    }
  }

  function gifts() {
    var host = document.getElementById('gift-set');
    if (host) {
      host.innerHTML = '<div class="panel"><p class="eyebrow">A gentle way to give</p><p id="gift-sweet" class="lede"></p></div>';
      renderSweetNote(document.getElementById('gift-sweet'));
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
    renderSweetNote(document.getElementById('club-sweet'));
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
            '<div class="cluster" style="margin-top:0.5rem"><a class="btn secondary" href="./builder.html?design=' + encodeURIComponent(record.id) + '">Open in Wear Your Story</a>' +
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
    if (!document.getElementById('code-form')) return;
    var rates = root.CS.ambassador && root.CS.ambassador.exampleRates;
    if (!rates) return;
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
        el.innerHTML = '<p class="empty-slot">The bag is empty. Wear Your Story is the shortest way to begin.</p>' +
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
      var hasTool = cart.lines.some(function (line) { return line.type === 'tool'; });
      var hasClub = cart.lines.some(function (line) { return line.type === 'club'; });
      var hasBracelet = cart.lines.some(function (line) { return line.type === 'configured-bracelet' || line.type === 'bundle'; });
      summary.innerHTML =
        '<div class="progress" aria-hidden="true"><span style="width:' + (ratio * 100) + '%"></span></div>' +
        '<p class="note">' + ship + '</p>' +
        '<p class="note">' + root.Util.esc(root.CS.shipping.policy) + '</p>' +
        '<div class="total-row"><span>Subtotal</span><span>' + money(sub) + '</span></div>' +
        '<p class="note">' + root.Util.esc(root.CS.priceNotes.metal) + '</p>' +
        (hasBracelet && !hasTool ? '<div class="panel"><p>The charm-changing tool is ' + root.Pricing.formatKey('tool') + ' if you want to swap a link at home.</p><button type="button" class="btn secondary" id="cart-tool">Add the tool</button></div>' : '') +
        (!hasClub ? '<div class="panel"><p id="cart-sweet"></p><a class="btn secondary" data-page-link="club" href="./club.html"></a></div>' : '') +
        '<div class="panel"><h3 class="serif" style="font-size:1.5rem">Complete the story</h3><div id="cart-recs" class="product-grid"></div></div>' +
        '<button type="button" class="btn full" id="checkout">Continue</button>' +
        '<p id="checkout-note" class="note" role="status"></p>' +
        '<button type="button" class="text-btn" id="to-vault">Save these pieces to your collection (demo)</button>';
      root.Shell.fill(summary);
      renderSweetNote(document.getElementById('cart-sweet'));
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
          if (note) note.textContent = 'Saved to your collection on this device. This is not a purchase.';
        });
      }
    });
  }

  function editionLabel(theme) {
    var n = String(theme.edition);
    return 'Edition ' + (n.length < 2 ? '0' + n : n);
  }

  function card() {
    var host = document.getElementById('card-preview');
    var picker = document.getElementById('card-picker');
    if (!host || !root.MonthlyThemes) return;
    var current = 0;
    function draw() {
      var theme = root.MonthlyThemes[current];
      var charms = theme.charmIds.map(function (id) { return root.Catalog.byId(id); }).filter(Boolean);
      var sections = root.CS.card.sections.map(function (section) {
        var copy = section.id === 'motivation' ? theme.motivation
          : section.id === 'encouragement' ? theme.encouragement
          : section.id === 'reminder' ? theme.reminder
          : theme.charms;
        return '<section class="panel"><h3>' + root.Util.esc(section.title) + '</h3><p>' + root.Util.esc(copy) + '</p></section>';
      }).join('');
      var qr = root.CS.card.digitalCollectionUrl
        ? '<p>The QR code on the printed card will open <a href="' + root.Util.esc(root.CS.card.digitalCollectionUrl) + '">' + root.Util.esc(root.CS.card.digitalCollectionUrl) + '</a>.</p>'
        : '<p class="empty-slot">QR code placeholder. Set card.digitalCollectionUrl in config when the digital collection has an address. This sample is not a scannable code.</p>';
      host.innerHTML =
        '<p class="eyebrow">' + root.Util.esc(theme.month) + ' · ' + editionLabel(theme) + '</p>' +
        '<h2>' + root.Util.esc(theme.title) + '</h2>' +
        '<div class="product-grid" id="card-charms"></div>' +
        '<div class="two" style="margin-top:1rem">' + sections + '</div>' +
        '<div class="panel" style="margin-top:1rem"><h3>Digital collection</h3>' + qr + '<p class="note">The same edition number is on the card and in your collection.</p></div>';
      root.ProductUI.mountGrid(document.getElementById('card-charms'), charms, { metal: 'gold' });
    }
    picker.innerHTML = root.MonthlyThemes.map(function (theme, index) {
      return '<button type="button" class="chip" data-edition="' + index + '" aria-pressed="' + (index === 0 ? 'true' : 'false') + '">' + root.Util.esc(theme.month) + '</button>';
    }).join('');
    picker.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-edition]');
      if (!btn) return;
      current = Number(btn.getAttribute('data-edition'));
      picker.querySelectorAll('[data-edition]').forEach(function (chip) {
        chip.setAttribute('aria-pressed', chip === btn ? 'true' : 'false');
      });
      draw();
    });
    draw();
  }

  function dashboard() {
    var rootEl = document.getElementById('dashboard');
    if (!rootEl) return;
    function draw() {
      var data = root.Vault.all();
      var owned = data.owned.map(function (item) { return root.Catalog.byId(item.charmId); }).filter(Boolean);
      var sub = data.subscription;
      var ownedHtml = owned.length
        ? '<div id="dash-owned" class="product-grid"></div>'
        : '<p class="empty-slot">No links saved yet. This demo collection starts empty.</p><button type="button" class="btn" id="dash-sample">Add sample links (demo)</button>';
      var subHtml = sub
        ? '<p><strong>Demo membership.</strong> ' + (sub.metal === 'silver' ? 'Silver tone' : 'Gold tone') + ' · ' + root.Util.esc(sub.status) + ' · ' + root.Pricing.formatKey('clubMonthly') + ' / month.</p>' +
          '<p class="note">Domestic shipping is included. This prototype does not promise a delivery date, and it does not bill anyone.</p>' +
          '<div class="cluster"><button type="button" class="btn secondary" id="dash-tone">' + (sub.metal === 'silver' ? 'Switch to gold tone' : 'Switch to silver tone') + '</button>' +
          (sub.status === 'demo' ? '<button type="button" class="btn secondary" id="dash-skip">Skip this demo month</button><button type="button" class="btn" id="dash-cancel">Cancel demo membership</button>' : '<p class="note">Cancelled on this device.</p>') +
          '</div>'
        : '<p class="empty-slot">No demo membership on this device.</p><a class="btn" data-page-link="club" href="./club.html"></a>';
      var themes = (root.MonthlyThemes || []).map(function (theme) {
        return '<article class="panel"><p class="eyebrow">' + editionLabel(theme) + ' · ' + root.Util.esc(theme.month) + '</p><h3>' + root.Util.esc(theme.title) + '</h3><p class="note">Sample edition. Not a shipment record.</p></article>';
      }).join('');
      var designsHtml = !data.designs.length
        ? '<p class="empty-slot">Saved bracelets will appear here.</p>'
        : data.designs.map(function (record) {
          return '<article class="panel"><h3>' + root.Util.esc(record.name) + '</h3><p class="note">' +
            (record.design.metal === 'silver' ? 'Silver tone' : 'Gold tone') +
            (record.design.story ? ' · ' + root.Util.esc(record.design.story) : '') +
            '</p><a class="btn secondary" href="./builder.html?design=' + encodeURIComponent(record.id) + '">Open</a></article>';
        }).join('');
      rootEl.innerHTML =
        '<section class="section"><p class="prototype-pill">Demo</p><h2>Links you keep</h2>' + ownedHtml +
        '<p style="margin-top:0.8rem"><a class="btn secondary" href="./builder.html?palette=owned">Design with links you keep</a></p></section>' +
        '<section class="section"><h2>Saved bracelets</h2><div class="two">' + designsHtml + '</div></section>' +
        '<section class="section"><h2>Monthly editions</h2><p class="note">Twelve sample themes. Joining does not mean these were mailed.</p><div class="two">' + themes + '</div></section>' +
        '<section class="section" id="manage"><h2>Membership</h2>' + subHtml + '</section>';
      root.Shell.fill(rootEl);
      if (owned.length) root.ProductUI.mountGrid(document.getElementById('dash-owned'), owned, { metal: (sub && sub.metal) || 'gold' });
    }
    rootEl.addEventListener('click', function (e) {
      if (e.target.id === 'dash-sample') { root.Vault.addSampleOwned(); draw(); }
      if (e.target.id === 'dash-cancel') {
        var sub = root.Vault.subscription();
        if (!sub) return;
        if (!window.confirm('Cancel the demo membership on this device? Nothing is billed.')) return;
        sub.status = 'cancelled';
        root.Vault.setSubscription(sub);
        draw();
      }
      if (e.target.id === 'dash-skip') {
        var current = root.Vault.subscription();
        if (!current) return;
        current.skipped = true;
        root.Vault.setSubscription(current);
        root.Util.announce('Demo month skipped on this device. No shipment was stopped, because none is scheduled.');
        draw();
      }
      if (e.target.id === 'dash-tone') {
        var membership = root.Vault.subscription();
        if (!membership) return;
        membership.metal = membership.metal === 'silver' ? 'gold' : 'silver';
        root.Vault.setSubscription(membership);
        draw();
      }
    });
    draw();
  }

  root.Pages = {
    home: home,
    builder: function () { root.Builder.mount(); },
    shop: shop,
    gifts: gifts,
    club: club,
    card: card,
    dashboard: dashboard,
    vault: vault,
    society: society,
    cart: cart,
    about: function () {},
    faq: function () {},
    policy: function () {},
  };
})(typeof window !== 'undefined' ? window : globalThis);
