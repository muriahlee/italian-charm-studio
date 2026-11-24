/**
 * On-device stylist.
 * Scores the catalog from tags, synonyms, and keywords. No network. No model key.
 * The provider in js/stylist/provider.js is the seam for a future server endpoint.
 */
(function (root) {
  'use strict';

  var STOP = {
    a: 1, an: 1, the: 1, and: 1, or: 1, for: 1, who: 1, loves: 1, love: 1, with: 1,
    to: 1, of: 1, my: 1, me: 1, in: 1, on: 1, it: 1, is: 1, please: 1, want: 1,
    wants: 1, something: 1, that: 1, this: 1, her: 1, his: 1, their: 1, your: 1,
    create: 1, make: 1, design: 1, bracelet: 1, charm: 1, charms: 1, italian: 1,
    person: 1, someone: 1, into: 1, from: 1, about: 1, really: 1, very: 1, just: 1,
  };

  /**
   * Concepts the sentence can trip. charmTags are what we look for on a charm.
   */
  var CONCEPTS = [
    { id: 'teacher', words: ['teacher', 'teachers', 'teaching', 'teach', 'school', 'classroom', 'student', 'students', 'professor'], tags: ['teacher', 'school', 'pencil', 'apple', 'classroom', 'lesson', 'ruler'] },
    { id: 'coffee', words: ['coffee', 'cafe', 'espresso', 'latte', 'cappuccino'], tags: ['coffee', 'cafe', 'espresso', 'latte', 'cup'] },
    { id: 'books', words: ['book', 'books', 'reading', 'read', 'reader', 'library', 'novel', 'literature', 'story', 'stories'], tags: ['book', 'books', 'reading', 'library', 'novel', 'story'] },
    { id: 'travel', words: ['travel', 'traveling', 'travelling', 'trip', 'trips', 'vacation', 'wander', 'passport', 'plane', 'flight', 'flights', 'journey'], tags: ['travel', 'plane', 'trip', 'passport', 'wander', 'map'] },
    { id: 'pink', words: ['pink', 'blush', 'rose', 'roses'], tags: ['pink', 'blush', 'rose'] },
    { id: 'mother', words: ['mom', 'mother', 'mum', 'mama', 'motherhood', 'mommy'], tags: ['mother', 'mom', 'motherhood', 'family'] },
    { id: 'baby', words: ['baby', 'newborn', 'infant', 'pram'], tags: ['baby', 'pram', 'child'] },
    { id: 'pet', words: ['dog', 'dogs', 'cat', 'cats', 'pet', 'pets', 'puppy', 'kitten', 'paw'], tags: ['pet', 'dog', 'cat', 'paw'] },
    { id: 'music', words: ['music', 'song', 'songs', 'piano', 'guitar', 'sing', 'singer', 'band'], tags: ['music', 'song', 'piano', 'note'] },
    { id: 'holiday', words: ['christmas', 'holiday', 'holidays', 'winter', 'noel', 'xmas'], tags: ['christmas', 'holiday', 'seasonal', 'winter'] },
    { id: 'night', words: ['star', 'stars', 'moon', 'night', 'sky', 'constellation'], tags: ['star', 'moon', 'night', 'celestial'] },
    { id: 'luxury', words: ['luxury', 'vintage', 'elegant', 'classic', 'formal', 'heirloom'], tags: ['luxury', 'vintage', 'elegant', 'classic'] },
    { id: 'family', words: ['family', 'home', 'dad', 'father', 'sister', 'brother', 'daughter', 'son', 'kids'], tags: ['family', 'home', 'house'] },
    { id: 'flower', words: ['flower', 'flowers', 'garden', 'floral', 'daisy', 'tulip'], tags: ['flower', 'garden', 'daisy'] },
    { id: 'initial', words: ['initial', 'initials', 'letter', 'letters', 'monogram', 'name'], tags: ['letter', 'initial', 'alphabet'] },
  ];

  function tokens(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9+]+/g, ' ')
      .split(/\s+/)
      .filter(function (word) { return word && !STOP[word]; });
  }

  function detectMetal(text) {
    var lower = String(text || '').toLowerCase();
    var goldAt = lower.indexOf('gold');
    var silverAt = lower.indexOf('silver');
    if (goldAt === -1 && silverAt === -1) return null;
    if (goldAt === -1) return 'silver';
    if (silverAt === -1) return 'gold';
    return goldAt < silverAt ? 'gold' : 'silver';
  }

  function detectInitial(text) {
    var named = String(text || '').match(/\b(?:initial|letter|monogram)\s+([a-zA-Z])\b/);
    if (named) return named[1].toUpperCase();
    return null;
  }

  function activeConcepts(words) {
    var found = [];
    CONCEPTS.forEach(function (concept) {
      for (var i = 0; i < concept.words.length; i++) {
        if (words.indexOf(concept.words[i]) !== -1) {
          found.push(concept);
          return;
        }
      }
    });
    return found;
  }

  function scoreCharm(charm, words, concepts) {
    var score = 0;
    var hayTags = charm.tags || [];
    var blob = (charm.name + ' ' + hayTags.join(' ') + ' ' + charm.description).toLowerCase();
    words.forEach(function (word) {
      if (word.length < 3) return;
      if (hayTags.indexOf(word) !== -1) score += 8;
      else if (blob.indexOf(word) !== -1) score += 3;
    });
    concepts.forEach(function (concept) {
      var hit = false;
      concept.tags.forEach(function (tag) {
        if (hayTags.indexOf(tag) !== -1) hit = true;
      });
      if (hit) score += 10;
      if (concept.id === 'luxury' && (charm.tier === 'luxury' || charm.tier === 'dangle')) score += 2;
    });
    if (charm.exclusive === 'club') score -= 1;
    return score;
  }

  function bestFor(concept, charms, used) {
    var best = null;
    var bestScore = 0;
    charms.forEach(function (charm) {
      if (used[charm.id]) return;
      var hit = false;
      (concept.tags || []).forEach(function (tag) {
        if ((charm.tags || []).indexOf(tag) !== -1) hit = true;
      });
      if (!hit) return;
      var s = scoreCharm(charm, concept.words, [concept]);
      if (s > bestScore) {
        bestScore = s;
        best = charm;
      }
    });
    return best;
  }

  function place(ids, linkCount) {
    var links = [];
    for (var n = 0; n < linkCount; n++) links.push(null);
    var count = ids.length;
    if (!count || !linkCount) return links;
    var used = {};
    ids.forEach(function (id, i) {
      var index = Math.round(((i + 1) * linkCount) / (count + 1)) - 1;
      if (index < 0) index = 0;
      if (index >= linkCount) index = linkCount - 1;
      while (links[index] && index < linkCount - 1) index += 1;
      if (links[index]) return;
      links[index] = id;
      used[index] = true;
    });
    return links;
  }

  function explain(metal, picks, concepts) {
    var finish = metal === 'silver' ? 'Silver' : 'Gold';
    var names = picks.map(function (charm) { return charm.name.toLowerCase(); });
    var why = concepts.map(function (concept) { return concept.id; });
    var reason = why.length
      ? 'Chosen for ' + why.join(', ') + '.'
      : 'Chosen from the words you used.';
    return finish + ', at the same price as ' + (metal === 'silver' ? 'gold' : 'silver') + '. ' +
      reason + ' ' +
      (names.length ? 'Starting links: ' + names.join(', ') + '.' : '') +
      ' Move any charm — this is only a first draft of the story.';
  }

  function recommend(text, context) {
    context = context || {};
    var linkCount = context.linkCount || root.Sizing.linksForWrist(context.wrist || root.CS.sizing.defaultWrist);
    var words = tokens(text);
    var concepts = activeConcepts(words);
    var metal = detectMetal(text) || context.metal || 'gold';
    var initial = detectInitial(text);
    var charms = root.Catalog.charms.filter(function (charm) {
      return (charm.metals || []).indexOf(metal) !== -1;
    });
    var used = {};
    var picks = [];

    if (initial) {
      var letter = root.Catalog.byId('letter-' + initial.toLowerCase());
      if (letter) {
        picks.push(letter);
        used[letter.id] = true;
      }
    }

    concepts.forEach(function (concept) {
      var best = bestFor(concept, charms, used);
      if (best) {
        picks.push(best);
        used[best.id] = true;
      }
      if (concept.id === 'teacher') {
        var second = bestFor(concept, charms, used);
        if (second) {
          picks.push(second);
          used[second.id] = true;
        }
      }
    });

    var ranked = charms.map(function (charm) {
      return { charm: charm, score: scoreCharm(charm, words, concepts) };
    }).filter(function (row) { return row.score > 0 && !used[row.charm.id]; });
    ranked.sort(function (a, b) { return b.score - a.score; });

    var target = Math.min(6, Math.max(concepts.length ? 5 : 4, concepts.length + (concepts.some(function (c) { return c.id === 'teacher'; }) ? 1 : 0)));
    if (initial) target += 1;
    ranked.forEach(function (row) {
      if (picks.length >= target) return;
      var catCount = picks.filter(function (charm) { return charm.category === row.charm.category; }).length;
      if (catCount >= 2) return;
      picks.push(row.charm);
      used[row.charm.id] = true;
    });

    if (!picks.length) {
      ['heart-little', 'north-star', 'daisy', 'pearl-button'].forEach(function (id) {
        var charm = root.Catalog.byId(id);
        if (charm) picks.push(charm);
      });
    }

    var ids = picks.map(function (charm) { return charm.id; });
    return {
      metal: metal,
      charmIds: ids,
      links: place(ids, linkCount),
      placements: place(ids, linkCount).map(function (id, index) { return id ? { index: index, charmId: id } : null; }).filter(Boolean),
      concepts: concepts.map(function (concept) { return concept.id; }),
      explanation: picks.length
        ? explain(metal, picks, concepts)
        : 'Add a few words — a person, a color, a habit — and the stylist will draft a bracelet from the catalog.',
    };
  }

  root.StylistEngine = { recommend: recommend, tokens: tokens, detectMetal: detectMetal };
})(typeof window !== 'undefined' ? window : globalThis);
