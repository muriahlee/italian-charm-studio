/**
 * Wear Your Story — 9mm Italian link bracelet.
 * Decorative links replace plain links. The count, and the size, stay put.
 * Click a link design, then a position, or drag. Undo, share, and price stay in step.
 */
(function (root) {
  'use strict';

  var state;
  var ui;
  var past = [];
  var future = [];
  var drag = null;
  var suppressClick = false;
  var rootEl = null;

  function blank() {
    var wrist = root.CS.sizing.defaultWrist;
    var n = root.Sizing.linksForWrist(wrist);
    var links = [];
    for (var i = 0; i < n; i++) links.push(null);
    return {
      metal: 'gold',
      wrist: wrist,
      links: links,
      assembly: 'studio',
      includeTool: false,
      includeGiftBox: false,
      giftMessage: '',
      story: '',
      view: 'straight',
    };
  }

  function snapshot() {
    return JSON.stringify({
      metal: state.metal,
      wrist: state.wrist,
      links: state.links,
      assembly: state.assembly,
      includeTool: state.includeTool,
      includeGiftBox: state.includeGiftBox,
      giftMessage: state.giftMessage,
      story: state.story,
      view: state.view,
    });
  }

  function persist() {
    try { sessionStorage.setItem(root.Store.key('draft'), snapshot()); } catch (e) { /* ignore */ }
  }

  function apply(raw) {
    var next = typeof raw === 'string' ? JSON.parse(raw) : raw;
    state.metal = next.metal === 'silver' ? 'silver' : 'gold';
    state.wrist = next.wrist;
    state.links = (next.links || []).slice();
    state.assembly = next.assembly === 'diy' ? 'diy' : 'studio';
    state.includeTool = !!next.includeTool;
    state.includeGiftBox = !!next.includeGiftBox;
    state.giftMessage = next.giftMessage || '';
    state.story = next.story || '';
    if (next.view) state.view = next.view;
    fitLinks(false);
  }

  function fitLinks(announceDrop) {
    var n = root.Sizing.linksForWrist(state.wrist);
    var dropped = state.links.slice(n).filter(Boolean);
    var next = state.links.slice(0, n);
    while (next.length < n) next.push(null);
    state.links = next;
    if (announceDrop && dropped.length) {
      ui.note = 'This wrist holds ' + n + ' links. ' + dropped.length + ' decorative link' + (dropped.length > 1 ? 's were' : ' was') + ' taken off the end. Undo puts them back.';
    }
  }

  function update(mutator) {
    past.push(snapshot());
    if (past.length > 60) past.shift();
    future = [];
    mutator();
    fitLinks(true);
    persist();
    renderDynamic();
    syncUndo();
  }

  function undo() {
    if (!past.length) return;
    future.push(snapshot());
    apply(past.pop());
    ui.note = '';
    persist();
    renderDynamic();
    syncUndo();
  }

  function redo() {
    if (!future.length) return;
    past.push(snapshot());
    apply(future.pop());
    persist();
    renderDynamic();
    syncUndo();
  }

  function syncUndo() {
    var u = document.getElementById('undo');
    var r = document.getElementById('redo');
    if (u) u.disabled = !past.length;
    if (r) r.disabled = !future.length;
  }

  function placedIds() {
    return state.links.filter(Boolean);
  }

  function visibleCharms() {
    var q = (ui.query || '').toLowerCase();
    return root.Catalog.charms.filter(function (charm) {
      if (ui.ownedOnly && !root.Vault.owns(charm.id)) return false;
      if (ui.category && charm.category !== ui.category) return false;
      if (ui.tier && charm.tier !== ui.tier) return false;
      if ((charm.metals || []).indexOf(state.metal) === -1) return false;
      if (ui.moodTags && ui.moodTags.length) {
        var moodHit = ui.moodTags.some(function (tag) { return (charm.tags || []).indexOf(tag) !== -1; });
        if (!moodHit) return false;
      }
      if (q) {
        var blob = (charm.name + ' ' + charm.tags.join(' ') + ' ' + charm.description).toLowerCase();
        if (blob.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function layoutCircle() {
    var box = rootEl.querySelector('.bracelet.is-circle');
    if (!box) return;
    var links = box.querySelectorAll('.link');
    if (!links.length) return;
    var size = box.clientWidth;
    var lw = 48;
    var lh = 64;
    var r = size / 2 - lh / 2 - 4;
    var n = links.length;
    for (var i = 0; i < n; i++) {
      var angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      var x = size / 2 + r * Math.cos(angle) - lw / 2;
      var y = size / 2 + r * Math.sin(angle) - lh / 2;
      var deg = (angle + Math.PI / 2) * 180 / Math.PI;
      links[i].style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + deg.toFixed(2) + 'deg)';
    }
  }

  function renderStage() {
    var stage = document.getElementById('stage');
    var straight = state.view === 'straight';
    var html = '<div class="bracelet ' + (straight ? 'is-straight' : 'is-circle') + '" role="list">';
    state.links.forEach(function (id, i) {
      var charm = id ? root.Catalog.byId(id) : null;
      var art = charm ? root.CharmArt.render(charm, state.metal) : root.CharmArt.renderEmpty(state.metal);
      var label = 'Link ' + (i + 1) + ' of ' + state.links.length + (charm ? ', ' + charm.name : ', plain link');
      html += '<button type="button" class="link' + (ui.selectedIndex === i ? ' is-selected' : '') + '" role="listitem" data-link-index="' + i + '"' +
        (id ? ' data-drag-charm="' + id + '"' : '') +
        ' aria-label="' + root.Util.esc(label) + '">' +
        '<span class="charm-frame' + (charm && charm.tier === 'dangle' ? ' is-dangle' : '') + '">' + art + '</span>' +
        '<span class="link-index">' + (i + 1) + '</span></button>';
    });
    html += '</div>';
    stage.innerHTML = html;
    if (!straight) requestAnimationFrame(layoutCircle);
    var prompt = document.getElementById('story-prompt');
    var count = placedIds().length;
    if (prompt) {
      prompt.textContent = count ? (state.links.some(function (id) { return !id; }) ? 'Your size stays the same. Swap any plain link.' : root.CS.brand.lines.charm) : 'Replace a link to build your story.';
    }
    renderInspector();
    renderRecs();
  }

  function renderInspector() {
    var el = document.getElementById('inspector');
    if (!el) return;
    if (ui.selectedCharmId && ui.selectedIndex == null) {
      var chosen = root.Catalog.byId(ui.selectedCharmId);
      el.innerHTML = '<span>' + root.Util.esc(chosen ? chosen.name : '') + ' selected. Choose a link, or drag it.</span>' +
        '<button type="button" class="text-btn" id="clear-selection">Clear</button>';
      return;
    }
    if (ui.selectedIndex == null) {
      el.innerHTML = '<span class="note">Choose a decorative link, then a plain one to replace. Or drag it into place.</span>';
      return;
    }
    var id = state.links[ui.selectedIndex];
    var charm = id ? root.Catalog.byId(id) : null;
    el.innerHTML =
      '<span>Link ' + (ui.selectedIndex + 1) + (charm ? ' · ' + root.Util.esc(charm.name) + ' · ' + root.Pricing.formatCents(root.Pricing.charmCents(charm)) : ' · plain link, included') + '</span>' +
      (charm ? '<button type="button" class="btn secondary" id="zoom-link">Look closer</button><button type="button" class="btn secondary" id="remove-link">Restore plain link</button>' : '<button type="button" class="btn secondary" id="zoom-link">Look closer</button>') +
      '<button type="button" class="btn secondary" id="nudge-left">Move left</button>' +
      '<button type="button" class="btn secondary" id="nudge-right">Move right</button>';
  }

  function renderPrice() {
    var lines = root.Cart.braceletBreakdown(state);
    var total = lines.reduce(function (sum, line) { return sum + line.cents; }, 0);
    if (state.includeTool) total += root.Pricing.priceCents('tool');
    if (state.includeGiftBox) total += root.Pricing.priceCents('giftBox');
    var list = document.getElementById('price-lines');
    if (list) {
      var html = lines.map(function (line) {
        return '<li><span>' + root.Util.esc(line.label) + '</span><span>' + root.Pricing.formatCents(line.cents) + '</span></li>';
      }).join('');
      if (!placedIds().length) html += '<li><span>Open links</span><span>' + root.Pricing.formatCents(0) + '</span></li>';
      if (state.includeTool) html += '<li><span>Assembly tool</span><span>' + root.Pricing.formatKey('tool') + '</span></li>';
      if (state.includeGiftBox) html += '<li><span>Gift box</span><span>' + root.Pricing.formatKey('giftBox') + '</span></li>';
      list.innerHTML = html;
    }
    var totalEl = document.getElementById('price-total');
    if (totalEl) totalEl.textContent = root.Pricing.formatCents(total);
    var buy = document.getElementById('buybar-price');
    if (buy) buy.textContent = root.Pricing.formatCents(total);
    var finish = document.getElementById('finish-label');
    if (finish) finish.textContent = (state.metal === 'silver' ? 'Silver tone' : 'Gold tone') + ' · ' + state.links.length + ' links · ' + state.wrist + ' in';
    var bundle = document.getElementById('bundle-note');
    if (bundle) {
      bundle.innerHTML = 'The first month of Fiorvelle Monthly Collection is ' + root.Pricing.formatKey('firstMonth') +
        ' and includes the starter bracelet in its presentation box plus 2 charms. Then ' +
        root.Pricing.formatKey('clubMonthly') + ' every month. 3-month minimum.';
    }
  }

  function renderPalette() {
    var el = document.getElementById('palette');
    if (!el) return;
    var charms = visibleCharms();
    if (!charms.length) {
      el.innerHTML = '<p class="empty-slot">' + (ui.ownedOnly ? 'Your collection has no links for this filter yet.' : 'No links in this filter.') + '</p>';
      return;
    }
    el.innerHTML = charms.map(function (charm) {
      var on = ui.selectedCharmId === charm.id;
      return '<button type="button" class="palette-item" data-select-charm="' + charm.id + '" data-drag-charm="' + charm.id + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
        '<span class="charm-frame' + (charm.tier === 'dangle' ? ' is-dangle' : '') + '" data-lazy="' + charm.id + '" data-metal="' + state.metal + '"></span>' +
        '<strong>' + root.Util.esc(charm.name) + '</strong>' +
        '<span>' + root.Pricing.formatCents(root.Pricing.charmCents(charm)) + '</span>' +
        '</button>';
    }).join('');
    root.ProductUI.hydrate(el);
  }

  function renderRecs() {
    var el = document.getElementById('complete');
    if (!el) return;
    var concepts = [];
    try {
      var saved = JSON.parse(sessionStorage.getItem(root.Store.key('stylist')) || '{}');
      concepts = saved.concepts || [];
    } catch (e) { concepts = []; }
    var quiz = root.Vault.quiz();
    var tags = (quiz && quiz.tags) || [];
    var list = root.Recs.charms({
      placedIds: placedIds(),
      ownedIds: root.Vault.ownedIds(),
      tags: tags.concat(concepts),
      excludeIds: placedIds(),
      limit: 4,
    });
    el.innerHTML = '<h3 class="serif" style="font-size:1.6rem;margin:0.2rem 0 0.6rem">Complete the story</h3>' +
      '<div class="palette-grid">' + list.map(function (charm) {
        return '<button type="button" class="palette-item" data-select-charm="' + charm.id + '" data-drag-charm="' + charm.id + '">' +
          root.ProductUI.frame(charm, state.metal, false) +
          '<strong>' + root.Util.esc(charm.name) + '</strong></button>';
      }).join('') + '</div>';
  }

  function syncForm() {
    rootEl.querySelectorAll('[data-metal-choice]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-metal-choice') === state.metal ? 'true' : 'false');
    });
    rootEl.querySelectorAll('[data-view]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-view') === state.view ? 'true' : 'false');
    });
    var wrist = document.getElementById('wrist');
    if (wrist) wrist.value = String(state.wrist);
    var studio = document.getElementById('asm-studio');
    var diy = document.getElementById('asm-diy');
    if (studio) studio.checked = state.assembly !== 'diy';
    if (diy) diy.checked = state.assembly === 'diy';
    var tool = document.getElementById('tool-check');
    var box = document.getElementById('box-check');
    if (tool) tool.checked = state.includeTool;
    if (box) box.checked = state.includeGiftBox;
    var story = document.getElementById('story');
    var gift = document.getElementById('gift-message');
    if (story && document.activeElement !== story) story.value = state.story;
    if (gift && document.activeElement !== gift) gift.value = state.giftMessage;
    var note = document.getElementById('builder-note');
    if (note) note.textContent = ui.note || '';
  }

  function renderDynamic() {
    renderStage();
    renderPrice();
    syncForm();
  }

  function place(index, id) {
    if (!id || index == null || index < 0 || index >= state.links.length) return;
    var charm = root.Catalog.byId(id);
    update(function () {
      state.links[index] = id;
      ui.selectedIndex = index;
      ui.note = '';
    });
    if (charm) root.Util.announce(charm.name + ' on link ' + (index + 1) + '.');
  }

  function swap(a, b) {
    update(function () {
      var tmp = state.links[a];
      state.links[a] = state.links[b];
      state.links[b] = tmp;
      ui.selectedIndex = b;
    });
  }

  function clearLink(index) {
    update(function () {
      state.links[index] = null;
      ui.note = '';
    });
  }

  function nudge(dir) {
    if (ui.selectedIndex == null) return;
    var next = ui.selectedIndex + dir;
    if (next < 0 || next >= state.links.length) return;
    swap(ui.selectedIndex, next);
  }

  function showGhost(id, x, y) {
    var charm = root.Catalog.byId(id);
    if (!charm) return;
    var ghost = document.getElementById('drag-ghost');
    if (!ghost) {
      ghost = document.createElement('div');
      ghost.id = 'drag-ghost';
      ghost.className = 'drag-ghost';
      document.body.appendChild(ghost);
    }
    ghost.innerHTML = root.CharmArt.render(charm, state.metal);
    ghost.style.left = x + 'px';
    ghost.style.top = y + 'px';
    ghost.hidden = false;
  }

  function moveGhost(x, y) {
    var ghost = document.getElementById('drag-ghost');
    if (!ghost) return;
    ghost.style.left = x + 'px';
    ghost.style.top = y + 'px';
  }

  function hideGhost() {
    var ghost = document.getElementById('drag-ghost');
    if (ghost) ghost.hidden = true;
  }

  function linkAt(x, y) {
    var ghost = document.getElementById('drag-ghost');
    if (ghost) ghost.hidden = true;
    var node = document.elementFromPoint(x, y);
    if (ghost) ghost.hidden = false;
    var link = node && node.closest ? node.closest('[data-link-index]') : null;
    return link ? Number(link.getAttribute('data-link-index')) : null;
  }

  function highlight(x, y) {
    var index = linkAt(x, y);
    rootEl.querySelectorAll('.link').forEach(function (el) {
      el.classList.toggle('is-drop', Number(el.getAttribute('data-link-index')) === index);
    });
  }

  function clearDrag() {
    hideGhost();
    rootEl.querySelectorAll('.is-drop').forEach(function (el) { el.classList.remove('is-drop'); });
    drag = null;
  }

  function shareUrl() {
    var url = new URL(root.CS.pages.builder.href, root.location.href);
    url.search = '';
    url.hash = 'design=' + root.Codec.encode(state);
    return url.href;
  }

  function copyShare() {
    var url = shareUrl();
    if (root.history && root.history.replaceState) root.history.replaceState(null, '', url);
    var status = document.getElementById('share-status');
    var done = function () { if (status) status.textContent = 'Link copied. It includes the story, if you wrote one.'; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(function () { fallback(url, status); });
    } else fallback(url, status);
  }

  function fallback(url, status) {
    var input = document.createElement('textarea');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    try { document.execCommand('copy'); if (status) status.textContent = 'Link copied.'; }
    catch (e) { if (status) status.textContent = url; }
    input.remove();
  }

  function loadInitial() {
    var hash = (root.location.hash || '').replace(/^#/, '');
    if (hash.indexOf('design=') === 0) {
      var decoded = root.Codec.decode(hash.slice('design='.length));
      if (decoded) {
        apply(decoded);
        ui.note = 'Opened from a shared link.';
        return;
      }
      ui.note = 'That link could not be read. Starting a blank bracelet.';
      return;
    }
    var params = new URLSearchParams(root.location.search);
    if (params.get('design')) {
      var found = root.Vault.designs().filter(function (item) { return item.id === params.get('design'); })[0];
      if (found) {
        apply(found.design);
        ui.note = 'Loaded “' + found.name + '”.';
        return;
      }
    }
    var prompt = params.get('prompt');
    if (prompt) {
      ui.stylistText = prompt;
      var box = document.getElementById('stylist-text');
      if (box) box.value = prompt;
      runStylist(prompt);
      return;
    }
    try {
      var draft = sessionStorage.getItem(root.Store.key('draft'));
      if (draft) {
        apply(draft);
        ui.note = '';
      }
    } catch (e) { /* ignore */ }
  }

  function runStylist(text) {
    var explain = document.getElementById('stylist-explain');
    var colorEl = document.getElementById('mood-color');
    var budgetEl = document.getElementById('mood-budget');
    var color = colorEl ? colorEl.value : '';
    var budget = budgetEl ? Number(budgetEl.value) : 0;
    if (color) text = (text ? text + ' ' : '') + color;
    root.Stylist.recommend(text, {
      metal: state.metal,
      linkCount: state.links.length,
      wrist: state.wrist,
      ownedIds: root.Vault.ownedIds(),
    }).then(function (result) {
      if (budget > 0) {
        var cap = Math.round(budget * 100);
        var spent = root.Pricing.priceCents('starterBracelet');
        result.links = (result.links || []).map(function (id) {
          if (!id) return null;
          var charm = root.Catalog.byId(id);
          var cents = charm ? root.Pricing.charmCents(charm) : 0;
          if (spent + cents > cap) return null;
          spent += cents;
          return id;
        });
        result.explanation = (result.explanation || '') + ' Held to ' + root.Pricing.formatCents(cap) + ', including the starter.';
      }
      update(function () {
        state.metal = result.metal === 'silver' ? 'silver' : 'gold';
        if (result.links && result.links.length === state.links.length) state.links = result.links.slice();
        else state.links = result.links || state.links;
        ui.note = '';
      });
      if (explain) explain.textContent = result.explanation || '';
      try {
        sessionStorage.setItem(root.Store.key('stylist'), JSON.stringify({ concepts: result.concepts || [], text: text }));
      } catch (e) { /* ignore */ }
      renderPalette();
    }).catch(function (err) {
      if (explain) explain.textContent = err && err.message ? err.message : 'The stylist could not draft this.';
    });
  }

  function template() {
    var wrists = root.CS.sizing.wrists.map(function (n) {
      return '<option value="' + n + '">' + n + ' in</option>';
    }).join('');
    var cats = '<button type="button" class="chip" data-cat="" aria-pressed="true">All</button>' +
      root.Catalog.categories.map(function (cat) {
        return '<button type="button" class="chip" data-cat="' + cat.id + '" aria-pressed="false">' + root.Util.esc(cat.label) + '</button>';
      }).join('');
    return '' +
      '<div class="builder-grid">' +
        '<section class="stage-card" aria-label="Bracelet">' +
          '<div class="stage-toolbar">' +
            '<div class="metal-switch" role="group" aria-label="Metal finish">' +
              '<button type="button" data-metal-choice="gold" aria-pressed="true">Gold tone</button>' +
              '<button type="button" data-metal-choice="silver" aria-pressed="false">Silver tone</button>' +
            '</div>' +
            '<label class="field" style="margin:0"><span>Wrist</span><select id="wrist">' + wrists + '</select></label>' +
            '<div class="view-switch" role="group" aria-label="Arrangement">' +
              '<button type="button" data-view="circle">Circle</button>' +
              '<button type="button" data-view="straight">Straight</button>' +
            '</div>' +
            '<button type="button" class="btn secondary" id="undo">Undo</button>' +
            '<button type="button" class="btn secondary" id="redo">Redo</button>' +
          '</div>' +
          '<p class="note" id="finish-label"></p>' +
          '<p class="prompt-line" id="story-prompt"></p>' +
          '<div id="stage"></div>' +
          '<p class="concept-label">Concept illustration of 9mm links. Not a product photograph. Sizing is an estimate, not a supplier certificate.</p>' +
          '<div id="inspector" class="inspector"></div>' +
          '<p id="builder-note" class="note" role="status"></p>' +
          '<details><summary>How the link count is calculated</summary><p class="note">' + root.Util.esc(root.Sizing.formulaText()) + ' Decorative links replace plain ones. They do not change the count.</p></details>' +
          '<details><summary>Add, remove, or replace a link</summary><ol class="howto">' +
            root.CS.howto.map(function (step, i) {
              return '<li><strong>' + (i + 1) + '. ' + root.Util.esc(step.title) + '.</strong> ' + root.Util.esc(step.text) + '</li>';
            }).join('') +
          '</ol></details>' +
        '</section>' +
        '<div class="builder-side">' +
          '<section class="palette-card">' +
            '<form id="stylist-form">' +
              '<p class="eyebrow">Find Your Mood</p>' +
              '<p class="note">Optional. Shop without it. Recommendations use the catalog on this device. No paid model is called.</p>' +
              '<div class="two">' +
                '<label class="field"><span>A color</span><select id="mood-color"><option value="">Any</option><option>pink</option><option>blue</option><option>green</option><option>gold</option><option>black</option></select></label>' +
                '<label class="field"><span>Maximum budget</span><input id="mood-budget" type="number" min="0" step="0.01" inputmode="decimal" placeholder="Optional"></label>' +
              '</div>' +
              '<label class="field"><span>Interests, work, or a memory</span>' +
                '<textarea id="stylist-text" maxlength="280" placeholder="A gold bracelet for a teacher who loves coffee, books, traveling, and pink"></textarea>' +
              '</label>' +
              '<button class="btn" type="submit">Find a starting point</button>' +
              '<p id="stylist-explain" class="note" role="status"></p>' +
            '</form>' +
            '<label class="field"><span>Browse by</span><select id="mood-filter" aria-label="Browse charms by">' +
              '<option value="">Everything</option>' +
              '<option value="pink blush rose">Color · blush</option>' +
              '<option value="blue navy">Color · blue</option>' +
              '<option value="green">Color · green</option>' +
              '<option value="teacher school">Profession</option>' +
              '<option value="family mother baby">Family</option>' +
              '<option value="love heart">Love</option>' +
              '<option value="travel plane">Travel</option>' +
              '<option value="book music coffee">Hobbies</option>' +
              '<option value="reminder happiness">Motivation</option>' +
              '<option value="birthstone">Birth month</option>' +
              '<option value="christmas gift holiday">Special occasions</option>' +
            '</select></label>' +
            '<input class="search" id="charm-search" type="search" placeholder="Search charms" aria-label="Search charms">' +
            '<div class="filters" id="cat-filters">' + cats + '</div>' +
            '<div class="filters" id="tier-filters">' +
              '<button type="button" class="chip" data-tier="" aria-pressed="true">All tiers</button>' +
              '<button type="button" class="chip" data-tier="standard" aria-pressed="false">Standard</button>' +
              '<button type="button" class="chip" data-tier="premium" aria-pressed="false">Premium</button>' +
              '<button type="button" class="chip" data-tier="luxury" aria-pressed="false">Luxury</button>' +
              '<button type="button" class="chip" data-tier="dangle" aria-pressed="false">Dangle</button>' +
            '</div>' +
            '<label class="checks"><input type="checkbox" id="owned-only"> Only links in your collection</label>' +
            '<div id="palette" class="palette-grid"></div>' +
            '<div id="complete"></div>' +
          '</section>' +
          '<section class="price-card" aria-label="Price">' +
            '<p class="eyebrow">This bracelet</p>' +
            '<ul class="price-lines" id="price-lines"></ul>' +
            '<div class="total-row"><span>Total</span><span id="price-total"></span></div>' +
            '<p class="note">' + root.Util.esc(root.CS.priceNotes.metal) + '</p>' +
            '<fieldset class="field"><legend>Assembly</legend>' +
              '<label class="checks"><input type="radio" name="assembly" id="asm-studio" value="studio" checked> Assembled by the studio, included</label>' +
              '<label class="checks"><input type="radio" name="assembly" id="asm-diy" value="diy"> I will assemble it myself</label>' +
            '</fieldset>' +
            '<label class="checks"><input type="checkbox" id="tool-check"> Add the assembly tool, ' + root.Pricing.formatKey('tool') + '</label>' +
            '<p class="note">Assembling it yourself suggests the tool. Remove it before the bag if you already have one.</p>' +
            '<label class="checks"><input type="checkbox" id="box-check"> Add a gift box, ' + root.Pricing.formatKey('giftBox') + '</label>' +
            '<label class="field"><span>The story behind my bracelet</span><textarea id="story" maxlength="180" placeholder="Optional. Saved with the design and the share link."></textarea></label>' +
            '<label class="field"><span>Gift message</span><textarea id="gift-message" maxlength="140" placeholder="Optional note to enclose."></textarea></label>' +
            '<div class="inline-actions">' +
              '<button type="button" class="btn" id="add-bracelet">Add bracelet to bag</button>' +
            '</div>' +
            '<div class="inline-actions">' +
              '<input id="design-name" class="search" style="margin:0" maxlength="60" placeholder="Name this design" aria-label="Design name">' +
              '<button type="button" class="btn secondary" id="save-design">Save</button>' +
              '<button type="button" class="btn secondary" id="share-design">Copy link</button>' +
            '</div>' +
            '<p id="share-status" class="note" role="status"></p>' +
            '<div class="panel" style="margin-top:0.8rem"><p id="bundle-note"></p><a class="btn" href="' + root.CS.pages.club.href + '#join" style="margin-top:0.6rem">Join the collection</a></div>' +
            '<div id="after-add" class="after-add" hidden></div>' +
          '</section>' +
        '</div>' +
      '</div>' +
      '<div class="buybar-fixed" id="buybar"><div><div class="note">Bracelet</div><strong id="buybar-price"></strong></div><button type="button" class="btn" id="add-bracelet-bar">Add to bag</button></div>';
  }

  function zoomLink(index) {
    var id = state.links[index];
    var charm = id ? root.Catalog.byId(id) : null;
    var dlg = document.getElementById('zoom-dialog');
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.id = 'zoom-dialog';
      document.body.appendChild(dlg);
    }
    var art = charm ? root.CharmArt.render(charm, state.metal) : root.CharmArt.renderEmpty(state.metal);
    dlg.innerHTML = '<div class="dialog-body" style="padding:1.2rem"><button type="button" class="icon-btn" id="zoom-close">Close</button>' +
      '<p class="concept-label">Concept illustration. Not a product photograph.</p>' +
      '<div class="charm-frame" style="width:min(220px,70vw);margin:0.6rem auto">' + art + '</div>' +
      '<h2>' + root.Util.esc(charm ? charm.name : 'Plain link') + '</h2>' +
      '<p>' + root.Util.esc(charm ? charm.description : 'A plain 9mm link, included in the starter.') + '</p>' +
      (charm ? '<p class="menu-price">' + root.Pricing.formatCents(root.Pricing.charmCents(charm)) + '</p>' : '<p class="note">Included with the starter.</p>') +
      '</div>';
    dlg.querySelector('#zoom-close').addEventListener('click', function () { dlg.close(); });
    if (dlg.showModal) dlg.showModal();
  }

  function addBracelet() {
    root.Cart.addConfigured(state).then(function () {
      var panel = document.getElementById('after-add');
      if (!panel) return;
      panel.hidden = false;
      panel.innerHTML =
        '<div class="panel" role="status">' +
          '<p class="serif" style="font-size:1.6rem">It is in the bag.</p>' +
          '<p>The tool opens a link when you want to replace one at home. The collection’s first month is the starter bracelet in its presentation box plus 2 charms. Then two charms, a card, and a sticker each month.</p>' +
          '<div class="cluster">' +
            '<a class="btn" href="' + root.CS.pages.cart.href + '">View bag</a>' +
            '<button type="button" class="btn secondary" id="upsell-tool">Add the tool</button>' +
            '<a class="btn secondary" href="' + root.CS.pages.club.href + '">' + root.Util.esc(root.CS.pages.club.label) + '</a>' +
            '<button type="button" class="text-btn" id="keep-editing">Keep editing</button>' +
          '</div>' +
        '</div>';
    });
  }

  function bind() {
    rootEl.addEventListener('click', function (e) {
      if (suppressClick) { suppressClick = false; return; }
      var metal = e.target.closest('[data-metal-choice]');
      if (metal) {
        var next = metal.getAttribute('data-metal-choice');
        if (next === state.metal) return;
        update(function () { state.metal = next; });
        renderPalette();
        return;
      }
      var view = e.target.closest('[data-view]');
      if (view) {
        state.view = view.getAttribute('data-view');
        persist();
        renderStage();
        syncForm();
        return;
      }
      if (e.target.closest('#undo')) { undo(); return; }
      if (e.target.closest('#redo')) { redo(); return; }
      var cat = e.target.closest('[data-cat]');
      if (cat) {
        ui.category = cat.getAttribute('data-cat');
        rootEl.querySelectorAll('[data-cat]').forEach(function (btn) {
          btn.setAttribute('aria-pressed', btn === cat ? 'true' : 'false');
        });
        renderPalette();
        return;
      }
      var tier = e.target.closest('[data-tier]');
      if (tier) {
        ui.tier = tier.getAttribute('data-tier');
        rootEl.querySelectorAll('[data-tier]').forEach(function (btn) {
          btn.setAttribute('aria-pressed', btn === tier ? 'true' : 'false');
        });
        renderPalette();
        return;
      }
      var select = e.target.closest('[data-select-charm]');
      if (select) {
        ui.selectedCharmId = select.getAttribute('data-select-charm');
        ui.selectedIndex = null;
        rootEl.querySelectorAll('[data-select-charm]').forEach(function (btn) {
          btn.setAttribute('aria-pressed', btn.getAttribute('data-select-charm') === ui.selectedCharmId ? 'true' : 'false');
        });
        renderInspector();
        return;
      }
      var link = e.target.closest('[data-link-index]');
      if (link) {
        var index = Number(link.getAttribute('data-link-index'));
        if (ui.selectedCharmId) place(index, ui.selectedCharmId);
        else {
          ui.selectedIndex = index;
          renderStage();
        }
        return;
      }
      if (e.target.closest('#clear-selection')) {
        ui.selectedCharmId = null;
        renderPalette();
        renderInspector();
        return;
      }
      if (e.target.closest('#zoom-link') && ui.selectedIndex != null) { zoomLink(ui.selectedIndex); return; }
      if (e.target.closest('#remove-link') && ui.selectedIndex != null) { clearLink(ui.selectedIndex); return; }
      if (e.target.closest('#nudge-left')) { nudge(-1); return; }
      if (e.target.closest('#nudge-right')) { nudge(1); return; }
      if (e.target.closest('#add-bracelet') || e.target.closest('#add-bracelet-bar')) { addBracelet(); return; }
      if (e.target.closest('#add-bundle')) { root.Cart.addBundle(state.metal); return; }
      if (e.target.closest('#share-design')) { copyShare(); return; }
      if (e.target.closest('#save-design')) {
        var name = (document.getElementById('design-name').value || 'Untitled').trim();
        var record = root.Vault.saveDesign({
          name: name,
          metal: state.metal,
          wrist: state.wrist,
          links: state.links,
          assembly: state.assembly,
          story: state.story,
          giftMessage: state.giftMessage,
        });
        var status = document.getElementById('share-status');
        if (status) status.textContent = 'Saved to your collection as “' + record.name + '”. This demo stays on this device.';
        return;
      }
      if (e.target.closest('#upsell-tool')) { root.Cart.addTool(); return; }
      if (e.target.closest('#keep-editing')) {
        var panel = document.getElementById('after-add');
        if (panel) panel.hidden = true;
      }
    });

    rootEl.addEventListener('change', function (e) {
      if (e.target.id === 'wrist') {
        var wrist = Number(e.target.value);
        update(function () { state.wrist = wrist; });
        return;
      }
      if (e.target.name === 'assembly') {
        update(function () {
          state.assembly = e.target.value === 'diy' ? 'diy' : 'studio';
          state.includeTool = state.assembly === 'diy';
        });
        return;
      }
      if (e.target.id === 'tool-check') {
        state.includeTool = e.target.checked;
        persist();
        renderPrice();
        return;
      }
      if (e.target.id === 'box-check') {
        state.includeGiftBox = e.target.checked;
        persist();
        renderPrice();
        return;
      }
      if (e.target.id === 'owned-only') {
        ui.ownedOnly = e.target.checked;
        renderPalette();
      }
    });

    rootEl.addEventListener('input', function (e) {
      if (e.target.id === 'story') { state.story = e.target.value.slice(0, 180); persist(); }
      if (e.target.id === 'gift-message') { state.giftMessage = e.target.value.slice(0, 140); persist(); }
      if (e.target.id === 'charm-search') { ui.query = e.target.value; renderPalette(); }
      if (e.target.id === 'mood-filter') {
        ui.moodTags = e.target.value ? e.target.value.split(' ') : [];
        renderPalette();
      }
    });

    rootEl.addEventListener('submit', function (e) {
      if (e.target.id !== 'stylist-form') return;
      e.preventDefault();
      runStylist(document.getElementById('stylist-text').value);
    });

    rootEl.addEventListener('keydown', function (e) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if ((e.key === 'z' || e.key === 'Z') && (e.metaKey || e.ctrlKey) && !typing) {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
        return;
      }
      var link = e.target.closest && e.target.closest('[data-link-index]');
      if (!link) return;
      var index = Number(link.getAttribute('data-link-index'));
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        clearLink(index);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var dir = e.key === 'ArrowRight' ? 1 : -1;
        var next = rootEl.querySelector('[data-link-index="' + (index + dir) + '"]');
        if (next) next.focus();
      }
    });

    rootEl.addEventListener('pointerdown', function (e) {
      var el = e.target.closest('[data-drag-charm]');
      if (!el) return;
      var id = el.getAttribute('data-drag-charm');
      if (!id) return;
      if (e.button != null && e.button !== 0) return;
      drag = {
        id: id,
        pointerId: e.pointerId,
        from: el.hasAttribute('data-link-index') ? Number(el.getAttribute('data-link-index')) : null,
        x: e.clientX,
        y: e.clientY,
        active: false,
        el: el,
      };
    });

    rootEl.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.pointerId) return;
      var dx = e.clientX - drag.x;
      var dy = e.clientY - drag.y;
      if (!drag.active) {
        if (Math.hypot(dx, dy) < 8) return;
        // Touch: a mostly vertical gesture scrolls the charm tray instead of dragging.
        if (e.pointerType === 'touch' && drag.from == null && Math.abs(dy) > Math.abs(dx) + 6) {
          drag = null;
          return;
        }
        drag.active = true;
        try { drag.el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        showGhost(drag.id, e.clientX, e.clientY);
      }
      e.preventDefault();
      moveGhost(e.clientX, e.clientY);
      highlight(e.clientX, e.clientY);
    }, { passive: false });

    function finishDrag(e) {
      if (!drag || e.pointerId !== drag.pointerId) return;
      var info = drag;
      var active = info.active;
      clearDrag();
      if (!active) return;
      suppressClick = true;
      var index = linkAt(e.clientX, e.clientY);
      hideGhost();
      if (index == null) return;
      if (info.from == null) place(index, info.id);
      else if (info.from !== index) swap(info.from, index);
    }

    rootEl.addEventListener('pointerup', finishDrag);
    rootEl.addEventListener('pointercancel', function (e) {
      if (!drag || e.pointerId !== drag.pointerId) return;
      clearDrag();
    });

    root.addEventListener('resize', function () {
      if (state && state.view === 'circle') layoutCircle();
    });
  }

  function mount() {
    rootEl = document.getElementById('builder');
    if (!rootEl) return;
    state = blank();
    ui = {
      selectedCharmId: null,
      selectedIndex: null,
      category: '',
      tier: '',
      query: '',
      ownedOnly: new URLSearchParams(root.location.search).get('palette') === 'owned',
      note: '',
      moodTags: [],
    };
    rootEl.innerHTML = template();
    if (ui.ownedOnly) document.getElementById('owned-only').checked = true;
    bind();
    loadInitial();
    renderPalette();
    renderDynamic();
    syncUndo();
  }

  root.Builder = { mount: mount };
})(typeof window !== 'undefined' ? window : globalThis);
