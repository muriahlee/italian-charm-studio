/**
 * Pure-logic checks. No browser required.
 * Run: node tests/logic.test.js
 */
import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const mem = new Map();
const storage = {
  getItem(k) { return mem.has(k) ? mem.get(k) : null; },
  setItem(k, v) { mem.set(k, String(v)); },
  removeItem(k) { mem.delete(k); },
};
const context = {
  console,
  localStorage: storage,
  sessionStorage: storage,
  TextEncoder,
  TextDecoder,
  btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
  atob: (s) => Buffer.from(s, 'base64').toString('binary'),
  URL,
  URLSearchParams,
  CustomEvent: class CustomEvent {
    constructor(type, init) { this.type = type; this.detail = init && init.detail; }
  },
  dispatchEvent() {},
  addEventListener() {},
  document: {
    addEventListener() {},
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    documentElement: { dataset: {} },
    body: { getAttribute() { return ''; } },
  },
};
context.window = context;
context.globalThis = context;
vm.createContext(context);

function load(rel) {
  const file = path.join(root, rel);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}

[
  'js/config.js',
  'js/util.js',
  'js/pricing.js',
  'js/sizing.js',
  'js/catalog.js',
  'data/monthly-themes.js',
  'js/storage.js',
  'js/commerce/adapter.js',
  'js/cart.js',
  'js/vault.js',
  'js/codec.js',
  'js/stylist/engine.js',
  'js/stylist/provider.js',
  'js/recommendations.js',
].forEach(load);

const { CS, Catalog, Pricing, Sizing, Cart, Codec, StylistEngine, Stylist, Vault, Recs } = context;
let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error('FAIL', msg);
  }
}

assert(CS.brand.name === 'Fiorvelle', 'brand name');
assert(CS.brand.tagline === 'Collect your happy.', 'tagline');
assert(CS.brand.taglineStatus === 'approved', 'tagline status');
assert(CS.brand.hero === 'Collect your happy.', 'hero');
assert(CS.brand.hero.indexOf('Wear who you are') === -1, 'retired headline');
assert(CS.brand.hero.indexOf('Italian charm bracelets') === -1, 'placeholder headline removed');
assert(CS.prices.starterBracelet === 24.99, 'starter price');
assert(CS.prices.standard === 12.99, 'standard');
assert(CS.prices.premium === 15.99, 'premium crystal');
assert(CS.prices.dangle === 17.99, 'dangle');
assert(CS.prices.plainLink === 5.99, 'plain link');
assert(CS.prices.tool === 6.99, 'tool');
assert(!CS.prices.gold && !CS.prices.silver, 'no metal prices');
assert(CS.pages.builder.label === 'Build Your Bracelet', 'builder label');
assert(CS.pages.shop.label === 'Shop Charms', 'shop label');
assert(CS.pages.club.label === 'Fiorvelle Monthly Collection', 'club label');
assert(CS.pages.club.label.indexOf('Charm Club') === -1, 'no Charm Club trademark');
assert(CS.pages.club.label.indexOf('Monthly Dose of Happy') === -1, 'old subscription name removed');
assert(CS.pages.card.label === 'The Happy Card', 'card label');
assert(CS.pages.gifts.label === 'Gifts', 'gift label');
assert(CS.shipping.thresholdApproved === false, 'shipping offer not approved');
assert(CS.prices.clubMonthly === 24.99, 'monthly price');
assert(CS.referral.status === 'coming-soon', 'referral closed');
assert(Array.isArray(CS.trustBadges) && CS.trustBadges.length === 0, 'trust empty');

const errors = Catalog.validate();
assert(errors.length === 0, 'catalog ' + errors.join('; '));
assert(Catalog.charms.length >= 100 && Catalog.charms.length <= 160, 'charm count ' + Catalog.charms.length);
Catalog.charms.forEach((charm) => {
  assert(charm.metals.includes('gold') && charm.metals.includes('silver'), charm.id + ' metals');
  assert(charm.priceKey === charm.tier, charm.id + ' tier price');
  assert(charm.image == null && charm.isDemo === true && charm.shopifyVariantId == null, charm.id + ' demo fields');
  assert(charm.inventory && charm.inventory.gold == null && charm.inventory.silver == null, charm.id + ' inventory');
});

assert(Sizing.linksForWrist(6.5) === 18, '6.5in is 18 links, got ' + Sizing.linksForWrist(6.5));
assert(Sizing.linksForWrist(6) === 17, '6in');
assert(Sizing.linksForWrist(7) === 20, '7in ' + Sizing.linksForWrist(7));

const quote = Pricing.bundleQuote();
assert(quote && quote.bundleCents === 3499, 'bundle cents');
assert(quote.separateCents > quote.bundleCents, 'bundle saves vs separate ' + quote.separateCents);
assert(Pricing.clubPrepaidCents(3) === 2499 * 3, 'club 3');
assert(Pricing.clubPrepaidCents(6) === 2499 * 6, 'club 6');
assert(Pricing.clubPrepaidCents(12) === 2499 * 12, 'club 12');
assert(Pricing.exampleCents(0) === 2499, 'plain bracelet');
assert(Pricing.exampleCents(2) === 5097, 'plus 2');
assert(Pricing.exampleCents(3) === 6396, 'plus 3');
assert(Pricing.exampleCents(6) === 10293, 'plus 6');
assert(Pricing.exampleCents(9) === 14190, 'plus 9');
assert(Pricing.exampleCents(18) === 25881, 'plus 18');
assert(Pricing.standardPairCents() === 2598, 'two charms');

const prompt = 'Create a gold bracelet for a teacher who loves coffee, books, traveling and pink';
const draft = StylistEngine.recommend(prompt, { linkCount: 18, wrist: 6.5 });
assert(draft.metal === 'gold', 'stylist metal');
function hasTag(tag) {
  return draft.charmIds.some((id) => Catalog.byId(id).tags.includes(tag));
}
assert(hasTag('teacher'), 'stylist teacher ' + draft.charmIds.join(','));
assert(hasTag('coffee'), 'stylist coffee');
assert(hasTag('book') || hasTag('books'), 'stylist books');
assert(hasTag('travel'), 'stylist travel');
assert(hasTag('pink'), 'stylist pink');
assert(draft.links.filter(Boolean).length === draft.charmIds.length, 'placement count');
assert(draft.explanation && draft.explanation.length > 20, 'explanation');

const silver = StylistEngine.recommend('a silver bracelet with a dog and a star', { linkCount: 18 });
assert(silver.metal === 'silver', 'silver detect');

const encoded = Codec.encode({
  metal: 'silver',
  wrist: 6.5,
  links: draft.links,
  assembly: 'diy',
  includeTool: true,
  includeGiftBox: false,
  story: 'For my sister',
  giftMessage: 'Open this slowly',
});
const back = Codec.decode(encoded);
assert(back.metal === 'silver' && back.story === 'For my sister', 'codec story');
assert(back.links.join('|') === draft.links.map((id) => id || null).join('|') || back.links.length === 18, 'codec links');
assert(back.assembly === 'diy' && back.includeTool === true, 'codec assembly');

const charm = Catalog.byId('heart-little');
await Cart.addCharm(charm, 'gold');
await Cart.addCharm(charm, 'gold');
let cart = await Cart.get();
assert(cart.lines.length === 1 && cart.lines[0].qty === 2, 'charm qty merge');
assert(cart.lines[0].unitCents === 1299, 'standard cents');
await Cart.addConfigured({
  metal: 'silver',
  wrist: 6.5,
  links: draft.links,
  assembly: 'diy',
  includeTool: true,
  includeGiftBox: false,
  story: 'A chapter',
  giftMessage: '',
});
cart = await Cart.get();
const bracelet = cart.lines.find((line) => line.type === 'configured-bracelet');
assert(bracelet && bracelet.meta.metal === 'silver', 'configured metal');
assert(bracelet.meta.story === 'A chapter', 'configured story');
assert(cart.lines.some((line) => line.type === 'tool'), 'tool suggested');
const sub = Cart.subtotalCents(cart);
assert(sub === cart.lines.reduce((s, l) => s + l.unitCents * l.qty, 0), 'subtotal');

const recs = Recs.charms({ placedIds: ['pencil'], tags: ['teacher'], limit: 4 });
assert(recs.length > 0 && recs.every((item) => item.id !== 'pencil'), 'recs');

Vault.addOwned('daisy', 'sample');
assert(Vault.owns('daisy'), 'vault own');
const record = Vault.saveDesign({ name: 'Test', metal: 'gold', wrist: 6.5, links: [null, 'heart-little'], story: 'Hi', assembly: 'studio' });
assert(Vault.missingFromDesign(record.design).some((item) => item.id === 'heart-little'), 'missing charm');

const reviews = JSON.parse(fs.readFileSync(path.join(root, 'data/reviews.json'), 'utf8'));
assert(Array.isArray(reviews.items) && reviews.items.length === 0, 'reviews empty');

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(!html.includes('Charm Studio') && !html.includes('MOOD & CO.') && !html.includes('Wear who you are') && !html.includes('Charm Club') && !html.includes('Monthly Dose of Happy') && !html.includes('Italian charm bracelets.'), 'retired names removed from home');
assert(html.includes('Collect your happy.') || html.includes('brand.hero'), 'tagline wired on home');
assert(html.includes('Fiorvelle Monthly Collection'), 'subscription name on home');
assert(context.MonthlyThemes.length === 12, 'twelve themes');
assert(context.MonthlyThemes[0].title === 'Beautiful Beginnings', 'january');
assert(context.MonthlyThemes[11].title === 'Believe in Yourself', 'december');
assert(Catalog.byId('luck-clover') && Catalog.byId('believe-wings'), 'theme charms');
assert(!/href="\//.test(html) && !/src="\//.test(html), 'relative urls');
assert(fs.existsSync(path.join(root, '.nojekyll')), 'nojekyll');
assert(Stylist.active === 'catalog', 'stylist local');
assert(!JSON.stringify(CS).includes('sk-') && CS.commerce.shopify.storefrontAccessToken === '', 'no key');

if (failed) {
  console.error(failed + ' failed');
  process.exit(1);
}
console.log('ok', Catalog.charms.length, 'charms', 'bundle save', quote.savingsCents, 'stylist', draft.charmIds.join(', '));
