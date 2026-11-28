/**
 * Shared header, footer, copy fill, cart badge, capture form, reviews, trust.
 * Labels come from CS.pages and CS.brand.
 */
(function (root) {
  'use strict';

  function pathGet(path) {
    return String(path || '').split('.').reduce(function (obj, key) {
      return obj == null ? undefined : obj[key];
    }, root.CS);
  }

  function page(key) {
    return root.CS.pages[key];
  }

  function currentFile() {
    var file = (location.pathname || '').split('/').pop();
    return file || 'index.html';
  }

  function link(key) {
    var item = page(key);
    if (!item) return '';
    var file = item.href.replace('./', '');
    var here = currentFile() === file || (currentFile() === '' && file === 'index.html');
    return '<a href="' + item.href + '"' + (here ? ' aria-current="page"' : '') + '>' + root.Util.esc(item.label) + '</a>';
  }

  function header() {
    var brand = root.CS.brand;
    var count = 0;
    try {
      var cart = root.Store.read('cart', { lines: [] });
      count = root.Cart ? root.Cart.count(cart) : 0;
    } catch (e) { count = 0; }
    var edits = root.CS.edits.map(link).join('');
    var primary = root.CS.nav.map(function (key) {
      if (key === 'collections') {
        return '<div class="nav-drop"><button type="button" aria-expanded="false" aria-controls="edit-menu">Collections</button>' +
          '<div id="edit-menu" class="edit-menu" hidden>' + edits + '</div></div>';
      }
      return link(key);
    }).join('');
    var announce = (root.CS.giftSeason && root.CS.giftSeason.message) || root.CS.priceNotes.preview;
    return '' +
      '<a class="skip-link" href="#main">Skip to content</a>' +
      '<header class="site-header">' +
        '<div class="utility">' +
          (root.CS.features.showPrototypeFlag ? '<span class="prototype-pill">Preview</span>' : '') +
          '<p>' + root.Util.esc(announce) + '</p>' +
        '</div>' +
        '<div class="mast">' +
          '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>' +
          '<a class="wordmark" href="' + page('home').href + '">' +
            '<img class="wordmark-img" src="assets/brand/fiorvelle_wordmark.png" width="990" height="152" alt="Fiorvelle">' +
          '</a>' +
          '<span class="mast-tools">' +
            '<a class="account-link" href="' + page('dashboard').href + '">' + root.Util.esc(page('dashboard').label) + '</a>' +
            '<a class="bag" href="' + page('cart').href + '">Bag <span class="cart-count" data-cart-count>' + count + '</span></a>' +
          '</span>' +
        '</div>' +
        '<nav id="site-nav" class="site-nav" aria-label="Primary" data-open="false">' + primary +
          '<a class="nav-account" href="' + page('dashboard').href + '">' + root.Util.esc(page('dashboard').label) + '</a>' +
        '</nav>' +
      '</header>' +
      '<div id="live" class="sr-only" aria-live="polite"></div>';
  }

  function footer() {
    var brand = root.CS.brand;
    var links = root.CS.footerNav.map(function (key) {
      var item = page(key);
      return '<a href="' + item.href + '">' + root.Util.esc(item.label) + '</a>';
    }).join('');
    return '' +
      '<footer class="site-footer">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<img class="wordmark-img wordmark-img-footer" src="assets/brand/fiorvelle_wordmark.png" width="990" height="152" alt="Fiorvelle">' +
            (brand.tagline ? '<span class="wordmark-tag">' + root.Util.esc(brand.tagline) + '</span>' : '') +
            '<p class="fine">' + root.Util.esc(root.CS.priceNotes.preview) + '</p>' +
            '<p class="fine">' + root.Util.esc(brand.promise) + '</p>' +
          '</div>' +
          '<nav class="footer-links" aria-label="Footer">' + links + '</nav>' +
          '<div>' +
            '<form class="capture" data-capture novalidate>' +
              '<p class="eyebrow">Notes, occasionally</p>' +
              '<label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" required></label>' +
              '<label class="field"><span>Mobile, optional</span><input name="sms" type="tel" autocomplete="tel" inputmode="tel"></label>' +
              '<button class="btn" type="submit">Keep a note</button>' +
              '<p class="form-note note">Saved on this device only. Nothing is sent.</p>' +
              '<p class="form-status" role="status"></p>' +
            '</form>' +
            '<p class="fine">Prototype. Illustrated pieces. ' + root.Util.esc(root.CS.checkoutNote) + '</p>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  function fill(scope) {
    var rootEl = scope || document;
    rootEl.querySelectorAll('[data-copy]').forEach(function (el) {
      var value = pathGet(el.getAttribute('data-copy'));
      if (typeof value === 'string' || typeof value === 'number') el.textContent = value;
    });
    rootEl.querySelectorAll('[data-price]').forEach(function (el) {
      el.textContent = root.Pricing.formatKey(el.getAttribute('data-price'));
    });
    rootEl.querySelectorAll('[data-page-link]').forEach(function (el) {
      var item = page(el.getAttribute('data-page-link'));
      if (!item) return;
      if (el.tagName === 'A') el.setAttribute('href', item.href);
      el.textContent = item.label;
    });
  }

  function paintCount(cart) {
    var n = root.Cart.count(cart || { lines: [] });
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = String(n);
    });
  }

  var bound = false;
  function bind() {
    if (bound) return;
    bound = true;
    document.addEventListener('click', function (e) {
      var toggle = e.target.closest('.nav-toggle');
      var nav = document.getElementById('site-nav');
      if (toggle && nav) {
        var open = nav.getAttribute('data-open') !== 'true';
        nav.setAttribute('data-open', open ? 'true' : 'false');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('nav-open', open);
        if (open) {
          var first = nav.querySelector('a, button');
          if (first) first.focus();
        }
        return;
      }
      var editsBtn = e.target.closest('.nav-drop > button');
      if (editsBtn) {
        var menu = document.getElementById('edit-menu');
        var expanded = editsBtn.getAttribute('aria-expanded') === 'true';
        editsBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (menu) menu.hidden = expanded;
        return;
      }
      if (nav && e.target.closest('#site-nav a')) {
        nav.setAttribute('data-open', 'false');
        var t = document.querySelector('.nav-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var nav = document.getElementById('site-nav');
      if (nav && nav.getAttribute('data-open') === 'true') {
        nav.setAttribute('data-open', 'false');
        var t = document.querySelector('.nav-toggle');
        if (t) { t.setAttribute('aria-expanded', 'false'); t.focus(); }
        document.body.classList.remove('nav-open');
      }
      var menu = document.getElementById('edit-menu');
      var editsBtn = document.querySelector('.nav-drop > button');
      if (menu && !menu.hidden) {
        menu.hidden = true;
        if (editsBtn) editsBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('submit', function (e) {
      var wait = e.target.closest('[data-waitlist]');
      if (wait) {
        e.preventDefault();
        submitWaitlist(wait);
        return;
      }
      var form = e.target.closest('[data-capture]');
      if (!form) return;
      e.preventDefault();
      var email = (form.email.value || '').trim();
      var sms = (form.sms.value || '').trim();
      var status = form.querySelector('.form-status');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (status) status.textContent = 'Enter an email address.';
        return;
      }
      var leads = root.Store.read('leads', []);
      leads.push({ email: email, sms: sms, at: new Date().toISOString() });
      root.Store.write('leads', leads);
      form.reset();
      if (status) status.textContent = 'Saved on this device only. Nothing is sent.';
    });
    root.addEventListener('cs:cart', function (event) {
      paintCount(event.detail);
    });
  }

  function sticky() {
    var mode = document.body.getAttribute('data-sticky');
    if (!mode) return;
    var bar = document.createElement('div');
    bar.className = 'page-sticky';
    var key = mode === 'club' ? 'club' : mode === 'cart' ? 'cart' : 'builder';
    var item = page(key);
    var href = mode === 'cart' ? '#checkout' : item.href;
    var label = mode === 'cart' ? 'Review bag' : mode === 'club' ? 'Join the collection' : item.label;
    bar.innerHTML = '<a class="btn" href="' + href + '">' + root.Util.esc(label) + '</a>';
    document.body.appendChild(bar);
    document.body.classList.add('has-sticky');
  }

  function submitWaitlist(form) {
    var email = (form.email.value || '').trim();
    var status = form.querySelector('.form-status');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (status) status.textContent = 'Enter an email address.';
      return;
    }
    var endpoint = root.CS.forms && root.CS.forms.waitlistEndpoint;
    if (!endpoint) {
      var leads = root.Store.read('waitlist', []);
      leads.push({ email: email, source: form.getAttribute('data-source') || 'waitlist', at: new Date().toISOString() });
      root.Store.write('waitlist', leads);
      form.reset();
      if (status) status.textContent = 'Saved on this device only. Nothing is sent until a form endpoint is set in config.';
      return;
    }
    fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: email, source: form.getAttribute('data-source') || 'waitlist' }),
    }).then(function (res) {
      if (!res.ok) throw new Error('Request failed');
      form.reset();
      if (status) status.textContent = 'You are on the list.';
    }).catch(function () {
      if (status) status.textContent = 'The list did not accept that address. Nothing else was stored.';
    });
  }

  function mount() {
    var host = document.getElementById('site-header');
    var foot = document.getElementById('site-footer');
    if (host) host.innerHTML = header();
    if (foot) foot.innerHTML = footer();
    var key = document.body.getAttribute('data-title') || document.body.getAttribute('data-page');
    var label = page(key) && page(key).label;
    var title = root.CS.brand.name + ' | ' + root.CS.brand.tagline;
    document.title = title;
    var description = root.CS.brand.name + '. ' + root.CS.brand.tagline + ' Preview, not open for orders.';
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', 'summary');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'theme-color', '#E8A9A0');
  }

  function setMeta(attr, key, content) {
    var selector = 'meta[' + attr + '="' + key + '"]';
    var meta = document.querySelector(selector);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, key);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  function reviews(el) {
    if (!el) return;
    fetch('data/reviews.json').then(function (res) {
      if (!res.ok) throw new Error('reviews');
      return res.json();
    }).then(function (data) {
      var items = data && Array.isArray(data.items) ? data.items : [];
      if (!items.length) {
        el.innerHTML = '<p class="empty-slot">Reviews coming soon.</p>';
        return;
      }
      el.innerHTML = items.map(function (item) {
        return '<blockquote class="review"><p>' + root.Util.esc(item.quote || '') + '</p><footer>' +
          root.Util.esc(item.name || '') + (item.detail ? ' · ' + root.Util.esc(item.detail) : '') +
          '</footer></blockquote>';
      }).join('');
    }).catch(function () {
      el.innerHTML = '<p class="empty-slot">Reviews coming soon.</p>';
    });
  }

  function trust(el) {
    if (!el) return;
    var badges = root.CS.trustBadges || [];
    if (!badges.length) {
      el.innerHTML = '';
      return;
    }
    el.innerHTML = '<ul class="trust-list">' + badges.map(function (badge) {
      return '<li><strong>' + root.Util.esc(badge.title || '') + '</strong><div>' + root.Util.esc(badge.detail || '') + '</div></li>';
    }).join('') + '</ul>';
  }

  root.Shell = {
    mount: mount,
    fill: fill,
    bind: bind,
    sticky: sticky,
    paintCount: paintCount,
    reviews: reviews,
    trust: trust,
  };
})(typeof window !== 'undefined' ? window : globalThis);
