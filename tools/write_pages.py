#!/usr/bin/env python3
"""Write the static pages. Run once from the repo root when the shell changes."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = """
  <script src="js/config.js"></script>
  <script src="js/util.js"></script>
  <script src="js/pricing.js"></script>
  <script src="js/sizing.js"></script>
  <script src="js/catalog.js"></script>
  <script src="js/charm-art.js"></script>
  <script src="js/storage.js"></script>
  <script src="js/commerce/adapter.js"></script>
  <script src="js/cart.js"></script>
  <script src="js/vault.js"></script>
  <script src="js/codec.js"></script>
  <script src="js/stylist/engine.js"></script>
  <script src="js/stylist/provider.js"></script>
  <script src="js/recommendations.js"></script>
  <script src="js/shell.js"></script>
  <script src="js/product-ui.js"></script>
  <script src="js/builder.js"></script>
  <script src="js/pages.js"></script>
  <script src="js/init.js"></script>
"""

def page(filename, page_id, title, sticky, body, shop=""):
    shop_attr = f' data-shop="{shop}"' if shop else ""
    sticky_attr = f' data-sticky="{sticky}"' if sticky else ""
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="">
  <title>Loading</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;0,6..96,600;1,6..96,500&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/pages.css">
  <link rel="stylesheet" href="css/builder.css">
  <link rel="icon" href="favicon.svg">
</head>
<body data-page="{page_id}" data-title="{title}"{sticky_attr}{shop_attr}>
  <div id="site-header"></div>
  <main id="main">
{body}
  </main>
  <div id="site-footer"></div>
  <noscript><p class="note">This prototype needs JavaScript for the bracelet builder, the bag, and saved designs.</p></noscript>
{SCRIPTS}</body>
</html>
"""
    (ROOT / filename).write_text(html, encoding="utf-8")
    print(filename)

HOME = r"""
    <section class="hero split">
      <div>
        <p class="eyebrow">Italian modular links</p>
        <h1 data-copy="brand.hero"></h1>
        <hr class="gold-rule">
        <p class="lede" data-copy="brand.lines.story"></p>
        <p class="lede" data-copy="brand.lines.versions"></p>
        <div class="cluster hero-actions">
          <a class="btn" data-page-link="builder" href="./builder.html"></a>
          <a class="btn secondary" data-page-link="gifts" href="./gifts.html"></a>
        </div>
        <p class="note" style="margin-top:0.9rem"><a data-page-link="club" href="./club.html"></a> · <span data-price="clubMonthly"></span> / month</p>
        <p class="note" data-copy="priceNotes.metal"></p>
      </div>
      <div>
        <div id="snap" class="snap"></div>
        <p class="demo-label">Demo product, photo coming soon</p>
      </div>
    </section>

    <section class="section" aria-labelledby="how-title">
      <p class="eyebrow">How it works</p>
      <h2 id="how-title" data-copy="brand.lines.rules"></h2>
      <div class="steps">
        <article class="step"><span>01</span><h3>Pick a metal</h3><p>Gold or silver. The finish changes. The price does not.</p></article>
        <article class="step"><span>02</span><h3>Add a charm</h3><p>Drag it onto a link, or tap a charm and then a link. Leave one open if the story is not finished.</p></article>
        <article class="step"><span>03</span><h3>Make it yours</h3><p>Wear it assembled by the studio, or close the links at home with the tool.</p></article>
      </div>
    </section>

    <section class="section" aria-labelledby="price-title">
      <h2 id="price-title">Clear prices</h2>
      <p class="lede" data-copy="priceNotes.metal"></p>
      <div id="legend" class="legend price-strip"></div>
    </section>

    <section class="section" aria-labelledby="best-title">
      <p class="eyebrow" data-copy="pages.best.label"></p>
      <h2 id="best-title">Pieces the studio is putting forward</h2>
      <p class="note">A curated edit. This prototype does not invent sales figures.</p>
      <div id="best-grid" class="product-grid" style="margin-top:1.2rem"></div>
      <p style="margin-top:1rem"><a data-page-link="best" href="./bestsellers.html"></a></p>
    </section>

    <section class="section" aria-labelledby="edits-title">
      <h2 id="edits-title">Three ways in</h2>
      <div class="edit-cards">
        <a class="edit-card" data-page-link="gold" href="./gold.html"></a>
        <a class="edit-card rose" data-page-link="silver" href="./silver.html"></a>
        <a class="edit-card ink" data-page-link="teacher" href="./teacher.html"></a>
      </div>
    </section>

    <section class="section split" aria-labelledby="gift-title">
      <div>
        <p class="eyebrow" data-copy="pages.gifts.label"></p>
        <h2 id="gift-title">A bracelet, five charms, one price</h2>
        <p id="bundle-savings" class="lede"></p>
        <div class="cluster" style="margin-top:1rem">
          <a class="btn" data-page-link="gifts" href="./gifts.html"></a>
          <a class="btn secondary" data-page-link="builder" href="./builder.html"></a>
        </div>
      </div>
      <div class="panel">
        <p data-copy="brand.lines.charm"></p>
        <p class="note">Write a gift message at the Mood Bar. Add the gift box if you want the ritual of a lid. Or give months of the Charm Club — three, six, or twelve — priced from the monthly figure.</p>
      </div>
    </section>

    <section class="section" aria-labelledby="club-title">
      <p class="eyebrow" data-copy="pages.club.label"></p>
      <h2 id="club-title">Five charms, every month</h2>
      <p class="lede">A standing story. Gold or silver, same membership price. Skip or cancel anytime.</p>
      <p class="club-price"><span data-price="clubMonthly"></span> <span style="font-family:var(--sans);font-size:1rem">/ month</span></p>
      <a class="btn" data-page-link="club" href="./club.html"></a>
    </section>

    <section class="section" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading">Reviews</h2>
      <div id="reviews-root"></div>
    </section>

    <div id="trust-root" data-trust-slot></div>

    <section class="section prose" aria-labelledby="story-title">
      <h2 id="story-title" data-copy="brand.hero"></h2>
      <p data-copy="brand.lines.story"></p>
      <p>Each link is a small plate of polished metal. A heart, a pencil, an initial, a plane. Not a costume. A record of who you are this year, and who you might be next.</p>
      <p><a data-page-link="about" href="./about.html"></a></p>
    </section>
"""

SHOP = r"""
    <header class="page-head">
      <p class="eyebrow">Charms</p>
      <h1 data-copy="pages.SHOPKEY.label"></h1>
      <p id="shop-lead" class="lede"></p>
      <p class="demo-label" style="text-align:left">Demo product, photo coming soon</p>
    </header>
    <div id="legend" class="legend"></div>
    <div id="shop-filters" class="filters" aria-label="Category"></div>
    <div id="tier-filters" class="filters" aria-label="Tier">
      <button type="button" class="chip" data-tier="" aria-pressed="true">All tiers</button>
      <button type="button" class="chip" data-tier="standard" aria-pressed="false">Standard</button>
      <button type="button" class="chip" data-tier="premium" aria-pressed="false">Premium</button>
      <button type="button" class="chip" data-tier="luxury" aria-pressed="false">Luxury</button>
      <button type="button" class="chip" data-tier="dangle" aria-pressed="false">Dangle</button>
    </div>
    <div id="grid" class="product-grid"></div>
    <section id="complete" class="section" aria-label="Complete the story"></section>
"""

pages = [
    ("index.html", "home", "home", "builder", HOME, ""),
    ("builder.html", "builder", "builder", "", r"""
    <header class="page-head">
      <p class="eyebrow">The builder</p>
      <h1 data-copy="pages.builder.label"></h1>
      <p class="lede" data-copy="brand.lines.rules"></p>
      <p class="lede" data-copy="brand.lines.story"></p>
    </header>
    <div id="builder"></div>
""", ""),
]

shops = [
    ("shop.html", "shop", "all", "builder"),
    ("gold.html", "gold", "gold", "builder"),
    ("silver.html", "silver", "silver", "builder"),
    ("teacher.html", "teacher", "teacher", "builder"),
    ("bestsellers.html", "best", "best", "builder"),
    ("new.html", "fresh", "fresh", "builder"),
]

for filename, title, shop, sticky in shops:
    pages.append((filename, "shop", title, sticky, SHOP.replace("SHOPKEY", title), shop))

pages.append(("gifts.html", "gifts", "gifts", "builder", r"""
    <header class="page-head">
      <p class="eyebrow">Gifts</p>
      <h1 data-copy="pages.gifts.label"></h1>
      <p class="lede" data-copy="brand.lines.charm"></p>
      <p class="lede">A message, a box, a set of five, or a year of the club. The metal is a preference. The price is not.</p>
    </header>
    <section id="gift-set" class="section"></section>
    <section class="section two">
      <article class="panel">
        <h2>A note in the box</h2>
        <p>Write the gift message on the Mood Bar. It stays with the bracelet in the bag. We do not print it in this prototype.</p>
        <a class="btn" data-page-link="builder" href="./builder.html"></a>
      </article>
      <article class="panel">
        <h2>Gift box</h2>
        <p>A rigid box and a card. <strong id="gift-box-price"></strong>. Add it from the Mood Bar or ask for it with the set.</p>
        <button type="button" class="btn secondary" id="add-box">Add the gift box</button>
      </article>
    </section>
    <section class="section">
      <h2>Charm Club, given as months</h2>
      <p class="note">Prepaid length times the monthly price. No extra discount is invented here.</p>
      <div id="prepaid" class="edit-cards"></div>
    </section>
    <script>
      document.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'add-box' && window.Cart) Cart.addGiftBox();
      });
    </script>
""", ""))

pages.append(("club.html", "club", "club", "club", r"""
    <header class="page-head">
      <p class="eyebrow">Membership</p>
      <h1 data-copy="pages.club.label"></h1>
      <p class="lede">Five curated charms each month. A gold or silver preference, at the same price. Subscriber edits, a monthly theme, complimentary US shipping on club shipments, and the right to skip or cancel.</p>
      <p class="club-price" id="club-price"></p>
      <p class="note">per month · <span data-copy="priceNotes.metal"></span></p>
    </header>
    <section class="section split">
      <div>
        <h2>What arrives</h2>
        <ul id="club-benefits"></ul>
        <p class="note" data-copy="brand.lines.versions"></p>
      </div>
      <div class="panel" id="membership"></div>
    </section>
    <section class="section" id="join">
      <h2>A short style note</h2>
      <p class="note">Demo only. Joining adds a membership line to the bag and saves a preference on this device. No payment is taken.</p>
      <form id="quiz" class="panel">
        <div class="quiz-step">
          <p class="eyebrow">Who is it for?</p>
          <div class="choice-grid">
            <button type="button" data-quiz="who" data-value="self">Myself</button>
            <button type="button" data-quiz="who" data-value="gift">A gift</button>
            <button type="button" data-quiz="who" data-value="both">Both</button>
          </div>
          <button type="button" class="btn" data-next style="margin-top:0.8rem">Next</button>
        </div>
        <div class="quiz-step">
          <p class="eyebrow">A mood</p>
          <div class="choice-grid">
            <button type="button" data-quiz="mood" data-value="quiet">Quiet</button>
            <button type="button" data-quiz="mood" data-value="warm">Warm</button>
            <button type="button" data-quiz="mood" data-value="playful">Playful</button>
            <button type="button" data-quiz="mood" data-value="formal">Formal</button>
          </div>
          <div class="cluster" style="margin-top:0.8rem"><button type="button" class="btn secondary" data-prev>Back</button><button type="button" class="btn" data-next>Next</button></div>
        </div>
        <div class="quiz-step">
          <p class="eyebrow">What should show up?</p>
          <div class="choice-grid">
            <button type="button" data-quiz="theme" data-value="stories">Stories and books</button>
            <button type="button" data-quiz="theme" data-value="travel">Travel</button>
            <button type="button" data-quiz="theme" data-value="classroom">A classroom</button>
            <button type="button" data-quiz="theme" data-value="family">Family</button>
            <button type="button" data-quiz="theme" data-value="color">Color</button>
          </div>
          <div class="cluster" style="margin-top:0.8rem"><button type="button" class="btn secondary" data-prev>Back</button><button type="button" class="btn" data-next>Next</button></div>
        </div>
        <div class="quiz-step">
          <p class="eyebrow">Finish</p>
          <p class="note" data-copy="priceNotes.metal"></p>
          <div class="choice-grid">
            <button type="button" data-quiz="metal" data-value="gold" aria-pressed="true">Gold</button>
            <button type="button" data-quiz="metal" data-value="silver">Silver</button>
          </div>
          <div class="cluster" style="margin-top:0.8rem"><button type="button" class="btn secondary" data-prev>Back</button><button type="button" class="btn" id="join-demo">Join the demo</button></div>
        </div>
      </form>
    </section>
    <section class="section">
      <h2>Give the membership</h2>
      <div id="club-prepaid" class="edit-cards"></div>
    </section>
""", ""))

pages.append(("vault.html", "vault", "vault", "builder", r"""
    <header class="page-head">
      <p class="eyebrow">Saved on this device</p>
      <h1 data-copy="pages.vault.label"></h1>
      <p class="lede">Your story so far. Owned charms, designs you named, and the ones you are still wishing for.</p>
      <p class="lede" data-copy="brand.lines.story"></p>
    </header>
    <div id="vault-root">
      <section class="section">
        <h2>Owned</h2>
        <p class="note">A demo record. It is not an account.</p>
        <div id="owned"></div>
        <p style="margin-top:0.8rem"><a class="btn secondary" href="./builder.html?palette=owned">Design with owned charms</a></p>
      </section>
      <section class="section">
        <h2>Saved designs</h2>
        <div id="designs"></div>
      </section>
      <section class="section">
        <h2>Wishlist</h2>
        <div id="wishlist"></div>
      </section>
      <section class="section">
        <h2>Monthly edits</h2>
        <p class="note">Sample themes for the Charm Club. Not a shipment history.</p>
        <div id="months" class="two"></div>
        <p style="margin-top:1rem"><a class="btn" data-page-link="club" href="./club.html"></a></p>
      </section>
    </div>
""", ""))

pages.append(("ambassador.html", "society", "society", "builder", r"""
    <header class="page-head">
      <p class="eyebrow">Share the work</p>
      <h1 data-copy="pages.society.label"></h1>
      <p class="lede" data-copy="brand.lines.versions"></p>
      <p class="lede">Teachers are very welcome here. So is anyone with a circle — a studio, a team, a family, a class. The house is not only a school brand.</p>
    </header>
    <section class="section prose">
      <h2>How a referral works, in this prototype</h2>
      <p>You share a design link from the Mood Bar. A demo code can sit in the note you send with it. There is no tracking pixel and no payout in this prototype.</p>
      <div id="rates"></div>
    </section>
    <section class="section two">
      <form id="code-form" class="panel">
        <h2>Demo code</h2>
        <label class="field"><span>Name or initials</span><input id="code-name" name="name" maxlength="40" autocomplete="name"></label>
        <button class="btn" type="submit">Generate a demo code</button>
        <p id="code-out" class="form-status" role="status"></p>
      </form>
      <div class="panel">
        <h2>Share a design</h2>
        <p>Build it, name it, copy the link. The story you wrote travels with the URL.</p>
        <a class="btn" data-page-link="builder" href="./builder.html"></a>
      </div>
    </section>
    <section class="section two">
      <form id="group-form" class="panel">
        <h2>Group orders</h2>
        <p class="note">A note for teams ordering several of the same bracelet. Saved on this device only.</p>
        <label class="field"><span>Organizer</span><input name="organizer" required></label>
        <label class="field"><span>Group</span><input name="group" required></label>
        <label class="field"><span>About how many</span><input name="quantity" inputmode="numeric"></label>
        <label class="field"><span>Email</span><input name="email" type="email" required></label>
        <button class="btn" type="submit">Save inquiry</button>
        <p class="form-status" role="status"></p>
      </form>
      <form id="fund-form" class="panel">
        <h2>School fundraising</h2>
        <p class="note">For a class or a school that wants to raise money with a charm edit. Example commission rates above are not a live offer.</p>
        <label class="field"><span>School or class</span><input name="school" required></label>
        <label class="field"><span>Contact</span><input name="contact" required></label>
        <label class="field"><span>Email</span><input name="email" type="email" required></label>
        <label class="field"><span>What you have in mind</span><textarea name="note"></textarea></label>
        <button class="btn" type="submit">Save inquiry</button>
        <p class="form-status" role="status"></p>
      </form>
    </section>
""", ""))

pages.append(("about.html", "about", "about", "builder", r"""
    <header class="page-head">
      <p class="eyebrow">The house</p>
      <h1 data-copy="pages.about.label"></h1>
      <p class="lede" data-copy="brand.hero"></p>
    </header>
    <article class="prose section">
      <p data-copy="brand.tagline"></p>
      <p data-copy="brand.lines.story"></p>
      <p><span data-copy="brand.name"></span> is a prototype for a house of Italian modular charms. The links are the 9mm kind: small rectangular plates that open, take a charm, and close again. Gold and silver are finishes of the same design. They are not two prices.</p>
      <h2>The metal, said carefully</h2>
      <p data-copy="materialsNote"></p>
      <h2>What this site is</h2>
      <p>The charms you see are illustrations, labeled as demo pieces until photography, SKUs, and inventory arrive. The bag is saved in this browser. Checkout will be handled securely by Shopify. Card numbers are never collected here.</p>
      <p data-copy="brand.lines.rules"></p>
      <p><a data-page-link="builder" href="./builder.html"></a></p>
    </article>
""", ""))

pages.append(("faq.html", "faq", "faq", "builder", r"""
    <header class="page-head">
      <p class="eyebrow">Questions</p>
      <h1 data-copy="pages.faq.label"></h1>
    </header>
    <div class="faq section">
      <details>
        <summary>Do gold and silver cost different amounts?</summary>
        <p>No. Every design is offered at the same price in gold or silver. A starter bracelet is one price. A charm’s price follows its tier — standard, premium, luxury, or dangle — and not its metal.</p>
      </details>
      <details>
        <summary>How many links do I need?</summary>
        <p>The count is your wrist in millimetres, plus about 10mm of comfort, divided by 9.5mm per link, then rounded. A 6.5 inch wrist comes to 18 links. The Mood Bar does this when you choose a size.</p>
      </details>
      <details>
        <summary>What is the metal?</summary>
        <p data-copy="materialsNote"></p>
      </details>
      <details>
        <summary>How does shipping work?</summary>
        <p data-copy="shipping.policy"></p>
      </details>
      <details>
        <summary>Can I return a piece?</summary>
        <p data-copy="returnsNote"></p>
      </details>
      <details>
        <summary>How do I check out?</summary>
        <p data-copy="checkoutNote"></p>
        <p>You will not be asked for a card number on this site.</p>
      </details>
      <details>
        <summary>Can I assemble it myself?</summary>
        <p>Yes. Choose “I will assemble it myself” on the Mood Bar and the assembly tool is suggested. Studio assembly is included in the bracelet.</p>
      </details>
      <details>
        <summary>What is the Charm Club?</summary>
        <p>A monthly edit of five charms at the price in the configuration, with a gold or silver preference at that same price. You can skip or cancel. Gift memberships for 3, 6, and 12 months are the monthly price times the number of months. Joining on this site is a demo.</p>
      </details>
      <details>
        <summary>Why do the charms look illustrated?</summary>
        <p>They are demo products. A photograph is coming. The label on each piece says so.</p>
      </details>
    </div>
""", ""))

pages.append(("cart.html", "cart", "cart", "cart", r"""
    <header class="page-head">
      <p class="eyebrow">Bag</p>
      <h1 data-copy="pages.cart.label"></h1>
      <p class="lede">Review the bracelet, change a quantity, then continue. Payment happens later, on Shopify. Not here.</p>
    </header>
    <div id="cart-app" class="section" style="padding-top:0">
      <div id="cart-lines"></div>
      <aside id="cart-summary" aria-label="Summary"></aside>
      <div id="checkout"></div>
    </div>
""", ""))

for filename, page_id, title, sticky, body, *rest in pages:
    shop = rest[0] if rest else ""
    page(filename, page_id, title, sticky, body, shop)
