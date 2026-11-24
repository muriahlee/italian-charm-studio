/**
 * SVG illustrations for 9mm Italian modular links.
 * Rectangular polished plates, gold or silver, with a raised motif.
 * Used wherever a charm has image: null.
 * Each piece is labeled in the UI as “Demo product, photo coming soon.”
 */
(function (root) {
  'use strict';

  var seq = 0;

  function metalStops(metal) {
    if (metal === 'silver') {
      return ['#fbfbfc', '#d5d8de', '#8e949e', '#f7f8f9'];
    }
    return ['#fff6e4', '#e4c48a', '#9a7340', '#f8efd8'];
  }

  function luminance(hex) {
    var c = String(hex || '#888888').replace('#', '');
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    var r = parseInt(c.slice(0, 2), 16) / 255;
    var g = parseInt(c.slice(2, 4), 16) / 255;
    var b = parseInt(c.slice(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function motifInk(well) {
    return luminance(well) > 0.62 ? '#2a241c' : '#f6f1e6';
  }

  function plate(metal, dangle, well, inner, label) {
    var id = 'm' + (++seq);
    var stops = metalStops(metal);
    var edge = metal === 'silver' ? '#8d939c' : '#8a6840';
    var height = dangle ? 188 : 132;
    var vb = '0 0 100 ' + height;
    var pendant = '';
    if (dangle) {
      pendant =
        '<rect x="46" y="124" width="8" height="10" rx="2" fill="url(#' + id + ')"/>' +
        '<circle cx="50" cy="140" r="5" fill="none" stroke="' + edge + '" stroke-width="2"/>' +
        '<rect x="30" y="148" width="40" height="30" rx="10" fill="url(#' + id + ')" stroke="' + edge + '" stroke-width="0.6"/>' +
        '<rect x="35" y="153" width="30" height="20" rx="7" fill="' + well + '"/>';
    }
    return (
      '<svg class="charm-svg' + (dangle ? ' is-dangle' : '') + '" viewBox="' + vb + '" role="img" aria-label="' + root.Util.esc(label) + '">' +
      '<defs>' +
      '<linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + stops[0] + '"/>' +
      '<stop offset="0.42" stop-color="' + stops[1] + '"/>' +
      '<stop offset="1" stop-color="' + stops[2] + '"/>' +
      '</linearGradient>' +
      '<linearGradient id="' + id + 's" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/>' +
      '<stop offset="0.45" stop-color="#ffffff" stop-opacity="0"/>' +
      '</linearGradient>' +
      '</defs>' +
      '<rect x="0" y="52" width="16" height="22" rx="3" fill="url(#' + id + ')"/>' +
      '<rect x="84" y="52" width="16" height="22" rx="3" fill="url(#' + id + ')"/>' +
      '<rect x="12" y="8" width="76" height="116" rx="12" fill="url(#' + id + ')" stroke="' + edge + '" stroke-width="0.7"/>' +
      '<rect x="20" y="18" width="60" height="96" rx="8" fill="' + well + '"/>' +
      '<g transform="translate(18,26)">' + inner + '</g>' +
      '<rect x="20" y="18" width="60" height="36" rx="8" fill="url(#' + id + 's)"/>' +
      pendant +
      '</svg>'
    );
  }

  function inkPath(d, ink, sw) {
    return '<path d="' + d + '" fill="none" stroke="' + ink + '" stroke-width="' + (sw || 1.8) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  function fillPath(d, fill) {
    return '<path d="' + d + '" fill="' + fill + '"/>';
  }

  /**
   * Motifs are drawn in a 64×80 box (the enamel well).
   * Pictorial charms use their own colors. Tone charms use the enamel ink.
   */
  function drawMotif(art, ink) {
    var m = art.motif;
    var letter = art.letter || '';
    var accent = art.enamel || ink;

    if (m === 'letter' || m === 'grade') {
      var text = m === 'grade' ? 'A+' : letter;
      var size = m === 'grade' ? 28 : 36;
      return '<text x="32" y="50" text-anchor="middle" font-family="Bodoni Moda, Didot, Times New Roman, serif" font-size="' + size + '" fill="' + ink + '">' + root.Util.esc(text) + '</text>';
    }

    if (m === 'heart') {
      return fillPath('M32 58 C32 58 12 44 12 30 C12 20 20 16 26 20 C29 14 35 14 38 20 C44 16 52 20 52 30 C52 44 32 58 32 58 Z', ink);
    }
    if (m === 'hearts') {
      return fillPath('M22 50 C22 50 10 40 10 30 C10 23 16 20 20 24 C22 20 27 20 29 24 C33 20 39 23 39 30 C39 40 22 50 22 50 Z', ink) +
        fillPath('M42 54 C42 54 32 46 32 38 C32 32 37 30 40 33 C42 30 46 30 48 33 C51 30 56 32 56 38 C56 46 42 54 42 54 Z', ink);
    }
    if (m === 'bow') {
      return fillPath('M32 34 C32 34 18 18 10 26 C4 32 14 40 24 36 L32 42 L40 36 C50 40 60 32 54 26 C46 18 32 34 32 34 Z', ink) +
        fillPath('M28 42 H36 L40 62 L32 56 L24 62 Z', ink);
    }
    if (m === 'flower') {
      var petals = '';
      for (var i = 0; i < 6; i++) {
        var a = (Math.PI * 2 * i) / 6;
        var cx = 32 + Math.cos(a) * 12;
        var cy = 38 + Math.sin(a) * 12;
        petals += '<ellipse cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" rx="7" ry="10" transform="rotate(' + (i * 60) + ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')" fill="' + ink + '"/>';
      }
      return petals + '<circle cx="32" cy="38" r="5" fill="' + accent + '"/>';
    }
    if (m === 'rose') {
      return '<circle cx="32" cy="40" r="8" fill="none" stroke="' + ink + '" stroke-width="2"/>' +
        '<circle cx="32" cy="40" r="4" fill="' + ink + '"/>' +
        fillPath('M32 18 C38 26 38 30 32 34 C26 30 26 26 32 18 Z', ink) +
        fillPath('M48 28 C40 30 36 36 36 40 C42 38 48 34 48 28 Z', ink) +
        fillPath('M16 28 C24 30 28 36 28 40 C22 38 16 34 16 28 Z', ink) +
        fillPath('M32 62 C26 50 22 48 18 52 C26 54 30 58 32 62 C34 58 38 54 46 52 C42 48 38 50 32 62 Z', ink);
    }
    if (m === 'tulip') {
      return fillPath('M32 58 V36 M32 36 C32 36 18 34 18 22 C18 14 28 16 32 26 C36 16 46 14 46 22 C46 34 32 36 32 36 Z', ink) +
        inkPath('M32 58 C24 58 20 50 22 46', ink, 1.6);
    }
    if (m === 'lily') {
      return fillPath('M32 56 V30 M32 30 C28 18 18 16 20 28 C22 36 32 34 32 30 C36 18 46 16 44 28 C42 36 32 34 32 30 Z', ink);
    }
    if (m === 'butterfly') {
      return fillPath('M32 28 C32 28 18 12 12 22 C8 30 18 36 28 34 C22 40 14 52 22 56 C30 58 32 46 32 40 C32 46 34 58 42 56 C50 52 42 40 36 34 C46 36 56 30 52 22 C46 12 32 28 32 28 Z', ink) +
        '<rect x="30" y="26" width="4" height="28" rx="2" fill="' + ink + '"/>';
    }
    if (m === 'strawberry') {
      return fillPath('M32 22 C26 22 22 28 24 24 C20 26 18 22 22 20 C18 16 26 14 28 18 C30 12 38 12 38 18 C44 12 48 18 42 22 C46 24 44 30 40 28 C42 24 36 22 32 22 Z', '#1f6b4a') +
        fillPath('M22 36 C22 28 42 28 42 36 C42 52 22 54 22 36 Z', '#a33b4d') +
        '<circle cx="28" cy="38" r="1.1" fill="#f6f1e6"/><circle cx="34" cy="40" r="1.1" fill="#f6f1e6"/><circle cx="30" cy="46" r="1.1" fill="#f6f1e6"/>';
    }
    if (m === 'lemon') {
      return '<ellipse cx="32" cy="40" rx="16" ry="20" fill="#e2c27a" stroke="#8a6a30" stroke-width="1.2"/>' +
        '<ellipse cx="32" cy="40" rx="8" ry="12" fill="none" stroke="#8a6a30" stroke-width="1"/>';
    }
    if (m === 'cherry') {
      return inkPath('M32 24 C32 24 28 36 22 40 M32 24 C32 24 36 36 42 40', '#2a241c', 1.5) +
        '<circle cx="20" cy="46" r="8" fill="#8e2f39"/><circle cx="42" cy="48" r="8" fill="#a33b4d"/>' +
        fillPath('M30 20 C34 14 40 16 36 22 Z', '#1f6b4a');
    }
    if (m === 'peach') {
      return '<circle cx="32" cy="42" r="16" fill="#e2b39a"/>' +
        inkPath('M32 26 C34 36 34 48 32 58', '#c4843c', 1.2) +
        fillPath('M30 24 C34 16 42 18 36 26 Z', '#1f6b4a');
    }
    if (m === 'grapes') {
      var g = '';
      [[32, 28], [24, 36], [40, 36], [32, 40], [22, 46], [32, 48], [42, 46], [32, 56]].forEach(function (p) {
        g += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="#6d4a86"/>';
      });
      return g + fillPath('M30 16 C34 10 42 14 36 20 Z', '#1f6b4a');
    }
    if (m === 'gem') {
      return fillPath('M32 14 L48 32 L32 66 L16 32 Z', accent) +
        fillPath('M32 14 L40 32 L32 28 L24 32 Z', 'rgba(255,255,255,0.35)') +
        inkPath('M16 32 H48 M24 32 L32 66 L40 32', 'rgba(255,255,255,0.45)', 0.8);
    }
    if (m === 'pearl') {
      return '<circle cx="32" cy="40" r="16" fill="#fbf8f4" stroke="#d9cbb8" stroke-width="1"/>' +
        '<ellipse cx="26" cy="34" rx="5" ry="3" fill="#ffffff" opacity="0.9"/>';
    }
    if (m === 'pearl-drop') {
      return '<circle cx="32" cy="30" r="8" fill="#fbf8f4" stroke="#d9cbb8"/>' +
        '<ellipse cx="32" cy="52" rx="10" ry="14" fill="#fbf8f4" stroke="#d9cbb8"/>' +
        '<ellipse cx="28" cy="46" rx="3" ry="2" fill="#ffffff"/>';
    }
    if (m === 'pencil') {
      return '<rect x="28" y="14" width="8" height="40" rx="1" fill="#e2c27a" transform="rotate(20 32 40)"/>' +
        fillPath('M20 58 L28 50 L34 62 Z', '#e7d3b0') +
        '<rect x="34" y="16" width="8" height="6" rx="1" fill="#d4a0a8" transform="rotate(20 32 40)"/>';
    }
    if (m === 'ruler') {
      return '<rect x="12" y="30" width="40" height="12" rx="1" fill="#e7d3b0" stroke="' + ink + '" stroke-width="1"/>' +
        '<path d="M16 30 V36 M22 30 V38 M28 30 V36 M34 30 V38 M40 30 V36 M46 30 V38" stroke="' + ink + '" stroke-width="1"/>';
    }
    if (m === 'bus') {
      return '<rect x="12" y="28" width="40" height="22" rx="3" fill="#e2c27a" stroke="#8a6a30"/>' +
        '<rect x="16" y="32" width="10" height="7" fill="#243656"/><rect x="28" y="32" width="10" height="7" fill="#243656"/><rect x="40" y="32" width="8" height="7" fill="#243656"/>' +
        '<circle cx="20" cy="52" r="3" fill="#2a241c"/><circle cx="44" cy="52" r="3" fill="#2a241c"/>';
    }
    if (m === 'apple') {
      var red = accent && luminance(accent) < 0.5 ? '#a33b4d' : '#7d9078';
      if (art && art._force) red = art._force;
      return fillPath('M24 36 C24 26 40 24 40 36 C48 36 50 48 40 56 C32 62 22 58 20 48 C16 44 18 36 24 36 Z', '#a33b4d') +
        fillPath('M32 28 C36 20 42 22 38 30 Z', '#1f6b4a') +
        '<rect x="31" y="22" width="2" height="8" fill="#6e5434"/>';
    }
    if (m === 'book') {
      return '<rect x="16" y="22" width="32" height="40" rx="2" fill="#6e3b34"/>' +
        '<rect x="20" y="26" width="24" height="32" fill="#f3ead7"/>' +
        '<path d="M24 32 H40 M24 38 H40 M24 44 H36" stroke="#6e3b34" stroke-width="1.2"/>';
    }
    if (m === 'book-open') {
      return fillPath('M32 24 L14 30 V58 L32 50 Z', '#f3ead7') +
        fillPath('M32 24 L50 30 V58 L32 50 Z', '#e7dcc8') +
        inkPath('M32 24 V50', '#6e5434', 1.2) +
        '<path d="M18 36 H28 M18 42 H28 M36 36 H46 M36 42 H46" stroke="#6e5434" stroke-width="1"/>';
    }
    if (m === 'coffee') {
      return '<rect x="18" y="28" width="24" height="20" rx="3" fill="#fbf8f4" stroke="#2a241c" stroke-width="1.4"/>' +
        '<path d="M42 32 H46 A6 6 0 0 1 46 44 H42" fill="none" stroke="#2a241c" stroke-width="1.6"/>' +
        inkPath('M24 22 C24 18 28 18 28 22 M32 20 C32 16 36 16 36 20', '#2a241c', 1.3) +
        '<rect x="16" y="50" width="32" height="3" rx="1" fill="#2a241c"/>';
    }
    if (m === 'tea') {
      return '<path d="M18 32 H42 L38 54 H22 Z" fill="#fbf8f4" stroke="#b76e79" stroke-width="1.4"/>' +
        '<path d="M42 36 H48 A6 6 0 0 1 48 48 H40" fill="none" stroke="#b76e79" stroke-width="1.5"/>' +
        inkPath('M26 24 C28 20 34 20 36 24', '#b76e79', 1.3);
    }
    if (m === 'plane') {
      return fillPath('M8 40 H28 L40 26 V34 H54 L58 40 L54 46 H40 V54 L28 44 H8 Z', '#243656');
    }
    if (m === 'compass') {
      return '<circle cx="32" cy="40" r="16" fill="none" stroke="' + ink + '" stroke-width="1.6"/>' +
        fillPath('M32 26 L36 40 L32 38 L28 40 Z', '#a33b4d') +
        fillPath('M32 54 L28 40 L32 42 L36 40 Z', ink) +
        '<circle cx="32" cy="40" r="2" fill="' + ink + '"/>';
    }
    if (m === 'suitcase') {
      return '<rect x="16" y="28" width="32" height="26" rx="2" fill="#8c7049" stroke="#2a241c"/>' +
        '<path d="M26 28 V22 H38 V28" fill="none" stroke="#2a241c" stroke-width="1.6"/>' +
        '<path d="M32 28 V54" stroke="#e7d3b0" stroke-width="1.4"/>';
    }
    if (m === 'passport') {
      return '<rect x="18" y="18" width="28" height="40" rx="2" fill="#243656"/>' +
        '<circle cx="32" cy="36" r="8" fill="none" stroke="#e7d3b0" stroke-width="1.4"/>' +
        '<text x="32" y="54" text-anchor="middle" font-family="Manrope, sans-serif" font-size="6" fill="#e7d3b0">PASS</text>';
    }
    if (m === 'map') {
      return fillPath('M14 24 L26 20 L38 26 L50 20 V56 L38 60 L26 54 L14 58 Z', '#e7dcc4') +
        inkPath('M26 20 V54 M38 26 V60', '#1f6b4a', 1.2) +
        inkPath('M20 36 C28 30 34 40 46 32', '#a33b4d', 1.3);
    }
    if (m === 'family') {
      return '<circle cx="20" cy="28" r="5" fill="' + ink + '"/><circle cx="32" cy="24" r="6" fill="' + ink + '"/><circle cx="44" cy="28" r="5" fill="' + ink + '"/>' +
        fillPath('M12 56 C12 44 28 44 28 56 Z', ink) +
        fillPath('M22 56 C22 42 42 42 42 56 Z', ink) +
        fillPath('M36 56 C36 44 52 44 52 56 Z', ink);
    }
    if (m === 'pram') {
      return fillPath('M14 40 H40 L46 28 H24 Z', '#d4a0a8') +
        '<circle cx="22" cy="50" r="4" fill="#2a241c"/><circle cx="38" cy="50" r="4" fill="#2a241c"/>' +
        inkPath('M40 36 H52', ink, 1.6);
    }
    if (m === 'house') {
      return fillPath('M12 36 L32 18 L52 36 V58 H12 Z', '#8c7049') +
        '<rect x="26" y="40" width="12" height="18" fill="#f6f1e6"/>';
    }
    if (m === 'infinity') {
      return inkPath('M12 40 C12 28 28 28 32 40 C36 52 52 52 52 40 C52 28 36 28 32 40 C28 52 12 52 12 40 Z', ink, 2);
    }
    if (m === 'paw') {
      return '<ellipse cx="32" cy="46" rx="10" ry="8" fill="' + ink + '"/>' +
        '<circle cx="18" cy="34" r="4" fill="' + ink + '"/><circle cx="28" cy="28" r="4.5" fill="' + ink + '"/>' +
        '<circle cx="38" cy="28" r="4.5" fill="' + ink + '"/><circle cx="46" cy="34" r="4" fill="' + ink + '"/>';
    }
    if (m === 'cat') {
      return fillPath('M18 36 L22 18 L30 32 L34 32 L42 18 L46 36 C50 48 46 58 32 58 C18 58 14 48 18 36 Z', '#c4a574') +
        '<circle cx="26" cy="42" r="1.6" fill="#2a241c"/><circle cx="38" cy="42" r="1.6" fill="#2a241c"/>' +
        '<path d="M32 46 L30 50 H34 Z" fill="#2a241c"/>';
    }
    if (m === 'dog') {
      return fillPath('M16 32 L20 18 H28 L30 28 H34 L36 18 H44 L48 32 V50 C48 58 16 58 16 50 Z', '#c4843c') +
        '<circle cx="26" cy="38" r="1.6" fill="#2a241c"/><circle cx="38" cy="38" r="1.6" fill="#2a241c"/>' +
        '<ellipse cx="32" cy="46" rx="3" ry="2" fill="#2a241c"/>';
    }
    if (m === 'bird') {
      return fillPath('M14 40 C22 28 40 26 52 34 C40 36 36 40 40 48 C30 44 20 48 14 40 Z', '#243656') +
        fillPath('M40 36 L52 32 L46 40 Z', '#e2c27a') +
        '<circle cx="24" cy="36" r="1.3" fill="#f6f1e6"/>';
    }
    if (m === 'note') {
      return '<ellipse cx="24" cy="52" rx="8" ry="6" transform="rotate(-20 24 52)" fill="' + ink + '"/>' +
        '<rect x="30" y="18" width="3" height="34" fill="' + ink + '"/>' +
        fillPath('M33 18 L48 24 V30 L33 24 Z', ink);
    }
    if (m === 'treble') {
      return inkPath('M36 62 C36 62 22 58 24 48 C26 40 40 42 38 32 C36 22 24 24 26 34 C28 42 36 40 36 32 C36 22 28 18 32 14', ink, 2.2);
    }
    if (m === 'piano') {
      return '<rect x="14" y="26" width="36" height="28" rx="2" fill="#fbf8f4" stroke="#2a241c"/>' +
        '<path d="M14 26 H50 M20 26 V40 M26 26 V44 M32 26 V40 M38 26 V44 M44 26 V40" stroke="#2a241c" stroke-width="1.3"/>' +
        '<rect x="22" y="26" width="4" height="14" fill="#2a241c"/><rect x="34" y="26" width="4" height="14" fill="#2a241c"/>';
    }
    if (m === 'star') {
      return fillPath('M32 14 L36 30 H52 L39 38 L44 54 L32 44 L20 54 L25 38 L12 30 H28 Z', accent && luminance(accent) < 0.4 ? '#e2c27a' : ink);
    }
    if (m === 'stars') {
      return fillPath('M20 28 L22 34 H28 L23 38 L25 44 L20 40 L15 44 L17 38 L12 34 H18 Z', '#e2c27a') +
        fillPath('M40 20 L42 26 H48 L43 30 L45 36 L40 32 L35 36 L37 30 L32 26 H38 Z', '#f6f1e6') +
        fillPath('M42 46 L43.5 50 H48 L44.5 52.5 L46 57 L42 54 L38 57 L39.5 52.5 L36 50 H40.5 Z', '#e2c27a');
    }
    if (m === 'moon') {
      return '<circle cx="30" cy="40" r="16" fill="#f6f1e6"/>' +
        '<circle cx="38" cy="34" r="14" fill="#1a1714"/>';
    }
    if (m === 'sun') {
      var rays = '';
      for (var s = 0; s < 8; s++) {
        var ang = (Math.PI * 2 * s) / 8;
        var x1 = 32 + Math.cos(ang) * 12;
        var y1 = 40 + Math.sin(ang) * 12;
        var x2 = 32 + Math.cos(ang) * 20;
        var y2 = 40 + Math.sin(ang) * 20;
        rays += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="#c4843c" stroke-width="1.6" stroke-linecap="round"/>';
      }
      return rays + '<circle cx="32" cy="40" r="8" fill="#e2c27a"/>';
    }
    if (m === 'planet') {
      return '<ellipse cx="32" cy="40" rx="18" ry="6" fill="none" stroke="#e2c27a" stroke-width="1.6" transform="rotate(-20 32 40)"/>' +
        '<circle cx="32" cy="40" r="10" fill="#d4b483"/>';
    }
    if (m === 'snowflake') {
      var flake = '';
      for (var f = 0; f < 6; f++) {
        flake += '<line x1="32" y1="40" x2="32" y2="18" stroke="' + ink + '" stroke-width="1.5" stroke-linecap="round" transform="rotate(' + (f * 60) + ' 32 40)"/>';
      }
      return flake + '<circle cx="32" cy="40" r="2" fill="' + ink + '"/>';
    }
    if (m === 'tree') {
      return fillPath('M32 16 L44 32 H38 L48 44 H40 L50 56 H14 L24 44 H16 L26 32 H20 Z', '#1e4d3a') +
        '<rect x="28" y="56" width="8" height="8" fill="#6e5434"/>';
    }
    if (m === 'bell') {
      return fillPath('M24 28 C24 18 40 18 40 28 V44 L46 50 H18 L24 44 Z', ink) +
        '<circle cx="32" cy="54" r="3" fill="' + ink + '"/><rect x="28" y="14" width="8" height="4" rx="1" fill="' + ink + '"/>';
    }
    if (m === 'wreath') {
      return '<circle cx="32" cy="40" r="16" fill="none" stroke="#1e4d3a" stroke-width="5"/>' +
        '<circle cx="32" cy="40" r="10" fill="none" stroke="#f4efe6" stroke-width="6"/>' +
        fillPath('M28 52 L32 62 L36 52 Z', '#8e2f39');
    }
    if (m === 'stocking') {
      return fillPath('M24 16 H40 V36 L48 48 V58 H30 L24 48 Z', '#8e2f39') +
        '<rect x="24" y="16" width="16" height="8" fill="#f6f1e6"/>';
    }
    if (m === 'gift') {
      return '<rect x="16" y="28" width="32" height="26" fill="#a33b4d"/>' +
        '<rect x="14" y="24" width="36" height="8" fill="#8e2f39"/>' +
        '<rect x="29" y="24" width="6" height="30" fill="#e7d3b0"/>' +
        fillPath('M32 24 C32 24 24 24 24 18 C24 14 30 14 32 20 C34 14 40 14 40 18 C40 24 32 24 32 24 Z', '#e7d3b0');
    }
    if (m === 'cameo') {
      return '<ellipse cx="32" cy="40" rx="16" ry="20" fill="#f7f1e6" stroke="#d4b483" stroke-width="2"/>' +
        fillPath('M24 48 C24 36 30 32 32 32 C34 32 40 36 40 48 Z', '#e2c4b0') +
        fillPath('M22 34 C24 24 40 24 42 36 C36 30 28 30 22 34 Z', '#2a241c');
    }
    if (m === 'key') {
      return '<circle cx="26" cy="28" r="8" fill="none" stroke="' + ink + '" stroke-width="2.4"/>' +
        '<path d="M32 34 L50 52 H44 V58 H38 V52 L34 48" fill="none" stroke="' + ink + '" stroke-width="2.4" stroke-linejoin="round"/>';
    }
    if (m === 'crown') {
      return fillPath('M12 46 L18 24 L32 38 L46 22 L52 46 Z', ink) +
        '<rect x="12" y="46" width="40" height="6" fill="' + ink + '"/>' +
        '<circle cx="18" cy="24" r="2" fill="' + accent + '"/><circle cx="32" cy="36" r="2" fill="' + accent + '"/><circle cx="46" cy="22" r="2" fill="' + accent + '"/>';
    }
    if (m === 'coin') {
      return '<circle cx="32" cy="40" r="18" fill="#d4b483" stroke="#8a6840" stroke-width="2"/>' +
        '<circle cx="32" cy="40" r="14" fill="none" stroke="#8a6840" stroke-width="1"/>' +
        fillPath('M32 30 C28 36 28 44 32 50 C36 44 36 36 32 30 Z', '#8a6840');
    }
    if (m === 'locket') {
      return '<circle cx="32" cy="36" r="14" fill="' + ink + '"/>' +
        fillPath('M32 44 C32 44 24 38 24 32 C24 28 28 26 30 28 C31 26 33 26 34 28 C36 26 40 28 40 32 C40 38 32 44 32 44 Z', luminance(ink) > 0.5 ? '#8e2f39' : '#f6f1e6') +
        '<rect x="30" y="18" width="4" height="6" fill="' + ink + '"/>';
    }
    if (m === 'chalk') {
      return '<rect x="14" y="22" width="36" height="40" rx="2" fill="#243656"/>' +
        fillPath('M32 36 C32 36 24 32 24 26 C24 23 27 22 29 24 C30 22 34 22 35 24 C37 22 40 23 40 26 C40 32 32 36 32 36 Z', '#f6f1e6');
    }

    return '<circle cx="32" cy="40" r="10" fill="' + ink + '"/>';
  }

  function render(charm, metal) {
    var art = (charm && charm.art) || { motif: 'heart', enamel: '#c47c8a' };
    var dangle = charm && charm.tier === 'dangle';
    var well = art.ground || art.enamel || '#f4efe6';
    var ink = motifInk(well);
    if (art.motif === 'star' && !art.ground) {
      well = '#1a1714';
      ink = '#f6f1e6';
    }
    var label = (charm && charm.name ? charm.name + ', ' : '') + (metal === 'silver' ? 'silver' : 'gold') + ' finish, demo illustration';
    var appleArt = art;
    if (art.motif === 'apple' && charm && charm.id === 'apple-green') {
      appleArt = {
        motif: 'apple',
        enamel: art.enamel,
        _green: true,
      };
    }
    var inner = drawMotif(appleArt, ink);
    if (art.motif === 'apple' && charm && charm.id === 'apple-green') {
      inner = inner.replace('#a33b4d', '#5f7d55');
    }
    return plate(metal === 'silver' ? 'silver' : 'gold', dangle, well, inner, label);
  }

  function renderEmpty(metal) {
    return plate(metal === 'silver' ? 'silver' : 'gold', false, 'rgba(255,255,255,0.28)', '', (metal === 'silver' ? 'Silver' : 'Gold') + ' link, empty');
  }

  root.CharmArt = {
    render: render,
    renderEmpty: renderEmpty,
  };
})(typeof window !== 'undefined' ? window : globalThis);
