# MOOD & CO.

A static storefront prototype for a house of Italian 9mm modular charm bracelets. It is HTML, CSS, and vanilla JavaScript, with no build step, so GitHub Pages can serve it from the repository root (including a project site such as `/italian-charm-studio/`).

Illustrated charms stand in for photography. The bag, the Mood Vault, and the club join flow stay on this device. Checkout is deliberately not wired to a card form.

## Rename the brand

Edit `js/config.js`.

| What | Where |
| --- | --- |
| Wordmark | `brand.name` |
| Line under the wordmark | `brand.tagline` |
| Hero line | `brand.hero` |
| Supporting lines | `brand.lines` |
| Page names | `pages.*.label` |
| Nav order | `nav`, `edits`, `footerNav` |
| Saved-data prefix | `brand.storagePrefix` |

Colors and type are CSS variables in `css/tokens.css`: ivory `#F8F3E9`, champagne `#E2D1B5`, gold `#B49A65`, dusty rose `#D5B2B4`, espresso `#332D25`. Display type is Bodoni Moda; body type is Manrope.

## Edit prices

Every retail number lives in `CS.prices` inside `js/config.js`. Do not put prices on individual charms.

| Key | Prototype |
| --- | --- |
| `starterBracelet` | $19.99 for gold **and** silver |
| `standard` / `premium` / `luxury` / `dangle` | $3.99 / $5.99 / $7.99 / $8.99 |
| `tool` | $4.99 assembly tool |
| `bundle` | $34.99 bracelet + five charms |
| `clubMonthly` | $24.99 |
| `giftBox` | $6.99 prototype add-on |

Metal is a finish. There is no separate gold or silver price. Charm `priceKey` matches `tier`, and the builder, bag, edits, club, and FAQ all read the config. The five-charm comparison (set price versus the same pieces bought separately) is calculated from `CS.bundle.charmIds`.

`shipping.freeThreshold` (prototype default $75) drives the bag’s progress note. It does not promise a delivery date.

## Link count

```
links = round((wristInches × 25.4 + comfortMm) / linkPitchMm)
```

Defaults in `CS.sizing`: pitch `9.5` mm (inside a 9–9.5 mm link), comfort `10` mm. A 6.5 inch wrist is `(165.1 + 10) / 9.5 = 18.43`, which rounds to **18 links**. The Mood Bar shows this note.

## Pages

| File | Label in `js/config.js` |
| --- | --- |
| `index.html` | Home |
| `builder.html` | The Mood Bar |
| `shop.html` | Shop All |
| `gold.html` | The Golden Edit |
| `silver.html` | The Silver Edit |
| `teacher.html` | The Teacher Edit |
| `bestsellers.html` | Best Sellers |
| `new.html` | New Arrivals |
| `gifts.html` | The Gift Edit |
| `club.html` | The Charm Club |
| `vault.html` | The Mood Vault |
| `ambassador.html` | The Mood Society |
| `about.html` | About |
| `faq.html` | FAQ |
| `cart.html` | Cart |

## File structure

```
index.html, builder.html, shop.html, gold.html, silver.html, teacher.html
bestsellers.html, new.html, gifts.html, club.html, vault.html
ambassador.html, about.html, faq.html, cart.html
.nojekyll
favicon.svg
css/tokens.css          palette and type
css/base.css            document defaults
css/components.css      header, cards, buttons, bag
css/pages.css           home, club, vault, society
css/builder.css         The Mood Bar
js/config.js            brand, prices, policies, page labels
js/catalog.js           charms, tiers, sample club edits
js/charm-art.js         SVG plates (used when image is null)
js/pricing.js           cents-safe money
js/sizing.js            wrist → link count
js/builder.js           place, drag, undo, share, stylist
js/stylist/engine.js    on-device tag and keyword recommender
js/stylist/provider.js  seam for a future server model
js/recommendations.js   “Complete the story”
js/cart.js              configured bracelets and add-ons
js/commerce/adapter.js  LocalDemoAdapter + Shopify stub
js/vault.js             local collection, designs, wishlist
js/codec.js             share-link encoding
js/shell.js             header, footer, reviews, trust, capture
js/product-ui.js        cards and quick view
js/pages.js             per-page controllers
js/init.js
data/reviews.json       empty until real reviews exist
tools/write_pages.py    regenerates the HTML shells
tests/logic.test.js     node tests for pricing, sizing, stylist, cart
```

Paths are relative (`css/…`, `./builder.html`), so the site works at a domain root or a Pages subpath. `.nojekyll` stops Jekyll from dropping files.

## Catalog and real product data

Charms are rows in `js/catalog.js`. Required fields on each exported charm: `id`, `sku`, `name`, `category`, `tags`, `metals`, `tier`, `priceKey`, `description`, `image`, `inventory`, `isDemo`, `isNew`, `isBestSeller`, `shopifyVariantId`.

`metals` is almost always `['gold','silver']`. Both finishes share `priceKey`.

To bring in supplier assets:

1. Put photographs in something like `images/charms/` (relative URLs only).
2. Set `image` to that path and `isDemo` to `false`. The card then uses the photo instead of the SVG. Keep useful alt text in `name`.
3. Replace `sku` with the supplier SKU. Prices stay in `js/config.js`; change a tier price once, not once per charm.
4. Set `inventory` to a number when you track stock. `null` means “not tracked” and the UI does not invent a low-stock claim.
5. Set `shopifyVariantId` to the ProductVariant GID when the Storefront adapter is live.
6. Flip `isNew` and `isBestSeller` only for merchandising you intend. Best Sellers does not display a made-up sales count.

Run `node tests/logic.test.js` after catalog edits. `Catalog.validate()` checks ids, tiers, bundle members, and sample club edits.

## Reviews and trust badges

`data/reviews.json` ships as `{ "items": [] }`. The reviews block then reads “Reviews coming soon.” Add real entries only:

```json
{
  "items": [
    { "id": "r1", "quote": "", "name": "", "detail": "", "rating": null }
  ]
}
```

Leave `rating` null unless you have a real score you are willing to show. Do not add sample quotes.

`CS.trustBadges` is `[]`. The slot renders nothing until you add objects `{ id, title, detail }` for claims that are actually true (a published return policy, a completed nickel-release test). Do not add badges for “hypoallergenic,” “tarnish-proof,” delivery guarantees, or certifications you have not earned.

`CS.giftSeason.message` is empty. Set it only for an honest note. There is no countdown.

`CS.ambassador.exampleRates` is labeled **Example only — not a live offer**.

## Stylist

The Mood Bar scores the catalog in the browser (`js/stylist/engine.js`): synonyms, tags, metal words, and a short explanation. Nothing is sent to a model.

`js/stylist/provider.js` documents a later `POST` to `CS.stylist.endpoint`. The server should call the model and return `{ metal, links, explanation }`. Keep the API key on that server. To switch, set the endpoint and `Stylist.active = 'remote'`.

## Shopify

`js/commerce/adapter.js` exports `LocalDemoAdapter` (what the prototype uses) and `ShopifyStorefrontAdapter` (a stub). The bag never collects a card number. Continuing shows: “Demo: checkout will be handled securely by Shopify.”

When you launch, prefer a small backend that holds the Storefront token, creates a cart, and returns `checkoutUrl`. Map each SKU to `shopifyVariantId`. Put bracelet options (metal, wrist, charm SKUs, story, gift message) on line-item attributes. Do not commit an Admin API key or a Storefront token.

## Mood Vault

`js/vault.js` is the data layer: owned charms, named designs, wishlist, quiz, and the demo membership, stored under `brand.storagePrefix`. Replace those methods with an account API later. The pages call `Vault`, not `localStorage`, directly.

“Add sample chapters” writes four demo charms so “design with owned charms” can be tried. “Save these pieces to the Mood Vault” copies the current bag into that same local record. Neither is a purchase.

## Demo versus production

| Feature | In this prototype | Before launch |
| --- | --- | --- |
| Brand, nav labels, prices | `js/config.js` and `css/tokens.css` | Replace with the live name if it changes |
| Charm art | SVG, labeled “Demo product, photo coming soon” | `image` path, `isDemo: false` |
| Inventory | `null` | Real counts or a backorder policy |
| Bag | `localStorage` via `LocalDemoAdapter` | Shopify cart + `checkoutUrl` |
| Payment | Not collected | Shopify hosted checkout |
| Reviews | Empty file, “Reviews coming soon” | Real `data/reviews.json` entries |
| Trust badges | Hidden (`trustBadges: []`) | Only verified claims |
| Shipping copy | Threshold and “calculated at checkout” | Your real policy, still without fake dates |
| Returns | “Terms will be published” | The policy you will honor |
| Materials | 316L and nickel-release testing are described as the plan, not a finished certificate | Publish the actual test |
| Charm Club | Demo join, prepaid totals = monthly × months | Shopify selling plan |
| Mood Vault | This browser | Accounts |
| Stylist | On-device catalog scoring | Optional server endpoint, key stays server-side |
| Mood Society rates | Example percentages, marked as such | A real agreement |
| Email / SMS capture | Saved locally, nothing sent | A real list provider |

## Known limitations

- Charm illustrations are geometric SVGs, not product photography. A few motifs are simplified so they read at link size.
- Dragging works with a mouse and with touch. A mostly vertical touch on the charm tray still scrolls, so a sideways or diagonal move starts the drag. Tap-then-link does not depend on drag.
- Share links put the design, story, and gift message in the URL hash. Very long stories are trimmed (180 and 140 characters).
- Circle view rotates links around the wrist, so motifs are sideways at the sides. Straight view is the editing layout and the default on small screens.
- The club, referrals, group orders, and fundraising forms do not leave the browser.
- Google Fonts is the only third-party request. There are no stock photographs.
- `tools/write_pages.py` regenerates HTML shells. Interactive copy is filled from `js/config.js` at runtime.

## Checks

```bash
node tests/logic.test.js
```
