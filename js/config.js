/**
 * MOOD & CO. — the only place the brand name, lines, page labels, prices, and policies are defined.
 *
 * Rename the house: edit brand.name (the wordmark) and brand.tagline.
 * Edit a price: edit prices (dollars). Every page, the builder, and the cart read from here.
 * Metal is a finish, not a price. There is one starterBracelet price for gold and for silver.
 * Charm prices depend only on tier: standard, premium, luxury, dangle.
 *
 * Palette and type live in css/tokens.css (ivory, champagne, gold, dusty rose, espresso).
 * Never put an API key, admin token, or Storefront secret in this file.
 */
(function (root) {
  'use strict';

  root.CS = {
    brand: {
      /** Wide-tracked wordmark. */
      name: 'MOOD & CO.',
      /** Small line under the wordmark. */
      tagline: 'EVERY MOOD. EVERY STORY.',
      /** Primary slogan. */
      hero: 'Wear who you are.',
      lines: {
        story: 'Your story, one link at a time.',
        charm: 'A little charm for every mood.',
        versions: 'Made for every version of you.',
        rules: 'Your mood. Your rules.',
      },
      /** localStorage namespace. Change it if a renamed brand should start fresh. */
      storagePrefix: 'moodco.v1',
    },

    /**
     * Visible page names. Filenames stay short; labels come from here.
     * The Mood Bar is the bracelet builder and the primary call to action.
     */
    pages: {
      home: { href: './index.html', label: 'Home' },
      builder: { href: './builder.html', label: 'The Mood Bar' },
      shop: { href: './shop.html', label: 'Shop All' },
      gold: { href: './gold.html', label: 'The Golden Edit' },
      silver: { href: './silver.html', label: 'The Silver Edit' },
      teacher: { href: './teacher.html', label: 'The Teacher Edit' },
      best: { href: './bestsellers.html', label: 'Best Sellers' },
      fresh: { href: './new.html', label: 'New Arrivals' },
      gifts: { href: './gifts.html', label: 'The Gift Edit' },
      club: { href: './club.html', label: 'The Charm Club' },
      vault: { href: './vault.html', label: 'The Mood Vault' },
      society: { href: './ambassador.html', label: 'The Mood Society' },
      about: { href: './about.html', label: 'About' },
      faq: { href: './faq.html', label: 'FAQ' },
      cart: { href: './cart.html', label: 'Cart' },
    },

    /** Header links, in order. Edit labels above; this is only the order. */
    nav: ['builder', 'shop', 'gifts', 'club', 'vault'],
    /** Finishes and edits, grouped in the header and listed on the shop pages. */
    edits: ['gold', 'silver', 'teacher', 'best', 'fresh'],
    footerNav: ['builder', 'shop', 'gold', 'silver', 'teacher', 'best', 'fresh', 'gifts', 'club', 'vault', 'society', 'about', 'faq', 'cart'],

    /**
     * Retail prices in US dollars.
     * starterBracelet is the empty 9mm bracelet in either gold or silver.
     */
    prices: {
      starterBracelet: 19.99,
      standard: 3.99,
      premium: 5.99,
      luxury: 7.99,
      dangle: 8.99,
      tool: 4.99,
      bundle: 34.99,
      clubMonthly: 24.99,
      /** Prototype default for the gift-box add-on. Change it here before launch. */
      giftBox: 6.99,
    },

    priceNotes: {
      metal: 'Every design is offered at the same price in gold or silver.',
    },

    /**
     * Link count.
     * links = round((wristInches * 25.4 + comfortMm) / linkPitchMm)
     * then clamped to minLinks..maxLinks.
     * 6.5 in → (165.1 + 10) / 9.5 = 18.43 → 18 links.
     * Pitch is the middle of a 9–9.5mm Italian link; comfort is about 1cm.
     */
    sizing: {
      linkPitchMm: 9.5,
      comfortMm: 10,
      minLinks: 15,
      maxLinks: 23,
      wrists: [5.5, 6, 6.5, 7, 7.5, 8],
      defaultWrist: 6.5,
    },

    shipping: {
      /** Complimentary US shipping once the merchandise subtotal reaches this amount. */
      freeThreshold: 75,
      policy:
        'Shipping is calculated at secure checkout. Complimentary US shipping applies once an order reaches the threshold configured for this shop. This prototype does not quote or promise a delivery date.',
    },

    /**
     * Optional honest seasonal note. Leave message empty to hide it.
     * Do not use this for countdown timers or stock claims.
     */
    giftSeason: {
      deadline: '',
      message: '',
    },

    materialsNote:
      'Production pieces are planned in 316L stainless steel, with nickel-release testing before they are sold. This prototype uses illustrated demo products. It does not claim a finished certification, and it does not describe the jewelry as hypoallergenic or tarnish-proof.',

    returnsNote:
      'Return terms will be published before the shop takes real orders. This prototype does not accept returns or payments.',

    checkoutNote: 'Demo: checkout will be handled securely by Shopify.',

    /**
     * Trust badges. Empty by default — nothing is shown until real items are added.
     * Shape: [{ id, title, detail }]
     * Only add a badge when the claim is true (a real policy, a real test result).
     */
    trustBadges: [],

    club: {
      charmsPerShipment: 5,
      prepaidMonths: [3, 6, 12],
      benefits: [
        'Five curated charms each month',
        'Complimentary US shipping on club shipments',
        'A gold or silver preference, at the same price',
        'Subscriber-only charms',
        'A monthly theme',
        'Skip or cancel anytime',
      ],
    },

    /** The fixed studio set. Savings are computed from these charm ids plus the starter. */
    bundle: {
      id: 'bundle-five',
      sku: 'SET-FIVE',
      name: 'Bracelet + Five Charms',
      charmIds: ['heart-little', 'daisy', 'coffee-cup', 'plane', 'pearl-button'],
    },

    products: {
      tool: {
        id: 'tool',
        sku: 'TOOL-ASM',
        name: 'Assembly tool',
        priceKey: 'tool',
        description: 'The small tool for opening a 9mm link at home, if you would rather set the charms yourself.',
      },
      giftBox: {
        id: 'gift-box',
        sku: 'GIFT-BOX',
        name: 'Gift box',
        priceKey: 'giftBox',
        description: 'A rigid box and a card, so the bracelet can be given as a finished gift.',
      },
    },

    commerce: {
      /** 'local-demo' or, once wired, 'shopify-storefront'. */
      provider: 'local-demo',
      shopify: {
        domain: '',
        storefrontApiVersion: '2025-01',
        /**
         * Leave this blank in the repo.
         * Prefer a backend that holds the Storefront token and returns checkoutUrl.
         * Never commit an Admin API key.
         */
        storefrontAccessToken: '',
      },
    },

    /**
     * Future stylist endpoint. The browser posts the sentence and a small context object.
     * The server calls the model. No model API key belongs in this repository.
     */
    stylist: {
      endpoint: '',
    },

    ambassador: {
      exampleRates: {
        label: 'Example only — not a live offer',
        orderPercent: 15,
        clubPercent: 10,
      },
    },

    features: {
      showPrototypeFlag: true,
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
