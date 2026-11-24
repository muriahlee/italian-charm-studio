/**
 * Demo catalog. Prices are NOT stored here — each charm has a priceKey
 * (standard, premium, luxury, or dangle) resolved in js/config.js.
 * Gold and silver are finishes on the same charm, at the same price.
 *
 * image: null means the SVG renderer draws the piece.
 * When real photography arrives, set image to a relative path, isDemo to false,
 * and shopifyVariantId to the Storefront variant GID. See the README.
 */
(function (root) {
  'use strict';

  var TIERS = { standard: 1, premium: 1, luxury: 1, dangle: 1 };

  function charm(o) {
    var tier = o.tier;
    if (!TIERS[tier]) throw new Error('Bad tier on ' + o.id);
    return {
      id: o.id,
      sku: o.sku,
      name: o.name,
      category: o.category,
      tags: o.tags,
      metals: o.metals || ['gold', 'silver'],
      tier: tier,
      priceKey: o.priceKey || tier,
      description: o.description,
      image: o.image == null ? null : o.image,
      inventory: o.inventory == null ? null : o.inventory,
      isDemo: o.isDemo !== false,
      isNew: !!o.isNew,
      isBestSeller: !!o.isBestSeller,
      shopifyVariantId: o.shopifyVariantId || null,
      exclusive: o.exclusive || null,
      art: o.art,
    };
  }

  var categories = [
    { id: 'bows-hearts', label: 'Bows & hearts' },
    { id: 'flowers-butterflies', label: 'Flowers & butterflies' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'letters', label: 'Letters & initials' },
    { id: 'birthstones', label: 'Birthstones' },
    { id: 'crystals-pearls', label: 'Crystals & pearls' },
    { id: 'teachers', label: 'Teachers' },
    { id: 'books-coffee', label: 'Books & coffee' },
    { id: 'travel', label: 'Travel' },
    { id: 'family', label: 'Family' },
    { id: 'pets', label: 'Pets' },
    { id: 'music', label: 'Music' },
    { id: 'celestial', label: 'Celestial' },
    { id: 'seasonal', label: 'Seasonal' },
    { id: 'luxury-vintage', label: 'Luxury & vintage' },
  ];

  var rows = [
    ['heart-little', 'CH-HRT-01', 'Little Heart', 'bows-hearts', 'standard', 'heart', '#c47c8a', null,
      ['heart', 'love', 'gift', 'pink', 'blush'], 'A small heart for someone who already has a chapter in your story.', 'best'],
    ['heart-open', 'CH-HRT-02', 'Open Heart', 'bows-hearts', 'standard', 'heart', '#a85a68', null,
      ['heart', 'love', 'open'], 'An open heart, for a story that is still being written.', ''],
    ['bow-silk', 'CH-BOW-01', 'Silk Bow', 'bows-hearts', 'standard', 'bow', '#d4a0a8', null,
      ['bow', 'gift', 'pink', 'blush', 'ribbon'], 'A silk bow, the way a gift looks before it is opened.', 'best'],
    ['bow-noir', 'CH-BOW-02', 'Noir Bow', 'bows-hearts', 'premium', 'bow', '#2a2622', null,
      ['bow', 'black', 'evening', 'elegant'], 'A black bow for evenings, and for the person who dresses with intent.', ''],
    ['hearts-twin', 'CH-HRT-03', 'Twin Hearts', 'bows-hearts', 'premium', 'hearts', '#8e2f39', null,
      ['heart', 'love', 'two', 'pair'], 'Two hearts, set close, for a pair of names you keep together.', ''],
    ['locket-heart', 'CH-HRT-04', 'Heart Locket', 'bows-hearts', 'dangle', 'locket', '#c47c8a', null,
      ['heart', 'locket', 'gift', 'dangle', 'pink'], 'A locket that hangs just below the line of the bracelet.', 'club'],

    ['daisy', 'CH-FLR-01', 'Daisy', 'flowers-butterflies', 'standard', 'flower', '#f3ead7', null,
      ['flower', 'daisy', 'white', 'garden'], 'A daisy for an ordinary day that turned out to matter.', 'best'],
    ['rose-bloom', 'CH-FLR-02', 'Garden Rose', 'flowers-butterflies', 'premium', 'rose', '#b76e79', null,
      ['flower', 'rose', 'pink', 'love', 'blush'], 'A garden rose, pink the way a note in the margin is pink.', ''],
    ['tulip', 'CH-FLR-03', 'Tulip', 'flowers-butterflies', 'standard', 'tulip', '#d47a62', null,
      ['flower', 'tulip', 'spring', 'coral'], 'A tulip for the first warm week of the year.', ''],
    ['calla-lily', 'CH-FLR-04', 'Calla Lily', 'flowers-butterflies', 'premium', 'lily', '#f7f4ef', null,
      ['flower', 'lily', 'white', 'elegant'], 'A calla, spare and formal, for a day you want to remember cleanly.', ''],
    ['butterfly-blush', 'CH-FLR-05', 'Blush Butterfly', 'flowers-butterflies', 'standard', 'butterfly', '#e7c1c8', null,
      ['butterfly', 'pink', 'blush', 'garden', 'change'], 'A blush butterfly, for a season of becoming someone new.', ''],
    ['butterfly-navy', 'CH-FLR-06', 'Midnight Butterfly', 'flowers-butterflies', 'luxury', 'butterfly', '#243656', null,
      ['butterfly', 'navy', 'evening', 'night'], 'A midnight butterfly, navy enamel on a quiet ground.', 'new'],

    ['strawberry', 'CH-FRT-01', 'Strawberry', 'fruits', 'standard', 'strawberry', '#f4efe6', null,
      ['fruit', 'strawberry', 'red', 'summer', 'sweet'], 'A strawberry, sweet and specific, like a joke only two people know.', 'best'],
    ['lemon', 'CH-FRT-02', 'Lemon', 'fruits', 'standard', 'lemon', '#f4efe6', null,
      ['fruit', 'lemon', 'yellow', 'citrus'], 'A lemon for a bright kitchen, or a sharp sense of humor.', ''],
    ['cherry-pair', 'CH-FRT-03', 'Cherries', 'fruits', 'standard', 'cherry', '#f4efe6', null,
      ['fruit', 'cherry', 'red', 'pair'], 'A pair of cherries, because some stories come in twos.', ''],
    ['peach', 'CH-FRT-04', 'Peach', 'fruits', 'premium', 'peach', '#f4efe6', null,
      ['fruit', 'peach', 'pink', 'blush', 'summer'], 'A peach, blush at the edge, for high summer.', ''],
    ['grapes', 'CH-FRT-05', 'Grapes', 'fruits', 'premium', 'grapes', '#f4efe6', null,
      ['fruit', 'grapes', 'purple', 'vine'], 'A small bunch of grapes, for a long table and a late hour.', ''],

    ['stone-garnet', 'CH-BST-01', 'Garnet', 'birthstones', 'premium', 'gem', '#8e2f39', '#1a1714',
      ['birthstone', 'garnet', 'january', 'red', 'stone'], 'January. A garnet for a beginning made in the dark of the year.', ''],
    ['stone-amethyst', 'CH-BST-02', 'Amethyst', 'birthstones', 'premium', 'gem', '#6d4a86', '#1a1714',
      ['birthstone', 'amethyst', 'february', 'purple', 'stone'], 'February. An amethyst, violet and steady.', ''],
    ['stone-aquamarine', 'CH-BST-03', 'Aquamarine', 'birthstones', 'premium', 'gem', '#7ea8c4', '#1a1714',
      ['birthstone', 'aquamarine', 'march', 'blue', 'stone'], 'March. Aquamarine, the color of water just before spring.', ''],
    ['stone-diamond', 'CH-BST-04', 'Diamond', 'birthstones', 'luxury', 'gem', '#f4f7f8', '#1a1714',
      ['birthstone', 'diamond', 'april', 'clear', 'stone', 'crystal'], 'April. A clear stone, cut to hold the light.', ''],
    ['stone-emerald', 'CH-BST-05', 'Emerald', 'birthstones', 'luxury', 'gem', '#1f6b4a', '#1a1714',
      ['birthstone', 'emerald', 'may', 'green', 'stone'], 'May. An emerald for a month of new leaves.', ''],
    ['stone-pearl-june', 'CH-BST-06', 'June Pearl', 'birthstones', 'premium', 'pearl', '#f7f4ef', '#e7d7c3',
      ['birthstone', 'pearl', 'june', 'white', 'stone'], 'June. A pearl, quiet and already complete.', ''],
    ['stone-ruby', 'CH-BST-07', 'Ruby', 'birthstones', 'luxury', 'gem', '#8e2f39', '#1a1714',
      ['birthstone', 'ruby', 'july', 'red', 'stone'], 'July. A ruby, deep red, for the middle of the year.', ''],
    ['stone-peridot', 'CH-BST-08', 'Peridot', 'birthstones', 'premium', 'gem', '#7d9078', '#1a1714',
      ['birthstone', 'peridot', 'august', 'green', 'stone'], 'August. Peridot, a green that belongs to late light.', ''],
    ['stone-sapphire', 'CH-BST-09', 'Sapphire', 'birthstones', 'luxury', 'gem', '#243656', '#1a1714',
      ['birthstone', 'sapphire', 'september', 'blue', 'navy', 'stone'], 'September. A sapphire the color of a serious sky.', ''],
    ['stone-opal', 'CH-BST-10', 'Opal', 'birthstones', 'premium', 'gem', '#e7c1c8', '#1a1714',
      ['birthstone', 'opal', 'october', 'pink', 'blush', 'stone'], 'October. An opal with a blush at the center.', ''],
    ['stone-citrine', 'CH-BST-11', 'Citrine', 'birthstones', 'premium', 'gem', '#e2c27a', '#1a1714',
      ['birthstone', 'citrine', 'november', 'gold', 'yellow', 'stone'], 'November. Citrine, warm as a lamp in a dark room.', ''],
    ['stone-turquoise', 'CH-BST-12', 'Turquoise', 'birthstones', 'premium', 'gem', '#6aa8a0', '#1a1714',
      ['birthstone', 'turquoise', 'december', 'blue', 'stone'], 'December. Turquoise, a bright note at the end of the year.', ''],

    ['pearl-button', 'CH-PRL-01', 'Button Pearl', 'crystals-pearls', 'premium', 'pearl', '#f7f4ef', '#e7d7c3',
      ['pearl', 'white', 'classic', 'button'], 'A button pearl, round and calm, the kind of classic you do not retire.', 'best'],
    ['pearl-drop', 'CH-PRL-02', 'Pearl Drop', 'crystals-pearls', 'dangle', 'pearl-drop', '#f7f4ef', '#e7d7c3',
      ['pearl', 'white', 'dangle', 'drop'], 'A single pearl on a short drop, just below the links.', ''],
    ['crystal-clear', 'CH-CRY-01', 'Clear Crystal', 'crystals-pearls', 'luxury', 'gem', '#f4f7f8', '#1a1714',
      ['crystal', 'clear', 'sparkle', 'light'], 'A clear crystal, for a sentence you want to keep exact.', ''],
    ['crystal-blush', 'CH-CRY-02', 'Blush Crystal', 'crystals-pearls', 'premium', 'gem', '#e7c1c8', '#1a1714',
      ['crystal', 'pink', 'blush', 'sparkle'], 'A blush crystal, pink held up to the light.', ''],
    ['crystal-emerald', 'CH-CRY-03', 'Emerald Crystal', 'crystals-pearls', 'luxury', 'gem', '#1f6b4a', '#1a1714',
      ['crystal', 'green', 'emerald'], 'An emerald-cut green, for depth rather than sparkle alone.', ''],

    ['pencil', 'CH-TCH-01', 'Yellow Pencil', 'teachers', 'standard', 'pencil', '#243656', null,
      ['teacher', 'school', 'pencil', 'classroom', 'lesson'], 'A pencil for the person who still writes in the margin.', 'best'],
    ['apple-red', 'CH-TCH-02', 'Red Apple', 'teachers', 'standard', 'apple', '#f4efe6', null,
      ['teacher', 'school', 'apple', 'classroom'], 'A red apple, the old emblem of a classroom, still sincere.', 'best'],
    ['ruler', 'CH-TCH-03', 'Little Ruler', 'teachers', 'standard', 'ruler', '#243656', null,
      ['teacher', 'school', 'ruler', 'classroom', 'measure'], 'A little ruler, for the one who lines the day up and makes it kind.', ''],
    ['school-bus', 'CH-TCH-04', 'School Bus', 'teachers', 'premium', 'bus', '#f4efe6', null,
      ['teacher', 'school', 'bus', 'classroom'], 'A school bus, for early mornings and the road to the building.', ''],
    ['grade-a', 'CH-TCH-05', 'A Plus', 'teachers', 'standard', 'grade', '#f4efe6', null,
      ['teacher', 'school', 'grade', 'classroom', 'lesson'], 'An A+, for a student, or for the teacher who earned it too.', ''],
    ['chalk-heart', 'CH-TCH-06', 'Chalk Heart', 'teachers', 'premium', 'chalk', '#243656', null,
      ['teacher', 'school', 'classroom', 'heart', 'chalk'], 'A heart drawn in chalk, the kind that stays on a sleeve.', ''],
    ['apple-green', 'CH-TCH-07', 'Green Apple', 'teachers', 'standard', 'apple', '#f4efe6', null,
      ['teacher', 'school', 'apple', 'classroom', 'green'], 'A green apple, sharper than the red, for a different kind of sweet.', ''],

    ['closed-book', 'CH-BOK-01', 'Closed Book', 'books-coffee', 'standard', 'book', '#f4efe6', null,
      ['book', 'books', 'reading', 'library', 'story', 'novel'], 'A closed book, for a story you have finished and still carry.', 'best'],
    ['open-book', 'CH-BOK-02', 'Open Book', 'books-coffee', 'premium', 'book-open', '#f4efe6', null,
      ['book', 'books', 'reading', 'library', 'story'], 'An open book, a page in the middle, where the plot turns.', ''],
    ['coffee-cup', 'CH-COF-01', 'Coffee Cup', 'books-coffee', 'standard', 'coffee', '#f4efe6', null,
      ['coffee', 'cafe', 'cup', 'latte'], 'A cup of coffee, for the hour before the day begins.', 'best'],
    ['espresso', 'CH-COF-02', 'Espresso', 'books-coffee', 'premium', 'coffee', '#2a2622', null,
      ['coffee', 'cafe', 'espresso', 'cup'], 'An espresso, short and dark, for someone who does not linger.', 'new'],
    ['tea-cup', 'CH-COF-03', 'Tea Cup', 'books-coffee', 'standard', 'tea', '#f4efe6', null,
      ['tea', 'cup', 'pink', 'calm', 'book'], 'A tea cup, pink at the rim, for a slower afternoon.', ''],

    ['plane', 'CH-TRV-01', 'Little Plane', 'travel', 'premium', 'plane', '#e7eef2', null,
      ['travel', 'plane', 'trip', 'flight', 'wander'], 'A little plane, for the trips that changed the scale of home.', 'best'],
    ['compass', 'CH-TRV-02', 'Compass', 'travel', 'premium', 'compass', '#f4efe6', null,
      ['travel', 'compass', 'adventure', 'wander'], 'A compass, not because you are lost — because you like knowing the direction.', ''],
    ['suitcase', 'CH-TRV-03', 'Suitcase', 'travel', 'standard', 'suitcase', '#f4efe6', null,
      ['travel', 'trip', 'suitcase', 'wander'], 'A suitcase, packed a little too full, which is how you travel.', ''],
    ['passport', 'CH-TRV-04', 'Passport', 'travel', 'standard', 'passport', '#243656', null,
      ['travel', 'passport', 'trip', 'wander'], 'A passport, for the stamps and the person who collected them.', ''],
    ['map-fold', 'CH-TRV-05', 'Folded Map', 'travel', 'premium', 'map', '#f4efe6', null,
      ['travel', 'map', 'trip', 'wander'], 'A folded map, creased where you have already been.', ''],

    ['mother-heart', 'CH-FAM-01', 'Mother Heart', 'family', 'premium', 'heart', '#b76e79', null,
      ['family', 'mother', 'mom', 'mum', 'motherhood', 'love', 'heart'], 'A heart for a mother, or for the person who mothered you.', 'best'],
    ['family-three', 'CH-FAM-02', 'Three Together', 'family', 'premium', 'family', '#f4efe6', null,
      ['family', 'three', 'home', 'together'], 'Three figures, close enough to share a shadow.', ''],
    ['pram', 'CH-FAM-03', 'Pram', 'family', 'standard', 'pram', '#f4efe6', null,
      ['family', 'baby', 'motherhood', 'pram', 'child'], 'A pram, for a very new person and the walks that came with them.', ''],
    ['little-house', 'CH-FAM-04', 'Little House', 'family', 'standard', 'house', '#f4efe6', null,
      ['family', 'home', 'house'], 'A little house, not an address — the feeling of coming in.', ''],
    ['infinity', 'CH-FAM-05', 'Infinity', 'family', 'premium', 'infinity', '#6e5434', null,
      ['family', 'love', 'forever', 'infinity'], 'An infinity, for a promise you intend to keep boring and daily.', ''],

    ['paw', 'CH-PET-01', 'Paw', 'pets', 'standard', 'paw', '#f4efe6', null,
      ['pet', 'paw', 'dog', 'cat'], 'A paw print, for the animal who waits by the door.', 'best'],
    ['cat', 'CH-PET-02', 'Cat', 'pets', 'premium', 'cat', '#f4efe6', null,
      ['pet', 'cat', 'kitten'], 'A cat, composed and slightly unimpressed, as cats are.', ''],
    ['dog', 'CH-PET-03', 'Dog', 'pets', 'premium', 'dog', '#f4efe6', null,
      ['pet', 'dog', 'puppy'], 'A dog, ears up, ready for the next ordinary adventure.', ''],
    ['songbird', 'CH-PET-04', 'Songbird', 'pets', 'standard', 'bird', '#f4efe6', null,
      ['pet', 'bird', 'song'], 'A songbird, small enough to miss if you are not listening.', ''],

    ['quaver', 'CH-MUS-01', 'Quaver', 'music', 'standard', 'note', '#f4efe6', null,
      ['music', 'song', 'note'], 'A single note, for a song that plays without being asked.', ''],
    ['treble', 'CH-MUS-02', 'Treble Clef', 'music', 'premium', 'treble', '#f4efe6', null,
      ['music', 'song', 'treble'], 'A treble clef, the doorway into the staff.', ''],
    ['piano', 'CH-MUS-03', 'Piano Keys', 'music', 'premium', 'piano', '#f4efe6', null,
      ['music', 'piano', 'song'], 'Three piano keys, for the person who sits down and the room changes.', ''],
    ['lyric-heart', 'CH-MUS-04', 'Lyric Heart', 'music', 'standard', 'heart', '#6d4a86', null,
      ['music', 'love', 'heart', 'song'], 'A heart in violet, for a lyric you never quite forgot.', ''],

    ['north-star', 'CH-CEL-01', 'North Star', 'celestial', 'standard', 'star', '#1a1714', null,
      ['celestial', 'star', 'night', 'guide'], 'A north star, the one you look for when the rest of the sky is busy.', 'best'],
    ['crescent-moon', 'CH-CEL-02', 'Crescent Moon', 'celestial', 'premium', 'moon', '#1a1714', null,
      ['celestial', 'moon', 'night'], 'A crescent, thin and exact, for late hours.', ''],
    ['sunburst', 'CH-CEL-03', 'Sunburst', 'celestial', 'standard', 'sun', '#f4efe6', null,
      ['celestial', 'sun', 'day', 'light'], 'A small sun, for the person who is the warm part of a room.', ''],
    ['constellation', 'CH-CEL-04', 'Constellation', 'celestial', 'luxury', 'stars', '#1a1714', null,
      ['celestial', 'star', 'night', 'constellation'], 'A few stars joined, a private constellation.', 'new club'],
    ['saturn', 'CH-CEL-05', 'Ringed Planet', 'celestial', 'premium', 'planet', '#1a1714', null,
      ['celestial', 'planet', 'night', 'star'], 'A ringed planet, for a mind that likes a longer orbit.', ''],

    ['snowflake', 'CH-SEA-01', 'Snowflake', 'seasonal', 'standard', 'snowflake', '#e7eef2', null,
      ['seasonal', 'christmas', 'winter', 'snow', 'holiday'], 'A snowflake, no two alike, which is also true of the people at your table.', 'new'],
    ['christmas-tree', 'CH-SEA-02', 'Christmas Tree', 'seasonal', 'standard', 'tree', '#f4efe6', null,
      ['seasonal', 'christmas', 'holiday', 'tree', 'winter'], 'A small tree, for the room you decorate and the people you do it for.', 'new'],
    ['holiday-bell', 'CH-SEA-03', 'Holiday Bell', 'seasonal', 'dangle', 'bell', '#6e5434', null,
      ['seasonal', 'christmas', 'holiday', 'bell', 'dangle'], 'A bell on a short drop, a sound you can see.', 'new'],
    ['wreath', 'CH-SEA-04', 'Wreath', 'seasonal', 'premium', 'wreath', '#f4efe6', null,
      ['seasonal', 'christmas', 'holiday', 'wreath', 'winter'], 'A wreath, a circle that means you are welcome.', 'new'],
    ['stocking', 'CH-SEA-05', 'Stocking', 'seasonal', 'standard', 'stocking', '#f4efe6', null,
      ['seasonal', 'christmas', 'holiday', 'gift'], 'A stocking, for the small gift at the foot of the morning.', 'new'],
    ['wrapped-gift', 'CH-SEA-06', 'Wrapped Gift', 'seasonal', 'standard', 'gift', '#f4efe6', null,
      ['seasonal', 'christmas', 'holiday', 'gift', 'present'], 'A wrapped gift, ribbon and all, for the pleasure of handing something over.', 'new'],

    ['cameo', 'CH-LUX-01', 'Cameo', 'luxury-vintage', 'luxury', 'cameo', '#f3ead7', null,
      ['luxury', 'vintage', 'classic', 'cameo', 'elegant'], 'A cameo, a profile from another century, still looking slightly aside.', 'best'],
    ['skeleton-key', 'CH-LUX-02', 'Skeleton Key', 'luxury-vintage', 'dangle', 'key', '#6e5434', null,
      ['luxury', 'vintage', 'key', 'dangle', 'elegant'], 'A skeleton key on a drop, for a door you are glad you can open.', ''],
    ['petite-crown', 'CH-LUX-03', 'Petite Crown', 'luxury-vintage', 'luxury', 'crown', '#6e5434', null,
      ['luxury', 'crown', 'royal', 'elegant'], 'A petite crown, worn lightly, for private occasions.', ''],
    ['roman-coin', 'CH-LUX-04', 'Roman Coin', 'luxury-vintage', 'luxury', 'coin', '#6e5434', null,
      ['luxury', 'vintage', 'coin', 'classic'], 'A coin with a worn profile, as if it has already lived a long time.', ''],
    ['onyx-heart', 'CH-LUX-05', 'Onyx Heart', 'luxury-vintage', 'luxury', 'heart', '#1c1915', null,
      ['luxury', 'vintage', 'black', 'heart', 'evening', 'elegant'], 'An onyx heart, black and polished, for a quieter kind of devotion.', 'club new'],
  ];

  var charms = rows.map(function (row) {
    var flags = String(row[10] || '').split(/\s+/).filter(Boolean);
    return charm({
      id: row[0],
      sku: row[1],
      name: row[2],
      category: row[3],
      tier: row[4],
      tags: row[8],
      description: row[9],
      isBestSeller: flags.indexOf('best') !== -1,
      isNew: flags.indexOf('new') !== -1,
      exclusive: flags.indexOf('club') !== -1 ? 'club' : null,
      art: { motif: row[5], enamel: row[6], ground: row[7], letter: '' },
    });
  });

  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (letter) {
    charms.push(charm({
      id: 'letter-' + letter.toLowerCase(),
      sku: 'CH-LET-' + letter,
      name: 'Initial ' + letter,
      category: 'letters',
      tier: 'standard',
      tags: ['letter', 'initial', 'alphabet', letter.toLowerCase(), 'name'],
      description: 'The initial ' + letter + ', for a name you want close at hand.',
      isBestSeller: letter === 'A' || letter === 'M',
      isNew: false,
      art: { motif: 'letter', enamel: '#6e2438', ground: null, letter: letter },
    }));
  });

  var byId = {};
  charms.forEach(function (item) {
    if (byId[item.id]) throw new Error('Duplicate charm id ' + item.id);
    byId[item.id] = item;
  });

  var collections = [
    {
      id: 'november-fireside',
      month: 'November',
      title: 'Fireside Chapters',
      sample: true,
      blurb: 'A sample monthly edit: a book, a cup, a star, a heart, a pearl.',
      charmIds: ['closed-book', 'coffee-cup', 'north-star', 'heart-little', 'pearl-button'],
    },
    {
      id: 'december-table',
      month: 'December',
      title: 'The Long Table',
      sample: true,
      blurb: 'A sample holiday edit for the people you seat beside you.',
      charmIds: ['christmas-tree', 'holiday-bell', 'wreath', 'snowflake', 'wrapped-gift'],
    },
    {
      id: 'january-sky',
      month: 'January',
      title: 'A Clearer Sky',
      sample: true,
      blurb: 'A sample new-year edit. Quiet metal, a little light.',
      charmIds: ['crescent-moon', 'pearl-button', 'letter-a', 'compass', 'snowflake'],
    },
  ];

  function validate() {
    var errors = [];
    var prices = root.CS.prices;
    charms.forEach(function (item) {
      if (!prices[item.priceKey] && prices[item.priceKey] !== 0) errors.push('Missing priceKey ' + item.priceKey + ' on ' + item.id);
      if (item.priceKey !== item.tier) errors.push('priceKey should match tier for ' + item.id);
      if (!item.metals.length) errors.push('No metals on ' + item.id);
      if (!item.art || !item.art.motif) errors.push('No motif on ' + item.id);
    });
    root.CS.bundle.charmIds.forEach(function (id) {
      if (!byId[id]) errors.push('Bundle charm missing: ' + id);
    });
    collections.forEach(function (col) {
      col.charmIds.forEach(function (id) {
        if (!byId[id]) errors.push('Collection ' + col.id + ' missing ' + id);
      });
    });
    return errors;
  }

  root.Catalog = {
    categories: categories,
    charms: charms,
    collections: collections,
    byId: function (id) { return byId[id] || null; },
    categoryLabel: function (id) {
      for (var i = 0; i < categories.length; i++) {
        if (categories[i].id === id) return categories[i].label;
      }
      return id;
    },
    validate: validate,
  };
})(typeof window !== 'undefined' ? window : globalThis);
