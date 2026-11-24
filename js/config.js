/**
 * Placeholder brand — the only place the name, lines, page labels, prices, and policies are defined.
 *
 * The name is not final. Change brand.name (one line) when the owner chooses it.
 * brand.tagline is a working line. brand.taglineStatus marks it as such in the UI.
 * There is no logo file. The wordmark is the name, set in type.
 *
 * Edit a price here. Metal tone is not a price.
 * One starterBracelet price covers gold tone and silver tone.
 * Charm prices depend only on tier: standard, premium, luxury, dangle.
 *
 * Palette and type live in css/tokens.css. Swap colors there.
 * Never put an API key, admin token, or Storefront secret in this file.
 */
(function (root) {
  'use strict';

  root.CS = {
    brand: {
      /** Provisional wordmark. Not a final brand approval. */
      name: 'MOOD & CO.',
      /** Official tagline is not finalized. Leave this empty so the site does not invent one. */
      tagline: '',
      taglineStatus: 'unfinalized',
      promise: 'Jewelry for individuality, memories, personal growth, and everyday happiness.',
      hero: 'Wear who you are.',
      heroSupport: 'Create a bracelet that tells your story. From little things that make you smile to moments you’ll never forget, make every link mean something.',
      lines: {
        story: 'Italian charms are interchangeable links. They form the bracelet itself.',
        charm: 'A little charm for a feeling you want close.',
        versions: 'For teens, students, teachers, mothers, and women at work.',
        rules: 'Choose a bracelet. Choose the links. Keep adding to the story.',
      },
      storagePrefix: 'moodco.preview',
    },

    /**
     * Visible page names. Filenames stay short; labels come from here.
     * Wear Your Story is the bracelet builder and the primary call to action.
     */
    pages: {
      home: { href: './index.html', label: 'Home' },
      builder: { href: './builder.html', label: 'Build Your Bracelet' },
      shop: { href: './shop.html', label: 'Shop Charms' },
      gold: { href: './gold.html', label: 'The Golden Edit' },
      silver: { href: './silver.html', label: 'The Silver Edit' },
      teacher: { href: './teacher.html', label: 'The Teacher Edit' },
      selflove: { href: './shop.html?mood=love', label: 'The Self-Love Edit' },
      little: { href: './shop.html?mood=little', label: 'The Little Things Edit' },
      best: { href: './bestsellers.html', label: 'The Studio Edit' },
      fresh: { href: './new.html', label: 'New Arrivals' },
      gifts: { href: './gifts.html', label: 'Gifts' },
      giftedit: { href: './gifts.html', label: 'The Gift Edit' },
      club: { href: './club.html', label: 'The Charm Club' },
      card: { href: './happy-card.html', label: 'The Happy Card' },
      dashboard: { href: './dashboard.html', label: 'Account' },
      vault: { href: './vault.html', label: 'Account' },
      about: { href: './about.html', label: 'About' },
      faq: { href: './faq.html', label: 'FAQ' },
      cart: { href: './cart.html', label: 'Shopping Bag' },
      privacy: { href: './privacy.html', label: 'Privacy Policy' },
      shipping: { href: './shipping.html', label: 'Shipping Policy' },
      returns: { href: './returns.html', label: 'Returns Policy' },
      terms: { href: './subscription-terms.html', label: 'Subscription Terms' },
    },

    /** Header links, in order. Edit labels above; this is only the order. */
    nav: ['builder', 'shop', 'collections', 'club', 'gifts'],
    /** Collection menu. Not a sales ranking. */
    edits: ['gold', 'silver', 'teacher', 'selflove', 'little', 'giftedit'],
    footerNav: ['builder', 'shop', 'club', 'card', 'gifts', 'dashboard', 'gold', 'silver', 'about', 'faq', 'privacy', 'shipping', 'returns', 'terms', 'cart'],

    /**
     * Retail prices in US dollars.
     * starterBracelet is the empty 9mm bracelet in either gold or silver.
     */
    prices: {
      starterBracelet: 24.99,
      standard: 12.99,
      /** Premium crystal links. Luxury links use this same price until a separate luxury price is set. */
      premium: 15.99,
      luxury: 15.99,
      dangle: 17.99,
      tool: 6.99,
      bundle: 34.99,
      clubMonthly: 24.99,
      /** Prototype default for the gift-box add-on. Change it here before launch. */
      giftBox: 6.99,
      plainLink: 5.99,
    },

    /**
     * Bracelet examples use the plain starter plus this many standard charms.
     * Totals are calculated. Do not hardcode them in the pages.
     */
    priceExamples: [
      { charms: 0, label: 'Plain bracelet' },
      { charms: 2, label: 'Plus 2 charms' },
      { charms: 3, label: 'Plus 3 charms' },
      { charms: 6, label: 'Plus 6 charms' },
      { charms: 9, label: 'Plus 9 charms' },
      { charms: 18, label: 'Fully customized, 18 charms' },
    ],

    priceNotes: {
      metal: 'Gold tone and silver tone of the same design are the same price.',
      club: 'Provisional price, plus applicable sales tax. Not finally approved.',
      preview: 'Preview. Not open for orders.',
      plainLink: 'One extra plain link. Same price in gold tone or silver tone.',
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
      /**
       * Do not show a free-shipping progress bar until this is explicitly approved.
       * The number below is only a placeholder for that future decision.
       */
      thresholdApproved: false,
      /** Placeholder amount. Not an approved offer. */
      freeThreshold: 75,
      policy:
        'Shipping is calculated at secure checkout. Complimentary US shipping applies once an order reaches the threshold configured for this shop. The monthly membership includes domestic shipping. This prototype does not quote or promise a delivery date.',
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
      charmsPerShipment: 2,
      prepaidMonths: [3, 6, 12],
      includes: [
        'Two themed Italian charm links',
        'A numbered collectible positivity card',
        'An affirmation sticker',
        'A reusable pouch',
        'Domestic shipping included',
      ],
      benefits: [
        'Two themed Italian charm links each month',
        'A numbered collectible positivity card',
        'An affirmation sticker',
        'A reusable pouch',
        'Domestic shipping included',
        'Gold tone or silver tone, at the same price',
        'Skip or cancel from your collection page',
      ],
    },

    /**
     * Happy Card. digitalCollectionUrl is what a future QR code should open.
     * Leave it empty until the live collection address exists. This prototype
     * does not invent a scannable code.
     */
    card: {
      digitalCollectionUrl: '',
      sections: [
        { id: 'motivation', title: 'Your Motivation' },
        { id: 'encouragement', title: 'Your Encouragement' },
        { id: 'reminder', title: 'Your Happy Reminder' },
        { id: 'charms', title: 'Your Charms' },
      ],
    },

    /**
     * Waitlist and other forms. Leave waitlistEndpoint empty to store addresses
     * on this device only. When you have a list provider, set a URL that accepts
     * POST JSON { email, source }. Do not put a secret in this file.
     */
    forms: {
      waitlistEndpoint: '',
    },

    /** How a link is opened, removed, and replaced with the assembly tool. */
    howto: [
      { title: 'Open', text: 'Use the assembly tool to release the link beside the one you want to change. The bracelet stays the length you measured.' },
      { title: 'Remove', text: 'Slide the plain link, or the decorative link you are retiring, out of the row.' },
      { title: 'Replace', text: 'Slide the new link in, the same 9mm width, and close the connection with the tool. Gold tone and silver tone are a finish, not a different size or price.' },
    ],

    /** The fixed studio set. Savings are computed from these charm ids plus the starter. */
    bundle: {
      id: 'bundle-five',
      sku: 'SET-FIVE',
      name: 'Bracelet + Five Charms',
      charmIds: ['heart-little', 'daisy', 'coffee-cup', 'plane', 'pearl-button'],
    },

    products: {
      starter: {
        id: 'starter',
        sku: 'BR-START',
        name: 'Plain starter bracelet',
        priceKey: 'starterBracelet',
        type: 'bracelet',
        description: 'A full row of plain 9mm links, sized to the wrist. Decorative links replace the plain ones. The length stays the same.',
        inventory: { gold: null, silver: null },
      },
      plainLink: {
        id: 'plain-link',
        sku: 'LINK-PLAIN',
        name: 'Additional plain link',
        priceKey: 'plainLink',
        type: 'link',
        description: 'One plain 9mm link, for a repair or a resize. Same link in gold tone or silver tone.',
        inventory: { gold: null, silver: null },
      },
      tool: {
        id: 'tool',
        sku: 'TOOL-ASM',
        name: 'Charm-changing tool',
        priceKey: 'tool',
        description: 'The small tool for opening a 9mm link so you can remove one and slide another into its place.',
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

    referral: {
      status: 'coming-soon',
      note: 'A referral program is planned. It is not open. There is no code to share and no commission to claim.',
    },

    features: {
      showPrototypeFlag: true,
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
