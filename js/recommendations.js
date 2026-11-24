/**
 * “Complete the story” — charms that sit beside what is already chosen,
 * what is owned, and what the stylist last heard.
 * Also the non-charm add-ons: tool, gift box, club, studio set.
 */
(function (root) {
  'use strict';

  var PAIR = {
    teacher: ['books', 'coffee'],
    school: ['book', 'coffee'],
    book: ['coffee', 'tea'],
    books: ['coffee'],
    coffee: ['book', 'books'],
    travel: ['star', 'celestial'],
    plane: ['star', 'passport'],
    family: ['heart', 'home'],
    mother: ['heart', 'family'],
    pet: ['heart', 'paw'],
    dog: ['paw', 'heart'],
    cat: ['paw', 'heart'],
    christmas: ['gift', 'star'],
    music: ['heart', 'night'],
    pink: ['heart', 'flower'],
  };

  function tagsOf(ids) {
    var tags = [];
    (ids || []).forEach(function (id) {
      var charm = root.Catalog.byId(id);
      if (!charm) return;
      (charm.tags || []).forEach(function (tag) { tags.push(tag); });
    });
    return tags;
  }

  function charms(context) {
    context = context || {};
    var limit = context.limit || 4;
    var blocked = {};
    (context.excludeIds || []).concat(context.placedIds || []).forEach(function (id) { blocked[id] = true; });
    var interest = tagsOf(context.placedIds).concat(tagsOf(context.ownedIds)).concat(context.tags || []);
    var wanted = {};
    interest.forEach(function (tag) {
      wanted[tag] = (wanted[tag] || 0) + 2;
      (PAIR[tag] || []).forEach(function (next) { wanted[next] = (wanted[next] || 0) + 3; });
    });
    if (!Object.keys(wanted).length) {
      ['heart', 'star', 'book', 'travel'].forEach(function (tag) { wanted[tag] = 1; });
    }
    var ranked = root.Catalog.charms.map(function (charm) {
      if (blocked[charm.id]) return null;
      var score = 0;
      (charm.tags || []).forEach(function (tag) {
        if (wanted[tag]) score += wanted[tag];
      });
      if (charm.isBestSeller) score += 0.5;
      return { charm: charm, score: score };
    }).filter(function (row) { return row && row.score > 0; });
    ranked.sort(function (a, b) { return b.score - a.score || a.charm.name.localeCompare(b.charm.name); });
    var out = [];
    var cats = {};
    ranked.forEach(function (row) {
      if (out.length >= limit) return;
      if ((cats[row.charm.category] || 0) >= 2) return;
      cats[row.charm.category] = (cats[row.charm.category] || 0) + 1;
      out.push(row.charm);
    });
    return out;
  }

  root.Recs = { charms: charms };
})(typeof window !== 'undefined' ? window : globalThis);
